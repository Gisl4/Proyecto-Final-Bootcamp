//Nos requerimos el modelo de User
const User = require("../models/User.model");
//Hacemos una función asíncrona para poder cambiar de género
const changeGender = async (req, res, next) => {
  try {
    const { idUserChanged } = req.params;
    const { gender } = req?.query;
    // los query no son obligatorios no hacenm que rompa la ruta, es decir que no encuentre
    // los params SON OBLIGATORIOS, si no se pone la ruta no se encuentra
    /**
     * En los params ponemos info exencial, en los query ponemos info no esencial
     */

    await User.findByIdAndUpdate(idUserChanged, {
      gender: gender ? gender : "otros",
    });

    // ----------------________> test en runtime------------------
    //-->Aqui en el test actualizamos el género del usuario
    const updateUser = await User.findById(idUserChanged);
    if (gender) {
      if (updateUser.gender == gender) {
        return res.status(200).json({ updateTest: true });
      } else {
        return res.status(404).json({ updateTest: false });
      }
    } else {
      if (updateUser.gender == "otros") {
        return res.status(200).json({ updateTest: true });
      } else {
        return res.status(404).json({ updateTest: false });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//Creamos una función asíncrona para poder poner a los usuarios como admins
const changeAdmin = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    try {
      await User.findByIdAndUpdate(idUser, { rol: "admin" });

      // test --------------------runtime ---------------
      //actualizamos el estado del user para ver que se ha cambiaddo de user a admin
      const updateUser = await User.findById(idUser);
      if (updateUser.rol == "admin") {
        return res.status(200).json({ updateTest: true });
      } else {
        return res.status(404).json({ updateTest: false });
      }
    } catch (error) {
      return res.status(404).json(error.message);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = { changeGender, changeAdmin };
