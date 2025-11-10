import React, { useEffect, useState } from "react";
import { obtenerMenu } from "../services/menuService";

export default function ClienteMenu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    cargarMenu();
  }, []);

  const cargarMenu = async () => {
    const res = await obtenerMenu();
    setMenu(res.data);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed py-10"
      style={{
        backgroundImage: "url('/images/pergamino-textura.jpg')",
        backgroundColor: "#f8f3e7",
      }}
    >
      <div className="bg-white/85 max-w-6xl mx-auto p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-amber-800/30">
        <h2 className="text-3xl font-serif text-center text-[#3b1d0f] mb-8 drop-shadow-md">
          🍽️ Menú del Restaurante La France
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-[#fdf6e3] border border-amber-900/30 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
              style={{
                backgroundImage: "url('/images/pergamino-card.jpg')",
                backgroundSize: "cover",
              }}
            >
              <h3 className="text-xl font-bold font-serif text-[#4b1e05] mb-2">
                {item.nombre}
              </h3>
              <p className="text-[#5a3b1a] italic mb-3">{item.descripcion}</p>
              <p className="text-lg font-semibold text-[#7a0000]">
                💰 S/ {item.precio}
              </p>

              <button className="sello-btn w-full mt-4">
                Agregar al pedido
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
