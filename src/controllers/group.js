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