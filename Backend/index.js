const express = require("express");
const dotenv = require("dotenv");
const { connect } = require("./src/utils/db");
const cors = require("cors");
// creamos el servidor web
const app = express();

// vamos a configurar dotenv para poder utilizar las variables d entorno del .env
dotenv.config();

//! ------------conectamos con la base de datos----------------

connect();

//!- ------------------- CONFIGURAR cloudinary ----------------

//Traemos cloudinary y la llamamos para utilizarla
const { configCloudinary } = require("./src/middleware/files.middleware");
configCloudinary();

//! -----------------VARIABLES CONSTANTES --> PORT

const PORT = process.env.PORT;

//!- ----------------CORS --------------------------------

// libreria para configurar el acceso a la api, hay que traer la librería (lo tengo en la línea 3)
app.use(cors()); // Para utilizar la librería

//! ----------------limitaciones de cantidad en el back end -

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));

//! -----------------ROUTAS ----------------------------------

const UserRoutes = require("./src/api/routes/User.routes");
app.use("/api/v1/users/", UserRoutes);

const MessageRoutes = require("./src/api/routes/Message.routes");
app.use("/api/v1/messages/", MessageRoutes);

const ExperienceRoutes = require("./src/api/routes/Experience.routes");
app.use("/api/v1/experiences/", ExperienceRoutes);

const EventRoutes = require("./src/api/routes/Event.routes");
app.use("/api/v1/event/", EventRoutes);

const AdminRoutes = require("./src/api/routes/Admin.routes");
app.use("/api/v1/admin/", AdminRoutes);

const CityRoutes = require("./src/api/routes/City.routes");
app.use("/api/v1/city/", CityRoutes);

const CountryRoutes = require("./src/api/routes/Country.routes");
app.use("/api/v1/country/", CountryRoutes);

const ChatRoutes = require("./src/api/routes/Chat.routes");
app.use("/api/v1/chat/", ChatRoutes);

//! --------------- generamos un error de cuando no se encuentre la ruta--

app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  return next(error);
});

//! ------------------> cuando el servidor crachea metemos un 500 ----------

// ----- en este caso como gestionamos un error la callback lleva de parametros error, req, res
// cuando es un controlador normal llevaria siempre como para parametros REQ, RES, NEXT ---> en este orden siemppre
app.use((error, req, res) => {
  return res
    .status(error.status || 500)
    .json(error.message || "unexpected error");
});

//! ----------------ESCUCHAMOS EN EL PUERTO EL SERVIDOR WEB

// esto de aqui  nos revela con que tecnologia esta hecho nuestro back
app.disable("x-powered-by");
app.listen(PORT, () =>
  console.log(`Server listening on port 👌🔍 http://localhost:${PORT}`)
);
