const jwt = require('jsonwebtoken');
const {isAdmin} = require("../dataMappers/user");

exports.makeToken = function(obj) {
	return jwt.sign(obj, process.env.TOKEN_SECRET, { expiresIn: '3 days' });
}

exports.verify = function(req,res,next) {
	if (!req.headers.authorization) {
		return res.status(401).json({errCode:50,err:"no token provided"});
	}
	const token = req.headers.authorization.split(' ')[1];
	if(!token){
		return res.status(401).json({errCode:50,err:"no token provided"});
	}

	jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
		if (err) {
			res.status(498).json({errCode:51,err:"bad token"});
		} else {
			req.userToken = decodedToken;
			next();
		}
	});
}

exports.socketVerify = function (socket, next) {
	const token = socket.handshake.auth.token;

	if(!token){
		return next(new Error('Auth: no token provided'));
	}

	jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
		if (err) {
			return next(new Error('Auth: invalid token provided'));
		} else {
			socket.user = decodedToken;
			next();
		}
	});
}

exports.adminCheck = async function (req, res, next) {
	try {
		if (await isAdmin(req.userToken.id)) {
			next();
		} else {
			res.status(403).json({errCode:21,err:"not enough rights"});
		}
	} catch (err) {
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}