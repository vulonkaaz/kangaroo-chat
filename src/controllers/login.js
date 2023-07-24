const bcrypt = require('bcrypt');
const userMapper = require("../dataMappers/user");
const { makeToken } = require("../middlewares/auth");

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
		res.json({token:makeToken({id:user.id}), name:user.name, fullname:user.full_name, picture:user.picture});
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.signup = async function(req, res) {
	try {
		const { email, password, name, fullname } = req.body;

		if (!email || !password || !name || !fullname) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		const hash = await bcrypt.hash(password, 10);
		const created = await userMapper.create(email, hash, name, fullname);
		if(!created) {
			return res.status(500).json({errCode:0,err:"server error"});
		}

		res.status(201).json({user:created,token:makeToken({id:created.id})});
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}