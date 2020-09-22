import axios from "axios";
import config from "../utils/config";

const api = axios.create({
  baseURL: `${config.BASE_URL}/api/v1`,
});

export default api;
