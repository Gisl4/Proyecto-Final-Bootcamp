import { useState } from "react";
import { useEffect } from "react";

const Logout = ({ onLogout }) => {
  //! Falta hacer la llamada al back para cerrar la sesión del usuario voy hacer una prueba con fetch
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Realizar una llamada al backend para obtener los usuarios
    fetch("/api/users") //!----- UserRoutes.get("/", getAll); Esa es la ruta del getALL del back, cual tengo que poner?
      .then((response) => response.json())
      .then((data) => {
        // Actualizar el estado de los usuarios con los datos recibidos del backend
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      });
  }, []);

  const handleLogout = () => {
    //! Hay que realizar la llamada al backen para cerrar sesión DUDA Aquí podrías realizar alguna llamada al backend para cerrar la sesión del usuario
    onLogout();
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
};
export default Logout;
