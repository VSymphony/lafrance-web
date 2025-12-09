import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [expandido, setExpandido] = useState({});
  const [clienteExpandido, setClienteExpandido] = useState({});
  const [loading, setLoading] = useState({});
  const [pedidoEditar, setPedidoEditar] = useState(null);
  const [productos, setProductos] = useState([]);
  const flujoEstados = [
    { estado: "PENDIENTE", label: "Pendiente", color: "bg-gray-300" },
    { estado: "CONFIRMADO", label: "Confirmado", color: "bg-blue-400" },
    { estado: "EN_CAMINO", label: "En_Camino", color: "bg-yellow-500" },
    { estado: "ENTREGADO", label: "Entregado", color: "bg-green-400" },
    { estado: "CANCELADO", label: "Cancelado", color: "bg-red-500" },
  ];



  const fetchPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/pedidos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPedidos(res.data);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      alert("❌ No se pudieron cargar los pedidos.");
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    if (pedidoEditar) {
      axios.get("http://localhost:8070/api/productos")
        .then(res => setProductos(res.data))
        .catch(() => console.error("Error cargando productos"));
    }
  }, [pedidoEditar]);


  const actualizarEstado = async (id, estado) => {
    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await axios.put(
        `http://localhost:8070/api/pedidos/${id}/estado`,
        { estado },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      await fetchPedidos();
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("❌ No se pudo actualizar el estado.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const eliminarItem = (index) => {
  setItemsEditados(prev => prev.filter((_, i) => i !== index));
};

  const eliminarPedido = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      await axios.delete(`http://localhost:8070/api/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await fetchPedidos();
      alert("🗑️ Pedido eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("❌ No se pudo eliminar el pedido.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleExpand = (id) => {
    setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCliente = (id) => {
    setClienteExpandido((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const nombre = p.usuario?.nombre?.toLowerCase() || "";
    const estado = p.estado?.toLowerCase() || "";
    const termino = busqueda.toLowerCase();
    return nombre.includes(termino) || estado.includes(termino);
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto pergamino-card mt-10 p-8">
        <h1 className="pergamino-title text-3xl text-center mb-6">
          Gestión de Pedidos
        </h1>

        <div className="flex justify-between mb-6 items-center">
          <input
            type="text"
            placeholder="Buscar por cliente o estado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pergamino-input w-1/2"
          />
          <button onClick={() => setBusqueda("")} className="sello-btn dorado sm">
            Limpiar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-[#d2b48c] rounded-md text-center">
            <thead className="bg-[#f8ecd1]">
              <tr>
                <th className="border border-[#d2b48c] px-4 py-2">Cliente</th>
                <th className="border border-[#d2b48c] px-4 py-2">Dirección</th>
                <th className="border border-[#d2b48c] px-4 py-2">Total</th>
                <th className="border border-[#d2b48c] px-4 py-2">Fecha</th>
                <th className="border border-[#d2b48c] px-4 py-2">Estado</th>
                <th className="border border-[#d2b48c] px-4 py-2">Acciones</th>
                <th className="border border-[#d2b48c] px-4 py-2">Detalles</th>
              </tr>
            </thead>

            <tbody>
              {pedidosFiltrados.length > 0 ? (
                pedidosFiltrados.map((p) => (
                  <>

                    <tr key={p.id} className="hover:bg-[#fff9ee] transition">
                      <td className="border border-[#d2b48c] px-4 py-2">{p.usuario?.nombre ?? "—"}</td>
                      <td className="border border-[#d2b48c] px-4 py-2">
                        {p.direccion ?? "—"} <br />
                        <span className="text-xs italic text-gray-600">{p.referencia}</span>
                      </td>
                      <td className="border border-[#d2b48c] px-4 py-2">S/ {p.total?.toFixed(2)}</td>
                      <td className="border border-[#d2b48c] px-4 py-2">{p.fecha_pedido}</td>
                      <td className={`border border-[#d2b48c] px-4 py-2 font-semibold ${
                        p.estado === "ENTREGADO" ? "text-green-700" :
                        p.estado === "CANCELADO" ? "text-red-700" :
                        p.estado === "EN CAMINO" ? "text-yellow-800" :
                        "text-yellow-700"
                      }`}>
                        {p.estado}
                      </td>

                      <td className="border border-[#d2b48c] px-4 py-2">
                        <div className="w-full flex justify-between items-center mb-2">
                          {flujoEstados.map((s, i) => {
                            const idxActual = flujoEstados.findIndex(f => f.estado === p.estado);
                            const completado = i <= idxActual;

                            return (
                              <div key={s.estado} className="flex-1 mx-1">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    completado ? s.color : "bg-gray-200"
                                  }`}
                                />
                                <span className="text-xs block text-center mt-1">{s.label}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-2 justify-center flex-wrap">
                          {p.estado === "PENDIENTE" && (
                            <>
                              <button
                                onClick={() => actualizarEstado(p.id, "CONFIRMADO")}
                                className="sello-btn azul sm"
                              >
                                Confirmar
                              </button>

                              <button
                                onClick={() => actualizarEstado(p.id, "CANCELADO")}
                                className="sello-btn rojo sm"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setPedidoEditar(p)}
                            disabled={p.estado !== "PENDIENTE"}
                            className={`sello-btn dorado sm 
                              ${p.estado !== "PENDIENTE" ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            Editar
                          </button>
                          
                          {p.estado === "CONFIRMADO" && (
                            <button
                              onClick={() => actualizarEstado(p.id, "EN_CAMINO")}
                              className="sello-btn dorado sm"
                            >
                              En Camino
                            </button>
                          )}

                          {p.estado === "EN_CAMINO" && (
                            <button
                              onClick={() => actualizarEstado(p.id, "ENTREGADO")}
                              className="sello-btn verde sm"
                            >
                              Entregado
                            </button>
                          )}

                          {(p.estado === "ENTREGADO" || p.estado === "CANCELADO") && (
                            <button disabled className="sello-btn sm opacity-50 cursor-not-allowed">
                              Acción completada
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="border border-[#d2b48c] px-4 py-2">
                        <div className="flex flex-col gap-2">
                          <button onClick={() => toggleExpand(p.id)} className="sello-btn azul sm w-full">
                            {expandido[p.id] ? "Ocultar Pedido" : "Detalles Pedido"}
                          </button>
                          <button onClick={() => toggleCliente(p.id)} className="sello-btn sm w-full">
                            {clienteExpandido[p.id] ? "Ocultar Cliente" : "Detalles Cliente"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Detalles Pedido */}
                    {expandido[p.id] && (
                      <tr className="bg-[#fff9ee]">
                        <td colSpan={7} className="p-4">
                          <h3 className="text-lg font-bold mb-2 text-[#7b1e1e]">Productos del pedido</h3>
                          <table className="w-full text-center border border-[#d2b48c]">
                            <thead className="bg-[#f0e4c3]">
                              <tr>
                                <th className="border px-2 py-1">Producto</th>
                                <th className="border px-2 py-1">Cantidad</th>
                                <th className="border px-2 py-1">Precio</th>
                                <th className="border px-2 py-1">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {p.detalles?.map((d) => (
                                <tr key={d.id}>
                                  <td className="border px-2 py-1">{d.producto?.nombre}</td>
                                  <td className="border px-2 py-1">{d.cantidad}</td>
                                  <td className="border px-2 py-1">S/ {d.precio_unitario.toFixed(2)}</td>
                                  <td className="border px-2 py-1 font-semibold">
                                    S/ {(d.cantidad * d.precio_unitario).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}

                    {/* Detalles Cliente */}
                    {clienteExpandido[p.id] && (
                      <tr className="bg-[#fff9ee]">
                        <td colSpan={7} className="p-4">
                          <h3 className="text-lg font-bold mb-2 text-[#7b1e1e]">Detalles del Cliente</h3>
                          <table className="w-full text-center border border-[#d2b48c]">
                            <thead className="bg-[#f0e4c3]">
                              <tr>
                                <th className="border px-2 py-1">Nombre</th>
                                <th className="border px-2 py-1">Correo</th>
                                <th className="border px-2 py-1">Teléfono</th>
                                <th className="border px-2 py-1">Dirección</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border px-2 py-1">{p.usuario?.nombre ?? "—"}</td>
                                <td className="border px-2 py-1">{p.usuario?.correo ?? "—"}</td>
                                <td className="border px-2 py-1">{p.usuario?.telefono ?? "—"}</td>
                                <td className="border px-2 py-1">
                                  {p.direccion ?? "—"} <br />
                                  <span className="text-xs italic">{p.referencia}</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-[#7b1e1e] p-4 italic">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pedidoEditar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div
            className="relative bg-[#fff8e6] w-[650px] max-h-[90vh] overflow-y-auto 
                      rounded-2xl shadow-2xl border border-amber-900/40 p-8 
                      animate-scaleIn pergamino-modal"
            style={{
              backgroundImage: "url('/images/pergamino-card.jpg')",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* BOTÓN DE CERRAR */}
            <button
              onClick={() => setPedidoEditar(null)}
              className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-red-700 
                        border-4 border-red-900 shadow-lg text-white font-bold 
                        flex items-center justify-center hover:scale-110 
                        transition-transform"
            >
              ✕
            </button>

            {/* TÍTULO */}
            <h2 className="text-3xl font-serif text-center text-[#4b1e05] mb-6 drop-shadow-lg">
              ✦ Editar Pedido #{pedidoEditar.id} ✦
            </h2>

            {/* DIRECCIÓN */}
            <label className="block mb-2 font-bold text-[#4b1e05]">Dirección:</label>
            <input
              type="text"
              value={pedidoEditar.direccion}
              onChange={(e) =>
                setPedidoEditar({ ...pedidoEditar, direccion: e.target.value })
              }
              className="w-full pergamino-input mb-6"
            />

            {/* LISTA DE ITEMS */}
            <h3 className="text-xl font-bold mb-3 text-[#7b1e1e]">
              Productos del Pedido
            </h3>

            {pedidoEditar.detalles.map((item, index) => (
              <div
                key={index}
                className="p-4 mb-4 bg-white/80 rounded-xl shadow-md border border-amber-700/30"
              >
                {/* SELECT PRODUCTO */}
                <label className="block text-sm font-semibold text-[#5a3b1a] mb-1">
                  Producto
                </label>
                <select
                  value={item.producto.id}
                  onChange={(e) => {
                    const nuevoId = Number(e.target.value);
                    const nuevoProducto = productos.find(p => p.id === nuevoId);

                    const nuevosDetalles = [...pedidoEditar.detalles];
                    nuevosDetalles[index].producto.id = nuevoProducto.id;
                    nuevosDetalles[index].producto.nombre = nuevoProducto.nombre;
                    nuevosDetalles[index].precio_unitario = nuevoProducto.precio;

                    setPedidoEditar({ ...pedidoEditar, detalles: nuevosDetalles });
                  }}
                  className="w-full pergamino-input mb-4"
                >
                  <option value="">Seleccionar producto...</option>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre} — S/ {prod.precio.toFixed(2)}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-4">
                  {/* CANTIDAD */}
                  <div>
                    <label className="block text-sm font-semibold text-[#5a3b1a]">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={(e) => {
                        const nuevaCant = Number(e.target.value);
                        const detalles = [...pedidoEditar.detalles];
                        detalles[index].cantidad = nuevaCant;
                        setPedidoEditar({ ...pedidoEditar, detalles });
                      }}
                      className="w-full pergamino-input"
                    />
                  </div>

                  {/* PRECIO UNITARIO */}
                  <div>
                    <label className="block text-sm font-semibold text-[#5a3b1a]">
                      Precio Unitario
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.precio_unitario}
                      onChange={(e) => {
                        const nuevoPrecio = Number(e.target.value);
                        const detalles = [...pedidoEditar.detalles];
                        detalles[index].precio_unitario = nuevoPrecio;
                        setPedidoEditar({ ...pedidoEditar, detalles });
                      }}
                      className="w-full pergamino-input"
                    />
                  </div>
                </div>

                {/* SUBTOTAL */}
                <p className="text-right mt-3 font-bold text-[#7b1e1e]">
                  Subtotal: S/ {(item.cantidad * item.precio_unitario).toFixed(2)}
                </p>

                {/* ELIMINAR ITEM */}
                <button
                  className="sello-btn sm hover:bg-red-900 text-white px-3 py-1 rounded shadow"
                  onClick={() => {
                    const nuevos = pedidoEditar.detalles.filter((_, i) => i !== index);
                    setPedidoEditar({ ...pedidoEditar, detalles: nuevos });
                  }}
                >
                  Eliminar producto
                </button>
              </div>
            ))}

            {/* BOTÓN AGREGAR ITEM */}
            <button
              className="sello-btn azul sm hover:bg-green-900 text-white px-4 py-2 rounded shadow mb-6"
              onClick={() => {
                setPedidoEditar({
                  ...pedidoEditar,
                  detalles: [
                    ...pedidoEditar.detalles,
                    {
                      id: null,
                      cantidad: 1,
                      precio_unitario: 0,
                      producto: { id: "", nombre: "" }
                    }
                  ]
                });
              }}
            >
              + Agregar producto
            </button>

            {/* TOTAL */}
            <p className="text-2xl font-bold text-right text-[#7b1e1e]">
              Total: S/{" "}
              {pedidoEditar.detalles
                .reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0)
                .toFixed(2)}
            </p>

            {/* BOTONES FINALES */}
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setPedidoEditar(null)} className="sello-btn rojo">
                Cancelar
              </button>

              <button
                className="sello-btn verde"
                onClick={async () => {
                  try {
                    await axios.put(
                      `http://localhost:8070/api/pedidos/actualizar/${pedidoEditar.id}`,
                      {
                        direccion: pedidoEditar.direccion,
                        referencia: pedidoEditar.referencia,
                        detalles: pedidoEditar.detalles.map((d) => ({
                          id: d.id,
                          productoId: d.producto.id,
                          cantidad: d.cantidad,
                          precio: d.precio_unitario
                        }))
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                      }
                    );

                    await fetchPedidos();
                    setPedidoEditar(null);
                    alert("✅ Pedido actualizado correctamente");
                  } catch (err) {
                    console.error("Error guardando pedido:", err);
                    alert("❌ No se pudo guardar los cambios.");
                  }
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
