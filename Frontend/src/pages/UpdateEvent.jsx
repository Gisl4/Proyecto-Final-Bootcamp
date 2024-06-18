import { useForm } from "react-hook-form";
import "./FormProfile.css";
import { Uploadfile } from "../components";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { updateEvent, eventById } from "../services/events.service";
import { useErrorEventDetalle } from "../hooks";
import { Navigate, useParams } from "react-router-dom";

export const UpdateEvent = () => {
  const [ok, setOk] = useState(false);
  const [eventoById, setEventById] = useState(null);
  const { id } = useParams();
  const [resEvent, setResEvent] = useState(null);
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);

  const defaultData = {
    name: eventoById?.name,
    description: eventoById?.description,
    date: eventoById?.date,
  };

  const formSubmit = (formData) => {
    Swal.fire({
      title: "¿Estás seguro de que quieres actualizar los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(255, 177, 205)",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputFile = document.getElementById("file-upload").files;
        let customFormData = formData;

        if (inputFile.length != 0) {
          customFormData = {
            ...formData,
            image: inputFile[0],
          };
        }

        setSend(true);
        setRes(await updateEvent(id, customFormData));
        setSend(false);
      }
    });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await eventById(id);
      response?.status == 200 && setEventById(response.data);
      setResEvent(response);
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    res?.status == 200 && setOk(true);
  }, [res]);

  if (ok) {
    return <Navigate to="/profile" />;
  }

  return (
    <>
      <div className="containerProfile">
        <div className="form-wrap formProfile">
          <h1>Actualiza tu evento ♻</h1>
          <p>Introduce los nuevos datos de tu evento</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Nombre del evento
              </label>
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                defaultValue={defaultData?.name}
                {...register("name")}
              />
            </div>

            <div className="description_container form-group">
              <label htmlFor="description" className="custom-placeholder">
                Descripción
              </label>
              <input
                className="input_user"
                type="text"
                id="description"
                name="description"
                defaultValue={defaultData?.description}
                {...register("description")}
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
                {...register("category")}
              />
              <datalist id="category-options">
                <option value="Música" />
                <option value="Gastronomía" />
                <option value="Deportes" />
                <option value="Otros..." />
              </datalist>
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
                {...register("date")}
              />
            </div>

            <Uploadfile />

            <div className="btn_container">
              <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#FEB0CD" }}
              >
                ACTUALIZA LOS DATOS
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
