const mongoose = require("mongoose");

//* ----------nos traemos de mongoose la parte de los esquemas de datos

// const Schema = mongoose.Schema;

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: false },
    category: {
      type: String,
      enum: ["Deportes", "Música", "Gastronomía", "Otros..."],
    },
    image: { type: String, require: true },
    description: {
      type: String,
    },
    date: {
      type: Date,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
    likeEvent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    eventFollowers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    eventOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],
  },
  {
    timestamps: true,
  }
);

//*-------- con la definicion de datos y su esquema vamos a crear el modelo de datos

const Event = mongoose.model("Event", EventSchema);

//*-------- exportar el modelo para que lo utilicen los controladores

module.exports = Event;
