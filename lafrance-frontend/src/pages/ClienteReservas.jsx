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
      <div className="max-w-md mx-auto pergamino-card mt-10">
        <h2 className="pergamino-title text-3xl">Hacer una Reserva</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personas */}
          <div>
            <label className="block mb-1 font-semibold text-[#3e2f1c]">Cantidad de Personas</label>
            <input
              name="personas"
              type="number"
              min="1"
              className="pergamino-input w-full"
              value={form.personas}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block mb-1 font-semibold text-[#3e2f1c]">Fecha de la Reserva</label>
            <input
              name="fecha"
              type="date"
              className="pergamino-input w-full"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block mb-1 font-semibold text-[#3e2f1c]">Hora de la Reserva</label>
            <select
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className="pergamino-input w-full"
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
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block mb-1 font-semibold text-[#3e2f1c]">Teléfono de contacto</label>
            <input
              name="telefono"
              type="tel"
              className="pergamino-input w-full bg-[#fffdf5] text-gray-700"
              value={form.telefono}
              readOnly
            />
          </div>

          {/* Botón */}
          <button
            className="sello-btn w-full mt-4"
          >
            Reservar
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
