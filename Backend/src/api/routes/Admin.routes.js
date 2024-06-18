//Nos requeerimos la librería y
const express = require("express");
const AdminRoutes = express.Router();

const { upload } = require("../../middleware/files.middleware");
const {
  isAuth,
  isAuthAdmin,
  isAuthSuper,
} = require("../../middleware/auth.middleware");
const {
  changeGender,
  changeAdmin,
} = require("../controllers/Admin.controllers");

//!------------------------------------------------------------------------
//?--------------------------------RUTAS SIN REDIRECT----------------------
//!------------------------------------------------------------------------
AdminRoutes.patch("/changeGender/:idUserChanged", changeGender);
AdminRoutes.patch(
  "/superAdmin/changeAdmin/:idUser",
  [isAuthSuper],
  changeAdmin
);
//!------------------------------------------------------------------------
//?--------------------------------RUTAS CON REDIRECT----------------------
//!------------------------------------------------------------------------

//!---------------- REDIRECT-------------------------------

module.exports = AdminRoutes;
