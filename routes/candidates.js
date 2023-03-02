const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../config/auth");

// Election Model
const Election = require("../models/Election");

// Candidate Model
const Candidate = require("../models/Candidate");

// New Candidate
router.get("/new", middleware.ensureAuthenticated, (req, res) => {
  // find election by ID
  Election.findById(req.params.id, (err, election) => {
    if (err) throw err;
    else {
      res.render("candidates/new", { election: election });
    }
  });
});

// Candidates Create
router.post("/", middleware.ensureAuthenticated, (req, res) => {
  Election.findById(req.params.id, (err, election) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
        const name = req.body.name;
        const about = req.body.about;
        const author = {
            id: req.user._id,
            username: req.user.username,
            name: req.user.name
        }
        const newCandidate = new Candidate({
            name,
            about,
            author
        })
      Candidate.create(newCandidate, (err, candidate) => {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // save candidate
          candidate.save();
          election.candidates.push(candidate);
          election.save();
          req.flash("success", "Successfully added candidate");
          res.redirect("/elections/" + election._id);
        }
      });
    }
  });
});

module.exports = router;
