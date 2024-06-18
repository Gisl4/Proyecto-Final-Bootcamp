import "./Header.css";
import { Nav } from "./Nav";

import { ProfileButton } from "./ProfileButton";

export const Header = () => {
  return (
    <header>
      <img
        className="logoViajeros"
        src="https://res.cloudinary.com/dqiudrruv/image/upload/v1716637986/Countries/_0f0d4172-812b-43b9-aa97-969995a9a516_pszccm.jpg"
        alt="logopagina"
      />
      <Nav />
      <div className="Botonesuser">
        <ProfileButton />
      </div>
    </header>
  );
};
