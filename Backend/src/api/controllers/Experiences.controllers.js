const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const Experience = require("../models/Experience.model");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Event = require("../models/Events.model");

//! -------------create new experiencie ----------------

const createExperience = async (req, res, next) => {
  // let catchImg = req.file?.path;

  try {
    await Experience.syncIndexes();
    const newExperience = new Experience(req.body);

    if (req.file) {
      newExperience.image = req.file?.path;
    } else {
      newExperience.image =
        "https://res.cloudinary.com/dyl5cabrr/image/upload/v1714138030/ac5016f6-7afd-43f8-9d87-f38c82e5a9f1_16-9-discover-aspect-ratio_default_0_gkuvqg.jpg";
    }

    const saveExperience = await newExperience.save();
    if (saveExperience) {
      try {
        const updatedEvent = await Event.findByIdAndUpdate(req.body.events, {
          $push: { experience: saveExperience._id },
        });

        if (!updatedEvent) {
          throw new Error("No se encontró el evento para actualizar.");
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
          $push: { experiencesOwner: saveExperience._id },
        });

        if (!updatedUser) {
          throw new Error("No se encontró el usuario para actualizar.");
        }

        const experienceFinal = await Experience.findById(
          saveExperience
        ).populate("events");
        return res.status(200).json(experienceFinal);
      } catch (error) {
        console.log(error.message);
        return res.status(404).json({
          message:
            "Error actualizando el evento o usuario con la experiencia creada.",
          error: error.message,
        });
      }
    } else {
      return res
        .status(404)
        .json("No se ha podido guardar el elemento en la DB ❌");
    }
  } catch (error) {
    req.file?.path && deleteImgCloudinary(catchImg);
    return res.status(404).json({
      message: "Error en el creado del elemento",
      error: error.message,
    });
  }
};

//! -------------------get all------------------------------

const getAllExperiences = async (req, res, next) => {
  try {
    const allExperience = await Experience.find()
      .populate("events")
      .populate({
        path: "comments",
        populate: [{ path: "owner" }, { path: "likes" }],
      });
    /** el find nos devuelve un array */
    if (allExperience.length > 0) {
      return res.status(200).json(allExperience);
    } else {
      return res.status(404).json("no se han encontrado characters");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar - lanzado en el catch",
      message: error.message,
    });
  }
};

//! -------------like experiencie ----------------

