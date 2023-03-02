const Election = require("../models/Election");

// All Middleware goes here
const middlewareObj = {};

middlewareObj.checkElectionOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Election.findById(req.params.id, (err, foundElection) => {
      if (err) {
        req.flash("error_msg", "Election not found");
        res.redirect("back");
      } else {
        // does user own the election?
        if (foundElection.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error_msg", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error_msg", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please log in to view this resource");
  res.redirect("/users/login");
};

module.exports = middlewareObj;
