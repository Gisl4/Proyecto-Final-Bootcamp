//Se requiere mongoose y se traen los esquemas de datos
const mongoose = require("mongoose");

//Definir modelo de datos:

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["private", "public"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    recipientEvents: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    recipientExperience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
    },
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

//Definicion de datos y su esquema , creamos el modelo de datos

const Message = mongoose.model("Message", MessageSchema);

//Se exporta el modelo para que los controllers

module.exports = Message;
