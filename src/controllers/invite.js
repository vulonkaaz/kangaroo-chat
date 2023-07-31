const invMapper = require('../dataMappers/invite');

exports.getAll = async function(_, res) {
	try {
		const list = await invMapper.getAll();

		res.status(200).json(list);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.make = async function(req, res) {
	try {
		const created = await invMapper.makeNew(req.userToken.id);
		res.status(201).json(created);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.update = async function(req, res) {
	try {
		const {valid} = req.body;
		if (typeof valid != 'boolean') {
			return res.status(400).json({errCode:11,err:"invalid elements"});
		}
		const updated = await invMapper.changeValidity(req.params.id, valid);
		res.status(200).json(updated);
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}