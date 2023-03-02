const express = require("express");
// const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

// Init App
const app = express();

// Passport config
require("./config/passport")(passport);

// DB config
const db = require("./config/keys").database;

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// EJS
// app.use(expressLayouts);
app.set("view engine", "ejs");

// bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Static
app.use(express.static(__dirname + "/public"));

// Method Override
app.use(methodOverride("_method"));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Mongoose Find and Modify
mongoose.set("useFindAndModify", false);

// Global Vars
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/elections", require("./routes/elections"));
app.use("/elections/:id/candidates", require("./routes/candidates"));

// 404 Page
app.get("*", (req, res) => {
  res.render("404");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on port ${PORT}`));
