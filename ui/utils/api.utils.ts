import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const apiServer = axios.create({
  baseURL: `${process.env.NEXT_SERVER_URI}/api`,
  withCredentials: true,
});
