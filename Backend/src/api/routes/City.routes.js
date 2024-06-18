const express = require("express");

const { isAuth, isAuthSuper } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  createCity,
  cityById,
  toggleEvent,
  updateCity,
  deleteCity,
  toggleCountry,
  getAll,
  getCountry,
} = require("../controllers/City.controller");
const CityRoutes = express.Router();

CityRoutes.post("/create", [isAuthSuper], upload.single("image"), createCity);
CityRoutes.get("/finById/:idCity", cityById);
CityRoutes.patch("/cities/:idCity/events/:idEvent", [isAuth], toggleEvent);
CityRoutes.patch("/cities/:idCity/country/:idCountry", [isAuth], toggleCountry);
CityRoutes.patch(
  "/update/:idCity",
  [isAuth],
  upload.single("image"),
  updateCity
);
CityRoutes.delete("/:idCity", [isAuthSuper], deleteCity);
CityRoutes.get("/", getAll);
CityRoutes.get("/cities/:countryId", getCountry);

module.exports = CityRoutes;
