const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registerUser = await User.register(newUser, password); // the 2nd parameter is our passoword it also check wether the user is in the database or not
    // console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("signup");
  }
};
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to WanderLust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You are logged out");
      res.redirect("/listings");
    }
  });
};
