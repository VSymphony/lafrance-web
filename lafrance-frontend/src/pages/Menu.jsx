import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8070/api/productos")
      .then((res) => setProductos(res.data))
      .catch(() => console.error("Error cargando menú"));
  }, []);

  return (
    <MainLayout>
      {/* Fondo tipo pergamino */}
      <div
        className="min-h-screen bg-cover bg-center bg-fixed py-12"
        style={{
          backgroundImage: "url('/images/pergamino-textura.jpg')",
          backgroundColor: "#f8f3e7",
        }}
      >
        {/* Contenedor central */}
        <div className="bg-white/85 max-w-6xl mx-auto p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-amber-800/40">
          
          {/* Encabezado decorativo */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif text-[#3b1d0f] mb-2 drop-shadow-md tracking-wide">
              Notre Carte
            </h2>
            <div className="flex justify-center">
              <img
                src="/images/fleur-divider.png"
                alt="Decoración francesa"
                className="h-6 mt-2 opacity-80"
              />
            </div>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((p) => (
              <div
                key={p.id}
                className="bg-[#fdf6e3] border border-amber-900/30 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
                style={{
                  backgroundImage: "url('/images/pergamino-card.jpg')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Imagen */}
                <img
                  src={p.imagen || "/placeholder.png"}
                  alt={p.nombre}
                  className="h-40 w-full object-cover rounded-lg mb-4 border border-amber-900/30 shadow-md"
                />

                {/* Nombre */}
                <h3 className="text-xl font-bold font-serif text-[#4b1e05] mb-2">
                  {p.nombre}
                </h3>

                {/* Descripción */}
                <p className="text-[#5a3b1a] italic mb-3 leading-relaxed">
                  {p.descripcion}
                </p>

                {/* Precio */}
                <p className="text-lg font-semibold text-[#7a0000]">
                  💰 S/ {p.precio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
