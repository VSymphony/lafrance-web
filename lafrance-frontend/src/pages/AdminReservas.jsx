import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function AdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

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

  const actualizarEstado = async (id, estado) => {
    const reserva = reservas.find((r) => r.id === id);
    if (!reserva) return;

    if (estado === "CONFIRMADA" && !reserva.mesa) {
      alert("❌ Debes asignar una mesa antes de confirmar la reserva.");
      return;
    }
    if (reserva.estado === "CONFIRMADA") {
      alert("⚠️ Esta reserva ya está confirmada y no se puede modificar.");
      return;
    }
    if (reserva.estado === "RECHAZADA") {
      alert("⚠️ Esta reserva ya fue rechazada y no se puede modificar.");
      return;
    }

    try {
      await axios.put(`http://localhost:8070/api/reservas/${id}/estado`, { estado });
      await fetchData();
      alert(`✅ Reserva ${estado.toLowerCase()} correctamente.`);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const asignarMesa = async (id, mesaId) => {
    if (!mesaId) {
      alert("❌ Debes seleccionar una mesa válida.");
      return;
    }

    try {
      await axios.put(`http://localhost:8070/api/reservas/${id}/mesa`, { mesaId });
      await fetchData();
    } catch (err) {
      console.error("Error al asignar mesa:", err);
    }
  };

  const eliminarReserva = async (id) => {
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

  const reservasFiltradas = reservas.filter((r) => {
    const nombre = r.usuario?.nombre?.toLowerCase() || "";
    const estado = r.estado.toLowerCase();
    const termino = busqueda.toLowerCase();
    return nombre.includes(termino) || estado.includes(termino);
  });

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pergamino-card mt-10 p-8">
        <h1 className="pergamino-title text-3xl text-center mb-6">
          Gestión de Reservas
        </h1>

        {/* 🔍 Buscador */}
        <div className="flex justify-between mb-6 items-center">
          <input
            type="text"
            placeholder="Buscar por cliente o estado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pergamino-input w-1/2"
          />
          <button
            onClick={() => setBusqueda("")}
            className="sello-btn dorado sm"
          >
            Limpiar
          </button>
        </div>

        {/* 🧾 Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border border-[#d2b48c] rounded-md text-center">
            <thead className="bg-[#f8ecd1]">
              <tr>
                <th className="border border-[#d2b48c] px-4 py-2">Cliente</th>
                <th className="border border-[#d2b48c] px-4 py-2">Correo</th>
                <th className="border border-[#d2b48c] px-4 py-2">Teléfono</th>
                <th className="border border-[#d2b48c] px-4 py-2">Fecha y Hora</th>
                <th className="border border-[#d2b48c] px-4 py-2">Personas</th>
                <th className="border border-[#d2b48c] px-4 py-2">Mesa</th>
                <th className="border border-[#d2b48c] px-4 py-2">Estado</th>
                <th className="border border-[#d2b48c] px-4 py-2">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.length > 0 ? (
                reservasFiltradas.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fff9ee] transition">
                    <td className="border border-[#d2b48c] px-4 py-2">
                      {r.usuario?.nombre ?? "—"}
                    </td>
                    <td className="border border-[#d2b48c] px-4 py-2">
                      {r.usuario?.correo ?? "—"}
                    </td>
                    <td className="border border-[#d2b48c] px-4 py-2">
                      {r.usuario?.telefono ?? "—"}
                    </td>
                    <td className="border border-[#d2b48c] px-4 py-2">
                      {new Date(r.fechaHora).toLocaleString()}
                    </td>
                    <td className="border border-[#d2b48c] px-4 py-2">
                      {r.numeroPersonas}
                    </td>

                    <td className="border border-[#d2b48c] px-4 py-2">
                      {r.mesa ? (
                        `Mesa ${r.mesa.numero}`
                      ) : (
                        <select
                          defaultValue=""
                          onChange={(e) =>
                            asignarMesa(r.id, parseInt(e.target.value))
                          }
                          className="pergamino-input"
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

                    <td
                      className={`border border-[#d2b48c] px-4 py-2 font-semibold ${
                        r.estado === "CONFIRMADA"
                          ? "text-green-700"
                          : r.estado === "RECHAZADA"
                          ? "text-red-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {r.estado}
                    </td>

                    <td className="border border-[#d2b48c] px-4 py-2 flex gap-2 justify-center">
                      <button
                        disabled={
                          r.estado === "CONFIRMADA" || r.estado === "RECHAZADA"
                        }
                        onClick={() => actualizarEstado(r.id, "CONFIRMADA")}
                        className={`sello-btn azul sm ${
                          r.estado === "CONFIRMADA" || r.estado === "RECHAZADA"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Confirmar
                      </button>

                      <button
                        disabled={
                          r.estado === "CONFIRMADA" || r.estado === "RECHAZADA"
                        }
                        onClick={() => actualizarEstado(r.id, "RECHAZADA")}
                        className={`sello-btn sm ${
                          r.estado === "CONFIRMADA" || r.estado === "RECHAZADA"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Rechazar
                      </button>

                      <button
                        onClick={() => eliminarReserva(r.id)}
                        className="sello-btn dorado sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-[#7b1e1e] p-4 italic"
                  >
                    No se encontraron reservas que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
