const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const enumOk = require("../../utils/enumOk");

const User = require("../models/User.model");
const City = require("../models/City.models");
const Experience = require("../models/Experience.model");
const Event = require("../models/Events.model");

//! -------------create new Events ----------------
//? -------------------------------POST create --------------------------
const createEvent = async (req, res, next) => {
  //*Se captura la url de la imagen de Cloudinary por si se diera el error de que en como la imagen se sube antes de meternos al controlador
  //*si hay un error en el controlador, una vez dentro, el elemento no se crea y por ende
  //*tenmos que borrar la imagen en cloudinary */
  //* El optional chaining se pone porque la imagen no es obligatoria por lo cual
  //* puede ser que no tengamos req.file.path

  let catchImg = req.file?.path;

  try {
    //! -----> ACTUALIZAR INDEXES
    /** los indexes se forman cuando una clave del objeto es unique, se puede ver en la
     * parte de mongo que esta al lado de find
     *
     * Esto es importante porque puede que haya modificado el modelo posteriormente a la
     * creacion del controlador
     */

    await Event.syncIndexes();
    //! ------> INSTANCIAR UN NUEVO CHARACTER
    /** vamos a instanciar un nuevo character y le metemos como info incial lo que recibimos
     * por la req.body
     */
    const newEvent = new Event(req.body);

    //! -------> VALORAR SI HEMOS RECIBIDO UNA IMAGEN O NO
    /** Si recibimos la imagen tenemos que meter la url en el objeto creado arriba con la
     * nueva instancia del Character
     */

    if (req.file) {
      newEvent.image = catchImg;
    } else {
      newEvent.image =
        "https://res.cloudinary.com/dyl5cabrr/image/upload/v1714138030/ac5016f6-7afd-43f8-9d87-f38c82e5a9f1_16-9-discover-aspect-ratio_default_0_gkuvqg.jpg";
    }

    try {
      //! ------------> VAMOS A GUARDAR LA INSTANCIA DEL NUEVO EVENTO
      const saveEvent = await newEvent.save();
      if (saveEvent) {
        /** Si existe vamos a enviar un 200 como que todo esta ok y le enviamos con un json
         * el objeto creado
         */
        try {
          await City.findByIdAndUpdate(req.body.cities, {
            $push: { events: saveEvent._id },
          });
          try {
            await User.findByIdAndUpdate(req.user._id, {
              $push: { eventsOwner: saveEvent._id },
            });
            const eventFinal = await Event.findById(saveEvent).populate(
              "eventOwner"
            );
            return res.status(200).json(eventFinal);
          } catch (error) {
            console.log(error.message);
            return res
              .status(404)
              .json(
                "No se ha podido actualizar el usuario con el evento creado"
              );
          }
        } catch (error) {
          console.log(error.message);
          return res.status(404).json("error general update city");
        }
      } else {
        return res
          .status(404)
          .json("No se ha podido guardar el elemento en la DB ❌");
      }
    } catch (error) {
      console.log(error.message);
      return res.status(404).json("error general saved event");
    }
  } catch (error) {
    //! -----> solo entramos aqui en el catch cuando ha habido un error
    /** SI HA HABIDO UN ERROR -----
     * Tenemos que borrar la imagen en cloudinary porque se sube antes de que nos metamos en
     * el controlador---> porque es un middleware que esta entre la peticion del cliente y el controlador
     */

    req.file?.path && deleteImgCloudinary(catchImg);

    return (
      res.status(404).json({
        messege: "error en el creado del elemento",
        error: error.message,
      }) && next(error)
    );
  }
};

//? -------------------------------get by category--------------------------

