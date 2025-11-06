import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const AdminProductos = ({ onAgregarProducto }) => {
  const [categorias, setCategorias] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
  nombre: "",
  descripcion: "",
  precio: "",
  imagen_url: "",
  disponible: true,
  categoriaId: "",
});


  useEffect(() => {
    // 🔹 Cargar categorías desde el backend
    axios.get("http://localhost:8070/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
        setNuevoProducto((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

  const manejarCambioCategoria = (selectedOption) => {
    setNuevoProducto({
      ...nuevoProducto,
      categoriaId: selectedOption ? selectedOption.value : "",
    });
  };

  const manejarSubmit = (e) => {
  e.preventDefault();

  const payload = {
    ...nuevoProducto,
    categoria_id: nuevoProducto.categoriaId,
  };
  delete payload.categoriaId;

  console.log("Enviando producto:", payload);

  axios.post("http://localhost:8070/api/productos", payload)
    .then((res) => {
      onAgregarProducto(res.data);
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen_url: "",
        disponible: true,
        categoriaId: "",
      });
    })
    .catch((err) => console.error("Error al guardar producto:", err));
};

  return (
    <form onSubmit={manejarSubmit} className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-center">Agregar Producto</h2>

      <input
        type="text"
        name="nombre"
        value={nuevoProducto.nombre}
        onChange={manejarCambio}
        placeholder="Nombre del producto"
        className="border border-gray-300 p-2 rounded w-full"
        required
      />

      <textarea
        name="descripcion"
        value={nuevoProducto.descripcion}
        onChange={manejarCambio}
        placeholder="Descripción"
        className="border border-gray-300 p-2 rounded w-full"
        required
      />

      <input
        type="number"
        name="precio"
        value={nuevoProducto.precio}
        onChange={manejarCambio}
        placeholder="Precio"
        className="border border-gray-300 p-2 rounded w-full"
        required
      />

      <input
        type="url"
        name="imagen_url"
        value={nuevoProducto.imagen_url}
        onChange={manejarCambio}
        placeholder="URL de la imagen"
        className="border border-gray-300 p-2 rounded w-full"
        required
        />

      {/* 🔽 Combobox moderno con React Select */}
      <div>
        <label className="block mb-1 font-medium">Categoría</label>
        <Select
        options={categorias.map((cat) => ({
            value: cat.id,
            label: cat.nombre,
        }))}
        value={
            categorias
            .map((cat) => ({ value: cat.id, label: cat.nombre }))
            .find((op) => op.value === nuevoProducto.categoriaId) || null
        }
        onChange={manejarCambioCategoria}
        placeholder="Selecciona una categoría..."
        isClearable
        className="text-gray-800"
        />
      </div>

      <div className="flex flex-col w-full max-w-md">
        <textarea
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            placeholder="Descripción del producto"
            className="border p-2 rounded resize-none"
            rows={3}
        />
        {errores.descripcion && (
            <span className="text-red-500 text-sm">{errores.descripcion}</span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
            type="checkbox"
            checked={nuevoProducto.disponible}
            onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, disponible: e.target.checked })
            }
        />
        <label className="text-gray-700">Disponible</label>
        </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-lg"
      >
        Guardar Producto
      </button>
    </form>
  );
};

export default AdminProductos;
