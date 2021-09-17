const express = require('express');
const passport = require('passport');
const user = require('../models/user');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");



router.get("/register", users.renderRegisterForm);

router.post("/register", catchAsync(users.createUser)); 

router.get("/login", users.renderLoginForm);

router.post("/login", passport.authenticate('local', {failureFlash: true, 
    failureRedirect: '/login'}), catchAsync(users.loginUser)); 

router.get("/logout", users.logoutUser)

module.exports = router;