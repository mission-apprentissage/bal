import axios from "axios";

import { publicConfig } from "../config.public";

export const api = axios.create({
  baseURL: publicConfig.apiEndpoint,
  withCredentials: true,
});
