import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./CreateCountryForm.css";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import { Uploadfile } from "../components";
import { Navigate } from "react-router-dom";
import { createCountry } from "../services/country.service";

export const CreateCountryForm = () => {
  //! 1) crear los estados

  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [ok, setOk] = useState(false);
  const { user, allUser, setAllUser, bridgeData } = useAuth();
  const [country, setCountry] = useState([]);

  //! 2) llamada al hook de react hook form

  const { register, handleSubmit, setValue } = useForm();

  //! 3) la funcion que gestiona los datos del formulario

  const formSubmit = async (formData) => {
    console.log("formdata", formData);
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
      setRes(await createCountry(customFormData));
      setSend(false);
    } else {
      // si no hay imagen solo hago una copia del formData
      const customFormData = {
        ...formData,
      };
      //llamada al backend
      setSend(true);
      setRes(await createCountry(customFormData));
      setSend(false);
    }
  };

  //! 4) useEffects que gestionan la repuesta y manejan los errores

  useEffect(() => {
    useErrorRegister(res, setRes, setOk);
    // si la res es ok llamamos a la funcion puente del contexto y le pasamos el parámetro ALLUSER
    if (res?.status == 200) {
      setCountry([...country, response.data]);
      bridgeData("ALLUSER");
    }
  }, [res]);

  useEffect(() => {
    console.log("allUser 🤡", allUser);
  }, [allUser]);

  //! 5) estados de navegacion

  if (ok) {
    return <Navigate to="/country" />;
  }

  return (
    <div>
      <div className="form-wrap">
        <div>
          <h1>Crear país</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                País
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

            <div className="tipicalFood_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Comida típica
              </label>
              <input
                className="input_user"
                type="texto"
                id="tipicalFood"
                name="tipicalFood"
                autoComplete="false"
                placeholder=""
                {...register("tipicalFood", { required: true })}
              />
            </div>

            <div className="traditions_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Principales tradiciones
              </label>
              <input
                className="input_user"
                type="texto"
                id="traditions"
                name="traditions"
                autoComplete="false"
                placeholder=""
                {...register("traditions", { required: true })}
              />
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
      {country.map((country) => (
        <li key={country._id}>
          <h3>{country.name}</h3>
          <img
            src={country.image}
            alt={country.name}
            style={{ maxWidth: "200px" }}
          />
          <p>{country.description}</p>
        </li>
      ))}
    </div>
  );
};
