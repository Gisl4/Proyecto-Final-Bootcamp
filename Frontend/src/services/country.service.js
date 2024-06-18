import { updateToken } from "../utils";
import { extraConfig } from "./serviceApi.config";

// ----------------createCountry ------------------------
//! SUPER ADMIN
export const createCountry = async (formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.post(`/country/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------countryById ------------------------

export const countryById = async (idCountry) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/country/finById/${idCountry}`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------getAll------------------------

export const getAllCountry = async () => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/country/getAll`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------update ------------------------

export const update = async (idCountry, formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/country/update/${idCountry}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------deleteCountry ------------------------
//! SUPER ADMIN
export const deleteCountry = async (idCountry) => {
  const APITraviesos = extraConfig();
  return APITraviesos.delete(`/country/${idCountry}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};
