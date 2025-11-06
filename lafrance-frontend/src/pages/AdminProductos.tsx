import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    imagen_url: "",
    descripcion: ""
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/categorias");
      const opciones = res.data.map((cat) => ({
        value: cat.id,
        label: cat.nombre,
      }));
      setCategorias(opciones);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!nuevo.nombre.trim()) nuevosErrores.nombre = "Nombre requerido";
    if (!nuevo.precio) nuevosErrores.precio = "Precio requerido";
    if (!nuevo.categoria) nuevosErrores.categoria = "Selecciona una categoría";
    if (!nuevo.imagen_url.trim()) nuevosErrores.imagen_url = "URL de imagen requerida";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const agregarProducto = async () => {
    if (!validar()) return;

    const payload = {
      nombre: nuevo.nombre,
      precio: parseFloat(nuevo.precio),
      imagen_url: nuevo.imagen_url,
      categoria_id: nuevo.categoria,
      descripcion: nuevo.descripcion
    };

    try {
      await axios.post("http://localhost:8070/api/productos", payload);
      setNuevo({
        nombre: "",
        precio: "",
        categoria: "",
        imagen_url: "",
        descripcion: "",
      });
      setErrores({});
      await cargarProductos();
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  };

  const borrarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/productos/${id}`);
      cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Administrar Productos</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-start">
        <div className="flex flex-col w-48">
          <input
            type="text"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            placeholder="Nombre"
            className="border p-2 rounded"
          />
          {errores.nombre && <span className="text-red-500 text-sm">{errores.nombre}</span>}
        </div>

        <div className="flex flex-col w-32">
          <input
            type="number"
            value={nuevo.precio}
            onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
            placeholder="Precio"
            className="border p-2 rounded"
          />
          {errores.precio && <span className="text-red-500 text-sm">{errores.precio}</span>}
        </div>

        <div className="flex flex-col w-48">
          <Select
            options={categorias}
            value={categorias.find((op) => op.value === nuevo.categoria) || null}
            onChange={(selected) =>
              setNuevo({ ...nuevo, categoria: selected ? selected.value : "" })
            }
            placeholder="Categoría"
            isClearable
            className="text-gray-800"
          />
          {errores.categoria && <span className="text-red-500 text-sm">{errores.categoria}</span>}
        </div>

        <div className="flex flex-col w-64">
          <input
            type="url"
            value={nuevo.imagen_url}
            onChange={(e) => setNuevo({ ...nuevo, imagen_url: e.target.value })}
            placeholder="URL de la imagen"
            className="border p-2 rounded"
          />
          {errores.imagen_url && <span className="text-red-500 text-sm">{errores.imagen_url}</span>}
          {nuevo.imagen_url && (
            <img
              src={nuevo.imagen_url}
              alt="Vista previa"
              className="mt-2 w-32 h-32 object-cover border rounded"
            />
          )}
        </div>

        <div className="flex flex-col w-full max-w-md">
          <textarea
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            placeholder="Descripción del producto"
            className="border p-2 rounded resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={agregarProducto}
          className="bg-blue-600 text-white px-4 py-2 rounded h-fit"
        >
          Agregar
        </button>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Precio</th>
            <th className="border px-4 py-2">Categoría</th>
            <th className="border px-4 py-2">Descripción</th>
            <th className="border px-4 py-2">Imagen</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.nombre}</td>
              <td className="border px-4 py-2">S/ {p.precio}</td>
              <td className="border px-4 py-2">{p.categoria?.nombre}</td>
              <td className="border px-4 py-2">{p.descripcion}</td>
              <td className="border px-4 py-2">
                <img
                  src={p.imagen_url}
                  alt={p.nombre}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => borrarProducto(p.id)}
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