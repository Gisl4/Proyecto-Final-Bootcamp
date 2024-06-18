const bcrypt = require("bcrypt"); // para encryptar informacion
const validator = require("validator"); /// n os sirve para validad info
const mongoose = require("mongoose");

// el nombre del esquema en mayusculas
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Email not valid"], // en caso de no ser un email valido
      // lanza el error ----> 'Email not valid'
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    age: {
      type: Date,
      required: true,
      trim: true,
    },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isStrongPassword], //minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    },
    gender: {
      type: String,
      enum: ["hombre", "mujer", "otros"],
      required: true,
    },
    rol: {
      type: String,
      enum: ["admin", "user", "superAdmin"],
      default: "user",
    },
    confirmationCode: {
      type: Number,
      required: true,
    },
    check: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    eventsOwner: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // array de los eventos que yo he creado
    experiencesOwner: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
    ], // array de las experiencias que hemos creado
    eventsFollow: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    eventsFav: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    experiencesFav: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
    ],

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // array de usuarios que le sigues
    followed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // arrays de usuarios que sigue
    chats: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    ] /* array de mensajes privados*/,
    banned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // para si te quiere bannear la página, bannear es bloquear porque el usuario ha hecho algo que no debía
    // blockedByApp : { type: Boolean, default: false },
    commentsPublicByOther: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    ], // los comentarios que me hacen a mi
    postedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // son los messages que creo
    /// cuando relacionamos un modelo de con otro lo hacemos con populate y el ref a otr
    messagesFav: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // son los messages favoritos
  },
  {
    // esto es cuando se crea y se actualiza el objeto
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
    // el next puede lanzar al log o puede decir que continuemos
  } catch (error) {
    next("Error hashing password", error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
