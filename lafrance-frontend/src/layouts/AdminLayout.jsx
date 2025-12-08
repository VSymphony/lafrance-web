import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  LogIn,
  Home,
  Menu,
  X,
  BookOpen,
  Scroll,
  Calendar,
  ClipboardList,
} from "lucide-react";

// Colores basados en el Navbar de La France:
const ACCENT_VINHO = "#7a0000"; 
const ACCENT_HOVER = "#9b0d0d";
const BASE_TEXT_COLOR = "#3e2f1c"; 
const BG_PERGAMINO_CLARO = "#a59374"; 
const SIDEBAR_BG_COLOR = "#a59374"; 

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", icon: Home, label: "Dashboard" },
    { to: "/admin/categorias", icon: BookOpen, label: "Categorías" },
    { to: "/admin/productos", icon: Scroll, label: "Productos" },
    { to: "/admin/reservas", icon: Calendar, label: "Reservas" },
    { to: "/admin/pedidos", icon: ClipboardList, label: "Pedidos" },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 text-center border-b border-[#d7c7a5]/50">
        <h2 className={`text-3xl font-extrabold tracking-wide text-[${BASE_TEXT_COLOR}]`}>
          Panel Admin
        </h2>
      </div>

      <nav className="flex-1 p-5 space-y-3 text-lg">
        {navItems.map((item) => (
          <Link
            key={item.to}
            // APLICANDO NEGRITA AQUÍ
            className={`flex items-center gap-3 py-2 px-4 rounded-lg font-semibold text-[${BASE_TEXT_COLOR}] hover:bg-[${BG_PERGAMINO_CLARO}]/80 hover:text-[${ACCENT_VINHO}] transition`}
            to={item.to}
            onClick={() => setIsSidebarOpen(false)}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Login / Logout */}
      <div className="p-5 border-t border-[#d7c7a5]/50">
        {token ? (
          <button
            onClick={handleLogout}
            // Botón ya usa font-semibold
            className={`w-full flex items-center justify-center gap-2 py-2 bg-[${ACCENT_VINHO}] hover:bg-[${ACCENT_HOVER}] rounded-lg transition text-[#fff9f0] font-semibold`}
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            // Botón ya usa font-semibold
            className={`w-full flex items-center justify-center gap-2 py-2 bg-[${BASE_TEXT_COLOR}] hover:bg-[#2b2014] rounded-lg transition text-white font-semibold`}
          >
            <LogIn size={18} /> Iniciar sesión
          </button>
        )}
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col"
      style={{
        backgroundImage: "url('/images/pergamino-textura.jpg')",
        backgroundColor: "#f8f3e7",
        fontFamily: "'EB Garamond', serif",
        color: BASE_TEXT_COLOR,
      }}
    >
      {/* Capa translúcida */}
      <div className={`bg-[${BG_PERGAMINO_CLARO}]/90 backdrop-blur-sm min-h-screen w-full flex flex-row`}>
        
        {/* Sidebar - Desktop (Fondo Sepia/Arena Suave) */}
        <aside className={`hidden md:flex w-64 flex-col bg-[${SIDEBAR_BG_COLOR}] text-[${BASE_TEXT_COLOR}] shadow-2xl border-r border-[#d7c7a5] fixed md:static h-screen z-20`}>
          <NavContent />
        </aside>

        {/* Contenido principal y cabecera móvil (flex-col) */}
        <div className="flex-1 flex flex-col">
          
          {/* Header/Top Bar for Mobile/Tablet (Fondo Sepia/Arena Suave) */}
          <header className={`md:hidden sticky top-0 bg-[${SIDEBAR_BG_COLOR}] shadow-xl z-10 p-4 flex items-center justify-between text-[${BASE_TEXT_COLOR}]`}>
            <h1 className="text-xl font-bold">Panel Admin</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full text-[${BASE_TEXT_COLOR}] hover:bg-black/10"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </header>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-10 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* Sidebar - Mobile (Drawer) */}
          <aside
            className={`fixed top-0 left-0 w-64 h-full bg-[${SIDEBAR_BG_COLOR}]/95 shadow-xl z-20 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:hidden`}
          >
            <NavContent />
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 p-6 sm:p-10 container mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}