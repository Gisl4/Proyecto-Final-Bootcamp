import "./FigureUser.css";

export const FigureEvent = ({ events }) => {
  // console.log("events", events);

  // Convertir la edad a un objeto Date
  const fechaCreacion = new Date(events.date);

  // Obtener la cadena de fecha corta formateada
  const fechaFormateada = fechaCreacion.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <figure className="dataProfile">
      {/* <img src={events.image} alt="user image" className="imageUser" /> */}
      {/* <h4>Nombre: {events.name}</h4> */}
      {/* <h4>Email: {user.email}</h4> /}
      {/ <h4>Gender: {user.gender}</h4> */}
      {/* <h4>Fecha: {fechaFormateada}</h4> */}
      {/* <h4 className="countryUser">País: {events?.country?.name}</h4> */}
      {/* <h4 className="cityUser">Ciudad: {events?.city?.name}</h4> */}
    </figure>
  );
};