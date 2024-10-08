const bcrypt = require('bcrypt');
const userMapper = require("../dataMappers/user");
const { makeToken } = require("../middlewares/auth");
const { mailCheck, handleCheck, fieldCheck } = require("../middlewares/regex");
const { checkKey } = require("../dataMappers/invite");

exports.login = async function(req, res) {
	try {
		const { email, password } = req.body;

		const user = await userMapper.login(email);
		if (!user) {
			return res.status(401).json({errCode:12,err:"bad login"});
		}
		if (! await bcrypt.compare(password, user.pass) ) {
			return res.status(401).json({errCode:12,err:"bad login"});
		}
		res.json({token:makeToken({id:user.id}), name:user.name, fullname:user.full_name, picture:user.picture, site_admin:user.site_admin});
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.signup = async function(req, res) {
	try {
		const { email, password, name, fullname, key } = req.body;

		const invitedBy = await checkKey(key);
		if (!invitedBy) {
			return res.status(403).json({errCode:14,err:"invalid invite key"});
		}
		if (!email || !password || !name || !fullname) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		if (!mailCheck(email) || email.length > 50 || !handleCheck(name) || !fieldCheck(fullname)) {
			return res.status(400).json({errCode:11,err:"invalid elements"});
		}
		const hash = await bcrypt.hash(password, 10);
		const created = await userMapper.create(email, hash, name, fullname, invitedBy.id);
		if(!created) {
			return res.status(500).json({errCode:0,err:"server error"});
		}

		res.status(201).json({user:created,token:makeToken({id:created.id})});
	} catch (err) {
		if(err.code=="23505") { //postgres code for unique key violation
			return res.status(400).json({errCode:13,err:"already exist"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.delete = async function(req, res) {
	try {
		const {password} = req.body;
		if (!password) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		const userPass = await userMapper.getPassword(req.userToken.id);
		if (!userPass) {
			return res.status(401).json({errCode:12,err:"bad login"});
		}
		if (! await bcrypt.compare(password, userPass) ) {
			return res.status(401).json({errCode:12,err:"bad login"});
		}
		await userMapper.delete(req.userToken.id);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.changePassword = async function(req, res) {
	try {
		const {currentPassword, newPassword} = req.body;
		if (!currentPassword || !newPassword) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		const userPass = await userMapper.getPassword(req.userToken.id);
		if (!userPass) {
			return res.status(401).json({errCode:12,err:"bad login"});
		}
		if (! await bcrypt.compare(currentPassword, userPass) ) {
			return res.status(401).json({errCode:12,err:"bad login"});
		}
		const hash = await bcrypt.hash(newPassword, 10);
		await userMapper.changePassword(req.userToken.id, hash);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}