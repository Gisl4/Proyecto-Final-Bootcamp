import { updateToken } from "../utils";
import { extraConfig } from "./serviceApi.config";
import axios from 'axios';


// ----------------createExperience ------------------------

export const createExperience = async (formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.post(`/experiences/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------getAll------------------------

export const getAllExperiences = async () => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/experiences/getAll`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------byId------------------------

export const byId = async (idExperience) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/experiences/finById/${idExperience}`)
    .then((res) => res)
    .catch((error) => error);
};

// ----------------toggleLikeExperience ------------------------

export const toggleLikeExperience = async (idExperience) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/experiences/like/${idExperience}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------toggleEvent ------------------------

export const toggleEvent = async (idExperience, idEvent) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(
    `/experiences/events/${idEvent}/experience/${idExperience}`,
    {
      headers: {
        Authorization: `Bearer ${updateToken()}`,
      },
    }
  )
    .then((res) => res)
    .catch((error) => error);
};

// ----------------update ------------------------

export const update = async (idExperience, formData) => {
  const APITraviesos = extraConfig();
  return APITraviesos.patch(`/experiences/update/${idExperience}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------deleteExperience ------------------------

export const deleteExperience = async (idExperience) => {
  const APITraviesos = extraConfig();
  return APITraviesos.delete(`/experiences/${idExperience}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};



