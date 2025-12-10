import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8070/api/productos")
      .then((res) => setProductos(res.data))
      .catch(() => setMensaje("Error cargando el menú 😢"));
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pergamino-card mt-10 p-8">
        {/* Encabezado */}
        <h2 className="pergamino-title text-3xl text-center mb-10">
          Notre Carte
        </h2>

        {mensaje && (
          <p className="text-center mt-6 font-semibold text-red-600">
            {mensaje}
          </p>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos
            .filter((p) => p.activo) // <-- mostrar solo habilitados
            .map((p) => (
              <div key={p.id} className="bg-[#fffdf5] border border-[#e3d4a5] rounded-2xl shadow-md p-5 flex flex-col items-center text-center transition transform hover:scale-105 hover:shadow-lg">
                <img src={p.imagen_url || "/placeholder.png"} alt={p.nombre} className="h-40 w-full object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-[#3e2f1c] text-lg mb-1">{p.nombre}</h3>
                <p className="text-gray-600 text-sm mb-3">{p.descripcion}</p>
                <p className="text-[#a47528] font-semibold text-base">S/ {p.precio.toFixed(2)}</p>
              </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
