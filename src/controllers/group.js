groupMapper = require('../dataMappers/group');

exports.createGroup = async function(req, res) {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		const created = await groupMapper.createGroup(name, req.userToken.id);

		res.status(201).json(created);
	} catch (err) {
		if(err.code=="23505") { //postgres code for unique key violation
			return res.status(400).json({errCode:13,err:"already exist"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.joinGroup = async function(req, res) {
	try {
		await groupMapper.joinGroup(req.params.id, req.userToken.id);
		res.status(204).send();
	} catch (err) {
		if(err.message =='user already in group') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		if(err.message =='group doesn\'t exist') {
			return res.status(404).json({errCode:20,err:"not found"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.leaveGroup = async function(req, res) {
	try {
		await groupMapper.leaveGroup(req.params.id, req.userToken.id);
		res.status(204).send();
	} catch (err) {
		if(err.message =='user not in group') {
			return res.status(404).json({errCode:20,err:"not found"});
		}
		if(err.message =='group doesn\'t exist') {
			return res.status(404).json({errCode:20,err:"not found"});
		}
		if(err.message =='user is banned') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		if(err.message =='user is creator') {
			return res.status(403).json({errCode:21,err:"creator can't leave"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.listJoined = async function(req, res) {
	try {
		const list = await groupMapper.listJoined(req.userToken.id);
		res.status(200).json(list);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.directory = async function(_, res) {
	try {
		const list = await groupMapper.listVisible();
		res.status(200).json(list);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.search = async function(req, res) {
	try {
		const list = await groupMapper.searchVisible(req.query.s);
		res.status(200).json(list);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.updateGroup = async function(req, res) {
	try {
		const {name} = req.body;
		if (!name) {
			return res.status(400).json({errCode:10,err:"missing fields"});
		}
		const updated = await groupMapper.updateGroup(req.params.id, name, req.userToken.id);
		res.status(200).json(updated);
	} catch (err) {
		if(err.code=="23505") { //postgres code for unique key violation
			return res.status(400).json({errCode:13,err:"already exist"});
		}
		if(err.message =='user not in group') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		if(err.message =='not enough rights') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}