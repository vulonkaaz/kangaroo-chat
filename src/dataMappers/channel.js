const database = require('../database');

exports.createInGroup = async function(name, groupId, userId) {
	// we check if the group exist
	const groupCheck = await database.query('SELECT name FROM "group" WHERE id=$1', [groupId]);
	if (!groupCheck.rows[0]) {
		throw new Error('group doesn\'t exist');
	}
	// we check if user has the right to make a channel
	const roleCheck = await database.query('SELECT role FROM "user_group" WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
	if (!roleCheck.rows[0]) {
		throw new Error('user not in group');
	}
	const role = roleCheck.rows[0].role;
	if (role != 2 && role != 3 && role != 4) {
		throw new Error('not enough rights');
	}
	// we check if another channel doesn't exist with the same name in the group
	const nameCheck = await database.query('SELECT * FROM "group_channel" \
	                                        INNER JOIN "channel" ON "group_channel".channel_id = "channel".id\
	                                        WHERE "channel".name = $1 AND "group_channel".group_id = $2', [name, groupId]);
	if (nameCheck.rows[0]) {
		throw new Error("channel already exist");
	}
	const created = await database.query('INSERT INTO "channel" (name, position) \
	                                      VALUES ($1, (SELECT COUNT(*) FROM group_channel WHERE group_id=$2) ) \
	                                      RETURNING *', [name, groupId]);
	// we count the number of chan in the group to fill the position value, first chan will have position 0,
	// second chan will have position 1 etc.
	
	database.query('INSERT INTO "group_channel" (group_id, channel_id) VALUES ($1,$2)', [groupId, created.rows[0].id]);
	return created.rows[0];
}

exports.getFromGroup = async function(groupId, userId) {
	// we check if the group exist
	const groupCheck = await database.query('SELECT name FROM "group" WHERE id=$1', [groupId]);
	if (!groupCheck.rows[0]) {
		throw new Error('group doesn\'t exist');
	}
	// we check if user is in the group
	const roleCheck = await database.query('SELECT role FROM "user_group" WHERE group_id=$1 AND user_id=$2', [groupId, userId]);
	if (!roleCheck.rows[0]) {
		throw new Error('user not in group');
	}
	const list = await database.query('SELECT * FROM "channel" INNER JOIN "group_channel" \
	                                   ON "group_channel".channel_id = "channel".id\
	                                   WHERE "group_channel".group_id = $1', [groupId]);
	return list.rows;
}

exports.getFromUser = async function(userId) {
	const list = await database.query(
		'SELECT * FROM "channel" WHERE "channel".id IN\
		 (SELECT channel_id FROM "group_channel" WHERE "group_id" IN\
		  (SELECT group_id FROM "user_group" WHERE "user_id" = $1 AND "role"!= -1)\
		 )', [userId]
	);
	return list.rows;
}

exports.modify = async function(id, name, userId) {
	// we check if user has the rights
	const groupCheck = await database.query(
		'SELECT role FROM "user_group" WHERE group_id IN \
		 (SELECT group_id FROM "group_channel" WHERE channel_id =$1) AND user_id = $2', 
		[id, userId]
	);
	const role = groupCheck.rows[0].role;
	if (role != 2 && role != 3 && role != 4) {
		throw new Error('not enough rights');
	}
	// we check if channel name is unique in group
	const nameCheck = await database.query(
		'SELECT * FROM "channel" WHERE name = $1 AND id IN\
		 (SELECT channel_id FROM "group_channel" WHERE group_id IN\
		  (SELECT group_id FROM "group_channel"  WHERE channel_id=$2 AND main)\
		 )', [name, id]
	);
	if (nameCheck.rows[0]) {
		throw new Error("channel already exist");
	}
	const updated = await database.query(
		'UPDATE "channel" SET name = $1 WHERE id = $2 RETURNING *', [name, id]
	);
	return updated.rows[0];
}