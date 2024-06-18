import { useState } from "react";
import "./ExperiencesCard.css";
import { Link } from "react-router-dom";

const ExperiencesCard = ({ experience }) => {
  const [newMessage, setNewMessage] = useState({
    owner: "6643b72f2ce2326596e6cfc2",
    type: "",
    content: "",
    recipientExperience: experience.id, // Supongamos que inicialmente el usuario es "Usuario Nuevo"
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newExperience.content.trim() !== "") {
      setNewMessage({ ...newMessage });
    }
  };
  return (
    <form id="formularios" onSubmit={handleSubmit}>
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        name="description"
        value={newExperience.description}
        onChange={handleChange}
        required
      />

      <button type="submit">Post Message</button>
    </form>
  );
};

//!--- FALTARIA AÑADIR TODOS LOS DATOS DE LA EXPERIENCE QUE INCLUIMOS EN EL MODELO DE EXPERIENCE

export default ExperiencesCard;
