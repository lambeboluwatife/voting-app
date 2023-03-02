const express = require("express");
const router = express.Router();
const path = require("path");
const middleware = require("../config/auth");

// Election Model
const Election = require("../models/Election");

// INDEX - Show all available election/voting
router.get("/", (req, res) => {
  // Get all votes from DB
  Election.find({}, (err, allElections) => {
    if (err) throw err;
    else {
      res.render("elections/index", {
        elections: allElections,
      });
    }
  });
});

// NEW - Show form to create new election
router.get("/new", middleware.ensureAuthenticated, (req, res) => {
  res.render("elections/new");
});

// CREATE - Create New Election
router.post("/", middleware.ensureAuthenticated, (req, res) => {
  // get data from form and add to elections array
  const title = req.body.title;
  const type = req.body.type;
  const description = req.body.description;
  const slot = req.body.slot;
  const author = {
    id: req.user._id,
    name: req.user.name,
  };

  let errors = [];

  // Check required fields
  if (!title || !type || !description || !slot) {
    errors.push({
      msg: "Please fill in all fields",
    });
  }

  // Check amounts of slot
  if (slot <= 1 || slot > 5) {
    errors.push({
      msg: "Slot must be between 2 - 5",
    });
  }

  if (errors.length > 0) {
    res.render("elections/new", {
      errors,
      title,
      type,
      description,
      slot,
    });
  } else {
    const newElection = {
      title: title,
      type: type,
      description: description,
      slot: slot,
      author: author,
    };

    // Create new election and save to DB
    Election.create(newElection, (err, newlyCreated) => {
      if (err) throw err;
      else {
        // redirect back to Elections page
        res.redirect("/elections");
      }
    });
  }
});

// SHOW - Show more info about an election
router.get("/:id", (req, res) => {
  // Find the election with the provided ID
  Election.findById(req.params.id)
    .populate("candidates")
    .exec((err, foundElection) => {
      if (err) {
        console.log(err);
      } else {
        res.render("elections/show", { election: foundElection });
      }
    });
});

// EDIT ELECTION ROUTE
router.get("/:id/edit", middleware.checkElectionOwnership, (req, res) => {
  Election.findById(req.params.id, (err, foundElection) => {
    res.render("elections/edit", {
      election: foundElection,
    });
  });
});

// UPDATE ELECTION ROUTE
router.put("/:id", middleware.checkElectionOwnership, (req, res) => {
  // find and update the correct election
  Election.findByIdAndUpdate(
    req.params.id,
    req.body.election,
    (err, updatedElection) => {
      if (err) {
        res.redirect("/elections");
      } else {
        res.redirect("/elections/" + req.params.id);
      }
    }
  );
});

// DESTROY ELECTION ROUTE
router.delete("/:id", middleware.checkElectionOwnership, (req, res) => {
  Election.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/elections");
    } else {
      res.redirect("/elections");
    }
  });
});

module.exports = router;
