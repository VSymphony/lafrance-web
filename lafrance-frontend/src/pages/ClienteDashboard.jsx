import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ClienteDashboard() {
  const [nombreCliente, setNombreCliente] = useState("");
  const usuarioId = localStorage.getItem("usuarioId");

  useEffect(() => {
    const fetchNombre = async () => {
      try {
        const res = await axios.get(`http://localhost:8070/api/usuarios/${Number(usuarioId)}`);
        setNombreCliente(res.data.nombre);
      } catch (err) {
        console.error("Error al obtener nombre del cliente:", err);
      }
    };

    if (usuarioId) fetchNombre();
  }, [usuarioId]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto text-center py-12 px-4">
        <motion.h1
          className="text-4xl font-serif text-[#0a1f44] text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Bienvenue, {nombreCliente || "Cliente"}
        </motion.h1>

        <p className="text-center text-gray-600 mb-10 italic">
          “La cuisine est l’art de transformer les produits en émotions.”
        </p>

        <motion.p
          className="text-gray-600 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explora nuestro menú, haz tus reservas y disfruta de la mejor experiencia gastronómica francesa.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-serif text-[#0a1f44] mb-2">🍷 Explora el Menú</h3>
            <p className="text-gray-600 text-sm mb-4">Descubre nuestras especialidades francesas con ingredientes auténticos.</p>
            <Link to="/menu" className="text-[#7b1e1e] font-medium hover:underline">Ver carta</Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-serif text-[#0a1f44] mb-2">📅 Tus Reservas</h3>
            <p className="text-gray-600 text-sm mb-4">Realiza tu próxima reserva en La France.</p>
            <Link to="/reservas" className="text-[#7b1e1e] font-medium hover:underline">Ver reservas</Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-serif text-[#0a1f44] mb-2">🛒 Pedidos Online</h3>
            <p className="text-gray-600 text-sm mb-4">Haz tus pedidos y recibelos en la comodidad de tu casa.</p>
            <Link to="/pedidos" className="text-[#7b1e1e] font-medium hover:underline">Hacer pedido</Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}