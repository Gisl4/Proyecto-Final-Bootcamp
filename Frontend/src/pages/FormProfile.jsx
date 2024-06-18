import { useForm } from "react-hook-form";
import { NavProfile } from "../components";
import "./FormProfile.css";
import { FigureUser, Uploadfile } from "../components";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { updateUser } from "../services/user.service";
import { useUpdateError } from "../hooks";
import { fetchCountries, fetchCities } from "../services/user.service";

export const FormProfile = () => {
  const { user, setUser, logout } = useAuth();
  const { handleSubmit, register, watch } = useForm();
  const [res, setRes] = useState({});
  const [send, setSend] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const defaultData = {
    name: user?.user,
  };

  const formSubmit = (formData) => {
    Swal.fire({
      title: "Are you sure you want to change your data profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(255, 177, 205)",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputFile = document.getElementById("file-upload").files;

        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", formData.name);
        formDataToSubmit.append("country", formData.country);
        formDataToSubmit.append("city", formData.city);

        if (inputFile.length != 0) {
          const custonFormData = {
            ...formData,
            image: inputFile[0],
          };

          setSend(true);
          setRes(await updateUser(custonFormData));
          setSend(false);
        } else {
          const custonFormData = {
            ...formData,
            image: inputFile[0],
          };
          setSend(true);
          setRes(await updateUser(custonFormData));
          setSend(false);
        }
      }
    });
  };

  useEffect(() => {
    console.log(res);
    useUpdateError(res, setRes, setUser, logout);
  }, [res]);

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

  return (
    <>
      <NavProfile />
      <div className="containerProfile">
        <div className="containerDataNoChange">
          <FigureUser user={user} />
        </div>
        <div className="form-wrap formProfile">
          <h1>Change your data profile ♻</h1>
          <p>Please, enter your new data profile</p>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="user_container form-group">
              <input
                className="input_user"
                type="text"
                id="name"
                name="name"
                autoComplete="false"
                defaultValue={defaultData?.name}
                {...register("name")}
              />
              <label htmlFor="custom-input" className="custom-placeholder">
                Username
              </label>
            </div>

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

            <Uploadfile />

            <div className="btn_container">
              <button
                className="btn"
                type="submit"
                disabled={send}
                style={{ background: send ? "#49c1a388" : "#FEB0CD" }}
              >
                CHANGE DATA PROFILE
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
