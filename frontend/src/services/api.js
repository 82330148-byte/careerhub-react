import axios from "axios";

export const api = axios.create({
  baseURL: "https://careerhub-react-production.up.railway.app",
});

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Request failed.";
}
