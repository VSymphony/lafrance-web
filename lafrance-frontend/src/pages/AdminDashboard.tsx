import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { ShoppingCart, Box, Tag, CalendarDays } from "lucide-react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Dashboard de estadísticas (estilo pergamino)
export default function AdminDashboardWithStats() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:8070"; // ajustar si cambia

  useEffect(() => {
    const loadAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        const [pRes, cRes, pedRes, rRes] = await Promise.all([
          axios.get(`${API}/api/productos`, { headers }),
          axios.get(`${API}/api/categorias`, { headers }),
          axios.get(`${API}/api/pedidos`, { headers }),
          axios.get(`${API}/api/reservas`, { headers }),
        ]);

        setProductos(pRes.data || []);
        setCategorias(cRes.data || []);
        setPedidos(pedRes.data || []);
        setReservas(rRes.data || []);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // Helper: fecha hoy en formato YYYY-MM-DD (cliente)
  const hoy = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const totalProductos = productos.length;
  const totalCategorias = categorias.length;
  const reservasActivas = reservas.filter((r) =>
    ["PENDIENTE", "CONFIRMADA"].includes((r.estado || "").toUpperCase())
  ).length;

  const pedidosHoy = pedidos.filter((p) => (p.fecha_pedido || "") === hoy())
    .length;

  // Preparar datos para gráfica: pedidos por día últimos 7 días
  const getLastNDays = (n = 7) => {
    const arr = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      arr.push(`${y}-${m}-${day}`);
    }
    return arr;
  };

  const days = getLastNDays(7);
  const chartData = days.map((dateStr) => {
    const count = pedidos.filter((p) => (p.fecha_pedido || "") === dateStr).length;
    return { date: dateStr.slice(5), pedidos: count };
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl text-center mb-6 text-[#7b1e1e] font-bold">Dashboard</h1>

        {loading ? (
          <p className="text-center">Cargando estadísticas...</p>
        ) : (
          <>
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              <StatCard
                title="Productos"
                value={totalProductos}
                icon={<Box size={28} className="text-[#5a4634]" />}
              />

              <StatCard
                title="Categorías"
                value={totalCategorias}
                icon={<TagIcon />}
              />

              <StatCard
                title="Reservas activas"
                value={reservasActivas}
                icon={<CalendarDays size={28} className="text-[#5a4634]" />}
              />

              <StatCard
                title="Pedidos hoy"
                value={pedidosHoy}
                icon={<ShoppingCart size={28} className="text-[#5a4634]" />}
              />

              <StatCard
                title="Ingresos Totales"
                value={pedidos.reduce((acc, p) => acc + (p.total || 0), 0).toFixed(2)}
                icon={<span className="text-[#5a4634] text-2xl font-bold">S/.</span>}
              />

              <StatCard
                title="Categorías"
                value={totalCategorias}
                icon={<TagIcon />}
              />


              <StatCard
                title="Reservas activas"
                value={reservasActivas}
                icon={<CalendarDays size={28} className="text-[#5a4634]" />}
              />

              <StatCard
                title="Pedidos hoy"
                value={pedidosHoy}
                icon={<ShoppingCart size={28} className="text-[#5a4634]" />}
              />
            </div>

            {/* Gráfica de pedidos últimos 7 días */}
            <div className="pergamino-card p-4 border border-[#d2b48c] shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-[#7b1e1e]">Pedidos últimos 7 días</h3>

              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="pedidos" fill="#7b1e1e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#f3e9d2] border border-[#d2b48c] rounded-xl p-4 flex items-center gap-4 shadow-sm">
      <div className="p-3 rounded-lg bg-[#fffaf0] border border-[#e6d7b8]">{icon}</div>
      <div>
        <div className="text-sm text-[#5a4634]">{title}</div>
        <div className="text-2xl font-bold text-[#7b1e1e]">{value}</div>
      </div>
    </div>
  );
}

function TagIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#5a4634]"><path d="M20.59 13.41L11.17 4 4 11.17V20h8.83L20.59 13.41z" stroke="#5a4634" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
