//! Conexión con la Base de datos MONGO DB

// traemos dotenv porque tenemos la url que no queremos que se comparta publicamente
const dotenv = require("dotenv");
dotenv.config();

// traemos la libreria mongoose que es quien va a controlar la DB: MONGO DB
const mongoose = require("mongoose");
// traemos la MONGO_URI del .env
const MONGO_URI = process.env.MONGO_URI;

// hacemos la funcion que se exporta y luego importa en el index que va a conectar con Mongo
const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI);
    const { name, host } = db.connection; // traemos el name y el host de la DB
    console.log(
      `Conectada la DB 👌  en el host: ${host} con el nombre: ${name}`
    );
  } catch (error) {
    console.log("No se ha conectado la db ❌", error.message);
  }
};

module.exports = { connect };
