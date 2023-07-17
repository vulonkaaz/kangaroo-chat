const database = require('../database');

exports.createGroup = async function(name, creatorId) {
	const group = await database.query('INSERT INTO "group" (name) VALUES ($1) RETURNING *', [name]);
	database.query('INSERT INTO "user_group" (user_id, group_id, role) VALUES ($1, $2, 4)', [creatorId, group.rows[0].id]);

	return group.rows[0];
}