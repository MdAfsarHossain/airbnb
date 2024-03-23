const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Signup and post route
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// Login and Login post router
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl , passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.login);


// Signup routes
// router.get("/signup", userController.renderSignupForm);

// Signup Post routes
// router.post("/signup", wrapAsync(userController.signup));

// Login routes
// router.get("/login", userController.renderLoginForm);

// Login post routes 
// Here use passport middleware for conform user is authenticated or not. This middle handler will redirect the user to the login page and redirect back to the login page if the user is authenticated or not. 
// router.post("/login", saveRedirectUrl , passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.login);


// Logout routes
router.get("/logout", userController.logout);

module.exports = router;



// Login user

/*
1.
afsar@gmail.com
afsar1
afsar

2.
afsar@gmail.com
AfsarHossain
12345

3. 
tarek@gmail.com
TarekHossain
12345

4. 
KamrunNahar
nahar@gmail.com
12345


5.
AnwarHossain
anwar@gmail.com
12345

6.


*/