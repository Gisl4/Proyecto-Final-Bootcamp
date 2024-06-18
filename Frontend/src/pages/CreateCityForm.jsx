import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./CreateCityForm.css";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import { Uploadfile } from "../components";
import { Navigate } from "react-router-dom";
import { createCity } from "../services/city.service";
import { fetchCountries } from "../services/user.service";

export const CreateCityForm = () => {
  //! 1) crear los estados

  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [ok, setOk] = useState(false);
  const { user, allUser, setAllUser, bridgeData } = useAuth();
  const [countries, setCountries] = useState([]);
  const [city, setCity] = useState([]);

  //! 2) llamada al hook de react hook form

  const { register, handleSubmit, setValue } = useForm();

  //! 3) la funcion que gestiona los datos del formulario

  const formSubmit = async (formData) => {
    const inputFile = document.getElementById("file-upload").files;
    //* condicional para enviar los datos del formulario al backend tanto si hay subida imagen como si no
    if (inputFile.length != 0) {
      // si es diferente a 0 es que hay algo dentro de files
      const customFormData = {
        ...formData,
        image: inputFile[0],
      };
      //llamada al backend
      setSend(true);
      setRes(await createCity(customFormData));
      setSend(false);
    } else {
      // si no hay imagen solo hago una copia del formData
      const customFormData = {
        ...formData,
      };
      //llamada al backend
      setSend(true);
      setRes(await createCity(customFormData));
      setSend(false);
    }
  };

  //! 4) useEffects que gestionan la repuesta y manejan los errores

  useEffect(() => {
    useErrorRegister(res, setRes, setOk);
    // si la res es ok llamamos a la funcion puente del contexto y le pasamos el parámetro ALLUSER
    if (res?.status == 200) {
      setCity([...city, response.data]);
      bridgeData("ALLUSER");
    }
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

  //! 5) estados de navegacion

  if (ok) {
    return <Navigate to="/country" />;
  }

  return (
    <div>
      <div className="form-wrap">
        <div>
          <h1>Crear tu ciudad</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Ciudad
              </label>
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                placeholder=""
                {...register("name", { required: true })}
              />
            </div>
            <div className="description_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Descripción
              </label>
              <input
                className="input_user"
                type="texto"
                id="description"
                name="description"
                autoComplete="false"
                placeholder=""
                {...register("description", { required: true })}
              />
            </div>

            <div className="numHab_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Número de habitantes
              </label>
              <input
                className="input_user"
                type="number"
                id="numHab"
                name="numHab"
                autoComplete="false"
                placeholder=""
                {...register("numHab", { required: true })}
              />
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

            <div>
              <Uploadfile required />
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
        </div>
      </div>
      {/* {countries.map((country) => (
        <li key={country._id}>
          <h3>{country.name}</h3>
          <img
            src={country.image}
            alt={country.name}
            style={{ maxWidth: "200px" }}
          />
          <p>{country.description}</p>
        </li> */}
      {/* ))} */}
    </div>
  );
};
