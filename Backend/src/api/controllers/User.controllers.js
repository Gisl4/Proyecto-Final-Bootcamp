//! -----------------------------------------------------------------------
//? ------------------------------librerias--------------------------------
//! -----------------------------------------------------------------------
const nodemailer = require("nodemailer");
const validator = require("validator");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

//! -----------------------------------------------------------------------
//? ------------------------------modelos----------------------------------
//! -----------------------------------------------------------------------
const User = require("../models/User.model");
const Event = require("../models/Events.model");
const Experience = require("../models/Experience.model");
const Message = require("../models/Message.model");
const Chat = require("../models/Chat.model");
const City = require("../models/City.models");

//! -----------------------------------------------------------------------
//? ------------------------utils - middlewares - states ------------------
//! -----------------------------------------------------------------------
const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const randomCode = require("../../utils/randomCode");
const sendEmail = require("../../utils/sendEmail");
const {
  getTestEmailSend,
  setTestEmailSend,
} = require("../../state/state.data");
const setError = require("../../helpers/handle-error");
const { generateToken } = require("../../utils/token");
const randomPassword = require("../../utils/randomPassword");

//! -----------------------------------------------------------------------------
//? ----------------------------REGISTER CORTO EN CODIGO ------------------------
//! -----------------------------------------------------------------------------

