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

exports.send = async function(userId, chanId, content) {
	// we check if user is in the group
	const check = await userTest(userId, chanId);
	if (!check) {
		throw new Error('user not in channel');
	}
	const message = await database.query(
		'INSERT INTO "message" (content, sender_id, channel_id) VALUES ($1,$2,$3)\
		 RETURNING *', [content,userId,chanId]
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
		'SELECT * FROM "message" WHERE channel_id=$1 AND created_at<$2 ORDER BY created_at DESC LIMIT 50',
		[chanId,timestamp]
	);
	return list.rows;
}