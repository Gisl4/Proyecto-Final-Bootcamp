import "./Country.css";
import React, { useState, useEffect } from "react";
import { countryById } from "../services/country.service";
import { useErrorCountry } from "../hooks";
import { Outlet, useParams } from "react-router-dom";
import { Loader, CountryCard } from "../components";
import CardCitiesGallery from "../components/CardCitiesGallery";

export const Country = () => {
  const [country, setCountry] = useState(null);
  const { idCountry } = useParams();
  const [res, setRes] = useState({});

  useEffect(() => {
    (async () => {
      setRes(await countryById(idCountry));
    })();
  }, []);

  useEffect(() => {
    useErrorCountry(res, setRes, setCountry);

    console.log(res);
  }, [res]);

  return (
    <div id="containerCountry">
      <h1>{country != null && country.name}</h1>
      <p className="parrafo">{country != null && country.description}</p>
      <h4>Principales tradiciones:</h4>
      <p className="parrafo"> {country != null && country.traditions}</p>
      <h4>Comida típica:</h4> <p className="parrafo"> {country != null && country.tipicalFood}</p>
      <div className="TarjetasCiudades">
        {country != null &&
          country.cities.map((item) => (
            <CardCitiesGallery data={item} key={JSON.stringify(item)} />
          ))}
      </div>
    </div>
  );
};
