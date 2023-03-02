const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  slot: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  candidates: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate"
  }
],
});

const Election = mongoose.model("Election", ElectionSchema);

module.exports = Election;
