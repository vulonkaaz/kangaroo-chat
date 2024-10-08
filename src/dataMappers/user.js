const database = require('../database');

exports.login = async function(email) {
	const query = 'SELECT id, name, full_name, picture, pass, site_admin FROM "user" WHERE email=$1';
	const result = await database.query(query, [email]);

	return result.rows[0];
}

exports.create = async function(email, password, name, fullname, keyId) {
	const query = 'INSERT INTO "user" (email, pass, name, full_name, invited_by) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, name, full_name';
	const result = await database.query(query, [email, password, name, fullname, keyId]);

	return result.rows[0];
}

exports.getPassword = async function(id) {
	const result = await database.query('SELECT pass from "user" WHERE id=$1', [id]);
	return result.rows[0].pass;
}

exports.getProfile = async function(id) {
	const query = 'SELECT id, email, name, full_name, picture, phone, title, position, department, status, location, \
	               website, contact_email, site_admin \
	               FROM "user" WHERE id=$1';
	const result = await database.query(query, [id]);

	return result.rows[0];
}

exports.search = async function(s) {
	const query = 'SELECT id, email, name, full_name, picture, phone, title, position, department, status, location, \
	               website, contact_email \
	               FROM "user" WHERE LOWER(full_name) LIKE LOWER($1)';
	const result = await database.query(query, ['%'+s+'%']);

	return result.rows;
}

exports.updateProfile = async function(id, name, fullName, phone, title, position, department, status, 
	                                    location, website, contact_email) {
	const currentProfile = await database.query(
		'SELECT name, full_name, phone, title, position, department, status, location, \
		website, contact_email FROM "user" WHERE id=$1', [id]
	);
	const updated = await database.query(
		'UPDATE "user" SET (name, full_name, phone, title, position, department, status, location, website, contact_email, updated_at)\
		 = ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW()) \
		 WHERE id = $11\
		 RETURNING id, email, name, full_name, picture, phone, title, position, department, status, location, website, contact_email',
		[
			name || currentProfile.rows[0].name,
			fullName || currentProfile.rows[0].full_name,
			phone || currentProfile.rows[0].phone,
			title || currentProfile.rows[0].title,
			position || currentProfile.rows[0].position,
			department || currentProfile.rows[0].department,
			status || currentProfile.rows[0].status,
			location || currentProfile.rows[0].location,
			website || currentProfile.rows[0].website,
			contact_email || currentProfile.rows[0].contact_email,
			id
		]
	);
	return updated.rows[0];
}

exports.rewriteProfile = async function(id, name, fullName, phone, title, position, department, status, 
	                                     location, website, contact_email) {
	const updated = await database.query(
		'UPDATE "user" SET (name, full_name, phone, title, position, department, status, location, website, contact_email, updated_at)\
			= ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW()) \
			WHERE id = $11\
			RETURNING id, email, name, full_name, picture, phone, title, position, department, status, location, website, contact_email',
		[
			name,
			fullName,
			phone,
			title,
			position,
			department,
			status,
			location,
			website,
			contact_email,
			id
		]
	);
	return updated.rows[0];
}

exports.updateAvatar = async function(id, filename) {
	const updated = await database.query(
		'UPDATE "user" SET (picture, updated_at) = ($1, NOW()) \
			WHERE id = $2\
			RETURNING id, email, name, full_name, picture, phone, title, position, department, status, location, website, contact_email',
		[
			filename,
			id
		]
	);
	return updated.rows[0];
}

exports.delete = async function(id) {
	await database.query('DELETE FROM "message" WHERE sender_id=$1', [id]);
	await database.query('DELETE FROM "user_group" WHERE user_id=$1', [id]);
	await database.query('DELETE FROM "user_channel" WHERE user_id=$1', [id]);
	await database.query('DELETE FROM "user" WHERE id=$1', [id]);
}

exports.changePassword = async function(id, hash) {
	await database.query('UPDATE "user" SET pass = $1 WHERE id = $2', [hash, id]);
}

exports.isAdmin = async function(id) {
	const value = await database.query('SELECT "site_admin" FROM "user" WHERE id=$1', [id]);
	return value.rows[0].site_admin;
}