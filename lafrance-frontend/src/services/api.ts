import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8070/lafrance",
});

export default api;
