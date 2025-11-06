import React, { useEffect, useState } from "react";
import {
  obtenerCategorias,
  crearCategoria,
  eliminarCategoria,
} from "../services/categoriasService";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const res = await obtenerCategorias();
    setCategorias(res.data);
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria.trim()) return alert("Ingrese un nombre válido");
    await crearCategoria({ nombre: nuevaCategoria });
    setNuevaCategoria("");
    cargarCategorias();
  };

  const borrarCategoria = async (id) => {
    await eliminarCategoria(id);
    cargarCategorias();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Administrar Categorías</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
          placeholder="Nombre de la categoría"
          className="border p-2 rounded w-64"
        />
        <button onClick={agregarCategoria} className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td className="border px-4 py-2">{cat.id}</td>
              <td className="border px-4 py-2">{cat.nombre}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => borrarCategoria(cat.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
