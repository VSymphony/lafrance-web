import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginAs } = useAuth();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axios.post("http://localhost:8070/api/usuarios/login", {
      correo,
      contrasena,
    });

    const user = response.data;

    if (user && user.rol) {
      // 🔥 Guardar los datos del usuario en localStorage
      localStorage.setItem("usuarioId", user.id);
      localStorage.setItem("usuarioNombre", user.nombre);
      localStorage.setItem("usuarioCorreo", user.correo);
      localStorage.setItem("usuarioRol", user.rol.nombre.toUpperCase());

      loginAs(user.rol.nombre.toUpperCase());

      // 🟢 Redirige según el rol
      if (user.rol.nombre.toUpperCase() === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/cliente");
      }
    } else {
      setError("Credenciales inválidas");
    }
  } catch (err) {
    console.error("❌ Error de login:", err);
    setError("Error al conectar con el servidor");
  }
};


  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Iniciar Sesión
          </button>
          <p className="text-center mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/registro" className="text-blue-600 hover:underline">
              Crear una cuenta
            </a>
          </p>

        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </MainLayout>
  );
}
