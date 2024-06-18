import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./Register.css";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import { Uploadfile } from "../components";
import { Navigate } from "react-router-dom";
import { createEvent } from "../services/events.service";
import { getAllCity } from "../services/city.service";
import { useErrorEvent } from "../hooks/useErrorEvent";
import Select from "react-select"; //!Asegurarse de tener importado Select y no comentarlo
export const EventsForm = () => {
  //! 1) crear los estados

  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [ok, setOk] = useState(false);
  const { user, allUser, setAllUser, bridgeData } = useAuth();
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [resCity, setResCity] = useState({});
  const [city, setCity] = useState("");

  //! 2) llamada al hook de react hook form

  const { register, handleSubmit, setValue } = useForm();

  //! 3) la funcion que gestiona los datos del formulario

  const formSubmit = async (formData) => {
    const inputFile = document.getElementById("file-upload").files;
    let customFormData = formData;
    //* condicional para enviar los datos del formulario al backend tanto si hay subida imagen como si no
    if (inputFile.length != 0) {
      // si es diferente a 0 es que hay algo dentro de files
      const customFormData = {
        ...formData,
        image: inputFile[0],
        cities: city,
        eventOwner: user._id,
      };
      //llamada al backend
      setSend(true);
      setRes(await createEvent(customFormData));
      setSend(false);
    } else {
      // si no hay imagen solo hago una copia del formData
      const customFormData = {
        ...formData,
      };
      //llamada al backend
      setSend(true);
      setRes(await createEvent(customFormData));
      setSend(false);
    }
  };

  //! 4) useEffects que gestionan la repuesta y manejan los errores

  useEffect(() => {
    useErrorRegister(res, setRes, setOk);
    // si la res es ok llamamos a la funcion puente del contexto y le pasamos el parámetro ALLUSER
    if (res?.status == 200 && setOk(true)) {
      setEvents([...events, response.data]);
      bridgeData("ALLUSER");
    }
  }, [res]);

  useEffect(() => {
    console.log("allUser 🤡", allUser);
  }, [allUser]);

  useEffect(() => {
    (async () => {
      setCities(await getAllCity());
    })();
  }, []);

  useEffect(() => {
    useErrorEvent(resCity, setResCity, setCities);
  }, [resCity]);

  useEffect(() => {
    console.log(cities);
  }, [cities]);

  //! 5) estados de navegacion

  if (ok) {
    return <Navigate to="/events" />;
  }

  return (
    <div>
      <div className="form-wrap">
        <div>
          <h1>Crear evento</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Evento
              </label>
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                placeholder="Añadir evento"
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

            <div className="category_container form-group">
              <label htmlFor="category" className="custom-placeholder">
                Categoria
              </label>
              <input
                className="input_user"
                type="text"
                id="category"
                name="category"
                autoComplete="off"
                placeholder="Selecciona una categoría"
                list="category-options"
                {...register("category", { required: true })}
              />
              <datalist id="category-options">
                <option value="Música" />
                <option value="Gastronomía" />
                <option value="Deportes" />
                <option value="Otros..." />
              </datalist>
            </div>
            <div className="cities_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Ciudad
              </label>
              <Select
                name="cities"
                id="cities"
                placeholder="Selecciona una ciudad"
                options={
                  cities.length != 0 &&
                  cities.data.map((city, index) => {
                    return { label: city.name, value: city._id, key: index };
                  })
                }
                onChange={({ value }) => setCity(value)}
              />
            </div>

            <div className="date_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Fecha y Hora
              </label>
              <input
                className="input_user"
                type="datetime-local"
                id="date"
                name="daytime"
                autoComplete="false"
                placeholder="DD-MM-AAAA"
                {...register("date", { required: true })}
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
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.name}</h3>
            <img
              src={event.image}
              alt={event.name}
              style={{ maxWidth: "200px" }}
            />
            <p>{event.description}</p>
            <p>Created by: {event.createdBy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
