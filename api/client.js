import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.11:5098",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});