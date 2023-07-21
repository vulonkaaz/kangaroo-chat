const msgMapper = require('../dataMappers/message');

exports.sendMessage = async function(message, user, io) {
	try {
		const {content, channel_id} = message;

		if (!content) {
			return null;
		}

		messageDB = await msgMapper.send(user.id, channel_id, content);
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