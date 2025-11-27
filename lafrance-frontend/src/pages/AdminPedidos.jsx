import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]); // ✅ siempre array
  const [loading, setLoading] = useState(true);

  // Cargar pedidos desde el backend
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch("http://localhost:8070/api/pedidos");
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const confirmarPedido = async (id) => {
    try {
      const res = await fetch(`http://localhost:8070/api/pedidos/${id}/confirmar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Error al confirmar pedido: " + data.message);
        return;
      }

      alert(data.message);
      // Actualizar estado local
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estado: "CONFIRMADO" } : p
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    }
  };

  const rechazarPedido = async (id) => {
    try {
      const res = await fetch(`http://localhost:8070/api/pedidos/${id}/rechazar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        alert("Error al rechazar pedido: " + data.message);
        return;
      }

      alert(data.message);
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estado: "RECHAZADO" } : p
        )
      );
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto mt-10 pergamino-card p-8">
        <h2 className="text-3xl pergamino-title text-center mb-6">📦 Administración de Pedidos</h2>

        {loading ? (
          <p className="text-center">Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-gray-600">No hay pedidos registrados</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Cliente</th>
                <th className="p-3 border">Dirección</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Estado</th>
                <th className="p-3 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(pedidos) && pedidos.map((pedido) => (
                <tr key={pedido.id} className="text-center">
                  <td className="p-3 border">{pedido.id}</td>
                  <td className="p-3 border">{pedido.usuario?.correo}</td>
                  <td className="p-3 border">{pedido.direccion}</td>
                  <td className="p-3 border">{pedido.total} Bs.</td>
                  <td className="p-3 border">{pedido.estado}</td>
                  <td className="p-3 border">
                    {pedido.estado === "PENDIENTE" && (
                      <>
                        <button
                          className="btn sello-btn mr-2"
                          onClick={() => confirmarPedido(pedido.id)}
                        >
                          Confirmar
                        </button>
                        <button
                          className="bg-red-600 text-white py-2 px-4 rounded"
                          onClick={() => rechazarPedido(pedido.id)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
}