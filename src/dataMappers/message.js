const database = require('../database');

const userTest = async function(userId, chanId) {
	// we check if user is in the group
	const groupCheck = await database.query(
		'SELECT role FROM "user_group" WHERE group_id IN \
		 (SELECT group_id FROM "group_channel" WHERE channel_id =$1)\
		 AND role != -1 AND user_id =$2', [chanId, userId]
	);
	if (!groupCheck.rows[0]) {
		return false;
	} else {
		return true;
	}
}

exports.send = async function(userId, chanId, content, attachment) {
	// we check if user is in the group
	const check = await userTest(userId, chanId);
	if (!check) {
		throw new Error('user not in channel');
	}
	const message = await database.query(
		'WITH inserted_msg AS \
		(INSERT INTO "message" (content, attachment, sender_id, channel_id) VALUES ($1,$2,$3,$4)\ RETURNING *)\
		SELECT "inserted_msg".*, "user".name, "user".full_name, "user".picture \
		FROM inserted_msg INNER JOIN "user" ON sender_id="user".id', [content, attachment,userId,chanId]
	);
	return message.rows[0];
}

exports.userTest = userTest;

exports.getMessages = async function(userId, chanId, timestamp) {
	// we check if user is in the group
	const check = await userTest(userId, chanId);
	if (!check) {
		throw new Error('user not in channel');
	}
	const list = await database.query(
		'SELECT "message".*, "user".name, "user".full_name, "user".picture FROM "message" \
		INNER JOIN "user" ON sender_id="user".id WHERE channel_id=$1 AND "message".created_at<$2 \
		ORDER BY created_at DESC LIMIT 50',
		[chanId,timestamp]
	);
	return list.rows;
}