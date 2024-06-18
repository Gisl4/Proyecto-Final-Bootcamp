// const express = require("express");

// const {
//   createCountry,
//   countryById,
//   update,
//   deleteCountry,
//   getAll,
// } = require("../controllers/Country.controllers");
// const CountryRoutes = express.Router();
// const { isAuth, isAuthSuper } = require("../../middleware/auth.middleware");
// const { upload } = require("../../middleware/files.middleware");

// CountryRoutes.post(
//   "/create",
//   [isAuthSuper],
//   upload.single("image"),
//   createCountry
// );
// CountryRoutes.get("/findById/:idCountry", countryById);
// CountryRoutes.patch(
//   "/update/:idCountry",
//   [isAuth],
//   upload.single("image"),
//   update
// );
// CountryRoutes.delete("/:idCountry", [isAuthSuper], deleteCountry);
// CountryRoutes.get("/getAll", getAll);

// module.exports = CountryRoutes;
const express = require("express");

const {
  createCountry,
  countryById,
  update,
  deleteCountry,
  getAll,
} = require("../controllers/Country.controllers");
const CountryRoutes = express.Router();
const { isAuth, isAuthSuper } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");

CountryRoutes.post(
  "/create",
  [isAuthSuper],
  upload.single("image"),
  createCountry
);
CountryRoutes.get("/finById/:idCountry", countryById);
CountryRoutes.patch(
  "/update/:idCountry",
  [isAuth],
  upload.single("image"),
  update
);
CountryRoutes.delete("/:idCountry", [isAuthSuper], deleteCountry);
CountryRoutes.get("/getAll", getAll);

module.exports = CountryRoutes;

//RUTAS DE COUNTRY QUE FUNCIONAN
