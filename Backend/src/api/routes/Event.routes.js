const express = require("express");
const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const {
  createEvent,
  getByCategory,
  getByCity,
  getAll,
  getByName,
  deleteEvent,
  toggleLikeEvent,
  toggleCity,
  toggleFollowEvent,
  updateEvent,
  eventById,
  sortByDate,
} = require("../controllers/Events.controllers"); //* cuidado si el archivo es en singular//
const EventRoutes = express.Router();

EventRoutes.post("/createEvent", [isAuth], upload.single("image"), createEvent);
EventRoutes.get("/getAll", getAll);
EventRoutes.get("/get/name/:name", getByName);
EventRoutes.get("/get/category/:category", getByCategory);
EventRoutes.get("/get/city/:city", getByCity);
EventRoutes.get("/finById/:idEvent", eventById);
EventRoutes.patch("/cities/:idCity/events/:idEvent", [isAuth], toggleCity);
EventRoutes.patch("/:idEvent", [isAuth], upload.single("image"), updateEvent);
EventRoutes.delete("/:id", [isAuth], deleteEvent);
EventRoutes.patch("/like/:idEvent", [isAuth], toggleLikeEvent);
EventRoutes.patch("/follow/:idEvent", [isAuth], toggleFollowEvent);
EventRoutes.get("/sortByDate", sortByDate);

module.exports = EventRoutes;
