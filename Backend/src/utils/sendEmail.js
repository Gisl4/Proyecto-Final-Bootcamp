const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const { setTestEmailSend } = require("../state/state.data");

const sendEmail = (userEmail, name, confirmationCode) => {
  /* reseteo el estado a false ---> es el estado inicial */
  setTestEmailSend(false); // función que está en state.data, al inicio reseteo el estado porque inicialmente no se ha enviado el correo
  const email = process.env.EMAIL; // cojo el email
  const password = process.env.PASSWORD; // cojo la password

  const transporter = nodemailer.createTransport({
    //Creo el transporte
    service: "gmail", // le digo que va a ser con gmail
    auth: {
      // le autentifico
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    // creo el email y le meto sus variables
    from: email, //yo que soy quien lo envío
    to: userEmail, // a quién lo envío
    subject: "Confirmation code", // Asunto del email
    text: `tu codigo es ${confirmationCode}, gracias por confiar en nosotros ${name}`, // texto del email
  };
  /* una vez que tengo el transporte y el email utilizo el método senEmail que le envio el email 
 y dentro tengo una función que controla el envío del email, esta función tiene el error y la info
 del envío . */
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // si tengo un error
      console.log(error);
      setTestEmailSend(false); // está en false porque no se ha enviado ningún correo
      return; // para salir de la función
    }
    console.log("Email sent: " + info.response); // muestro que se ha enviado el correo con la info de la response
    setTestEmailSend(true); // está en true porque se ha enviado el correo
  });
};

module.exports = sendEmail; // exporto la función
