const jwt = require('jsonwebtoken');

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