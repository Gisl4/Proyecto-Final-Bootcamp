const setError = (code, message) => {
  //enviamos un código y un mensaje
  const error = new Error(); // generamos el error con el new Error
  error.code = code; // le metemos el código de estatus del error
  error.message = message; // le metemos el mensaje
  return error; // retornamos el error
};
module.exports = setError;
