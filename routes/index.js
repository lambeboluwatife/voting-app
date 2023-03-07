const express = require("express");
const router = express.Router();
const middleware = require("../config/auth");

// Election Model
const Election = require("../models/Election");

// Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

// Dashboard
router.get("/dashboard", middleware.ensureAuthenticated, (req, res) => {
  // Get all elections from DB
  Election.find(
    {
      author: {
        id: req.user._id,
        name: req.user.name,
      },
    },
    (err, allElections) => {
      if (err) throw err;
      else {
        res.render("dashboard", {
          elections: allElections,
          name: req.user.name,
        });
      }
    }
  );
});

module.exports = router;
