import { Link } from "react-router-dom";
import "./CardCountryHome.css";

export const CardCountryHome = ({ data }) => {
  const { image, name, country} = data;
  const path = `/country/${data.name}/${data._id}`;
  return (
    <div className="cardCountryHome">
      <Link to={path}>
      <h3> {name}</h3>
        <h3>{country}</h3>
        <img src={image} alt={name} />
      </Link>
    </div>
  );
};
