import "./FigureUser.css";

export const FigureUser = ({ user }) => {
  console.log("user", user);

  // Convertir la edad a un objeto Date
  const fechaNacimiento = new Date(user.age);

  // Obtener la cadena de fecha corta formateada
  const edadFormateada = fechaNacimiento.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <figure className="dataProfile">
      <img src={user.image} alt="user image" className="imageUser" />
      <h4>Name: {user.user}</h4>
      <h4>Email: {user.email}</h4>
      <h4>Gender: {user.gender}</h4>
      <h4>Edad: {edadFormateada}</h4>
      <h4 className="countryUser">País: {user?.country?.name}</h4>
      <h4 className="cityUser">Ciudad: {user?.city?.name}</h4>
    </figure>
  );
};
