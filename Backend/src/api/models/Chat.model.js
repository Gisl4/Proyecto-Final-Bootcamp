// Se requiere mongoose y se traen los esquemas de datos
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definir modelo de datos:

const ChatSchema = new Schema(
  {
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    userOne: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userTwo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    /* El array que tenga muchos mensajes va entre [] 
    ---> los usuarios uno y dos van solo con {}, porque son un único objeto*/
  },
  {
    timestamps: true,
  }
);

// Definicion de datos y su esquema , creamos el modelo de datos

const Chat = mongoose.model("Chat", ChatSchema);

// Se exporta el modelo para que los controllers
module.exports = Chat;
