import { Link } from "react-router-dom";
import "./Eventos.css";

export const Eventos = ({ name, src, date, item }) => {
  console.log("id", item);
  return (
    <Link to={`/events/${item._id}`}>
      <figure>
        <img className= "cardEventos"src={src} alt={name} width={350} height={200} />
        <p>Evento: {name}</p>
        <p>Fecha: {new Date(date).toLocaleString()}</p>
      </figure>
    </Link>
  );
};
