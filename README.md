# Kangaro'O

Kangaro'O is a web-based instant messaging software you can install on your server, it is written in node.js for the backend and react for the frontend

This repo is the backend part of the project

## dependencies

nodejs, npm, postgres, sqitch

## how to start

* make a new database in postgres
* make the sqitch.conf and .env files using the exemples
* `sqitch deploy` to fill the database
* `node index.js` to launch the server
