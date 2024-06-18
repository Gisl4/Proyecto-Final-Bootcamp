// import axios from "axios";
// import { updateToken } from "../utils";

// const apiHeaders = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
//   "Access-Control-Allow-Origin": "*",
//   Authorization: `Bearer ${updateToken()}`,
// };

// export const APITraviesos = axios.create({
//   baseURL: "http://localhost:8081/api/v1",
//   headers: apiHeaders,
//   timeout: 60000,
// });

import axios from 'axios';
import { updateToken } from '../utils';

export const extraConfig = () => {
return (axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
      Accept: "application/json",
      "Content-Type":"application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization:`Bearer ${updateToken()}`
  },
  timeout: 60000,
}))
}