const registerUtil = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    await User.syncIndexes();

    const { email, name } = req.body;

    const userExist = await User.findOne(
      { email: req.body.email },
      { name: req.body.name }
    );
    if (!userExist) {
      let confirmationCode = randomCode();
      const newUser = new User({ ...req.body, confirmationCode });
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        newUser.image = "https://pic.onlinewebfonts.com/svg/img_181369.png";
      }

      try {
        const userSave = await newUser.save();

        if (userSave) {
          sendEmail(email, name, confirmationCode);
          setTimeout(() => {
            if (getTestEmailSend()) {
              // el estado ya utilizado lo reinicializo a false
              setTestEmailSend(false);
              return res.status(200).json({
                user: userSave,
                confirmationCode,
              });
            } else {
              setTestEmailSend(false);
              return res.status(404).json({
                user: userSave,
                confirmationCode: "error, resend code",
              });
            }
          }, 2500);
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(409).json("this user already exist");
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

const registerWithRedirect = async (req, res, next) => {
  // capturamos la imagen por si hay un error borrarla en cloudinary
  let catchImg = req.file?.path;

  // Importante con el async await hacerlo con un try catch
  try {
    // actualizamos los indexes de los elementos unicos por si acaso han variado
    await User.syncIndexes();
    // Generamos el codigo con la funcion que hicimos en utils y que tienes mas arriba
    let confirmationCode = randomCode();

    // Hacemos destructuring del email y name que viene del body
    const { email, name } = req.body;

    // ---> comprobamos si existe el usuario

    // aqui se ponen el email y el name por separado porque ambos son unique,
    // si no fueran unique hay que meterlo como {email:req.body.email, name: req.body.name}
    const userExist = await User.findOne(
      { email: req.body.email },
      { name: req.body.name }
    );

    // SI NO EXISTE ENTONCES HACEMOS LA LÓGICA DEL REGISTER
    if (!userExist) {
      // Creamos un nuevo usuario con el req.body y le añadimos el codigo de confirmacion
      const newUser = new User({ ...req.body, confirmationCode });
      console.log(newUser);

      //  tenemos el archivo de la imagen le metemos el req.file.path que es donde guarda...
      // .. el middleware la URL de cloudinary
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        // si no nos pasa nada le pondremos una imagen predefinida
        newUser.image = "https://pic.onlinewebfonts.com/svg/img_181369.png";
      }
      // -----> GUARDAMOS EL USUARIO EN LA DB
      try {
        const userSave = await newUser.save();

        if (userSave) {
          // si hay usuario hacemos el redirech
          return res.redirect(
            307,
            `http://localhost:8081/api/v1/users/register/sendMail/${userSave._id}`
          );
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      //----> SI EL USUARIO EXISTE:
      // + Borramos la imagen de cloudinary porque si existe no registramos el user
      // + Mandamos un error de que usuario ya existe
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(409).json("this user already exist");
    }
  } catch (error) {
    // si hay un error general borramos la URL porque no hemos registrado al usuario
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

/// ------------------------------------------------------------------------------------
/// --------------------CONTROLADOR DE ENVIAR EL CODE  ---------------------------------
///-------------------------------------------------------------------------------------

const sendMailRedirect = async (req, res, next) => {
  try {
    // nos traemos el id de los params
    const { id } = req.params;
    // buscamos al usuario por id para luego utilizarlo para sacar el email y el codigo
    const userDB = await User.findById(id);

    // ---------------------------CONFIGURAMOS NODEMAILER -----------------------------------
    const emailEnv = process.env.EMAIL;
    const password = process.env.PASSWORD;
    // --> 1) Configuramos el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailEnv,
        pass: password,
      },
    });
    // --> 2) creamos las opciones del envio del email
    const mailOptions = {
      from: emailEnv,
      to: userDB.email,
      subject: "Confirmation code",
      text: `tu codigo es ${userDB.confirmationCode}, gracias por confiar en nosotros ${userDB.name}`,
    };
    // --> 3) enviamos el correo y gestionamos el error o el ok del envio
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        // damos feedback al frontal de que no se ha enviado correctamente el codigo
        //TODO!  esto lo hacemos para que el frontal vuelva a enviar una request de este..
        // ... endpoint y vuelva a enviar el código al usuario.
        return res.status(404).json({
          user: userDB,
          confirmationCode: "error, resend code",
        });
      } else {
        console.log("Email sent: " + info.response);
        // damos feedback al frontal de que se ha enviado correctamente el codigo
        return res.status(200).json({
          user: userDB,
          confirmationCode: userDB.confirmationCode,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};

const resendCode = async (req, res, next) => {
  console.log("body", req);
  try {
    //! vamos a configurar nodemailer porque tenemos que enviar un codigo
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });

    //! hay que ver que el usuario exista porque si no existe no tiene sentido hacer ninguna verificacion
    const userExists = await User.findOne({ email: req.body?.email });

    if (userExists) {
      const mailOptions = {
        from: email,
        to: req.body?.email,
        subject: "Confirmation code",
        text: `tu codigo es ${userExists.confirmationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(404).json({
            resend: false,
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            resend: true,
          });
        }
      });
    } else {
      return res.status(404).json("User not found");
    }
  } catch (error) {
    return next(setError(500, error.message || "Error general send code"));
  }
};
//! ------------------------------------------------------------------------
//? -------------------------- CHECK NEW USER------------------------------
//! ------------------------------------------------------------------------

const checkNewUser = async (req, res, next) => {
  /* Pasos a seguir:
  1) -> email y el codigo de confirmacion
  2) -> buscar el user en la bdo con el email 
  3) -> comparar los codigos
  4) -> hacer un update y cambiar la clave check


  Error: 
   -> el email no exista  en el back
   -> los codigos no son iguales
   -> que falle la update
  */

  try {
    //! nos traemos de la req.body el email y codigo de confirmation
    const { email, confirmationCode } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      //!No existe----> 404 de no se encuentra
      return res.status(404).json("User not found");
    } else {
      // cogemos que comparamos que el codigo que recibimos por la req.body y el del userExists es igual
      if (confirmationCode === userExists.confirmationCode) {
        try {
          await userExists.updateOne({ check: true });

          //! hacer un test para ver si a actualizado la clave

          // hacemos un testeo de que este user se ha actualizado correctamente, hacemos un findOne
          const updateUser = await User.findOne({ email });

          // este finOne nos sirve para hacer un ternario que nos diga si la propiedad vale true o false
          return res.status(200).json({
            testCheckOk: updateUser.check == true ? true : false,
          });
        } catch (error) {
          return res.status(404).json(error.message);
        }
      } else {
        ///! el else de cuando los codigos no son iguales
        try {
          /// En caso dec equivocarse con el codigo lo borramos de la base datos y lo mandamos al registro
          await User.findByIdAndDelete(userExists._id);

          // borramos la imagen
          deleteImgCloudinary(userExists.image);

          // devolvemos un 200 con el test de ver si el delete se ha hecho correctamente
          return res.status(200).json({
            userExists,
            check: false,

            // test en el runtime sobre la eliminacion de este user
            delete: (await User.findById(userExists._id))
              ? "error delete user"
              : "ok delete user",
          });
        } catch (error) {
          return res
            .status(404)
            .json(error.message || "error general delete user");
        }
      }
    }
  } catch (error) {
    // siempre en el catch devolvemos un 500 con el error general
    return next(setError(500, error.message || "General error check code"));
  }
};

//! -----------------------------------------------------------------------------
//? --------------------------------LOGIN ---------------------------------------
//! -----------------------------------------------------------------------------

const login = async (req, res, next) => {
  /**
   *
   * Pasos a seguir:
   * 1) body vamos a recibir el email y la contraseña
   * 2) comprobar con el email que exista en la mongo db
   * 3)comprobamos que la contraseña coincida con la base de datos
   *  - comparamos una contraseña sin encrytar con un encritada -> bcrypt
   * 4) Si con iguales genero un token --> con la funcion generateToken  de los util el token
   *
   * Errores:
   * -> que el usuario no exista en la db
   * -> que la contraseña no coincida
   * -> que la generacion del token falle
   
   */

  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email }).populate(
      "city country eventsOwner eventsFav eventsFollow experiencesOwner experiencesFav"
    );

    if (userDB) {
      // compara dos contraseñar una sin encryptar y otra que si lo esta
      if (bcrypt.compareSync(password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json("password dont match");
      }
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error.message);
  }
};

//! -----------------------------------------------------------------------------
//? --------------------------------AUTOLOGIN ---------------------------------------
//! -----------------------------------------------------------------------------

const autoLogin = async (req, res, next) => {
  /** ES IGUAL QUE EL LOGIN SOLO QUE AHORA COMPARO DOS CONTRASEÑAS ENCRYPTADA
   * Y NO HHACE FALTA EL COMPARESYNC
   * */
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email }).populate(
      "city country  eventsOwner eventsFav eventsFollow experiencesOwner experiencesFav"
    );

    if (userDB) {
      // comparo dos contraseñas encriptadas
      if (password == userDB.password) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json("password dont match");
      }
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error);
  }
};
//? -----------------------------------------------------------------------------
//! ------------------CAMBIO DE CONTRASEÑA CUANDO NO ESTAS LOGADO---------------
//? -----------------------------------------------------------------------------

const changePassword = async (req, res, next) => {
  /**
   * Pasos a seguir:
   * 1) Vamos a recibir el email del usuario por el body
   * 2) Comprobamos que exista este user en la bdo
   * 3) Generamos una contraseña nueva --> estará en utils
   * 4) Tenemos que encryptar la contraseña y guardarla en el bdo
   * 5) Se la enviamos al user
   *
   * ERRORES:
   * -> el user no este registrado
   * -> que no se haya generado la contraseña
   * -> que no le haya enviado el correo con la contraseña
   * -> que no se haya actualizado la contraseña en la bdo
   */

  try {
    /** vamos a recibir  por el body el email y vamos a comprobar que
     * este user existe en la base de datos
     */
    const { email } = req.body;
    console.log(req.body);
    const userDb = await User.findOne({ email });
    if (userDb) {
      /// si existe hacemos el redirect
      const PORT = process.env.PORT;
      return res.redirect(
        307,
        `http://localhost:${PORT}/api/v1/users/sendPassword/${userDb._id}`
      );
    } else {
      return res.status(404).json("User no register");
    }
  } catch (error) {
    return next(error);
  }
};

const sendPassword = async (req, res, next) => {
  try {
    /** VAMOS A BUSCAR AL USER POOR EL ID DEL PARAM */
    const { id } = req.params;
    const userDb = await User.findById(id);
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });
    let passwordSecure = randomPassword();
    console.log(passwordSecure);
    const mailOptions = {
      from: email,
      to: userDb.email,
      subject: "-----",
      text: `User: ${userDb.name}. code: ${passwordSecure} Hemos enviado esto porque tenemos una solicitud de cambio de contraseña, si no has sido ponte en contacto con nosotros, gracias.`,
    };
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        /// SI HAY UN ERROR MANDO UN 404
        console.log(error);
        return res.status(404).json("dont send email and dont update user");
      } else {
        // SI NO HAY NINGUN ERROR
        console.log("Email sent: " + info.response);
        ///guardamos esta contraseña en mongo db

        /// 1 ) encriptamos la contraseña
        const newPasswordBcrypt = bcrypt.hashSync(passwordSecure, 10);

        try {
          /** este metodo te lo busca por id y luego modifica las claves que le digas
           * en este caso le decimos que en la parte dde password queremos meter
           * la contraseña hasheada
           */
          await User.findByIdAndUpdate(id, { password: newPasswordBcrypt });

          //!------------------ test --------------------------------------------
          // vuelvo a buscar el user pero ya actualizado
          const userUpdatePassword = await User.findById(id);

          // hago un compare sync ----> comparo una contraseña no encriptada con una encrptada
          /// -----> userUpdatePassword.password ----> encriptada
          /// -----> passwordSecure -----> contraseña no encriptada
          if (bcrypt.compareSync(passwordSecure, userUpdatePassword.password)) {
            // si son iguales quiere decir que el back se ha actualizado correctamente
            return res.status(200).json({
              updateUser: true,
              sendPassword: true,
            });
          } else {
            /** si no son iguales le diremos que hemos enviado el correo pero que no
             * hemos actualizado el user del back en mongo db
             */
            return res.status(404).json({
              updateUser: false,
              sendPassword: true,
            });
          }
        } catch (error) {
          return res.status(404).json(error.message);
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

//? -----------------------------------------------------------------------------
//! ------------------CAMBIO DE CONTRASEÑA CUANDO NO ESTAS LOGADO---------------
//? -----------------------------------------------------------------------------

const modifyPassword = async (req, res, next) => {
  /** Pasos:
   * 1) por el body recibo la contraseña nueva y antigua
   * 2) _id => lo saco de la req.user
   * 3) la antigua contraseña que has escrito coincida con el back compareSync
   * 4) La nueva contraseña se encrypta
   * 5) se actualiza en el back
   * test----
   *
   *
   * Errores:
   * -> que la contraseña antigua no coincida con la del back
   * -> que  no se actualize la contraseña en el back
   */

  /** IMPORTANTE ---> REQ.USER ----> LO CREAR LOS AUTH MIDDLEWARE */
  console.log("req.user", req.user);

  try {
    const { password, newPassword } = req.body;
    const { _id } = req.user;

    /** comparamos la contrasela vieja sin encriptar y la encriptada */
    if (bcrypt.compareSync(password, req.user.password)) {
      /** tenemos que encriptar la contraseña para poder guardarla en el back mongo db */
      const newPasswordHashed = bcrypt.hashSync(newPassword, 10);

      /** vamos a actualizar la contraseña en mongo db */
      try {
        await User.findByIdAndUpdate(_id, { password: newPasswordHashed });

        /** TESTING EN TIEMPO REAL  */

        //1) Traemos el user actualizado
        const userUpdate = await User.findById(_id);

        // 2) vamos a comparar la contraseña sin encriptar y la tenemos en el back que esta encriptada
        if (bcrypt.compareSync(newPassword, userUpdate.password)) {
          /// SI SON IGUALES 200 ---> UPDATE OK
          return res.status(200).json({
            updateUser: true,
          });
        } else {
          ///NO SON IGUALES -------> 404 no son iguales
          return res.status(404).json({
            updateUser: false,
          });
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }
    } else {
      /** si las contraseñas no son iguales le mando un 404 diciendo que las contraseñas no son iguales */
      return res.status(404).json("password dont match");
    }
  } catch (error) {
    return next(error);
    /**
     * return next(
      setError(
        500,
        error.message || 'Error general to ChangePassword with AUTH'
      )
    );
     */
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------UPDATE--------------------------------------
//! -----------------------------------------------------------------------------

const update = async (req, res, next) => {
  // capturamos la imagen nueva subida a cloudinary
  let catchImg = req.file?.path;

  try {
    // actualizamos los elementos unique del modelo
    await User.syncIndexes();

    // instanciamos un nuevo objeto del modelo de user con el req.body
    const patchUser = new User(req.body);

    // si tenemos imagen metemos a la instancia del modelo esta imagen nuevo que es lo que capturamos en catchImg
    req.file && (patchUser.image = catchImg);

    /** vamos a salvaguardar info que no quiero que el usuario pueda cambiarme */
    // AUNQUE ME PIDA CAMBIAR ESTAS CLAVES NO SE LO VOY A CAMBIAR
    patchUser._id = req.user._id;
    patchUser.password = req.user.password;
    patchUser.rol = req.user.rol;
    patchUser.confirmationCode = req.user.confirmationCode;
    patchUser.email = req.user.email;
    patchUser.check = req.user.check;
    patchUser.gender = req.user.gender;
    patchUser.eventsOwner = req.user.eventsOwner;
    patchUser.experiencesOwner = req.user.experiencesOwner;
    patchUser.eventsFollow = req.user.eventsFollow;
    patchUser.eventsFav = req.user.eventsFav;
    patchUser.experiencesFav = req.user.experiencesFav;
    patchUser.followers = req.user.followers;
    patchUser.followed = req.user.followed;
    patchUser.chats = req.user.chats;
    patchUser.banned = req.user.banned;
    patchUser.commentsPublicByOther = req.user.commentsPublicByOther;
    patchUser.postedMessages = req.user.postedMessages;
    patchUser.messagesFav = req.user.messagesFav;

    try {
      /** hacemos una actualizacion NO HACER CON EL SAVE
       * le metemos en el primer valor el id de el objeto a actualizar
       * y en el segundo valor le metemos la info que queremos actualizar
       */
      await User.findByIdAndUpdate(req.user._id, patchUser);

      // si nos ha metido una imagen nueva y ya la hemos actualizado pues tenemos que borrar la antigua
      // la antigua imagen la tenemos guardada con el usuario autenticado --> req.user
      if (req.file) deleteImgCloudinary(req.user.image);

      // ++++++++++++++++++++++ TEST RUNTIME+++++++++++++++++++++++++++++++++++++++
      /** siempre lo pprimero cuando testeamos es el elemento actualizado para comparar la info que viene
       * del req.body
       */
      const updateUser = await User.findById(req.user._id);

      /** sacamos las claves del objeto del req.body para saber que info nos han pedido actualizar */
      const updateKeys = Object.keys(req.body); // ["name"]

      // creamos un array donde guardamos los test
      const testUpdate = [];

      // recorremos el array de la info que con el req.body nos dijeron de actualizar
      /** recordar este array lo sacamos con el Object.keys */

      // updateKeys ES UN ARRAY CON LOS NOMBRES DE LAS CLAVES = ["name", "email", "rol"]

      ///----------------> para todo lo diferente de la imagen ----------------------------------
      updateKeys.forEach((item) => {
        /** vamos a comprobar que la info actualizada sea igual que lo que me mando por el body... */
        if (updateUser[item] === req.body[item]) {
          /** aparte vamos a comprobar que esta info sea diferente a lo que ya teniamos en mongo subido antes */
          if (updateUser[item] != req.user[item]) {
            // si es diferente a lo que ya teniamos lanzamos el nombre de la clave y su valor como true en un objeto
            // este objeto see pusea en el array que creamos arriba que guarda todos los testing en el runtime
            testUpdate.push({
              [item]: true,
            });
          } else {
            // si son igual lo que pusearemos sera el mismo objeto que arrriba pro diciendo que la info es igual
            testUpdate.push({
              [item]: "sameOldInfo",
            });
          }
        } else {
          testUpdate.push({
            [item]: true,
          });
        }
      });

      /// ---------------------- para la imagen ---------------------------------
      if (req.file) {
        /** si la imagen del user actualizado es estrictamente igual a la imagen nueva que la
         * guardamos en el catchImg, mandamos un objeto con la clave image y su valor en true
         * en caso contrario mandamos esta clave con su valor en false
         */
        updateUser.image === catchImg
          ? testUpdate.push({
              image: true,
            })
          : testUpdate.push({
              image: false,
            });
      }

      /** una vez finalizado el testing en el runtime vamos a mandar el usuario actualizado y el objeto
       * con los test
       */
      return res.status(200).json({
        updateUser,
        testUpdate,
      });
    } catch (error) {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};
//! -----------------------------------------------------------------------------
//? ---------------------------------findById------------------------------------
//! -----------------------------------------------------------------------------

const byId = async (req, res, next) => {
  try {
    /* creamos una constante, apuntamos al modelo y hacemos un findById para buscar por id. 
    El id lo encontramos con req.params y la clave .id. Si no lo encuentra es un null */
    const userById = await User.findById(req.params.id)
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
      .populate("city country")
      .populate("followed", "name image")
      .populate("followers", "name image");
    if (userById) {
      // comprobamos si existe
      return res.status(200).json(userById); // mandamos un json con el objeto
    } else {
      // si no lo ha encontrado
      return res.status(404).json("usuario no encontrado"); // mandamos usuario no encontrado
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------getAll--------------------------------------
//! -----------------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    // creamos una constante, apuntamos al modelo y hacemos un find. Esto devuelve un array
    const getAllUser = await User.find().populate("city");
    if (getAllUser.length === 0) {
      // comprobamos si el getAll ha encontrado alguno, si no tiene ninguno, retornamos no encontrados
      return res.status(404).json("no encontrados");
    } else return res.status(200).json({ data: getAllUser });
  } catch (error) {
    return next(error);
  }
};
//! -----------------------------------------------------------------------------
//? ---------------------------------get By name---------------------------------
//! -----------------------------------------------------------------------------

const byName = async (req, res, next) => {
  try {
    /* creamos una constante, apuntamos al modelo y hacemos un findOne para buscar uno y lo vamos a hacer por name. 
    El name lo encontramos diciendo en la clave que quiero que busque y con req.params y la clave .name buscaré el 
    nombre exacto.*/
    const getNameUser = await User.findOne({ name: req.params.name });
    if (getNameUser) {
      return res.status(200).json(getNameUser);
    } else {
      return res.status(404).json("usuario no encontrado");
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------get By Gender----------------------
//! -----------------------------------------------------------------------------

const byGender = async (req, res, next) => {
  try {
    const getGenderUser = await User.find({
      gender: req.params.gender,
    });
    if (getGenderUser) {
      return res.status(200).json(getGenderUser);
    } else {
      return res.status(404).json("usuario no encontrado");
    }
  } catch (error) {
    return next(error);
  }
};
//! -----------------------------------------------------------------------------
//? ---------------------------------FOLLOW USER--------------------------------------
//! -----------------------------------------------------------------------------

const followUserToggle = async (req, res, next) => {
  try {
    const { idUserSeQuiereSeguir } = req.params;
    const { followed } = req.user; // busco en el arrray de seguidores si le sigo o no este usuario

    if (followed.includes(idUserSeQuiereSeguir)) {
      // si los que sigo esta el id del que quiero seguir lo saco del array
      //! si lo incluye, quiere decir lo sigo por lo que lo dejo de seguir
      try {
        // 1) como lo quiero dejar de seguir quito su id del array de los que me siguen

        await User.findByIdAndUpdate(req.user._id, {
          $pull: {
            followed: idUserSeQuiereSeguir,
          },
        });
        try {
          // 2) del user que dejo de seguir me tengo que quitar de sus seguidores

          await User.findByIdAndUpdate(idUserSeQuiereSeguir, {
            $pull: {
              followers: req.user._id,
            },
          });

          return res.status(200).json({
            action: "he dejado de seguirlo",
            authUser: await User.findById(req.user._id)
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
            userSeQuiereSeguir: await User.findById(idUserSeQuiereSeguir),
            allEvent: await Event.find().populate("cities eventOwner"),
            allUser: await User.find().populate("city country"),
          });
        } catch (error) {
          return res.status(404).json({
            error:
              "error catch update quien le sigue al user que recibo por el param",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error:
            "error catch update borrar de seguidor el id que recibo por el param",
          message: error.message,
        });
      }
    } else {
      //! si no lo tengo como que lo sigo, lo empiezo a seguir

      try {
        // 1) como lo quiero dejar de seguir quito su id del array de los que me siguen

        await User.findByIdAndUpdate(req.user._id, {
          $push: {
            followed: idUserSeQuiereSeguir,
          },
        });
        try {
          // 2) del user que dejo de seguir me tengo que quitar de sus seguidores

          await User.findByIdAndUpdate(idUserSeQuiereSeguir, {
            $push: {
              followers: req.user._id,
            },
          });

          return res.status(200).json({
            action: "Lo empiezo a seguir de seguirlo",
            authUser: await User.findById(req.user._id)
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
            userSeQuiereSeguir: await User.findById(idUserSeQuiereSeguir),
            allEvent: await Event.find().populate("cities eventOwner"),
            allUser: await User.find().populate("city country"),
          });
        } catch (error) {
          return res.status(404).json({
            error:
              "error catch update quien le sigue al user que recibo por el param",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error:
            "error catch update poner de seguidor el id que recibo por el param",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return res.status(404).json({
      error: "error catch general",
      message: error.message,
    });
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------DELETE--------------------------------------
//! -----------------------------------------------------------------------------

const deleteUser = async (req, res, next) => {
  try {
    const { _id, image } = req.user;
    await User.findByIdAndDelete(_id);

    // hacemos un test para ver si lo ha borrado
    if (await User.findById(_id)) {
      // si el usuario
      return res.status(404).json("not deleted"); ///
    } else {
      /**
       * HAY QUE BORRARR TODO LO QUE HAY HECHO EL USER: LIKE, COMENTARIOS, LOS CHATS, LOS MENSAJES , EVENTOS, EXPERIENCIAS, ....
       */
      deleteImgCloudinary(image);

      /**
       * 0) borrar la persona ---ok
       * 1) likes ---> Eventos -- ok
       * 2) likes ---> Experiencias --ok
       * 3) likes ---> Messages --ok
       * 4) userOne, userTwo: Chat ---ok
       * 5) owner -->Message
       * 6) mensajes (comments) ---> Eventos
       * 7) mensajes (comments) ---> Experiencias
       * 8) eventos creados por user
       * 9) experiencias creadas por user.
       * 10) eventos follow --> eventos
       */

      try {
        await User.updateMany(
          { followers: _id },
          { $pull: { followers: _id } }
        );
        try {
          await User.updateMany(
            { followed: _id },
            { $pull: { followed: _id } }
          );
          try {
            //* 1) likes ---> Events
            await Event.updateMany(
              { likeEvent: _id },
              { $pull: { likeEvent: _id } }
            );

            try {
              //* 2) likes ---> Experiencias

              await Experience.updateMany(
                { likes: _id },
                { $pull: { likes: _id } }
              );

              try {
                //* 3) likes ---> Messages
                await Message.updateMany(
                  { likes: _id },
                  { $pull: { likes: _id } }
                );
                try {
                  //* 4) userOne, userTwo: Chat
                  await Chat.deleteMany({ userOne: _id });
                  try {
                    await Chat.deleteMany({ userTwo: _id });
                    try {
                      req.user.chats.forEach(async (idDeLosChatsBorrados) => {
                        await User.updateMany(
                          { chats: idDeLosChatsBorrados },
                          { $pull: { chats: idDeLosChatsBorrados } }
                        );
                      });
                      try {
                        //* 5) owner -->Message
                        await Message.deleteMany({ owner: _id });

                        // try {
                        //   // 6) mensajes (comments) ---> Eventos
                        //   await Events.deleteMany(
                        //     { comments: id },
                        //     { $pull: { comments: id } }
                        //   );
                        //   try {
                        //     // 7) mensajes (comments) ---> Experiencias
                        //     await Experience.updateMany(
                        //       { comments: id },
                        //       { $pull: { comments: id } }
                        //     );
                        try {
                          // 8) eventos creados por user
                          await User.deleteMany({ eventsOwner: _id });
                          try {
                            // 9) experiencias creadas por user
                            await User.deleteMany({
                              experiencesOwner: _id,
                            });

                            try {
                              // 10) eventos follow --> eventos
                              await Event.deleteMany({
                                eventFollow: _id,
                              });
                              //! ----------REDIRECT--------------------------
                              console.log("😘", req.user.postedMessages);
                              return res.redirect(
                                307,
                                `http://localhost:8081/api/v1/users/redirect/message/${JSON.stringify(
                                  req.user.postedMessages
                                )}`
                              );
                            } catch (error) {
                              return res.status(404).json({
                                error: "Comment borrado - eventos",
                                message: error.message,
                              });
                            }
                          } catch (error) {
                            return res.status(404).json({
                              error: "Comment borrado - experiencias",
                              message: error.message,
                            });
                          }
                        } catch (error) {
                          return res.status(404).json({
                            error: "Eventos creados por el user",
                            message: error.message,
                          });
                        }
                        //   } catch (error) {
                        //     return res.status(404).json({
                        //       error: "Experiencias creados por el user",
                        //       message: error.message,
                        //     });
                        //   }
                        // } catch (error) {
                        //   return res.status(404).json({
                        //     error: "Eventos seguidos por el user por el user",
                        //     message: error.message,
                        //   });
                        // }
                      } catch (error) {
                        return res.status(404).json({
                          error: "Messages deleteMany - owner",
                          message: error.message,
                        });
                      }
                    } catch (error) {
                      return res.status(404).json({
                        error:
                          "User updateMany -- bucle de los id del resto de user de mis chats borrados",
                        message: error.message,
                      });
                    }
                  } catch (error) {
                    return res.status(404).json({
                      error: "chat deleteMany -- userTwo",
                      message: error.message,
                    });
                  }
                } catch (error) {
                  return res.status(404).json({
                    error: "chat deleteMany -- userOne",
                    message: error.message,
                  });
                }
              } catch (error) {
                return res.status(404).json({
                  error: " Menssage updateMany  --  likes",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(404).json({
                error: " Experiences updateMany  --  likes",
                message: error.message,
              });
            }
          } catch (error) {
            return res.status(404).json({
              error: " Events updateMany  --  likes",
              message: error.message,
            });
          }
        } catch (error) {
          return res.status(404).json({
            error: " user updateMany  -- followers ",
            message: error.message,
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: " user updateMany  -- followed ",
          message: error.message,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

const deleteMessageDeleteUser = async (req, res, next) => {
  try {
    const { arrayIdMessages } = req.params;
    const parseArray = JSON.parse(arrayIdMessages);
    console.log("😘", parseArray);

    await parseArray.forEach(async (id) => {
      try {
        const mensageDelete = await Message.findByIdAndDelete(id);

        if (mensageDelete.type == "public") {
          try {
            await Experience.updateMany(
              { comments: id },
              { $pull: { comments: id } }
            );

            try {
              await Event.updateMany(
                { comments: id },
                { $pull: { comments: id } }
              );
              return await res.status(200).json("delete ok");
            } catch (error) {
              return res.status(404).json({
                error: " character updateMany  -- comments ",
                message: error.message,
              });
            }
          } catch (error) {
            return res.status(404).json({
              error: "movie updateMany  --  comments ",
              message: error.message,
            });
          }
        }
      } catch (error) {
        return res.status(404).json({
          error: "message delete",
          message: error.message,
        });
      }
    });
  } catch (error) {
    return res.status(404).json(error.message);
  }
};

module.exports = {
  registerUtil,
  registerWithRedirect,
  sendMailRedirect,
  resendCode,
  checkNewUser,
  login,
  autoLogin,
  changePassword,
  sendPassword,
  modifyPassword,
  update,
  getAll,
  byId,
  byName,
  byGender,
  followUserToggle,
  deleteMessageDeleteUser,
  deleteUser,
};
