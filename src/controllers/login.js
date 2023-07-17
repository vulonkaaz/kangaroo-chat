const bcrypt = require('bcrypt');
const userMapper = require("../dataMappers/user");
const { makeToken } = require("../middlewares/auth");

exports.login = async function(req, res) {
	try {
		const { email, password } = req.body;

		const user = await userMapper.login(email);
		if (!user) {
			return res.status(401).send('invalid email or passwd');
		}
		if (! await bcrypt.compare(password, user.pass) ) {
			return res.status(401).send('invalid email or passwd');
		}
		res.json({token:makeToken({id:user.id})});
	} catch (err) {
		res.status(500).send("server error");
		console.log(err);
	}
}

exports.signup = async function(req, res) {
	try {
		const { email, password, name, fullname } = req.body;

		if (!email || !password || !name || !fullname) {
			return res.status(400).send("missing fields");
		}
		const hash = await bcrypt.hash(password, 10);
		const created = await userMapper.create(email, hash, name, fullname);
		if(!created) {
			return res.status(500).send("database error");
		}

		res.status(201).json({user:created,token:makeToken({id:created.id})});
	} catch (err) {
		res.status(500).send("server error");
		console.log(err);
	}
}