import axios from "axios";

const API_URL = "http://localhost:8070/api/categorias";

export const obtenerCategorias = () => axios.get(API_URL);
export const crearCategoria = (categoria) => axios.post(API_URL, categoria);
export const eliminarCategoria = (id) => axios.delete(`${API_URL}/${id}`);
export const actualizarCategoria = (id, categoria) => axios.put(`${API_URL}/${id}`, categoria);
