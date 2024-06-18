import { Link } from "react-router-dom";
import "./CardCitiesGallery.css";

const CardCitiesGallery = ({ data }) => {
  const { image, name, city } = data;
  const path = `/${data.name}/${data._id}`;
  return (
    <div className="cardCityGallery">
      <Link to={path}>
        <h3> {name}</h3>
        <h3>{city}</h3>
        <img src={image} alt={name} />
      </Link>
    </div>
  );
};

export default CardCitiesGallery;
