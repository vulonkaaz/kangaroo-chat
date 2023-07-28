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

exports.changeMyProfile = async function(req, res) {
	try {
		const {name, full_name, phone, title, position, department, status, location, website, contact_email} = req.body;
		const updated = await userMapper.updateProfile(
			req.userToken.id, name, full_name, phone, title, position, department, status, location, website, contact_email
		);
		res.status(200).json(updated);
	} catch (err) {
		if(err.code=="23505") { //postgres code for unique key violation
			return res.status(400).json({errCode:13,err:"already exist"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.rewriteMyProfile = async function(req, res) {
	try {
		const {name, full_name, phone, title, position, department, status, location, website, contact_email} = req.body;
		const updated = await userMapper.rewriteProfile(
			req.userToken.id, name, full_name, phone, title, position, department, status, location, website, contact_email
		);
		res.status(200).json(updated);
	} catch (err) {
		if(err.code=="23505") { //postgres code for unique key violation
			return res.status(400).json({errCode:13,err:"already exist"});
		}
		if(err.code=="23502") { //postgres code for not null key violation
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.avatarUpload = async function(req, res) {
	try {
		if (!req.file) {
			return res.status(400).json({errCode:30, err:"no file"});
		}
		const updated = await userMapper.updateAvatar(req.userToken.id, req.file.filename);
		res.status(200).json(updated);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}