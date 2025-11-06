import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);

  // 🔹 Cargar reservas desde el backend
  const fetchReservas = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/reservas");
      setReservas(res.data);
    } catch (err) {
      console.error("Error al obtener reservas:", err);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // 🔹 Cambiar estado de la reserva (confirmar o rechazar)
  const actualizarEstado = async (id, estado) => {
    try {
      await axios.put(`http://localhost:8070/api/reservas/${id}/estado`, { estado });
      fetchReservas(); // Recargar lista
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
        <h1 className="text-3xl font-bold mb-6 text-yellow-600 text-center">
          Gestión de Reservas
        </h1>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-yellow-100">
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Teléfono</th>
              <th className="border p-2">Fecha y Hora</th>
              <th className="border p-2">Personas</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>

          {/* 👇 Aquí va el tbody que me mostraste */}
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id} className="text-center">
                <td className="border p-2">{r.usuario?.nombre}</td>
                <td className="border p-2">{r.usuario?.correo}</td>
                <td className="border p-2">{r.telefono}</td>
                <td className="border p-2">
                  {new Date(r.fechaHora).toLocaleString()}
                </td>
                <td className="border p-2">{r.numeroPersonas}</td>
                <td className="border p-2">{r.estado}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => actualizarEstado(r.id, "CONFIRMADA")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => actualizarEstado(r.id, "RECHAZADA")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
