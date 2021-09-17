const express = require('express');
const passport = require('passport');
const user = require('../models/user');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");


router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser)); 

router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, 
    failureRedirect: '/login'}), catchAsync(users.loginUser)); 

router.get("/logout", users.logoutUser)

module.exports = router;