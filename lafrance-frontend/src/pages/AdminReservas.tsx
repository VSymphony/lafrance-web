import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  disponible: boolean;
}

interface Usuario {
  nombre: string;
  telefono: string;
  correo: string;
}

interface Reserva {
  id: number;
  usuario?: Usuario;
  fechaHora: string;
  numeroPersonas: number;
  estado: string;
  mesa?: Mesa | null;
}

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);

  // 🔹 Obtener reservas y mesas disponibles
  const fetchData = async () => {
    try {
      const [resReservas, resMesas] = await Promise.all([
        axios.get("http://localhost:8070/api/reservas"),
        axios.get("http://localhost:8070/api/mesas/disponibles"),
      ]);
      setReservas(resReservas.data);
      setMesas(resMesas.data);
    } catch (err) {
      console.error("Error al obtener datos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Cambiar estado de la reserva
  const actualizarEstado = async (id: number, estado: string) => {
    try {
      await axios.put(`http://localhost:8070/api/reservas/${id}/estado`, { estado });
      fetchData();
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  // 🔹 Asignar mesa a una reserva
  const asignarMesa = async (id: number, mesaId: number) => {
    try {
      await axios.put(`http://localhost:8070/api/reservas/${id}/mesa`, { mesaId });
      fetchData();
    } catch (err) {
      console.error("Error al asignar mesa:", err);
    }
  };

  // 🔹 Eliminar reserva
  const eliminarReserva = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reserva?")) return;

    try {
      await axios.delete(`http://localhost:8070/api/reservas/${id}`);
      await fetchData();
      alert("✅ Reserva eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar reserva:", err);
      alert("❌ No se pudo eliminar la reserva.");
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
              <th className="border p-2">Mesa</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reservas.map((r) => (
              <tr key={r.id} className="text-center">
                <td className="border p-2">{r.usuario?.nombre ?? "—"}</td>
                <td className="border p-2">{r.usuario?.correo ?? "—"}</td>
                <td className="border p-2">{r.usuario?.telefono ?? "—"}</td>
                <td className="border p-2">
                  {new Date(r.fechaHora).toLocaleString()}
                </td>
                <td className="border p-2">{r.numeroPersonas}</td>

                {/* 🔸 Selector o número de mesa */}
                <td className="border p-2">
                  {r.mesa ? (
                    `Mesa ${r.mesa.numero}`
                  ) : (
                    <select
                      defaultValue=""
                      onChange={(e) =>
                        asignarMesa(r.id, parseInt(e.target.value))
                      }
                      className="border rounded p-1"
                    >
                      <option value="">Asignar mesa</option>
                      {mesas.map((m) => (
                        <option key={m.id} value={m.id}>
                          Mesa {m.numero} ({m.capacidad} personas)
                        </option>
                      ))}
                    </select>
                  )}
                </td>

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
                  <button
                    onClick={() => eliminarReserva(r.id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Eliminar
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
