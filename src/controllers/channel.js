chanMapper = require('../dataMappers/channel');

exports.createInGroup = async function(req, res) {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).send("missing fields");
		}
		const created = await chanMapper.createInGroup(name, req.params.id, req.userToken.id);
		res.status(201).json(created);
		
	} catch (err) {
		if(err.message =='group doesn\'t exist') {
			return res.status(404).send('this group does not exist');
		}
		if(err.message =='not enough rights') {
			return res.status(403).send('not enough rights');
		}
		if(err.message =='channel already exist') {
			return res.status(400).send('another channel has the same name in this group');
		}
		res.status(500).send("server error");
		console.log(err);
	}
}

exports.getFromGroup = async function(req, res) {
	try {
		const list = await chanMapper.getFromGroup(req.params.id);
		res.status(200).json(list);
	} catch (err) {
		if(err.message =='group doesn\'t exist') {
			return res.status(404).send('this group does not exist');
		}
		res.status(500).send("server error");
		console.log(err);
	}
}