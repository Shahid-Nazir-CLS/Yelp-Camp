const express = require('express');
const passport = require('passport');
const user = require('../models/user');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");


router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", catchAsync(async(req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Successfully registered!")
            res.redirect("/campgrounds");
        });
    }catch(err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
})); 

router.get("/login", (req, res) => {
    if(req.user)
        return res.redirect("/campgrounds");

    res.render("users/login");
});

router.post("/login", passport.authenticate('local', {failureFlash: true, 
    failureRedirect: '/login'}), catchAsync(async(req, res) => {
    
    const redirectUrl = req.session.returnTo || "/campgrounds" ;
    delete req.session.returnTo;
    req.flash('success', 'welcome back'),
    res.redirect(redirectUrl);
})); 



router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out!")
    res.redirect("/campgrounds");
})

module.exports = router;