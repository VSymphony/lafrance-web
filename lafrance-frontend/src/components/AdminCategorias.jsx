import { useState, useEffect } from "react";

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  // Cargar categorías al iniciar
  useEffect(() => {
    fetch("http://localhost:8070/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  // Crear o actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();

    const metodo = editando ? "PUT" : "POST";
    const url = editando
      ? `http://localhost:8070/api/categorias/${editando}`
      : "http://localhost:8070/api/categorias";

    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });

    setNombre("");
    setEditando(null);
    actualizarLista();
  };

  // Eliminar categoría
  const eliminarCategoria = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await fetch(`http://localhost:8070/api/categorias/${id}`, {
      method: "DELETE",
    });
    actualizarLista();
  };

  // Recargar lista
  const actualizarLista = () => {
    fetch("http://localhost:8070/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  };

  const editarCategoria = (categoria) => {
    setNombre(categoria.nombre);
    setEditando(categoria.id);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Categorías</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de categoría"
          className="border p-2 rounded w-64"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editando ? "Actualizar" : "Agregar"}
        </button>
        {editando && (
          <button
            type="button"
            onClick={() => {
              setEditando(null);
              setNombre("");
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id} className="text-center">
              <td className="border p-2">{cat.id}</td>
              <td className="border p-2">{cat.nombre}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => editarCategoria(cat)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCategoria(cat.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
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

export default AdminCategorias;
