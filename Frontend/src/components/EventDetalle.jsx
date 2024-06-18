import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useErrorEventDetalle } from "../hooks";
import { Loader } from "./Loader";
import { eventById } from "../services/events.service";
import { Comments, Experience } from "./index";
import "./EventDetalle.css";

export const EventDetalle = () => {
  const [eventoById, setEventById] = useState(null);
  const [resEvent, setResEvent] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [commentsCounter, setCommentsCounter] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await eventById(id);
      setResEvent(response);
      setCommentsCounter(response.data.comments.length);
    };
    fetchEvent();
  }, [id]);

  // Llama al hook directamente en el componente
  useErrorEventDetalle(resEvent, setResEvent, setEventById);
  useEffect(() => {
    // If there is a newExperience in the location state, add it to the event experiences
    if (location.state && location.state.newExperience) {
      setEventById((prevEvent) => ({
        ...prevEvent,
        experience: [...prevEvent?.experience, location?.state?.newExperience],
      }));
    }
  }, [location.state]);

  const onToggleComments = () => {
    setOpen(!open);
  };

  function updateCommentsCounter(commentsCount) {
    setCommentsCounter(commentsCount);
  }

  return (
    <div>
      {eventoById != null ? (
        <figure className="event-detail-figure" id="eventId">
          <img
            className="event-detail-image"
            src={eventoById?.image}
            alt={eventoById?.name}
          />
          <div className="title-and-icons-wrapper">
            <h2>{eventoById?.name}</h2>
            <div className="comment-icon-padding">
              <span
                className="material-symbols-outlined event-comment-experience-icon"
                onClick={onToggleComments}
              >
                mode_comment
              </span>
              <p
                className={
                  commentsCounter > 9
                    ? "comments-likes-counter"
                    : "comments-likes-counter comments-likes-counter-2"
                }
              >
                {commentsCounter ? commentsCounter : ""}
              </p>
            </div>
          </div>
          <p>{eventoById.description}</p>
          <p>{new Date(eventoById.date).toLocaleString()}</p>
          <div className="card-comments-wrapper">
            {open ? (
              <>
                <Comments
                  selectedRecipient={eventoById._id}
                  commentsProps={eventoById?.comments}
                  updateCommentsCounter={updateCommentsCounter}
                />
                <div className="close-chat-wrapper">
                  <span
                    onClick={onToggleComments}
                    className="material-symbols-outlined"
                  >
                    close
                  </span>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <button
            onClick={() =>
              navigate(
                `/${eventoById.cities[0].name}/${eventoById.cities[0]._id}`
              )
            }
          >
            Ciudad del evento
          </button>
          <button onClick={() => navigate("/profile")}>Mi perfil</button>
          <button
            onClick={() =>
              navigate(`/events/${eventoById._id}/ExperiencesForm`)
            }
          >
            Crear Experiencia
          </button>
          <div className="experiences">
            <h3>Experiencias</h3>
          </div>
          <div>
            {eventoById != null && eventoById?.experience?.length > 0 ? (
              eventoById?.experience?.map((item) => (
                <Experience
                  renderData={item}
                  key={item._id}
                  setEvents={setEventById}
                  profile={false}
                  // handleDeleteExperience={handleDeleteExperience}
                  // handleUpdate={handleUpdate}
                  userAuth={eventoById}
                  // setExperiences={setExperiences}
                />
              ))
            ) : (
              <p>
                No hay experiencias disponibles para este evento. Sé el primero
                ⬆️
              </p>
            )}
          </div>
        </figure>
      ) : (
        <Loader />
      )}
    </div>
  );
};
