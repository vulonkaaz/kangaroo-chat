const msgMapper = require('../dataMappers/message');

exports.sendMessage = async function(message, user, io) {
	try {
		const {content, attachment, channel_id} = message;

		if (!content && !attachment) {
			return null;
		}

		messageDB = await msgMapper.send(user.id, channel_id, content, attachment);
		io.to("chan-"+channel_id).emit("message", messageDB);
	} catch (err) {
		console.log(err);
	}
}

exports.joinRoom = async function(id, socket) {
	try {
		const check = await msgMapper.userTest(socket.user.id, id);
		if (check) {
			socket.join("chan-"+id);
		}
	} catch (err) {
		console.log(err);
	}
}

exports.getMessages = async function(req, res) {
	try {
		const timestamp = new Date(req.query.time || Date.now());
		const list = await msgMapper.getMessages(req.userToken.id,req.params.id, timestamp);
		res.status(200).json(list);
	} catch (err) {
		if(err.message =='user not in channel') {
			return res.status(403).json({errCode:21,err:"not enough rights"});
		}
		res.status(500).json({errCode:0,err:"server error"});
		console.log(err);
	}
}

exports.upload = function(req, res) {
	if (!req.file) {
		return res.status(400).json({errCode:30, err:"no file"});
	}
	res.status(201).json({filename:req.file.filename});
}