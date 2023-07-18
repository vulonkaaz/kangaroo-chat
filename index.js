require('dotenv').config();

const express = require('express');
const app = express();
//const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./src/router');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(router);
app.use((_,res) => {res.status(404).send("route not defined")});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
