const userMapper = require("../dataMappers/user");

exports.getProfile = async function(req, res) {
	try {
		const user = await userMapper.getProfile(req.params.id);
		if (!user) {
			return res.status(404).json({errCode:20,err:"not found"});
		}
		res.status(200).json(user);
	}catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.getMyProfile = async function(req, res) {
	try {
		const user = await userMapper.getProfile(req.userToken.id);
		if (!user) {
			return res.status(404).json({errCode:20,err:"not found"});
		}
		res.status(200).json(user);
	}catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}