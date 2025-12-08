import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [expandido, setExpandido] = useState({}); // <- para expandir detalles
  const [clienteExpandido, setClienteExpandido] = useState({});


  const fetchPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/pedidos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  const confirmarPedido = async (id) => {
  try {
    await axios.put(
      `http://localhost:8070/api/pedidos/${id}/confirmar`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    fetchPedidos();
    alert("✅ Pedido marcado como ENTREGADO.");
  } catch (err) {
    console.error("Error al confirmar:", err);
    alert("❌ No se pudo confirmar el pedido.");
  }
};

const rechazarPedido = async (id) => {
  try {
    await axios.put(
      `http://localhost:8070/api/pedidos/${id}/rechazar`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    fetchPedidos();
    alert("⚠️ Pedido cancelado.");
  } catch (err) {
    console.error("Error al cancelar:", err);
    alert("❌ No se pudo cancelar el pedido.");
  }
};


  const eliminarPedido = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;

    try {
      await axios.delete(`http://localhost:8070/api/pedidos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchPedidos();
      alert("🗑️ Pedido eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("❌ No se pudo eliminar el pedido.");
    }
  };

  const toggleExpand = (id) => {
    setExpandido((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCliente = (id) => {
  setClienteExpandido((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
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

        {/* Buscador */}
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

        {/* Tabla */}
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
                      <td className="border border-[#d2b48c] px-4 py-2">
                        {p.usuario?.nombre ?? "—"}
                      </td>

                      <td className="border border-[#d2b48c] px-4 py-2">
                        {p.direccion ?? "—"} <br />
                        <span className="text-xs italic text-gray-600">
                          {p.referencia}
                        </span>
                      </td>

                      <td className="border border-[#d2b48c] px-4 py-2">
                        S/ {p.total?.toFixed(2)}
                      </td>

                      <td className="border border-[#d2b48c] px-4 py-2">
                        {p.fecha_pedido}
                      </td>

                      <td
                        className={`border border-[#d2b48c] px-4 py-2 font-semibold ${
                          p.estado === "ENTREGADO"
                            ? "text-green-700"
                            : p.estado === "CANCELADO"
                            ? "text-red-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {p.estado}
                      </td>

                      <td className="border border-[#d2b48c] px-4 py-2 flex gap-2 justify-center">
                        <button
                          onClick={() => confirmarPedido(p.id)}
                          className="sello-btn azul sm"
                        >
                          Entregado
                        </button>

                        <button
                          onClick={() => rechazarPedido(p.id)}
                          className="sello-btn sm"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => eliminarPedido(p.id)}
                          className="sello-btn dorado sm"
                        >
                          Eliminar
                        </button>
                      </td>

                      <td className="border border-[#d2b48c] px-4 py-2">
                        <div className="flex flex-col gap-2">

                          {/* Botón 1 - Detalles del pedido */}
                          <button
                            onClick={() => toggleExpand(p.id)}
                            className="sello-btn azul sm w-full"
                          >
                            {expandido[p.id] ? "Ocultar Pedido" : "Detalles Pedido"}
                          </button>

                          {/* Botón 2 - Detalles del cliente */}
                          <button
                            onClick={() => toggleCliente(p.id)}
                            className="sello-btn verde sm w-full"
                          >
                            {clienteExpandido[p.id] ? "Ocultar Cliente" : "Detalles Cliente"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* DETALLES EXPANDIBLES */}
                    {expandido[p.id] && (
                      <tr className="bg-[#fff9ee]">
                        <td colSpan={7} className="p-4">
                          <h3 className="text-lg font-bold mb-2 text-[#7b1e1e]">
                            Productos del pedido
                          </h3>

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
                                  <td className="border px-2 py-1">
                                    {d.producto?.nombre}
                                  </td>
                                  <td className="border px-2 py-1">
                                    {d.cantidad}
                                  </td>
                                  <td className="border px-2 py-1">
                                    S/ {d.precio_unitario.toFixed(2)}
                                  </td>
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
                    {clienteExpandido[p.id] && (
                      <tr className="bg-[#fff9ee]">
                        <td colSpan={7} className="p-4">
                          <h3 className="text-lg font-bold mb-2 text-[#7b1e1e]">
                            Detalles del Cliente
                          </h3>

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
    </AdminLayout>
  );
}
