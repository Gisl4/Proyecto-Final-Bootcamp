import { Outlet, useNavigate } from "react-router-dom";
import "./SuperAdminPage.css";
import { CardCountryHome } from "../components";
// import { CardCitiesGallery } from "../components";
import "./CountryAll.css";
import React, { useState, useEffect } from "react";
import { getAllCountry } from "../services/country.service";
import { useErrorCountry } from "../hooks";

export const SuperAdminPage = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [res, setRes] = useState({});

  useEffect(() => {
    const fetchCountries = async () => {
      const result = await getAllCountry();
      setRes(result);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (res) {
      useErrorCountry(res, setRes, setCountries);
    }
  }, [res]);

  const handleCountry = async (eventId) => {
    try {
      await updateEvent(eventId);
      setUserById((prevUser) => ({
        ...prevUser,
        eventsOwner: prevUser.eventsOwner.filter(
          (event) => event._id !== eventId
        ),
      }));
      console.log("Evento actualizado:", eventId);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  return (
    <div className="superadmin-panel">
      <h1>SuperAdmin Panel</h1>
      <div className="button-container">
        <button onClick={() => navigate(`/superAdminPage/createCountry`)}>
          Crear nuevo país
        </button>
        <button onClick={() => navigate(`/superAdminPage/createCity`)}>
          Crear nueva ciudad
        </button>
        <button onClick={() => navigate(`/superAdminPage/deleteCountry`)}>
          Eliminar país
        </button>
        <button onClick={() => navigate(`/superAdminPage/deleteCity`)}>
          Eliminar ciudad
        </button>
        <button onClick={() => navigate(`/superAdminPage/updateCountry`)}>
          Actualiza el país
        </button>
        <button onClick={() => navigate(`/superAdminPage/updateCity`)}>
          Actualiza la ciudad
        </button>

        <Outlet />
        {/* <button onClick={() => navigate(`/superAdminPage/createCountry`)}>
          Países
          <div id="containerCountryAll">
      {countries.length !== 0 ? (
        countries.map((item) => <CardCountryHome data={item} key={item._id} />)
      ) : (
        <p>Cargando..</p>
      )}
    </div> */}
        {/* </button> */}
      </div>
    </div>
  );
};
