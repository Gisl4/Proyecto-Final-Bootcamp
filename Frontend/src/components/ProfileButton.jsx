// import { NavLink } from "react-router-dom";
// import { useAuth } from "../context/authContext";
// import "./ProfileButton.css";
// export const ProfileButton = () => {
//   const { user, login, logout } = useAuth();
//   return (
//     <>
//       {user ? (
//         <>
//           <NavLink to="/ajustes">
//             <span className="material-symbols-outlined">settings</span>
//           </NavLink>
//           <NavLink to="/profile">
//             <span className="material-symbols-outlined">account_circle</span>
//           </NavLink>

//           <NavLink to="/">
//             <span className="material-symbols-outlined" onClick={logout}>
//               logout
//             </span>
//           </NavLink>
//         </>
//       ) : (
//         <>
//           <NavLink to="/login">
//             <span class="material-symbols-outlined">login</span>
//           </NavLink>
//           <NavLink to="/register">
//             <span class="material-symbols-outlined">location_away</span>
//           </NavLink>
//         </>
//       )}
//     </>
//   );
// };

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./ProfileButton.css";

export const ProfileButton = () => {
  const { user, login, logout } = useAuth();
  return (
    <div className="menu-container">
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="menu-icon">
        <span className="material-symbols-outlined">menu</span>
      </label>
      <nav className="menu">
        {user ? (
          <>
            <NavLink to="/ajustes">
              <span className="material-symbols-outlined">settings</span>
            </NavLink>
            <NavLink to="/profile">
              <span className="material-symbols-outlined">account_circle</span>
            </NavLink>
            <NavLink to="/">
              <span className="material-symbols-outlined" onClick={logout}>
                logout
              </span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">
              <span className="material-symbols-outlined">login</span>
            </NavLink>
            <NavLink to="/register">
              <span className="material-symbols-outlined">location_away</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};
