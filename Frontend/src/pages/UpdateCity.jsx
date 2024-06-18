import { useForm } from "react-hook-form";
import "./FormProfile.css";
import { Uploadfile } from "../components";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
// import { useErrorCountryDetalle} from "../hooks";
import { Navigate, useParams } from "react-router-dom";
import { cityById, updateCity } from "../services/city.service";
import { fetchCountries, fetchCities } from "../services/user.service";

export const UpdateCity = () => {
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
    console.log("formData", formData);
    Swal.fire({
      title: "¿Estás segur@ de que quieres actualizar los datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(255, 177, 205)",
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
        setRes(await updateCity(idCity, customFormData));
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
        description: citiesById?.description,
        tipicalFood: citiesById?.tipicalFood,
        traditions: citiesById?.traditions,
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
          <h1>Actualiza la ciudad ♻</h1>
          <p>Introduce los nuevos datos de la ciudad</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <div className="user_container form-group">
                <select
                  className="input_user"
                  id="country"
                  name="country"
                  {...register("country", { required: true })}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="country" className="custom-placeholder">
                  Country
                </label>
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
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="city" className="custom-placeholder">
                    City
                  </label>
                </div>
              )}
              <label htmlFor="custom-input" className="custom-placeholder">
                Nombre de la ciudad
              </label>
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                defaultValue={defaultData?.name}
                {...register("name")}
              />
            </div>

            <div className="description_container form-group">
              <label htmlFor="description" className="custom-placeholder">
                Descripción
              </label>
              <input
                className="input_user"
                type="text"
                id="description"
                name="description"
                defaultValue={defaultData?.description}
                {...register("description")}
              />
            </div>

            <Uploadfile />

            <div className="btn_container">
              <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#FEB0CD" }}
              >
                ACTUALIZA LOS DATOS
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
