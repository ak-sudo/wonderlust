
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
var methodOverride = require("method-override");
const ejsMmate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session"); 
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const reviews = require("./routes/reviews.js");
const listings = require("./routes/listings.js");
const userRoute = require("./routes/user.js");


const dbURL = process.env.ATLASDB_URL;

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

async function main() {
  await mongoose.connect(dbURL);
}

const validaeteListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if (error) {
      throw new ExpressError(400, error);
  }
  else{
    next();
  }
}

const validaeteReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  if (error) {
      throw new ExpressError(400, error);
  }
  else{
    next();
  }
}

main()
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.engine("ejs", ejsMmate);
app.set("view engine", "ejs");
app.set(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
})

store.on("error", function (e) {
  console.log("Session store error", e);
});

const sessionOptions ={
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  coookies: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days

  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRoute);



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal Server Error" } = err;
//   res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { err,req });
//   res.send("Something went wrong");
});
