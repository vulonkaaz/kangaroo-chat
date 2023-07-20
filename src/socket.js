const { socketVerify } = require('./middlewares/auth');

module.exports = (io) => {
	io.use(socketVerify);

	io.on('connection', (socket) => {
		console.log('a user connected');
		console.log(socket.user);
	});

};