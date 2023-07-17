const express = require('express');
const router = express.Router();
const loginCtrl = require('./controllers/login');
const userCtrl = require('./controllers/user');
const { verify } = require("./middlewares/auth");

router.post("/api/login", loginCtrl.login);
router.post("/api/signup", loginCtrl.signup);

router.get("/api/user/:id(\\d+)", verify, userCtrl.getProfile);
router.get("/api/user/me", verify, userCtrl.getMyProfile);

module.exports = router;
