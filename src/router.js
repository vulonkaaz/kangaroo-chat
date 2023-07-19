const express = require('express');
const router = express.Router();
const loginCtrl = require('./controllers/login');
const userCtrl = require('./controllers/user');
const groupCtrl = require('./controllers/group');
const chanCtrl = require('./controllers/channel');
const { verify } = require("./middlewares/auth");

router.post("/api/login", loginCtrl.login);
router.post("/api/signup", loginCtrl.signup);

router.get("/api/user/:id(\\d+)", verify, userCtrl.getProfile);
router.get("/api/user/me", verify, userCtrl.getMyProfile);

router.post("/api/group", verify, groupCtrl.createGroup);
router.get ("/api/group/joined", verify, groupCtrl.listJoined);
router.get ("/api/group/directory", verify, groupCtrl.directory);
router.post("/api/group/:id(\\d+)/join", verify, groupCtrl.joinGroup);
router.post("/api/group/:id(\\d+)/leave", verify, groupCtrl.leaveGroup);

router.post("/api/group/:id(\\d+)/channel", verify, chanCtrl.createInGroup);

module.exports = router;