const toggleLikeExperience = async (req, res, next) => {
  try {
    const { idExperience } = req.params; //De donde saco el id de la experiencia??
    // Necesitamos estar logado para darle like
    const { _id } = req.user;
    // const { _id } = req.body;

    if (req.user.experiencesFav.includes(idExperience)) {
      try {
        await User.findByIdAndUpdate(_id, {
          //Actualiza el usuario e incluye su experiencia fav
          $pull: { experiencesFav: idExperience },
        });

        try {
          await Experience.findByIdAndUpdate(idExperience, {
            //Actualiza la experiencia y añade el usuario que le ha dado like
            $pull: { likes: _id },
          });

          return res.status(200).json({
            action: "disliked",
            user: await User.findById(_id).populate("experiencesFav"),
            experience: await Experience.findById(idExperience).populate(
              "likes events"
            ),
            allExperience: await Experience.find(),
          });
        } catch (error) {
          return res.status(404).json({
            error: "No se ha actualizado la experiencia - likes",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "No se ha actualizado el usuario -  experiencesFav",
          message: error.message,
        });
      }
    } else {
      try {
        await User.findByIdAndUpdate(_id, {
          //Saca el id de la experiencia cuando le doy dislike
          $push: { experiencesFav: idExperience },
        });

        try {
          await Experience.findByIdAndUpdate(idExperience, {
            //Saca el id del usuario en la experiencia cuanod le doy dislike
            $push: { likes: _id },
          });

          return res.status(200).json({
            action: "like",
            user: await User.findById(_id).populate("experiencesFav"),
            experience: await Experience.findById(idExperience).populate(
              "likes events"
            ),
            allExperience: await Experience.find(),
          });
        } catch (error) {
          return res.status(404).json({
            error: "No se ha actualizado la experiencia - likes",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "No se ha actualizado el usuario -  experiencesFav",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------TOGLEEVENT add o delete un events  ---------------
//! ---------------------------------------------------------------------

const toggleEvent = async (req, res, next) => {
  try {
    const { idExperience, idEvent } = req.params;

    // Obtener los objetos experience y Event por sus IDs
    const experience = await Experience.findById(idExperience);
    const event = await Event.findById(idEvent);

    if (!experience || !event) {
      return res
        .status(404)
        .json({ error: "Experiencia o evento no encontrado" });
    }

    if (experience.events.includes(idEvent)) {
      try {
        // Actualizar el evento y eliminar la experiencia
        await Experience.findByIdAndUpdate(idExperience, {
          $pull: { events: idEvent },
        });

        try {
          // Actualizar la experiencia y eliminar el evento
          await Event.findByIdAndUpdate(idEvent, {
            $pull: { experience: idExperience },
          });

          return res.status(200).json({
            action: "delete",
            experience: await Event.findById(idEvent).populate("experience"),
            events: await Experience.findById(idExperience).populate("events"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "No se ha actualizado la experiencia - events",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "No se ha actualizado el evento - experience",
          message: error.message,
        });
      }
    } else {
      try {
        // Actualizar el evento y agregar la ciudad
        await Experience.findByIdAndUpdate(idExperience, {
          $push: { events: idEvent },
        });

        try {
          // Actualizar la ciudad y agregar el evento
          await Event.findByIdAndUpdate(idEvent, {
            $push: { experience: idExperience },
          });

          return res.status(200).json({
            action: "events",
            experience: await Event.findById(idEvent).populate("experience"),
            events: await Experience.findById(idExperience).populate("events"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "No se ha actualizado la experience - events",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "No se ha actualizado el evento - experience",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------findById------------------------------------
//! -----------------------------------------------------------------------------

const byId = async (req, res, next) => {
  try {
    /* creamos una constante, apuntamos al modelo y hacemos un findById para buscar por id. 
    El id lo encontramos con req.params y la clave .id. Si no lo encuentra es un null */
    const { idExperience } = req.params;
    const experienceById = await Experience.findById(idExperience).populate({
      path: "comments",
      populate: [{ path: "owner" }],
    });
    if (experienceById) {
      // comprobamos si existe
      return res.status(200).json(experienceById); // mandamos un json con el objeto
    } else {
      // si no lo ha encontrado
      return res.status(404).json("experiencia no encontrado"); // mandamos usuario no encontrado
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------UPDATE--------------------------------------
//! -----------------------------------------------------------------------------

const update = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    await Experience.syncIndexes();
    const { idExperience } = req.params;
    const experience = await Experience.findById(idExperience);
    if (experience) {
      //*eventByTypeByType//
      const oldImg = experience.image;

      const customBody = {
        image: req.file?.path ? catchImg : oldImg,
        description: req.body?.description
          ? req.body?.description
          : experience.description,
        name: req.body?.name ? req.body?.name : experience.name,
      };

      try {
        await Experience.findByIdAndUpdate(idExperience, customBody);
        if (req.file?.path) {
          deleteImgCloudinary(oldImg);
        }

        const elementUpdateExperience = Object.keys(req.body);

        let test = {};

        elementUpdateExperience.forEach((item) => {
          if (req.body[item] === experience[item]) {
            test[item] = false;
          } else {
            test[item] = true;
          }
        });

        if (catchImg) {
          experience.image === catchImg //*
            ? (test = { ...test, file: false })
            : (test = { ...test, file: true });
        }

        let acc = 0;
        for (clave in test) {
          test[clave] == false && acc++;
        }
        if (acc > 0) {
          return res.status(404).json({
            dataTest: test,
            update: false,
          });
        } else {
          return res.status(200).json({
            dataTest: test,
            update: true,
          });
        }
      } catch (error) {
        console.log(error.message);
        return res.status(404).json(error.message);
      }
    } else {
      console.log(error.message);
      return res.status(404).json("este character no existe");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json(error.message);
  }
};

//! ---------------------------------------------------------------------
//? -------------------------------DELETE -------------------------------
//! ---------------------------------------------------------------------

const deleteExperience = async (req, res, next) => {
  try {
    const { idExperience } = req.params;

    const experience = await Experience.findByIdAndDelete(idExperience);
    if (!experience) {
      return res.status(404).json({ error: "Experiencia no encontrada" });
    }

    // Eliminamos la experiencia del modelo de eventos si está vinculada
    try {
      await Event.updateMany(
        { experience: idExperience },
        { $pull: { experience: idExperience } }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al actualizar eventos", message: error.message });
    }

    // Actualizamos el modelo de usuario para quitar la referencia a la experiencia eliminada
    try {
      await User.updateMany(
        { experiencesOwner: idExperience },
        { $pull: { experiencesOwner: idExperience } }
      );

      return res.status(200).json({ deletedExperienceId: idExperience });
    } catch (error) {
      return res.status(500).json({
        error: "Error al actualizar usuarios",
        message: error.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar experiencia", message: error.message });
  }
};

module.exports = {
  toggleLikeExperience,
  createExperience,
  toggleEvent,
  byId,
  update,
  deleteExperience,
  getAllExperiences,
};
