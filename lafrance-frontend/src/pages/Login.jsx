import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ login viene del contexto

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8070/api/auth/login", {
        correo,
        contrasena,
      });

      console.log("✅ Respuesta del backend:", response.data);

      // 🔍 Decodificar token
      const decoded = jwtDecode(response.data.token);
      console.log("🧩 Token decodificado:", decoded);

      if (response.data.token) {
  const decoded = jwtDecode(response.data.token);
  console.log("🧩 Token decodificado:", decoded);

  // Guarda todos los datos
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("usuarioId", decoded.id);
  localStorage.setItem("nombreUsuario", decoded.nombre);
  localStorage.setItem("role", decoded.rol);

  login(response.data.token);

  const rol = decoded.rol || decoded.role;
  if (rol === "ADMIN") navigate("/admin");
  else navigate("/cliente");


        
      } else {
        alert("❌ Credenciales inválidas");
      }
    } catch (error) {
      console.error("🚨 Error en login:", error);
      alert("⚠️ Error al iniciar sesión");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-10 pergamino-card">
        <h2 className="pergamino-title text-3xl mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-[#3e2f1c]">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="pergamino-input w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-[#3e2f1c]">
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="pergamino-input w-full"
            />
          </div>

          <button type="submit" className="sello-btn w-full mt-4">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
