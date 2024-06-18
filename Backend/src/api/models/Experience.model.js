const mongoose = require("mongoose");

// el nombre del esquema en mayusculas
const ExperienceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, require: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    // users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    events: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model("Experience", ExperienceSchema);

module.exports = Experience;
