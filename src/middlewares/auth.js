const jwt = require('jsonwebtoken');

exports.makeToken = function(obj) {
	return jwt.sign(obj, process.env.TOKEN_SECRET, { expiresIn: '3 days' });
}

exports.verify = function(req,res,next) {
	if (!req.headers.authorization) {
		res.status(401).send("authentification required, no token provided");
	}
	const token = req.headers.authorization.split(' ')[1];
	if(!token){
		res.status(401).send("authentification required, no token provided");
	}

	jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
		if (err) {
			res.status(498).send("authentification required, invalid token provided");
		} else {
			req.userToken = decodedToken;
			next();
		}
	});
}