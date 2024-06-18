import { useEffect, useState } from "react";
import "./EventsPages.css";
import { Event, Input } from "../components";
import { getAll } from "../services/events.service";
import { useErrorEvent } from "../hooks/useErrorEvent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { byId } from "../services/user.service";
import { useErrorEventPages } from "../hooks";

export const Eventspages = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [res, setRes] = useState({});
  const [resData, setResData] = useState({});

  const [resById, setResById] = useState({});
  const [userById, setUserById] = useState(null);

  const [valueInput, setValueInput] = useState(() => {
    return localStorage.getItem("input")
      ? JSON.parse(localStorage.getItem("input"))
      : "";
  });
  const [data, setData] = useState([]);
  const eliminarDiacriticos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

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
    setData(() => {
      console.log(events)
      if (events && events.length > 0) {
        // Check if events is defined and is an array
        const filter = events.filter((event) =>
          event.cities?.some((city) =>
            eliminarDiacriticos(city.name.toLowerCase()).includes(
              eliminarDiacriticos(valueInput.toLowerCase())
            )
          )
        );

        console.log(filter)

        localStorage.setItem("input", JSON.stringify(valueInput.toLowerCase()));

        return filter;
      }

      return [];
    });
  }, [valueInput]);

  useEffect(() => {
    (async () => {
      setRes(await getAll());
    })();
  }, []);

  useEffect(() => {
    useErrorEvent(resData, setResData, setData);
  }, [resData]);

  useEffect(() => {
    useErrorEventPages(res, setRes, setEvents);
  }, [res]);

  useEffect(() => {
  
  }, [events]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/EventsForm");
  };

  const handleInputChange = (event) => {
    setValueInput(event.target.value);
  };

  return (
    <div id="containerEvent">
      <button onClick={handleClick}> ✒️ CREA TU EVENTO </button>
      <br></br>
      <Input
        setValueInput={setValueInput}
        value={valueInput}
        onChange={handleInputChange} // Update state when input changes
      />
      <hr />
      <br></br>

    
      <div className="cards-wrapper">
        {data.length > 0
          ? data.map((item) => {
            console.log("entro data")
            return   <Event
                renderData={item}
                key={item._id}
                setEvents={setData}
                profile={false}
                home={false}
                userAuth={userById}
                eventsPage={true}
                inputValue={valueInput}
              />
})
          : events.length > 0 &&
            events.map((item) => { 
              console.log("entro event")
              return  <Event
                renderData={item}
                key={item._id}
                setEvents={setData}
                profile={false}
                home={false}
                userAuth={userById}
                eventsPage={true}
                inputValue={valueInput}
              />}
            
            )}
      </div>
    </div>
  );
};
