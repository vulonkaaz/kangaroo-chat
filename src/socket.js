const { socketVerify } = require('./middlewares/auth');
const messageCtrl = require('./controllers/message');

module.exports = (io) => {
	io.use(socketVerify);

	io.on('connection', (socket) => {
		console.log('a user connected');
		console.log(socket.user);

		//socket.on("message", messageCtrl.sendMessage);
		socket.on("message", (message) => {
			messageCtrl.sendMessage(message, socket.user, io);
			// it was the only way I found to pass the user ID to my sendMessage(), if someone know a cleaner
			// way to do that that doesn't involve this weird () => {} function please tell me
		});

		socket.on("join", (id) => {
			messageCtrl.joinRoom(id, socket);
		});

		socket.on("leave", (id) => {
			socket.leave("chan-"+id);
		});
	});

};