import { useEffect, useState } from "react";
import "./ExperiencesPage.css";
import { Experience } from "../components";
import { useNavigate } from "react-router-dom";
import { useErrorExperience } from "../hooks/useErrorExperience";
import { getAllExperiences } from "../services/experiences.service";
import { useErrorEventDetalle } from "../hooks";
import { getAll } from "../services/events.service";

export const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [res, setRes] = useState({});
  const [resEvents, setResEvents] = useState({});
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  // Llama a los hooks directamente en el componente
  useErrorExperience(res, setRes, setExperiences);
  useErrorEventDetalle(resEvents, setResEvents, setEvents);

  useEffect(() => {
    (async () => {
      setRes(await getAllExperiences());
    })();
  }, []);

  useEffect(() => {
    console.log(experiences);
  }, [experiences]);
//! ---- HACER EL GETaLLeXPERIENCES CAMBIAR ESTADO, CAMBIAR RESPUESTA ---
  useEffect(() => {
    (async () => {
      setResEvents(await getAll());
    })();
  }, []);

  useEffect(() => {
    console.log(events);
  }, [events]);

  const handleClick = () => {
    navigate("/ExperiencesForm");
  };

  // Filtra las experiencias que están relacionadas con el evento seleccionado
  const experiencesEvent = experiences.filter(
    (experience) =>
      Array.isArray(experience.events) && experience.events.includes(events._id)
  );

  return (
    <div id="containerExperience">
      <button onClick={handleClick}> ✒️ CREA TU EXPERIENCIA </button>
      <hr />
      <br />
      {experiencesEvent.length > 0 &&
        experiencesEvent
          .slice(0, 1000)
          .map((item) => (
            <Experience
              item={item}
              src={item?.image}
              name={item?.name}
              key={item._id}
              description={item?.description}
              likes={item?.likes}
              comments={item?.comments}
              events={item?.events}
              experienceId={item?._id}
              setExperiences={setExperiences}
            />
          ))}
    </div>
  );
};
