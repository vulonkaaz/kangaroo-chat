chanMapper = require('../dataMappers/channel');

exports.createInGroup = async function(req, res) {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		const created = await chanMapper.createInGroup(name, req.params.id, req.userToken.id);
		res.status(201).json(created);
		
	} catch (err) {
		if(err.message =='group doesn\'t exist') {
			return res.status(404).json({errCode:20,err:"not found"});
		}
		if(err.message =='user not in group') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		if(err.message =='not enough rights') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		if(err.message =='channel already exist') {
			return res.status(400).json({errCode:13,err:"already exist"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.getFromGroup = async function(req, res) {
	try {
		const list = await chanMapper.getFromGroup(req.params.id, req.userToken.id);
		res.status(200).json(list);
	} catch (err) {
		if(err.message =='group doesn\'t exist') {
			return res.status(404).json({errCode:20,err:"not found"});
		}
		if(err.message =='user not in group') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.getMyChannels = async function(req, res) {
	try {
		const list = await chanMapper.getFromUser(req.userToken.id);
		res.status(200).json(list);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.modifyChannel = async function(req, res) {
	try {
		const {name} = req.body;
		if (!name) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		
		const updated = await chanMapper.modify(req.params.id, name, req.userToken.id);
		res.status(200).json(updated);
	} catch (err) {
		if(err.message =='not enough rights') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		if(err.message =='channel already exist') {
			return res.status(400).json({errCode:13,err:"already exist"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.deleteChannel = async function(req, res) {
	try {
		await chanMapper.delete(req.params.id, req.userToken.id);
		res.status(204).send();
	} catch (err) {
		if(err.message =='not enough rights') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}