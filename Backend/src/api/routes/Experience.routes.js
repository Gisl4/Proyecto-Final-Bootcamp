const express = require("express");
const {
  toggleLikeExperience,
  toggleEvent,
  createExperience,
  byId,
  update,
  deleteExperience,
  getAllExperiences,
} = require("../controllers/Experiences.controllers");
const { isAuth } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const ExperienceRoutes = express.Router();

ExperienceRoutes.patch("/like/:idExperience", [isAuth], toggleLikeExperience);
// ExperienceRoutes.patch("/addEvent/:idExperience", [isAuth], toggleEvent);
ExperienceRoutes.patch(
  "/events/:idEvent/experience/:idExperience",
  [isAuth],
  toggleEvent
);
ExperienceRoutes.post(
  "/create",
  [isAuth],
  upload.single("image"),
  createExperience
);
ExperienceRoutes.patch(
  "/update/:idExperience",
  [isAuth],
  upload.single("image"),
  update
);
ExperienceRoutes.get("/finById/:idExperience", byId);
ExperienceRoutes.delete("/:idExperience", [isAuth], deleteExperience);
ExperienceRoutes.get("/getAll", getAllExperiences);

module.exports = ExperienceRoutes;