// *filtrar los eventos por su tipología//
const getByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const eventByCategory = await Event.findByCategory(category);
    if (eventByCategory) {
      return res.status(200).json(eventByCategory);
    } else {
      return res.status(404).json("no se ha encontrado el evento");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//? -------------------------------get by city--------------------------

// *filtrar los eventos por ciudades//
const getByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const eventByCity = await Event.find({ cities: city }).populate("cities");
    if (eventByCity) {
      return res.status(200).json(eventByCity);
    } else {
      return res.status(404).json("no se ha encontrado la ciudad");
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//? -------------------------------get all------------------------------

const getAll = async (req, res, next) => {
  try {
    const allEvent = await Event.find()
      .populate("experience")
      .populate("eventOwner")
      .populate("cities")
      .populate({
        path: "comments",
        populate: [{ path: "owner" }],
      });
    /** el find nos devuelve un array */
    if (allEvent.length > 0) {
      return res.status(200).json({ allEvent });
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

//? -------------------------------get by name --------------------------

const getByName = async (req, res, next) => {
  try {
    const { name } = req.params;

    /// nos devuelve un array de elementos
    const eventByName = await Event.find({ name });
    if (characterByName.length > 0) {
      return res.status(200).json(eventByName);
    } else {
      return res.status(404).json("no se ha encontrado");
    }
  } catch (error) {
    return res.status(404).json({
      error: "error al buscar por nombre capturado en el catch",
      message: error.message,
    });
  }
};

//? -------------------------------toggle like Event --------------------------

const toggleLikeEvent = async (req, res, next) => {
  try {
    const { idEvent } = req.params;
    const { _id } = req.user;

    if (req.user.eventsFav.includes(idEvent)) {
      try {
        await User.findByIdAndUpdate(_id, {
          $pull: { eventsFav: idEvent },
        });

        try {
          await Event.findByIdAndUpdate(idEvent, {
            $pull: { likeEvent: _id },
          });

          return res.status(200).json({
            action: "disliked",
            user: await User.findById(_id)
              .populate({
                path: "eventsOwner",
                populate: [
                  { path: "eventOwner", model: User },
                  { path: "cities", model: City },
                ],
              })
              .populate({
                path: "eventsFav",
                populate: [
                  // { path: "likeEvent", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate({
                path: "eventsFollow",
                populate: [
                  // { path: "eventFollowers", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate("city country experiencesOwner experiencesFav"),
            events: await Event.findById(idEvent)
              .populate("experience")
              .populate("eventOwner")
              .populate("cities")
              .populate({
                path: "comments",
                populate: [{ path: "owner" }],
              }),
            data: await Event.findById(idEvent)
              .populate("experience")
              .populate("eventOwner")
              .populate("cities")
              .populate({
                path: "comments",
                populate: [{ path: "owner" }],
              }),
            allEvent: await Event.find().populate("cities eventOwner"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "no update Event - likes",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "no update user-  EventsFav",
          message: error.message,
        });
      }
    } else {
      try {
        await User.findByIdAndUpdate(_id, {
          $push: { eventsFav: idEvent },
        });

        try {
          await Event.findByIdAndUpdate(idEvent, {
            $push: { likeEvent: _id },
          });

          return res.status(200).json({
            action: "like",
            user: await User.findById(_id)
              .populate({
                path: "eventsOwner",
                populate: [
                  { path: "eventOwner", model: User },
                  { path: "cities", model: City },
                ],
              })
              .populate({
                path: "eventsFav",
                populate: [
                  // { path: "likeEvent", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate({
                path: "eventsFollow",
                populate: [
                  // { path: "eventFollowers", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate("city country experiencesOwner experiencesFav"),
            events: await Event.findById(idEvent),

            allEvent: await Event.find().populate("cities eventOwner"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "no update Event - likeEvent",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "no update user-  eventsFav",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//? -------------------------------toggle Follow event--------------------------

const toggleFollowEvent = async (req, res, next) => {
  try {
    const { idEvent } = req.params;
    const { _id } = req.user;

    if (req.user.eventsFollow.includes(idEvent)) {
      try {
        await User.findByIdAndUpdate(_id, {
          $pull: { eventsFollow: idEvent },
        });

        try {
          await Event.findByIdAndUpdate(idEvent, {
            $pull: { eventFollowers: _id },
          });

          return res.status(200).json({
            action: "unfollow",
            user: await User.findById(_id)
              .populate({
                path: "eventsOwner",
                populate: [
                  { path: "eventOwner", model: User },
                  { path: "cities", model: City },
                ],
              })
              .populate({
                path: "eventsFav",
                populate: [
                  // { path: "likeEvent", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate({
                path: "eventsFollow",
                populate: [
                  // { path: "eventFollowers", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate("city country experiencesOwner experiencesFav"),
            events: await Event.findById(idEvent),
            allEvent: await Event.find().populate("cities eventOwner"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "no update Event - eventFollowers",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "no update user-  eventsFollow",
          message: error.message,
        });
      }
    } else {
      try {
        await User.findByIdAndUpdate(_id, {
          $push: { eventsFollow: idEvent },
        });

        try {
          await Event.findByIdAndUpdate(idEvent, {
            $push: { eventFollowers: _id },
          });

          return res.status(200).json({
            action: "follow",
            user: await User.findById(_id)
              .populate({
                path: "eventsOwner",
                populate: [
                  { path: "eventOwner", model: User },
                  { path: "cities", model: City },
                ],
              })
              .populate({
                path: "eventsFav",
                populate: [
                  // { path: "likeEvent", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate({
                path: "eventsFollow",
                populate: [
                  // { path: "eventFollowers", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate("city country experiencesOwner experiencesFav"),
            events: await Event.findById(idEvent),
            allEvent: await Event.find().populate("cities eventOwner"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "no update Event - eventFollowers",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "no update user-  eventsFollow",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

//? ----------------------------toggle city-----add o delete un events  --------------

const toggleCity = async (req, res, next) => {
  try {
    const { idCity, idEvent } = req.params;
    // Obtener los objetos City y Event por sus IDs
    const city = await City.findById(idCity);
    const event = await Event.findById(idEvent);

    if (!city || !event) {
      return res.status(404).json({ error: "Ciudad o evento no encontrado" });
    }
    console.log(city);
    console.log(event);
    if (event.cities.includes(idCity)) {
      try {
        // Actualizar el evento y eliminar la ciudad
        await Event.findByIdAndUpdate(idEvent, { $pull: { cities: idCity } });
        console.log("borrado el evento");

        try {
          // Actualizar la ciudad y eliminar el evento
          await City.findByIdAndUpdate(idCity, { $pull: { events: idEvent } });
          console.log("borrada la ciudad");
          return res.status(200).json({
            action: "delete",
            cities: await Event.findById(idEvent).populate("cities"),
            events: await City.findById(idCity).populate("events"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "No se ha actualizado la ciudad - events",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "No se ha actualizado el evento - cities",
          message: error.message,
        });
      }
    } else {
      try {
        // Actualizar el evento y agregar la ciudad
        await Event.findByIdAndUpdate(idEvent, { $push: { cities: idCity } });
        console.log("actualizado el evento");

        try {
          // Actualizar la ciudad y agregar el evento
          await City.findByIdAndUpdate(idCity, { $push: { events: idEvent } });
          console.log("actualizada la ciudad");
          return res.status(200).json({
            action: "events",
            cities: await Event.findById(idEvent).populate("cities"),
            events: await City.findById(idCity).populate("events"),
          });
        } catch (error) {
          return res.status(404).json({
            error: "No se ha actualizado la ciudad - events",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "No se ha actualizado el evento - cities",
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

const eventById = async (req, res, next) => {
  try {
    /* creamos una constante, apuntamos al modelo y hacemos un findById para buscar por id. 
    El id lo encontramos con req.params y la clave .id. Si no lo encuentra es un null */
    const { idEvent } = req.params;
    const eventById = await Event.findById(idEvent)
      .populate("name experience cities")
      .populate({
        path: "experience",
        populate: [
          {
            path: "comments",
            populate: [{ path: "owner" }, { path: "likes" }],
          },
        ],
      })
      .populate({
        path: "comments",
        populate: [{ path: "owner" }, { path: "likes" }],
      });

    if (eventById) {
      // comprobamos si existe
      return res.status(200).json(eventById); // mandamos un json con el objeto
    } else {
      // si no lo ha encontrado
      return res.status(404).json("evento no encontrado"); // mandamos usuario no encontrado
    }
  } catch (error) {
    return next(error);
  }
};

//? -------------------------------UPDATE -------------------------------

const updateEvent = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    await Event.syncIndexes();
    const { idEvent } = req.params;
    const { _id } = req.user;

    const event = await Event.findById(idEvent);
    if (event) {
      //*eventByTypeByType//
      const oldImg = event.image;

      const customBody = {
        category: req.body?.category ? req.body?.category : event.category,
        image: req.file?.path ? catchImg : oldImg,
        description: req.body?.description
          ? req.body?.description
          : event.description,
        name: req.body?.name ? req.body?.name : event.name,
        date: req.body?.date ? req.body?.date : event.date,
      };

      if (req.body?.category) {
        //* cambiamos gender por category dada la modificación del modelo de Event//
        const resultEnum = enumOk.enumOkCategory(req.body?.category);
        customBody.category = resultEnum.check
          ? req.body?.category
          : event.category;
      }

      try {
        await Event.findByIdAndUpdate(idEvent, customBody);
        if (req.file?.path) {
          deleteImgCloudinary(oldImg);
        }

        // ......> me cojer el req.body y vamos a sacarle las claves para saber que elementos nos ha dicho de actualizar
        const elementUpdateEvent = Object.keys(req.body);

        /** vamos a hacer un objeto vacion donde meteremos los test */

        let test = {};

        /** vamos a recorrer las claves del body y vamos a crear un objeto con los test */

        elementUpdateEvent.forEach((item) => {
          if (req.body[item] === event[item]) {
            test[item] = false;
          } else {
            test[item] = true;
          }
        });

        if (catchImg) {
          event.image === catchImg //*
            ? (test = { ...test, file: false })
            : (test = { ...test, file: true });
        }

        //* vamos a ver que no haya ningun false. Si hay un false lanzamos un 404,
        //* si no hay ningun false entonces lanzamos un 200 porque todo esta correcte

        let acc = 0;
        for (clave in test) {
          test[clave] == false && acc++;
        }
        if (acc > 0) {
          return res.status(200).json({
            texto: "error",
            dataTest: test,
            update: false,
          });
        } else {
          return res.status(200).json({
            dataTest: test,
            update: true,
            user: await User.findById(_id)
              .populate({
                path: "eventsOwner",
                populate: [
                  { path: "eventOwner", model: User },
                  { path: "cities", model: City },
                ],
              })
              .populate({
                path: "eventsFav",
                populate: [
                  // { path: "likeEvent", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate({
                path: "eventsFollow",
                populate: [
                  // { path: "eventFollowers", model: User },
                  { path: "cities", model: City },
                  { path: "eventOwner", model: User },
                ],
              })
              .populate({
                path: "experiencesFav",
                populate: [
                  // { path: "eventFollowers", model: User },
                  { path: "events", model: Event },
                ],
              })
              .populate({
                path: "experiencesOwner",
                populate: [
                  // { path: "eventFollowers", model: User },
                  { path: "events", model: Event },
                ],
              })
              .populate("city country"),
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

//? -------------------------------SORT BY DATE -------------------------------

const sortByDate = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json("error.message");
  }
};

//? -------------------------------DELETE -------------------------------

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (event) {
      // lo buscamos para vr si sigue existiendo o no
      const findByTypeEvent = await Event.findById(id);

      try {
        const test = await Experience.updateMany(
          { event: id },
          { $pull: { event: id } }
        );
        console.log(test);

        try {
          await User.updateMany(
            { eventsFav: id },
            { $pull: { eventsFav: id } }
          );

          await Event.findByIdAndDelete(id);

          return res.status(200).json({
            deleteTest: true,
          });
        } catch (error) {
          return res.status(404).json({
            error: "error catch update User",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: "error catch update Experience",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json(error.message);
  }
};
module.exports = {
  createEvent,
  getByCategory,
  getByCity,
  getAll,
  getByName,
  updateEvent,
  deleteEvent,
  toggleLikeEvent,
  toggleFollowEvent,
  toggleCity,
  sortByDate,
  eventById,
};
