import { useForm } from "react-hook-form";
import "./FormProfile.css";
import { Uploadfile } from "../components";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { Navigate, useParams } from "react-router-dom";
import { cityById, deleteCity } from "../services/city.service";
import { fetchCountries, fetchCities } from "../services/user.service";

export const DeleteCityForm = () => {
  const [ok, setOk] = useState(false);
  const [citiesById, setCitiesById] = useState(null);
  const [resCities, setResCities] = useState(null);
  const { handleSubmit, register, watch } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [cities, setCities] = useState([]);
  const [idCity, setIdCity] = useState(null);
  const [countries, setCountries] = useState([]);
  const [defaultData, setDefaultData] = useState(null);

  const formSubmit = (formData) => {
    Swal.fire({
      title: "¿Estás segur@ de que quieres eliminar la ciudad seleccionada?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(73, 193, 162)",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputFile = document.getElementById("file-upload").files;
        let customFormData = formData;

        if (inputFile.length != 0) {
          customFormData = {
            ...formData,
            image: inputFile[0],
          };
        }

        delete customFormData.city;

        setSend(true);
        setRes(await deleteCity(idCity, customFormData));
        setSend(false);
      }
    });
  };

  useEffect(() => {
    res?.status == 200 && setOk(true);
  }, [res]);

  //------------PARA SELECCIONAR LA CIUDAD-----------

  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    };
    loadCountries();
  }, []);

  const selectedCountry = watch("country");
  useEffect(() => {
    if (selectedCountry) {
      const loadCities = async () => {
        const citiesData = await fetchCities(selectedCountry);
        setCities(citiesData);
      };
      loadCities();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (cityById != null) {
      setDefaultData({
        name: citiesById?.name,
      });
    }
  }, [citiesById]);

  if (ok) {
    return <Navigate to="/country" />;
  }

  return (
    <>
      <div className="containerProfile">
        <div className="form-wrap formProfile">
          <h1>Eliminar ciudad </h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <div className="user_container form-group">
                <select
                  className="input_user"
                  id="country"
                  name="country"
                  {...register("country", { required: true })}
                >
                  <option value="">Selecciona el país</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="country" className="custom-placeholder"></label>
              </div>

              {selectedCountry && (
                <div className="city_container form-group">
                  <select
                    className="input_user"
                    id="city"
                    name="city"
                    {...register("city", { required: true })}
                    onInput={(e) => {
                      setIdCity(e.target.value);
                    }}
                  >
                    <option value="">Selecciona la ciudad</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <Uploadfile />

            <div className="btn_container">
              <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#49c1a2" }}
              >
                ELIMINAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
