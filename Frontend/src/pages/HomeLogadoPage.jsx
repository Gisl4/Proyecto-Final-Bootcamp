import { useState, useEffect } from "react";
import "./HomeLogadoPage.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useErrorEvent } from "../hooks/useErrorEvent";
import { getAll } from "../services/events.service";
import { Event } from "../components";
import { byId } from "../services/user.service";
import { useErrorHomeLog } from "../hooks";

export const HomeLogadoPage = () => {
  const { user } = useAuth();
  console.log("user", user);
  const [events, setEvents] = useState([]);
  const [res, setRes] = useState({});
  const [resById, setResById] = useState({});

  const [userById, setUserById] = useState(null);

  useEffect(() => {
    (async () => {
      setRes(await getAll());
      setResById(await byId(user._id));
    })();
  }, []);

  useEffect(() => {
    resById?.status == 200 && setUserById(resById.data);
  }, [resById]);

  useEffect(() => {
    useErrorHomeLog(res, setRes, setEvents, user?.city?.name);
  }, [res, user.city.name]);

  useEffect(() => {
    console.log(events);
  }, [events]);

  return (
    <main>
      <div className="homePage">
        <h3 className="TituloViajeros">¡¡Bienvenid@ {user.user}!!</h3>
        <p className="parrafo">
          Aquí tienes los eventos más destacados de tu ciudad...
        </p>

        <h2 className="EventosHome">
          ¿Quieres ver lo que se cuece en {user.city.name}?
        </h2>

        {console.log("events", events)}
        <div>
          <button>
            <Link to="/events">Ver más</Link>
          </button>
          {events.length > 0 &&
            userById != null &&
            events.map((item) => (
              <Event
                renderData={item}
                key={item._id}
                setEvents={setEvents}
                profile={false}
                home={true}
                userAuth={userById}
              />
            ))}
        </div>
      </div>
    </main>
  );
};
