import "./Nav.css";
import { useAuth } from "../context/authContext";
import { NavLink } from "react-router-dom";
export const Nav = () => {
  const { user, login, logout } = useAuth();
  return (
    <>
      {user ? (
        <>
          <NavLink to="/log">
            <button>Home</button>
          </NavLink>
          <NavLink to={`/${user.city.name}/${user.city._id}`}>
            {/* Hay que hacer un link dinámico aqui para que pinte la ciudad del
            usuario según la que corresponda */}
            <button>Mi ciudad</button>
          </NavLink>
          <NavLink to="/country">
            <button>Paises</button>
          </NavLink>
          <NavLink to="/followers">
            <button>Amigos</button>
          </NavLink>
          <NavLink to="/usersAll">
            <button>Usuarios</button>
          </NavLink>
          <NavLink to="/chats">
            <button>Chats</button>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/">
            <button>Home</button>
          </NavLink>
          <NavLink to="/country">
            <button>Paises</button>
          </NavLink>
          <NavLink to="/events">
            <button>Eventos</button>
          </NavLink>
        </>
      )}
    </>
  );
};
