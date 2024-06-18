import { useForm } from "react-hook-form";
import "./FormProfile.css";
import { Uploadfile } from "../components";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useErrorCountryDetalle } from "../hooks";
import { Navigate, useParams } from "react-router-dom";
import { countryById, update } from "../services/country.service";
import { fetchCountries } from "../services/user.service";
export const UpdateCountry = () => {
  const [ok, setOk] = useState(false);
  const [countrieById, setCountrieById] = useState(null);
  const [resCountrie, setResCountrie] = useState(null);
  const { handleSubmit, register } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [countries, setCountries] = useState([]);
  const [idCountry, setIdCountry] = useState(null);

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

        delete customFormData.country;

        setSend(true);
        setRes(await update(idCountry, customFormData));
        setSend(false);
      }
    });
  };

  useEffect(() => {
    res?.status == 200 && setOk(true);
  }, [res]);

  //---------PARA SELECCIONAR EL PAÍS-------
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const fetchCounty = async () => {
      const response = await countryById(idCountry);
      response?.status == 200 && setCountrieById(response.data);
      setResCountrie(response);
    };

    idCountry != null && fetchCounty();
  }, [idCountry]);

  useEffect(() => {
    if (countryById != null) {
      setDefaultData({
        name: countrieById?.name,
        description: countrieById?.description,
        tipicalFood: countrieById?.tipicalFood,
        traditions: countrieById?.traditions,
      });
    }
  }, [countrieById]);

  if (ok) {
    return <Navigate to="/country" />;
  }

  return (
    <>
      <div className="containerProfile">
        <div className="form-wrap formProfile">
          <h1>Actualiza tu País ♻</h1>
          <p>Introduce los nuevos datos del país</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <div className="user_container form-group">
                <select
                  className="input_user"
                  id="country"
                  name="country"
                  {...register("country", { required: true })}
                  onInput={(e) => {
                    setIdCountry(e.target.value);
                  }}
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
              <label htmlFor="custom-input" className="custom-placeholder">
                Nombre del país
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
            <div className="description_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Comida típica
              </label>
              <input
                className="input_user"
                type="text"
                id="tipicalFood"
                name="tipicalFood"
                autoComplete="false"
                defaultValue={defaultData?.tipicalFood}
                {...register("tipicalFood")}
              />
            </div>
            <div className="description_container form-group">
              <label htmlFor="custom-input" className="custom-placeholder">
                Tradiciones
              </label>
              <input
                className="input_user"
                type="text"
                id="traditions"
                name="traditions"
                autoComplete="false"
                defaultValue={defaultData?.traditions}
                {...register("traditions")}
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
