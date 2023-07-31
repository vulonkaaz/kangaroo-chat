const database = require('../database');
const crypto = require("crypto");

exports.getAll = async function() {
	const list = await database.query(
		'SELECT * FROM "invite_key"'
	);
	return list.rows;
}

exports.makeNew = async function(creatorId) {
	const key = crypto.randomBytes(30).toString('base64url');
	const newKey = await database.query(
		'INSERT INTO "invite_key" (key, issuer_id) VALUES ($1, $2) RETURNING *', 
		[key, creatorId]
	);
	return newKey.rows[0];
}