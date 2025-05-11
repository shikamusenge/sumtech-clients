import axios from "axios";
export const BASE_URL = "http://localhost:5000";
export const SERVER = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // This is crucial for sending/receiving cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
  });
  

