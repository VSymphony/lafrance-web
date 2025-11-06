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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Menú del Restaurante</h2>
      <div className="grid grid-cols-3 gap-6">
        {menu.map((item) => (
          <div key={item.id} className="border rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold">{item.nombre}</h3>
            <p className="text-gray-600">{item.descripcion}</p>
            <p className="font-bold mt-2">S/ {item.precio}</p>
            <button className="bg-green-600 text-white mt-3 px-4 py-2 rounded">
              Agregar al pedido
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
