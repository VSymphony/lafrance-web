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
    <div
      className="bg-[#fdf6e3] border border-amber-900/30 rounded-xl shadow-lg p-6 mb-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
      style={{
        backgroundImage: "url('/images/pergamino-card.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h3 className="text-xl font-bold font-serif text-[#4b1e05] mb-2">
        Pedido #{pedido.id}
      </h3>
      <p className="text-[#5a3b1a] mb-2">Total: S/ {pedido.total.toFixed(2)}</p>
      <p className="text-[#5a3b1a] mb-4">Fecha: {pedido.fecha_pedido}</p>

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
              <span className="text-xs block text-center mt-1 text-[#3b1d0f]">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

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
      <div
        className="min-h-screen bg-cover bg-center bg-fixed py-12"
        style={{
          backgroundImage: "url('/images/pergamino-textura.jpg')",
          backgroundColor: "#f8f3e7",
        }}
      >
        <div className="bg-white/85 max-w-6xl mx-auto p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-amber-800/40">
          {/* Encabezado */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-[#3b1d0f] mb-2 drop-shadow-md tracking-wide">
              Mi Perfil
            </h1>
            <div className="flex justify-center">
              <img
                src="/images/fleur-divider.png"
                alt=""
                className="h-6 mt-2 opacity-80"
              />
            </div>
          </div>

          {/* Datos personales */}
          <div className="bg-[#fdf6e3] border border-amber-900/30 rounded-xl p-6 mb-10 shadow-lg">
            <h2 className="font-semibold text-lg mb-4 text-[#4b1e05]">Datos Personales</h2>
            <p className="text-[#5a3b1a]"><strong>Nombre:</strong> {perfil.nombre}</p>
            <p className="text-[#5a3b1a]"><strong>Correo:</strong> {perfil.correo}</p>
            <p className="text-[#5a3b1a]"><strong>Teléfono:</strong> {perfil.telefono}</p>
            <p className="text-[#5a3b1a]"><strong>Dirección:</strong> {perfil.direccion ?? "—"}</p>
          </div>

          {/* Historial de pedidos */}
          <h2 className="text-2xl font-bold mb-6 text-[#3b1d0f]">Historial de Pedidos</h2>
          {perfil.historialPedidos && perfil.historialPedidos.length > 0 ? (
            perfil.historialPedidos.map((p) => <PedidoCard key={p.id} pedido={p} />)
          ) : (
            <p className="text-gray-600 italic">No tienes pedidos aún.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
