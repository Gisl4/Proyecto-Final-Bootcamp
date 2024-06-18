import { updateToken } from "../utils";
import { extraConfig } from "./serviceApi.config";

// ----------------create empty chat ------------------------

export const createEmptyChat = async (idRecipient) => {
  const APITraviesos = extraConfig();

  return APITraviesos.post(`/chat/${idRecipient}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------get All ------------------------

export const getAllChats = async () => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/chat/get/all`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------get By Id ------------------------

export const getChatById = async (id) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/chat/get/id/${id}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------get By User ------------------------

export const getChatByUser = async (id) => {
  const APITraviesos = extraConfig();
  return APITraviesos.get(`/chat/get/${id}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};

// ----------------Delete chat ------------------------

export const deleteChat = async (id) => {
  const APITraviesos = extraConfig();
  return APITraviesos.delete(`/chat/${id}`, {
    headers: {
      Authorization: `Bearer ${updateToken()}`,
    },
  })
    .then((res) => res)
    .catch((error) => error);
};
