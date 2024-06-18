import { updateToken } from "../utils";
import { extraConfig } from "./serviceApi.config";
import axios from "axios";

// ----------------createEvent ------------------------

export const createEvent = async (formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.post(`/event/createEvent`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------get By Id ------------------------

export const eventById = async (idEvent) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/event/finById/${idEvent}`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------getAll------------------------

export const getAll = async () => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/event/getAll`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------getByName------------------------

export const getByName = async (name) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/event/get/name/${name}`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------getByCategory------------------------

export const getByCategory = async (category) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/event/get/category/${category}`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------getByCity------------------------

export const getByCity = async (city) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/event/get/city/${city}`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------toggleCity ------------------------

export const toggleCity = async (idCity, idEvent) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/event/cities/${idCity}/events/${idEvent}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------updateEvent ------------------------

export const updateEvent = async (idEvent, formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/event/${idEvent}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------deleteEvent ------------------------

export const deleteEvent = async (id) => {
  const APITraviesos = extraConfig();
  return APITraviesos.delete(`/event/${id}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------toggleLikeEvent ------------------------

export const toggleLikeEvent = async (idEvent) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/event/like/${idEvent}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------toggleFollowEvent ------------------------

export const toggleFollowEvent = async (idEvent) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/event/follow/${idEvent}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------sortByDate------------------------

export const sortByDate = async () => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/event/sortByDate`)
    .then((res) => res)
    .catch((error) => error);
};
