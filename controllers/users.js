const User = require("../models/user");


module.exports.requestSignupPage = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.doSignup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeresUser = await User.register(newUser, password);
        
        req.login(registeresUser, (err) => {
            if (err) {
                return next(err);
            };
            req.flash("success", "User Registered Sucessfully!");
            res.redirect("/listings");
        });
        
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }   

}

module.exports.requestLoginPage = (req, res) => {
    res.render("users/login.ejs");
  }


module.exports.doLogin = async(req, res) => {
    const {username, password} = req.body;

    req.flash("success", `Welcome back ${username}!`);
    let redirectUrl = res.locals.returnTo || "/listings";
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged Out Successfully!");
        res.redirect("/listings");
    });
}