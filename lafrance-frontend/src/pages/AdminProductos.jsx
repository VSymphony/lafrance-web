import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";
import MainLayout from "../layouts/MainLayout";

Modal.setAppElement("#root");

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    imagen_url: "",
    descripcion: "",
  });
  const [errores, setErrores] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);
  const [erroresModal, setErroresModal] = useState({});

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

  const guardarProducto = async () => {
    if (!validar()) return;

    const payload = {
      nombre: nuevo.nombre,
      precio: parseFloat(nuevo.precio),
      imagen_url: nuevo.imagen_url,
      categoria_id: nuevo.categoria,
      descripcion: nuevo.descripcion,
      disponible: true,
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
      console.error("Error al guardar producto:", err);
    }
  };

  const borrarProducto = async (id) => {
    try {
      if (window.confirm("¿Estás seguro de eliminar este producto?")) {
        await axios.delete(`http://localhost:8070/api/productos/${id}`);
        cargarProductos();
      }
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  // 🧾 Abrir modal de edición
  const abrirModal = (p) => {
    setProductoEditado({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      descripcion: p.descripcion,
      imagen_url: p.imagen_url,
      categoria: p.categoria
        ? { id: p.categoria.id, nombre: p.categoria.nombre }
        : null,
    });
    setErroresModal({});
    setModalAbierto(true);
  };


  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditado(null);
  };

  const validarModal = () => {
    const err = {};
    if (!productoEditado.nombre?.trim()) err.nombre = "El nombre es obligatorio";
    if (productoEditado.precio <= 0) err.precio = "El precio debe ser mayor a 0";
    if (!productoEditado.descripcion?.trim()) err.descripcion = "La descripción es obligatoria";
    return err;
  };

  const guardarCambios = async () => {
  const val = validarModal();
  if (Object.keys(val).length > 0) {
    setErroresModal(val);
    return;
  }

  const payload = {
    nombre: productoEditado.nombre,
    descripcion: productoEditado.descripcion,
    precio: parseFloat(productoEditado.precio),
    imagen_url: productoEditado.imagen_url,
    categoria_id: productoEditado.categoria?.id,
    disponible: true,
  };

  try {
    await axios.put(
      `http://localhost:8070/api/productos/${productoEditado.id}`,
      payload
    );
    await cargarProductos();
    cerrarModal();
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    alert("❌ No se pudo actualizar el producto");
  }
};


  return (
    <MainLayout>
    <div className="p-6">
      <h2 className="pergamino-title text-3xl mb-4 text-center">Administrar Productos</h2>

      {/* 🪶 FORMULARIO DE NUEVO PRODUCTO */}
      <div className="pergamino-card p-6 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-[#3e2f1c]">Nombre</label>
            <input
              type="text"
              value={nuevo.nombre}
              onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
              className="pergamino-input w-full"
            />
            {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
          </div>

          <div>
            <label className="font-semibold text-[#3e2f1c]">Precio</label>
            <input
              type="number"
              value={nuevo.precio}
              onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
              className="pergamino-input w-full"
            />
            {errores.precio && <p className="text-red-600 text-sm">{errores.precio}</p>}
          </div>

          <div>
            <label className="font-semibold text-[#3e2f1c]">Categoría</label>
            <Select
              options={categorias}
              value={categorias.find((op) => op.value === nuevo.categoria) || null}
              onChange={(selected) =>
                setNuevo({ ...nuevo, categoria: selected ? selected.value : "" })
              }
              placeholder="Selecciona categoría"
              isClearable
              className="text-[#3e2f1c]"
            />
            {errores.categoria && <p className="text-red-600 text-sm">{errores.categoria}</p>}
          </div>

          <div>
            <label className="font-semibold text-[#3e2f1c]">URL Imagen</label>
            <input
              type="url"
              value={nuevo.imagen_url}
              onChange={(e) => setNuevo({ ...nuevo, imagen_url: e.target.value })}
              className="pergamino-input w-full"
            />
            {errores.imagen_url && <p className="text-red-600 text-sm">{errores.imagen_url}</p>}
          </div>
        </div>

        {nuevo.imagen_url && (
          <div className="flex justify-center mt-2">
            <img
              src={nuevo.imagen_url}
              alt="Vista previa"
              className="w-32 h-32 object-cover rounded shadow-md border"
            />
          </div>
        )}

        <div>
          <label className="font-semibold text-[#3e2f1c]">Descripción</label>
          <textarea
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            rows={3}
            className="pergamino-input w-full resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={guardarProducto} className="sello-btn dorado px-6">
            Agregar Producto
          </button>
        </div>
      </div>

      {/* 🧾 TABLA */}
      <table className="min-w-full border border-gray-300 pergamino-card">
        <thead className="bg-[#f5e8c7] text-[#3e2f1c]">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-6 py-2">Precio</th>
            <th className="border px-4 py-2">Categoría</th>
            <th className="border px-4 py-2">Descripción</th>
            <th className="border px-6 py-2">Imagen</th>
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
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => abrirModal(p)}
                    className="sello-btn azul sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => borrarProducto(p.id)}
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

      {/* 🪶 MODAL DE EDICIÓN */}
      <Modal
        isOpen={modalAbierto}
        onRequestClose={cerrarModal}
        className="pergamino-card max-w-lg mx-auto p-6 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button
          onClick={cerrarModal}
          className="absolute top-2 right-3 text-[#3e2f1c] text-xl hover:text-red-700"
        >
          ✕
        </button>

        <h3 className="pergamino-title text-2xl text-center mb-4">✒️ Editar Producto</h3>

        <div className="space-y-4">
          {/* 🏷️ Nombre */}
          <div>
            <label className="font-semibold text-[#3e2f1c]">Nombre</label>
            <input
              type="text"
              value={productoEditado?.nombre || ""}
              onChange={(e) =>
                setProductoEditado({ ...productoEditado, nombre: e.target.value })
              }
              className="pergamino-input w-full"
            />
            {erroresModal.nombre && (
              <p className="text-red-700 text-sm">{erroresModal.nombre}</p>
            )}
          </div>

          {/* 💰 Precio */}
          <div>
            <label className="font-semibold text-[#3e2f1c]">Precio</label>
            <input
              type="number"
              value={productoEditado?.precio || ""}
              onChange={(e) =>
                setProductoEditado({
                  ...productoEditado,
                  precio: parseFloat(e.target.value),
                })
              }
              className="pergamino-input w-full"
            />
            {erroresModal.precio && (
              <p className="text-red-700 text-sm">{erroresModal.precio}</p>
            )}
          </div>

          {/* 🗂️ Categoría */}
          <div>
            <label className="font-semibold text-[#3e2f1c]">Categoría</label>
            <Select
              options={categorias}
              value={
                categorias.find(
                  (cat) => cat.value === productoEditado?.categoria?.id
                ) || null
              }
              onChange={(selected) =>
                setProductoEditado({
                  ...productoEditado,
                  categoria: selected
                    ? { id: selected.value, nombre: selected.label }
                    : null,
                })
              }
              placeholder="Seleccionar categoría"
              className="text-gray-800"
              isClearable
            />
            {erroresModal.categoria && (
              <p className="text-red-700 text-sm">{erroresModal.categoria}</p>
            )}
          </div>

          {/* 🖼️ Imagen URL */}
          <div>
            <label className="font-semibold text-[#3e2f1c]">URL de Imagen</label>
            <input
              type="url"
              value={productoEditado?.imagen_url || ""}
              onChange={(e) =>
                setProductoEditado({
                  ...productoEditado,
                  imagen_url: e.target.value,
                })
              }
              placeholder="https://ejemplo.com/imagen.jpg"
              className="pergamino-input w-full"
            />
            {productoEditado?.imagen_url && (
              <img
                src={productoEditado.imagen_url}
                alt="Vista previa"
                className="mt-2 w-32 h-32 object-cover border rounded mx-auto"
              />
            )}
            {erroresModal.imagen_url && (
              <p className="text-red-700 text-sm">{erroresModal.imagen_url}</p>
            )}
          </div>

          {/* 📝 Descripción */}
          <div>
            <label className="font-semibold text-[#3e2f1c]">Descripción</label>
            <textarea
              value={productoEditado?.descripcion || ""}
              onChange={(e) =>
                setProductoEditado({
                  ...productoEditado,
                  descripcion: e.target.value,
                })
              }
              className="pergamino-input w-full resize-none"
              rows={3}
            />
            {erroresModal.descripcion && (
              <p className="text-red-700 text-sm">{erroresModal.descripcion}</p>
            )}
          </div>
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
