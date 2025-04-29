const express = require("express");
const route = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

route.route('/signup')
.get(userController.requestSignupPage)
.post(userController.doSignup);

route.route('/login')
.get(userController.requestLoginPage)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}), userController.doLogin)

route.get("/logout", userController.Logout)


module.exports = route;