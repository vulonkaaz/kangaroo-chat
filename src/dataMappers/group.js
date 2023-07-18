const database = require('../database');

exports.createGroup = async function(name, creatorId) {
	const group = await database.query('INSERT INTO "group" (name) VALUES ($1) RETURNING *', [name]);
	database.query('INSERT INTO "user_group" (user_id, group_id, role) VALUES ($1, $2, 4)', [creatorId, group.rows[0].id]);

	return group.rows[0];
}

exports.joinGroup = async function(groupId, userId) {
	// we check if the group exist
	const groupCheck = await database.query('SELECT name FROM "group" WHERE id=$1', [groupId]);
	if (!groupCheck.rows[0]) {
		throw new Error('group doesn\'t exist');
	}
	// we check if the user is already in Group
	const check = await database.query('SELECT * FROM "user_group" WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
	if (check.rows[0]) {
		throw new Error('user already in group');
	}
	return await database.query('INSERT INTO "user_group" (user_id, group_id, role) VALUES ($1, $2, 0)', [userId, groupId]);
}

exports.leaveGroup = async function(groupId, userId) {
	// we check if the group exist
	const groupCheck = await database.query('SELECT name FROM "group" WHERE id=$1', [groupId]);
	if (!groupCheck.rows[0]) {
		throw new Error('group doesn\'t exist');
	}
	//we check if the user is in the group
	const check = await database.query('SELECT * FROM "user_group" WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
	if (!check.rows[0]) {
		throw new Error('user not in group');
	}
	if (check.rows[0].role === -1) { // a banned user can't leave (this would unban them)
		throw new Error('user is banned');
	}
	if (check.rows[0].role === 4) { // the creator can't abandon their group
		throw new Error('user is creator');
	}
	return await database.query('DELETE FROM "user_group" WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
}

exports.listJoined = async function(userId) {
	const list = await database.query('SELECT "group".*, "user_group".role FROM "group" \
	                                   INNER JOIN "user_group" ON "group".id = "user_group".group_id\
	                                   WHERE "user_group".user_id = $1 AND "user_group".role != -1', [userId]);
	return list.rows;
}