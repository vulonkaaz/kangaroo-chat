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