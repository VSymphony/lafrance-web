import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  obtenerCategorias,
  crearCategoria,
  eliminarCategoria,
  actualizarCategoria,
} from "../services/categoriasService";
import MainLayout from "../layouts/MainLayout";

Modal.setAppElement("#root");

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await obtenerCategorias();
      setCategorias(res.data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const agregarCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      setError("⚠️ Ingrese un nombre válido");
      return;
    }
    try {
      await crearCategoria({ nombre: nuevaCategoria });
      setNuevaCategoria("");
      setError("");
      cargarCategorias();
    } catch (err) {
      console.error("Error al crear categoría:", err);
    }
  };

  const borrarCategoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await eliminarCategoria(id);
      cargarCategorias();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
    }
  };

  const abrirModal = (cat) => {
    setCategoriaEditada({ ...cat });
    setModalAbierto(true);
    setError("");
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaEditada(null);
    setError("");
  };

  const guardarCambios = async () => {
    if (!categoriaEditada.nombre.trim()) {
      setError("⚠️ El nombre no puede estar vacío");
      return;
    }
    try {
      await actualizarCategoria(categoriaEditada.id, {
        nombre: categoriaEditada.nombre,
      });
      cargarCategorias();
      cerrarModal();
    } catch (err) {
      console.error("Error al actualizar categoría:", err);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h2 className="pergamino-title text-3xl mb-4 text-center">
          Administrar Categorías
        </h2>

        {/* Formulario para nueva categoría */}
        <div className="pergamino-card p-6 mb-6 space-y-3">
          <label className="font-semibold text-[#3e2f1c]">
            Nombre de la categoría
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              placeholder="Ej: Postres"
              className="pergamino-input flex-1"
            />
            <button onClick={agregarCategoria} className="sello-btn dorado sm">
              Agregar
            </button>
          </div>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>

        {/* Tabla */}
        <table className="min-w-full border border-gray-300 pergamino-card">
          <thead className="bg-[#f5e8c7] text-[#3e2f1c]">
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
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => abrirModal(cat)}
                      className="sello-btn azul sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => borrarCategoria(cat.id)}
                      className="sello-btn sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal de edición */}
        <Modal
          isOpen={modalAbierto}
          onRequestClose={cerrarModal}
          className="pergamino-card max-w-md mx-auto p-6 relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <button
            onClick={cerrarModal}
            className="absolute top-2 right-3 text-[#3e2f1c] text-xl hover:text-red-700"
          >
            ✕
          </button>

          <h3 className="pergamino-title text-2xl text-center mb-4">
            ✒️ Editar Categoría
          </h3>

          <div>
            <label className="font-semibold text-[#3e2f1c]">Nombre</label>
            <input
              type="text"
              value={categoriaEditada?.nombre || ""}
              onChange={(e) =>
                setCategoriaEditada({
                  ...categoriaEditada,
                  nombre: e.target.value,
                })
              }
              className="pergamino-input w-full"
            />
            {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button onClick={cerrarModal} className="sello-btn sm">
              Cancelar
            </button>
            <button onClick={guardarCambios} className="sello-btn azul sm">
              Guardar Cambios
            </button>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
