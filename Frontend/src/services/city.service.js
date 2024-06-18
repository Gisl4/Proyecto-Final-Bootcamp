import { updateToken } from "../utils";
import { extraConfig } from "./serviceApi.config";

// ----------------createCity ------------------------
//! SUPER ADMIN
export const createCity = async (formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.post(`/city/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------get By Id ------------------------

export const cityById = async (idCity) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/city/finById/${idCity}`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------getAll------------------------

export const getAllCity = async () => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`city`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------toggleEvent ------------------------

export const toggleEvent = async (idCity, idEvent, formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(
    `/city/cities/${idCity}/events/${idEvent}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${updateToken()}`,
      },
    }
  )
    .then((res) => res)
    .catch((error) => error);
};

// ----------------toggleCountry ------------------------

export const toggleCountry = async (idCity, idCountry) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/city/cities/${idCity}/country/${idCountry}`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------updateCity ------------------------

export const updateCity = async (idCity, formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/city/update/${idCity}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------deleteCity ------------------------
//! SUPER ADMIN
export const deleteCity = async (idCity) => {
  const APITraviesos = extraConfig();
  return APITraviesos.delete(`/city/${idCity}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};
