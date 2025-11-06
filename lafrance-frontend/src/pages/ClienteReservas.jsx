import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function ClienteReservas() {
  const [form, setForm] = useState({
    telefono: "",
    personas: 1,
    fecha: "",
    hora: "",
  });

  const usuarioId = localStorage.getItem("usuarioId"); // 🔗 viene del login

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioId) {
      alert("⚠️ Debes iniciar sesión antes de hacer una reserva.");
      return;
    }

    try {
      // 🕒 Combinar fecha + hora
      const fechaHora = `${form.fecha}T${form.hora}:00`;

      const body = {
        usuarioId: Number(usuarioId), // ✅ Enviamos el ID del usuario
        telefono: form.telefono,
        numeroPersonas: form.personas,
        fechaHora,
      };

      console.log("📤 Enviando al backend:", body); // DEBUG

      await axios.post("http://localhost:8070/api/reservas", body);
      alert("✅ Reserva registrada con éxito.");
      setForm({ telefono: "", personas: 1, fecha: "", hora: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar la reserva.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Hacer una Reserva
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2>
            Cantidad de Personas
          </h2>
          <input
            name="personas"
            type="number"
            min="1"
            className="border p-2 w-full rounded"
            value={form.personas}
            onChange={handleChange}
            required
          />
          <h2>
            Fecha de la Reserva
          </h2>
          <input
            name="fecha"
            type="date"
            className="border p-2 w-full rounded"
            value={form.fecha}
            onChange={handleChange}
            required
          />
          <h2>
            Hora de la Reserva
          </h2>
          <input
            name="hora"
            type="time"
            className="border p-2 w-full rounded"
            value={form.hora}
            onChange={handleChange}
            required
          />
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded w-full">
            Reservar
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
