const userMapper = require("../dataMappers/user");

exports.getProfile = async function(req, res) {
	try {
		const user = await userMapper.getProfile(req.params.id);
		if (!user) {
			return res.status(404).send("user not found");
		}
		res.status(200).json(user);
	}catch (err) {
		res.status(500).send("server error");
		console.log(err);
	}
}

exports.getMyProfile = async function(req, res) {
	try {
		const user = await userMapper.getProfile(req.userToken.id);
		if (!user) {
			return res.status(404).send("user not found");
		}
		res.status(200).json(user);
	}catch (err) {
		res.status(500).send("server error");
		console.log(err);
	}
}