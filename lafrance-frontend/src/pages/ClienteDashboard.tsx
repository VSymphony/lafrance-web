import MainLayout from "../layouts/MainLayout";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ClienteDashboard() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto text-center py-12">
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ¡Bienvenido a La France! 🇫🇷
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explora nuestro menú, haz tus reservas y disfruta de la mejor experiencia gastronómica francesa.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            to="/menu"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-6 rounded-2xl shadow-md font-semibold transition"
          >
            🍷 Ver Menú
          </Link>

          <Link
            to="/reservas"
            className="bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-2xl shadow-md font-semibold transition"
          >
            📅 Reservar
          </Link>

          <Link
            to="/pedidos"
            className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-2xl shadow-md font-semibold transition"
          >
            🛒 Hacer Pedido
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
