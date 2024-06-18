import Swal from "sweetalert2/dist/sweetalert2.all.js";
import "./UpdateUserProfile.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateError } from "../hooks";
import { FigureUser, Uploadfile } from "../components";
import { byId, updateUser } from "../services/user.service";
import { useAuth } from "../context/authContext";
import { fetchCountries, fetchCities } from "../services/user.service";

export const UpdateProfile = () => {
  //! --------------- estados

  const [resEdit, setResEdit] = useState({});
  const [sendEdit, setSendEdit] = useState(false);
  // const [data, setData] = useState(null);

  //! --------------- hooks

  const { user, setUser, logout } = useAuth();
  const { handleSubmit, register, watch } = useForm();
  const [countries, setCountries] = useState(user?.country);
  const [cities, setCities] = useState(user?.city);

  const defaultData = {
    name: user?.user,
  };

  // const fetchData = async () => {
  //   const dataForState = await byId(user?._id);
  //   setData(dataForState);
  //   setIsDataReady(true);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const formSubmit = async (formData) => {
    Swal.fire({
      title: "Save changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(255, 177, 205)",
      cancelButtonColor: "#DB3236",
      cancelButtonText: "Cancel",
      confirmButtonText: "Save",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputFile = document.getElementById("file-upload").files;
        if (inputFile.length != 0) {
          const customFormData = {
            ...formData,
            image: inputFile[0],
          };

          setSendEdit(true);
          setResEdit(await updateUser(customFormData));
          setSendEdit(false);
        } else {
          const customFormData = {
            ...formData,
            image: user?.image,
          };
          setSendEdit(true);
          setResEdit(await updateUser(customFormData));
          setSendEdit(false);
        }
      }
    });
  };
  //! ----- useEffect

  useEffect(() => {
    useUpdateError(resEdit, setResEdit, setUser, logout);
  }, [resEdit]);

  //! 5) cargar países al montar el componente
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    };
    loadCountries();
    console.log(loadCountries);
  }, []);

  //! 6) cargar ciudades cuando se seleccione un país
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
      <div className="containerProfile">
        <div className="containerDataNoChange">
          <FigureUser user={user} />
        </div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <h1>Edit your information </h1>
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
                country=""
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
          <div>
            <Uploadfile />
          </div>
          //! comentado para la descripción del usuario por si queremos meterlo
          {/* <LabelAndInput inputHeight={"60px"}>
                Brief description of you
                <textarea
                  type="text"
                  defaultValue={data?.data?.description}
                  name="description"
                  autoComplete="false"
                  {...register("description")}
                />
              </LabelAndInput> */}
          <div className="btn_container">
            <button
              className="btn"
              type="submit"
              disabled={send}
              style={{ background: send ? "#49c1a388" : "#FEB0CD" }}
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      </div>
    </>
    //   )}
    // </>
  );
};
