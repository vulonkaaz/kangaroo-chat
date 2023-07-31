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