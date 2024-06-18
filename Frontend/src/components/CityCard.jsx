import "./CityCard.css"; // Importa el archivo CSS con los estilos

const CityCard = ({ city, image, description }) => {
  return (
    <div className="city-card">
      <img src={image} alt={city} />
      <h3>{city}</h3>
      <p>{description}</p>
    </div>
  );
};

//!--- FALTARIA AÑADIR TODOS LOS DATOS DE LA CITY QUE INCLUIMOS EN EL MODELO DE CITY (NEKY)

export default CityCard;
