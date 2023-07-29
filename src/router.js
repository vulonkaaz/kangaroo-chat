const express = require('express');
const router = express.Router();
const loginCtrl = require('./controllers/login');
const userCtrl = require('./controllers/user');
const groupCtrl = require('./controllers/group');
const chanCtrl = require('./controllers/channel');
const msgCtrl = require('./controllers/message');
const { verify } = require("./middlewares/auth");
const { fileCheck, errHandler: upldErrHandler } = require("./middlewares/upload");
const multer  = require('multer');
const upload = multer({ 
	dest: 'media/',
	fileFilter: fileCheck,
	limits: {fileSize: 8388608} // 8 MiB = 8388608 B
 });

router.post("/api/login", loginCtrl.login);
router.post("/api/signup", loginCtrl.signup);

router.get   ("/api/user/:id(\\d+)", verify, userCtrl.getProfile);
router.get   ("/api/user/search", verify, userCtrl.search);
router.get   ("/api/user/me", verify, userCtrl.getMyProfile);
router.patch ("/api/user/me", verify, userCtrl.changeMyProfile);
router.put   ("/api/user/me", verify, userCtrl.rewriteMyProfile);
router.delete("/api/user/me", verify, loginCtrl.delete);
router.post  ("/api/user/me/avatar", verify, upload.single("file"), userCtrl.avatarUpload, upldErrHandler);

router.post  ("/api/group", verify, groupCtrl.createGroup);
router.get   ("/api/group/joined", verify, groupCtrl.listJoined);
router.get   ("/api/group/directory", verify, groupCtrl.directory);
router.get   ("/api/group/search", verify, groupCtrl.search);
router.post  ("/api/group/:id(\\d+)/join", verify, groupCtrl.joinGroup);
router.post  ("/api/group/:id(\\d+)/leave", verify, groupCtrl.leaveGroup);
router.patch ("/api/group/:id(\\d+)", verify, groupCtrl.updateGroup);
router.delete("/api/group/:id(\\d+)", verify, groupCtrl.delete);

router.post  ("/api/group/:id(\\d+)/channel", verify, chanCtrl.createInGroup);
router.get   ("/api/group/:id(\\d+)/channel", verify, chanCtrl.getFromGroup);
router.get   ("/api/user/me/channel", verify, chanCtrl.getMyChannels);
router.patch ('/api/channel/:id(\\d+)', verify, chanCtrl.modifyChannel);
router.delete('/api/channel/:id(\\d+)', verify, chanCtrl.deleteChannel);

router.get ('/api/channel/:id(\\d+)/message', verify, msgCtrl.getMessages);
router.post('/api/upload', verify, upload.single("file"), msgCtrl.upload, upldErrHandler);

module.exports = router;
