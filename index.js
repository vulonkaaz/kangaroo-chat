require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {origin: '*'}
});
//const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./src/router');
const socketHandler = require('./src/socket');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(router);
app.use((_,res) => {res.status(404).send("route not defined")});

socketHandler(io);

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
