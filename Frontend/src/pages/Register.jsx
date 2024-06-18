import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./Register.css";
import {
  registerUser,
  fetchCountries,
  fetchCities,
} from "../services/user.service";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import { Link, Navigate } from "react-router-dom";
import { Uploadfile } from "../components";

export const Register = () => {
  //! 1) crear los estados
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [ok, setOk] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const { allUser, setAllUser, bridgeData } = useAuth();

  //! 2) llamada al hook de react hook form
  const { register, handleSubmit, watch } = useForm();

  //! 3) la funcion que gestiona los datos del formulario
  const formSubmit = async (formData) => {
    const inputFile = document.getElementById("file-upload").files;

    const customFormData = { ...formData };
    if (inputFile.length !== 0) {
      customFormData.image = inputFile[0];
    }

    setSend(true);
    setRes(await registerUser(customFormData));
    setSend(false);
  };

  //! 4) useEffects que gestionan la repuesta y manejan los errores
  useEffect(() => {
    useErrorRegister(res, setRes, setOk);
    if (res?.status === 200) bridgeData("ALLUSER");
  }, [res]);

  useEffect(() => {
    console.log("allUser 🤡", allUser);
  }, [allUser]);

  //! 5) cargar países al montar el componente
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    };
    loadCountries();
    console.log(loadCountries);
  }, []);

  //! 6) cargar ciudades cuando se seleccione un país
  const selectedCountry = watch("country");
  useEffect(() => {
    if (selectedCountry) {
      const loadCities = async () => {
        const citiesData = await fetchCities(selectedCountry);
        setCities(citiesData);
      };
      loadCities();
    }
  }, [selectedCountry]);

  //! 7) estados de navegacion
  if (ok) {
    return <Navigate to="/verifyCode" />;
  }

  return (
    <>
      <div className="form-wrap">
        <h1>Registrate</h1>
        <p>Es gratis y solo te llevará un minuto</p>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <input
              className="input_user"
              type="text"
              id="name"
              name="name"
              autoComplete="false"
              placeholder="Cristina"
              {...register("name", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Nombre
            </label>
          </div>
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
          <div className="email_container form-group">
            <input
              className="input_user"
              type="email"
              id="email"
              name="email"
              autoComplete="false"
              placeholder="traviesos@gmail.com"
              {...register("email", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Email
            </label>
          </div>

          <div className="age_container form-group">
            <input
              className="input_user"
              type="date"
              id="age"
              name="age"
              autoComplete="false"
              placeholder="25"
              {...register("age", { required: true })}
            />
            <label htmlFor="custom-input" className="custom-placeholder">
              Fecha de nacimiento
            </label>
          </div>

          <div className="sexo">
            <input
              type="radio"
              name="sexo"
              id="hombre"
              value="hombre"
              {...register("gender")}
            />
            <label htmlFor="hombre" className="label-radio hombre">
              Hombre
            </label>
            <input
              type="radio"
              name="sexo"
              id="mujer"
              value="mujer"
              {...register("gender")}
            />
            <label htmlFor="mujer" className="label-radio mujer">
              Mujer
            </label>
            <input
              type="radio"
              name="sexo"
              id="otros"
              value="otros"
              {...register("gender")}
            />
            <label htmlFor="otros" className="label-radio otros">
              Otros
            </label>
          </div>

          <div className="country_container form-group">
            <select
              className="input_user"
              id="country"
              name="country"
              {...register("country", { required: true })}
            >
              <option value="">Selecciona tu país</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
            <label htmlFor="country" className="custom-placeholder">
              Paises
            </label>
          </div>

          {selectedCountry && (
            <div className="city_container form-group">
              <select
                className="input_user"
                id="city"
                name="city"
                country=""
                {...register("city", { required: true })}
              >
                <option value="">Selecciona tu ciudad</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
              <label htmlFor="city" className="custom-placeholder">
                Ciudades
              </label>
            </div>
          )}

          <div>
            <Uploadfile />
          </div>

          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#2f7a67" }}
            >
              {send ? "Cargando..." : "Aceptar"}
            </button>
          </div>
        </form>
        <div className="footerForm">
          <p className="parrafoLogin">
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </>
  );
};
