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

exports.changeValidity = async function(id, valid) {
	const updated = await database.query(
		'UPDATE "invite_key" SET valid = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
		[valid, id]
	);
	return updated.rows[0];
}

exports.checkKey = async function(string) {
	const key = await database.query(
		'SELECT id FROM "invite_key" WHERE key = $1 AND valid', [string]
	);
	return key.rows[0];
}