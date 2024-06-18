import { Link } from "react-router-dom";
// import { cityById } from "../services/city.service";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CountryCard.css";

export const CountryCard = ({ country }) => {
  const [expanded, setExpanded] = useState(false); // Estado para ampliar la tarjeta del país
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div
      className={`country-card ${expanded ? "expanded" : ""}`}
      onClick={handleExpandClick}
    >
      <h1>{country.name}</h1>
      <img src={country.image} alt={country.name} />

      {/* <p> {country.description}</p>
      <p>
        <h4>Comida típica:</h4> {country.tipicalFood}
      </p>
      <p>
        <h4>Tradiciones de interés:</h4> {country.traditions}{" "}
      </p>
      {expanded && (
        <div className="city-list">
          <h4>Principales ciudades</h4>
          {country.cities.map((city, index) => (
            <li key={index}>
              <Link to={city.path}>{cityById.name}</Link>
            </li>
          ))}
        </div>
      )} */}
    </div>
  ); //! CÓDIGO PARA MOSTRAR COMIDA TÍPICA,TRADICIONES, CIUDADES? Y DESCRIPCIÓN
}; //! FALTA LA NAVEGACIÖN DESDE LAS IMÁGENES

//!--- FALTARIA AÑADIR TODOS LOS DATOS DE LA COUNTRY QUE INCLUIMOS EN EL MODELO DE COUNTRY (NEKY)

// const CountryCard = ({ country }) => {
//   const [cities, setCities] = useState([]);
//   const [showCities, setShowCities] = useState(false);

//   const toggleCities = async () => {
//     if (!showCities) {
//       try {
//         // Realizar una solicitud HTTP GET para obtener las ciudades del país
//         const response = await axios.get(
//           `http://localhost:8081/api/v1/countries/${country._id}/cities`
//         );
//         if (response.status === 200) {
//           setCities(response.data); // Establecer las ciudades en el estado
//           setShowCities(true); // Mostrar las ciudades
//         }
//       } catch (error) {
//         console.error("Error fetching cities:", error);
//         // Manejar el error adecuadamente
//       }
//     } else {
//       setShowCities(false); // Ocultar las ciudades
//     }
//   };

//   return (
//     <div
//       className="country-card"
//       onClick={toggleCities}
//       style={{ backgroundImage: `url(${country.image})` }}
//     >
//       <h1>{country.name}</h1>
//       {showCities && (
//         <ul>
//           {cities.map((city, index) => (
//             <li key={index}>{city.name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CountryCard;
