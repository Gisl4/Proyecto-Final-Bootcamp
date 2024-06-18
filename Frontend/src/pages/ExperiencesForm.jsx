import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./Register.css";
import { useErrorRegister } from "../hooks";
import { useAuth } from "../context/authContext";
import { Uploadfile } from "../components";
import { createExperience } from "../services/experiences.service";
import { Navigate } from "react-router-dom";

export const ExperiencesForm = () => {
  const { id } = useParams(); // Obtener el ID del evento desde los parámetros de la URL
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [ok, setOk] = useState(false);
  const { user, allUser, setAllUser, bridgeData } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const formSubmit = async (formData) => {
    const inputFile = document.getElementById("file-upload").files;
    const customFormData = {
      ...formData,
      image: inputFile[0],
      events: id, // Incluye el ID del evento en los datos del formulario
    };

    setSend(true);
    setRes(await createExperience(customFormData));
    setSend(false);
  };

  useEffect(() => {
    useErrorRegister(res, setRes, setOk);
    if (res?.status === 200) {
      setExperiences([...experiences, res.data]);
      bridgeData("ALLUSER");
      navigate(`/events/${id}`, { state: { newExperience: res.data } }); // Pasar la nueva experiencia como estado
    }
  }, [res, experiences, bridgeData]);

  return (
    <div>
      <div className="form-wrap">
        <h1>Crear experiencia</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="user_container form-group">
            <input
              className="input_user"
              type="text"
              id="name"
              name="name"
              placeholder="Nombre"
              {...register("name", { required: true })}
            />
            <label htmlFor="name" className="custom-placeholder">
              Nombre
            </label>
          </div>
          <div className="description_container form-group">
            <input
              className="input_user"
              type="text"
              id="description"
              name="description"
              placeholder="Descripción"
              {...register("description", { required: true })}
            />
            <label htmlFor="description" className="custom-placeholder">
              Descripción
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
      <ul>
        {experiences.map((experience) => (
          <li key={experience._id}>
            <h3>{experience.name}</h3>
            <img
              src={experience.image}
              alt={experience.name}
              style={{ maxWidth: "200px" }}
            />
            <p>{experience.description}</p>
            <p>Creada por: {experience.createdBy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
