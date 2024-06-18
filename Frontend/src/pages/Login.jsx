import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loginUserService } from "../services/user.service";
import { useLoginError } from "../hooks/useLoginError";
//import { useLoginError } from "../hooks"

export const Login = () => {
  //! estados
  const { register, handleSubmit } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [loginOk, setLoginOk] = useState(false);
  const { login, setUser } = useAuth();

  //! 1) funcion que gestiona los datos del formulario
  const formSubmit = async (formData) => {
    // llamada al backend
    setSend(true);
    setRes(await loginUserService(formData));
    setSend(false);
  };

  //! 2) hooks que gestiona los errores
  useEffect(() => {
    useLoginError(res, setRes, login, setLoginOk);
  }, [res]);

  // metido para comprobar superadmin 02/06
  useEffect(() => {
    setUser(() => null);
    localStorage.removeItem("user");
  }, []);

  //! 3) estados de navegacion
  if (loginOk) {
    if (res.data.user.check == false) {
      return <Navigate to="/verifyCode" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return (
    <>
      <div className="form-wrap">
        <h1>Iniciar sesión</h1>
        <p>Nos alegra verte de nuevo 🥰</p>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="email_container form-group">
            <input
              className="input_user"
              type="email"
              id="email"
              name="email"
              autoComplete="false"
              placeholder="Traviesos@gmail.com"
              {...register("email", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Email
            </label>

            <div className="password_container form-group">
              <input
                className="input_user"
                type="password"
                id="password"
                name="password"
                autoComplete="false"
                placeholder="Cristina321*"
                {...register("password", { required: true })}
              />
              <label htmlFor="custom-input" className="custom-placeholder">
                Contraseña
              </label>
            </div>
          </div>

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#FEB0CD" }}
            >
              Iniciar sesión
            </button>
          </div>
          <p className="bottom-text">
            <small>
              ¿Has olvidado tu contraseña?
              <Link to="/forgotpassword" className="anchorCustom">
                Cambiar contraseña
              </Link>
            </small>
          </p>
        </form>

        <div className="footerForm">
          <p className="parrafoLogin">
            ¿No tienes una cuenta? <Link to="/register">Registrate aquí</Link>
          </p>
        </div>
      </div>
    </>
  );
};
