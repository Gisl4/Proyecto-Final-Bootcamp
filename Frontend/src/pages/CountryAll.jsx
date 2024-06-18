import { CardCountryHome } from "../components";
// import { CardCitiesGallery } from "../components";
import "./CountryAll.css";
import React, { useState, useEffect } from "react";
import { countryById, getAllCountry } from "../services/country.service";
import { useErrorCountry } from "../hooks";
import { Outlet, useParams } from "react-router-dom";

export const CountryAll = () => {
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

  return (
    <div id="containerCountryAll">
      {countries.length !== 0 ? (
        countries.map((item) => <CardCountryHome data={item} key={item._id} />)
      ) : (
        <p>Cargando..</p>
      )}
    </div>
  );
};
