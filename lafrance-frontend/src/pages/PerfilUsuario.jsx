import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

// Flujo de estados del pedido
const flujoEstados = [
  { estado: "PENDIENTE", label: "Pendiente", color: "bg-gray-300" },
  { estado: "CONFIRMADO", label: "Confirmado", color: "bg-blue-400" },
  { estado: "EN_CAMINO", label: "En Camino", color: "bg-yellow-500" },
  { estado: "ENTREGADO", label: "Entregado", color: "bg-green-400" },
  { estado: "CANCELADO", label: "Cancelado", color: "bg-red-500" },
];

// Componente que muestra cada pedido con barra de progreso
function PedidoCard({ pedido }) {
  const idxActual = flujoEstados.findIndex(f => f.estado === pedido.estado);

  return (
    <div className="bg-[#fffdf5] border border-[#e3d4a5] rounded-2xl shadow-md p-5 mb-6 transition transform hover:scale-105 hover:shadow-lg">
      <h3 className="font-bold text-[#3e2f1c] text-lg mb-1">Pedido #{pedido.id}</h3>
      <p className="text-[#3e2f1c] mb-1">Total: S/ {pedido.total.toFixed(2)}</p>
      <p className="text-[#3e2f1c] mb-3">Fecha: {pedido.fecha_pedido}</p>

      {/* Barra de progreso */}
      <div className="w-full flex justify-between items-center mb-2">
        {flujoEstados.map((s, i) => {
          const completado = i <= idxActual;
          return (
            <div key={s.estado} className="flex-1 mx-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  completado ? s.color : "bg-gray-200"
                }`}
              />
              <span className="text-xs block text-center mt-1 text-[#3e2f1c]">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {pedido.estado === "CONFIRMADO" && (
        <p className="text-blue-600 font-semibold mt-2">Pedido Confirmado</p>
      )}
      {pedido.estado === "EN_CAMINO" && (
        <p className="text-yellow-600 font-semibold mt-2">Pedido en Camino</p>
      )}
      {pedido.estado === "ENTREGADO" && (
        <p className="text-green-600 font-semibold mt-2">Pedido Entregado</p>
      )}
      {pedido.estado === "CANCELADO" && (
        <p className="text-red-600 font-semibold mt-2">Pedido Cancelado</p>
      )}
    </div>
  );
}

export default function PerfilCliente() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const fetchPerfil = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/perfil", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPerfil(res.data);
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      alert("❌ No se pudo cargar el perfil. ¿Estás logueado?");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  if (cargando) {
    return (
      <MainLayout>
        <p className="text-center mt-10">Cargando perfil...</p>
      </MainLayout>
    );
  }

  if (!perfil) {
    return (
      <MainLayout>
        <p className="text-center mt-10">No se encontró el perfil.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pergamino-card mt-10 p-8">
        {/* Encabezado */}
        <h1 className="pergamino-title text-3xl text-center mb-10">
          Mi Perfil
        </h1>

        {/* Datos personales */}
        <div className="bg-[#fffdf5] border border-[#e3d4a5] rounded-2xl p-5 mb-10 shadow-md">
          <h2 className="font-bold text-[#3e2f1c] text-lg mb-4">Datos Personales</h2>
          <p className="text-[#3e2f1c]"><strong>Nombre:</strong> {perfil.nombre}</p>
          <p className="text-[#3e2f1c]"><strong>Correo:</strong> {perfil.correo}</p>
          <p className="text-[#3e2f1c]"><strong>Teléfono:</strong> {perfil.telefono}</p>
          <p className="text-[#3e2f1c]"><strong>Dirección:</strong> {perfil.direccion ?? "—"}</p>
        </div>

        {/* Historial de pedidos */}
        <h2 className="font-bold text-[#3e2f1c] text-2xl mb-6 text-center">Historial de Pedidos</h2>
        {perfil.historialPedidos && perfil.historialPedidos.length > 0 ? (
          perfil.historialPedidos.map((p) => <PedidoCard key={p.id} pedido={p} />)
        ) : (
          <p className="text-gray-600 italic text-center">No tienes pedidos aún.</p>
        )}
      </div>
    </MainLayout>
  );
}
