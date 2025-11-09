import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function ClienteReservas() {
  const [form, setForm] = useState({
    telefono: "",
    personas: 1,
    fecha: "",
    hora: "",
  });

  const usuarioId = localStorage.getItem("usuarioId");

  // 🔹 Obtener teléfono del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await axios.get(`http://localhost:8070/api/usuarios/${usuarioId}`);
        setForm((prev) => ({ ...prev, telefono: res.data.telefono }));
      } catch (err) {
        console.error("Error al cargar usuario:", err);
      }
    };
    if (usuarioId) fetchUsuario();
  }, [usuarioId]);

  // 🔹 Manejar cambios de inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Enviar reserva al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioId) {
      alert("⚠️ Debes iniciar sesión antes de hacer una reserva.");
      return;
    }

    try {
      const fechaHora = `${form.fecha}T${form.hora}:00`;

      const body = {
        usuarioId: Number(usuarioId),
        telefono: form.telefono,
        numeroPersonas: form.personas,
        fechaHora,
      };

      console.log("📤 Enviando al backend:", body);

      await axios.post("http://localhost:8070/api/reservas", body);
      alert("✅ Reserva registrada con éxito.");
      setForm({ telefono: form.telefono, personas: 1, fecha: "", hora: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar la reserva.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Hacer una Reserva</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personas */}
          <div>
            <h2>Cantidad de Personas</h2>
            <input
              name="personas"
              type="number"
              min="1"
              className="border p-2 w-full rounded"
              value={form.personas}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha */}
          <div>
            <h2>Fecha de la Reserva</h2>
            <input
              name="fecha"
              type="date"
              className="border p-2 w-full rounded"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hora */}
          <div>
            <h2>Hora de la Reserva</h2>
            <select
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Seleccionar hora</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="20:00">9:00 PM</option>
              <option value="20:00">10:00 PM</option>
            </select>
          </div>

            {/* Teléfono */}
          <div>
            <h2>Teléfono de contacto</h2>
            <input
              name="telefono"
              type="tel"
              className="border p-2 w-full rounded bg-gray-100 text-gray-700"
              value={form.telefono}
              readOnly
            />
          </div>

          {/* Botón */}
          <button
            className="bg-[#0a1f44] hover:bg-[#7b1e1e] text-white py-2 px-4 rounded w-full font-serif transition-colors duration-300"
          >
            Reservar
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
