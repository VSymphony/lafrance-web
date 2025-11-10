import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // 🧠 Cargar sesión si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        const userData = {
          id: decoded.id || decoded.sub || "",
          nombre:
            decoded.nombre ||
            decoded.name ||
            decoded.username ||
            decoded.user ||
            "",
          role: decoded.role || decoded.rol || "CLIENTE",
        };

        setUser(userData);
        setRole(userData.role);
      } catch (error) {
        console.error("Error decodificando JWT:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // 🔐 Login: guardar token y datos del usuario
  const login = (token) => {
    try {
      const decoded = jwtDecode(token);

      const userData = {
        id: decoded.id || decoded.sub || "",
        nombre:
          decoded.nombre ||
          decoded.name ||
          decoded.username ||
          decoded.user ||
          "",
        role: decoded.role || decoded.rol || "CLIENTE",
      };

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioId", userData.id);
      localStorage.setItem("nombreUsuario", userData.nombre);
      localStorage.setItem("role", userData.role);

      setUser(userData);
      setRole(userData.role);
    } catch (error) {
      console.error("Error guardando token:", error);
    }
  };

  // 🚪 Logout: limpiar todo
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("nombreUsuario");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
