const User = require("../models/user.js");

// New Signup form
module.exports.renderSignupForm = (req, res) => {
    // res.send("Form");

    res.render("users/signup.ejs");

};


// Render Signup form for a new User
module.exports.signup = async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser, password);
        // console.log(registerUser);

        // This use for when the user create a new account it's can login the user
        req.login(registerUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Login
module.exports.login = async (req, res) => {
    // res.send("Welcome to Wanderlust! You are logged in!");
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


// Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are now logged out!");
        res.redirect("/listings");
    });
};