const express = require('express');
const router = express.Router();
const loginCtrl = require('./controllers/login');
const userCtrl = require('./controllers/user');
const groupCtrl = require('./controllers/group');
const chanCtrl = require('./controllers/channel');
const msgCtrl = require('./controllers/message');
const { verify } = require("./middlewares/auth");

router.post("/api/login", loginCtrl.login);
router.post("/api/signup", loginCtrl.signup);

router.get   ("/api/user/:id(\\d+)", verify, userCtrl.getProfile);
router.get   ("/api/user/me", verify, userCtrl.getMyProfile);
router.patch ("/api/user/me", verify, userCtrl.changeMyProfile);
router.put   ("/api/user/me", verify, userCtrl.rewriteMyProfile);
router.delete("/api/user/me", verify, loginCtrl.delete);

router.post  ("/api/group", verify, groupCtrl.createGroup);
router.get   ("/api/group/joined", verify, groupCtrl.listJoined);
router.get   ("/api/group/directory", verify, groupCtrl.directory);
router.get   ("/api/group/search", verify, groupCtrl.search);
router.post  ("/api/group/:id(\\d+)/join", verify, groupCtrl.joinGroup);
router.post  ("/api/group/:id(\\d+)/leave", verify, groupCtrl.leaveGroup);
router.patch ("/api/group/:id(\\d+)", verify, groupCtrl.updateGroup);
router.delete("/api/group/:id(\\d+)", verify, groupCtrl.deleteGroup);

router.post("/api/group/:id(\\d+)/channel", verify, chanCtrl.createInGroup);
router.get ("/api/group/:id(\\d+)/channel", verify, chanCtrl.getFromGroup);
router.get ("/api/user/me/channel", verify, chanCtrl.getMyChannels);

router.get ('/api/channel/:id(\\d+)/message', verify, msgCtrl.getMessages);

module.exports = router;
