import { Experience } from "../components";
import "./ProfilePage.css";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
// import { useErrorEvent } from "../hooks/useErrorEvent";
// import { eventById, getAll } from "../services/events.service";
import { deleteExperience, update } from "../services/experiences.service";
import { Event } from "../components";
import { useErrorExperience, useErrorUser } from "../hooks";
import { byId } from "../services/user.service";
import { deleteEvent, updateEvent } from "../services/events.service";

export const ProfilePage = ({ item }) => {
  const { user } = useAuth();
  const [resUser, setResUser] = useState([]);
  const [userById, setUserById] = useState(null);

  useEffect(() => {
    (async () => {
      setResUser(await byId(user._id));
    })(user);
  }, [user]);

  useEffect(() => {
    useErrorUser(resUser, setResUser, setUserById);
  }, [resUser]);

  useEffect(() => {
    console.log(userById);
  }, [userById]);

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setUserById((prevUser) => ({
        ...prevUser,
        eventsOwner: prevUser.eventsOwner.filter(
          (event) => event._id !== eventId
        ),
      }));
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      await deleteExperience(experienceId);
      setUserById((prevUser) => ({
        ...prevUser,
        experiencesOwner: prevUser.experiencesOwner.filter(
          (experience) => experience._id !== experienceId
        ),
      }));
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  const handleUpdate = async (eventId) => {
    try {
      await updateEvent(eventId);
      setUserById((prevUser) => ({
        ...prevUser,
        eventsOwner: prevUser.eventsOwner.filter(
          (event) => event._id !== eventId
        ),
      }));
      console.log("Evento actualizado:", eventId);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  const handleUpdateExperience = async (experienceId) => {
    try {
      await update(experienceId);
      setUserById((prevUser) => ({
        ...prevUser,
        experiencesOwner: prevUser.experiencesOwner.map((experience) =>
          experience._id === updatedExperience._id
            ? updatedExperience
            : experience
        ),
      }));
      console.log("Experiencia actualizada:", experienceId);
    } catch (error) {
      console.error("Error al actualizar la experiencia:", error);
    }
  };

  return (
    <>
      <main>
        <div className="superadmin-profile">
          <button
            style={{
              display: userById?.rol === "superAdmin" ? "block" : "none",
            }}
          >
            <Link to="/superAdminPage"> Administración </Link>
          </button>
        </div>
        <div className="homePage">
          <h3 className="TituloViajeros">
            ¡¡Hola {user.user}, aquí tienes todo tu contenido!!
          </h3>

          <h2 className="EventosHome">Tus eventos creados</h2>
          <div>
            {userById != null ? (
              userById.eventsOwner.map((item) => (
                <Event
                  renderData={item}
                  key={item._id}
                  setEvents={setUserById}
                  profile={true}
                  handleDelete={handleDelete}
                  handleUpdate={handleUpdate}
                  userAuth={userById}
                />
              ))
            ) : (
              <p>No hay eventos creados disponibles</p>
            )}
          </div>
          <h2 className="EventosHome">Tus eventos favoritos</h2>
          <div>
            {userById != null ? (
              userById.eventsFav.map((item) => (
                <Event
                  renderData={item}
                  key={item._id}
                  setEvents={setUserById}
                  profile={true}
                  userAuth={userById}
                />
              ))
            ) : (
              <p>No hay eventos favoritos disponibles</p>
            )}
          </div>
          <h2 className="EventosHome">Eventos que sigues</h2>
          <div>
            {userById != null ? (
              userById.eventsFollow.map((item) => (
                <Event
                  renderData={item}
                  key={item._id}
                  setEvents={setUserById}
                  profile={true}
                  userAuth={userById}
                />
              ))
            ) : (
              <p>No hay eventos seguidos disponibles</p>
            )}
          </div>
          <h2 className="EventosHome">Experiencias que has creado</h2>
          <div>
            {userById != null ? (
              userById.experiencesOwner.map((item) => (
                <Experience
                  renderData={item}
                  key={item._id}
                  setEvents={setUserById}
                  profile={true}
                  userAuth={userById}
                  handleDeleteExperience={handleDeleteExperience}
                  handleUpdateExperience={handleUpdateExperience}
                />
              ))
            ) : (
              <p>No has creado aún experiencias</p>
            )}
          </div>
          <p className="parrafo">
            Echa un vistazo de los nuevos eventos disponibles en{" "}
            {user.city.name}
          </p>
          <button>
            <Link to="/events">Eventos</Link>
          </button>
        </div>
      </main>
    </>
  );
};
