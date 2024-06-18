import "./FigureUser.css";

export const FigureExperience = ({ experience }) => {
  console.log("experience", experience);

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
      <img src={experience.image} alt="user image" className="imageUser" />
      <h4>Name: {experience.name}</h4>
      {/* <h4>Email: {user.email}</h4> /}
      {/ <h4>Gender: {user.gender}</h4> */}
      <h4>Fecha: {fechaFormateada}</h4>
      <h4>Evento: {events.name}</h4>
      <h4 className="countryUser">País: {user?.country?.name}</h4>
      <h4 className="cityUser">Ciudad: {user?.city?.name}</h4>
    </figure>
  );
};