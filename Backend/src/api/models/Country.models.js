const mongoose = require("mongoose");
//* ----------nos traemos de mongoose la parte de los esquemas de datos

const Schema = mongoose.Schema;
// el nombre del esquema en mayusculas
const CountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],
    tipicalFood: { type: String },
    traditions: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Country = mongoose.model("Country", CountrySchema);

module.exports = Country;
