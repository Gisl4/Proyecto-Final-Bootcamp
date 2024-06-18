import { useState, useEffect } from "react";
import "./Homepages.css";
import { useErrorCountry } from "../hooks/useErrorCountry";
import { Link, useNavigate } from "react-router-dom";
import { getAllCountry } from "../services/country.service";
import { CardCountryHome } from "../components";

export const Homepages = () => {
  const [country, setCountries] = useState([]);
  const [res, setRes] = useState({});

  useEffect(() => {
    (async () => {
      setRes(await getAllCountry());
    })();
  }, []);

  useEffect(() => {
    useErrorCountry(res, setRes, setCountries);
    console.log(country);
  }, [res]);

  // useEffect(() => {
  //   console.log(country);
  // }, [country]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Country");
  };

  return (
    <main>
      <div className="homePage">
        <h3 className="TituloViajeros">Traviesos Extranjeros 🌎</h3>
      
        <p className="parrafo">Échale un ojo a nuestra lista de países más destacados. En ellos podrás conocer
          un pedacito de cada uno ya que se reflejan tradiciones, comidas típicas y una breve descripción. Y, lo más 
          importante de todo, ¡¡Podrás conocer qué se cuece en cada una de sus ciudades!!</p>        
          
          <p className="parrafo">En cada uno de ellos hay una variedad de ciudades en las que podrás encontrar los eventos disponibles y más 
          punteros. ¡¡Estaremos encantados de que compartas tus experiencias con nosotros!!</p>

          <p className="parrafo">¡Sigue a los organizadores y eventos que más encajen con tu filosofía traviesa! Seguro que haces muy buenas 
          migas en estos increíbles encuentros a lo largo de tu recorrido a través del globo.</p>

        <h2 className="tituloPaises">Países</h2>
          <p className="parrafo">
          ¡Descubre el país que más llama a tu curiosidad traviesa! Te dejamos maquinando un poquito antes de logarte ... 😜
        </p>
          
         
      

        <div id="containerHome">
          {
            /**meter los botones  */
            country.length != 0 ? (
              country.map((item) => (
                <CardCountryHome data={item} key={item._id} />
              ))
            ) : (
              <p>Cargando...</p>
            )
          }
        </div>

        <h2 className="EventosHome">
          ¿Quieres ver lo que se cuece en tu nueva ciudad?
        </h2>
        <p className="parrafo">¡Ojo al dato! Aquí están los mejores eventos disponibles ⬇️⬇️</p>
        <button>
          <Link to="/events">Eventos</Link>
        </button>
      </div>
    </main>
  );
};

{
  /* <div className="card">
  <button onClick={handleClick}>
    <img
      src="https://res.cloudinary.com/dqiudrruv/image/upload/v1715956882/traviesosExtrajeros/t1gwnw8ztndp9o8ovlqi.jpg"
      alt="Portugal"
    />
  </button>
</div>; */
}
