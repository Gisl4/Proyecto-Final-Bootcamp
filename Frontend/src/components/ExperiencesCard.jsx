import { useState } from "react";
import "./ExperiencesCard.css";
import { Link } from "react-router-dom";

const ExperiencesCard = ({ experience }) => {
  const [expanded, setExpanded] = useState(false); // Estado para ampliar la tarjeta de país

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div
      className={`experience-card ${expanded ? "expanded" : ""}`}
      onClick={handleExpandClick}
    >
      <h2>{experience.name}</h2>
      <img src={experience.image} alt={experience.name} />
      {expanded && (
        <div className="experiences-list">
          <h3>Experiencias en tu ciudad:</h3>
          <ul>
            {experience.cities.map((city, index) => (
              <ul key={index}>
                <Link to={city.path}>{city.name}</Link>
              </ul>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

//!--- FALTARIA AÑADIR TODOS LOS DATOS DE LA EXPERIENCE QUE INCLUIMOS EN EL MODELO DE EXPERIENCE 

export default ExperiencesCard;
