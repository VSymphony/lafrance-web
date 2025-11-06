import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8070/api/productos")
      .then(res => setProductos(res.data))
      .catch(() => console.error("Error cargando menú"));
  }, []);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8">🍽️ Nuestro Menú</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {productos.map(p => (
            <div key={p.id} className="bg-white p-4 shadow-lg rounded-xl text-center">
              <img src={p.imagen || "/placeholder.png"} alt={p.nombre} className="h-40 mx-auto rounded-lg mb-3" />
              <h3 className="font-bold text-lg">{p.nombre}</h3>
              <p className="text-gray-600">{p.descripcion}</p>
              <p className="text-yellow-600 font-semibold mt-2">${p.precio}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

