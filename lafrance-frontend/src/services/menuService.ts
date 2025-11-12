import axios from "axios";

const API_URL = "http://localhost:8070/api/menu";

export const obtenerMenu = () => axios.get(API_URL);
