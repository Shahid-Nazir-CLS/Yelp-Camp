const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
};

module.exports.createUser = async(req, res, next) => {
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
};

module.exports.renderLoginForm = (req, res) => {
    if(req.user)
        return res.redirect("/campgrounds");

    res.render("users/login");
};

module.exports.loginUser = async(req, res) => {
    
    const redirectUrl = req.session.returnTo || "/campgrounds" ;
    delete req.session.returnTo;
    req.flash('success', 'welcome back'),
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out!")
    res.redirect("/campgrounds");
};