import axios from "axios";

const API_URL = "http://localhost:8080/api/menu";

export const obtenerMenu = () => axios.get(API_URL);
