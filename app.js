if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // for getting the error details
const session = require("express-session");
const MongoStore = require("connect-mongo"); // for storing web cookies on our server
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const user = require("./models/user.js");

// let mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
let db_url = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

let store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("Error in the mongo", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET, // A secret key used to sign the session ID cookie
  resave: false, // Forces the session to be saved back to the session store
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  cookie: {
    // for saving cookie in browser for a time period
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // it is used to store user data so the user don't need to login if he switch to other page
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // req.user is used to check wether the user is loggen in or not

  next();
});

// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({
//     email: "nsld@snln",
//     username: "wvd",
//   });

//   let newUser = await User.register(fakeUser, "helloworld"); // the 2nd parameter is our passoword it also check wether the user is in the database or not
//   res.send(newUser);
// });

app.use("/listings", listingRouter); // /listingRouter is a common path
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Some error occured" } = err;
  res.status(statuscode).render("error.ejs", { message });
  // res.status(statuscode).send(message);
});

app.listen(8080, () => {
  console.log(`App is listening on port 8080`);
});
