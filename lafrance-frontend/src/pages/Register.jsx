import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8070/api/usuarios/registro", form);
      alert("✅ Cuenta creada con éxito. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("❌ Error al crear la cuenta. Intenta con otro correo.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="sello-btn dorado"
          >
            Registrarse
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </MainLayout>
  );
}
