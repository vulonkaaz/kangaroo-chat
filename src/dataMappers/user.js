const database = require('../database');

exports.login = async function(email) {
	const query = 'SELECT id, name, full_name, picture, pass FROM "user" WHERE email=$1';
	const result = await database.query(query, [email]);

	return result.rows[0];
}

exports.create = async function(email, password, name, fullname) {
	const query = 'INSERT INTO "user" (email, pass, name, full_name) VALUES ($1,$2,$3,$4) RETURNING id, email, name, full_name';
	const result = await database.query(query, [email, password, name, fullname]);

	return result.rows[0];
}

exports.getProfile = async function(id) {
	const query = 'SELECT id, email, name, full_name, picture, phone, title, position, department, status, location, \
	               website, contact_email \
	               FROM "user" WHERE id=$1';
	const result = await database.query(query, [id]);

	console.log(id);
	console.log(result.rows);
	return result.rows[0];
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