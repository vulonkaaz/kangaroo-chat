groupMapper = require('../dataMappers/group');

exports.createGroup = async function(req, res) {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).send("missing fields");
		}
		const created = await groupMapper.createGroup(name, req.userToken.id);

		res.status(201).json(created);
	} catch (err) {
		res.status(500).send("server error");
		console.log(err);
	}
}

exports.joinGroup = async function(req, res) {
	try {
		await groupMapper.joinGroup(req.params.id, req.userToken.id);
		res.status(204).send();
	} catch (err) {
		if(err.message =='user already in group') {
			return res.status(403).send('user already in group or banned');
		}
		if(err.message =='group doesn\'t exist') {
			return res.status(404).send('this group does not exist');
		}
		res.status(500).send("server error");
		console.log(err);
	}
}

exports.leaveGroup = async function(req, res) {
	try {
		await groupMapper.leaveGroup(req.params.id, req.userToken.id);
		res.status(204).send();
	} catch (err) {
		if(err.message =='user not in group') {
			return res.status(404).send('user not in group');
		}
		if(err.message =='group doesn\'t exist') {
			return res.status(404).send('this group does not exist');
		}
		if(err.message =='user is banned') {
			return res.status(403).send('user is banned');
		}
		if(err.message =='user is creator') {
			return res.status(403).send('user is creator');
		}
		res.status(500).send("server error");
		console.log(err);
	}
}

exports.listJoined = async function(req, res) {
	try {
		const list = await groupMapper.listJoined(req.userToken.id);
		res.status(200).json(list)
	} catch (err) {
		res.status(500).send("server error");
		console.log(err);
	}
}