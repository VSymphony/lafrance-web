import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

export default function FormProductos({ onProductoAgregado }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [imagenUrl, setImagenUrl] = useState("");
  const [disponible, setDisponible] = useState(true);

  // 🔹 Cargar las categorías al montar el componente
  useEffect(() => {
    axios
      .get("http://localhost:8070/api/categorias")
      .then((res) => {
        // Mapear las categorías al formato que React Select necesita
        const opciones = res.data.map((cat) => ({
          value: cat.id,
          label: cat.nombre,
        }));
        setCategorias(opciones);
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!categoria) {
    alert("Por favor selecciona una categoría");
    return;
  }

  const nuevoProducto = {
    nombre,
    descripcion,
    precio,
    imagen_url: imagenUrl,
    disponible,
    categoria_id: categoria.value, // directamente el ID
  };

  try {
    await axios.post("http://localhost:8070/api/productos", nuevoProducto);
    alert("Producto agregado correctamente");
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImagenUrl("");       // ✅ limpiar campo imagen
    setDisponible(true);    // ✅ resetear disponibilidad
    setCategoria(null);
    onProductoAgregado();   // 🔄 Actualiza la tabla
  } catch (err) {
    console.error("Error al guardar producto:", err);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Agregar Producto
      </h2>

      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Imagen (URL):</label>
        <input
          type="url"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Precio:</label>
        <input
          type="number"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* 🔹 Combobox React Select */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Categoría:</label>
        <Select
          options={categorias}
          value={categoria}
          onChange={setCategoria}
          placeholder="Selecciona una categoría"
          isSearchable
          className="text-black"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
          className="mr-2"
        />
        <label className="text-gray-600">Disponible</label>
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Guardar Producto
      </button>
    </form>
  );
}
