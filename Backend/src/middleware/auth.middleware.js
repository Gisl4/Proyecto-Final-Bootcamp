const User = require("../api/models/User.model");
const { verifyToken } = require("../utils/token");
const dotenv = require("dotenv");
dotenv.config();

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", ""); // enviamos el token por el bearer token en insomnia

  if (!token) {
    return next(new Error("Unauthorized")); // si no tenemos token lanzamos un error de que no está autorizado
  }
  /* ahora descodificamos el token con la función verifyToken que está en utils, en la función de token que tiene 
  el email y el id, estas dos cosas cuando lo descodifiquemos nos las va a devolver en un objeto en la variable 
  decoded, con esto vamos a construir el objeto request con una nueva clave que se llama user y lo que hago es que busco 
  el usuario que está con el token y lo guardo en la req.user. Si todo está correcto le digo continua con el next(), 
  si no, retornamos el error y lo mandamos al log (la consola). */

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    /// solo se crea req.user cuando es un endpoint authenticado ---> tiene como middleware el auth
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(error);
  }
};
/* en el caso de isAuthAdmin es igual todo pero hacemos un paso más, en la req.user el rol es diferente a admin? 
 si es diferente lanzamos un error de que no estás autorizado. Estás autenticado (porque hay token) pero no 
 autorizado (porque no eres administrador). Si todo está correcto lanzamos el next para que continue y en el 
 catch lanzamos el next con el error para enviarlo al log (la consola). */
const isAuthAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    // cuando decodifico el token saco el id y el email
    console.log(decoded);
    req.user = await User.findById(decoded.id);

    // pongo un requisito mas y es que sea admin
    if (req.user.rol !== "admin") {
      return next(new Error("Unauthorized, not admin"));
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const isAuthSuper = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    // cuando decodifico el token saco el id y el email
    console.log(decoded);
    req.user = await User.findById(decoded.id);

    // pongo un requisito mas y es que sea admin
    if (req.user.rol !== "superAdmin") {
      return next(new Error("Unauthorized, not superAdmin"));
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isAuth,
  isAuthAdmin,
  isAuthSuper,
};
