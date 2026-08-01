import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
});

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Request failed.";
}
