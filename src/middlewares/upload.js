exports.fileCheck = function(req, file, cb) {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true); // Accept the file
	} else {
		cb(new Error('not an image'), false);
	}
}

exports.errHandler = function(err,req,res, next) {
	if (err.message == 'not an image') {
		res.status(400).json({errCode:31, err:"bad file"});
	}
	if (err.code == 'LIMIT_FILE_SIZE') {
		res.status(400).json({errCode:32, err:"file too large"});
	}
}