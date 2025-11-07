import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function AdminDashboard() {
  return (
    <MainLayout>
  <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 text-center">
    <h1 className="text-3xl font-bold mb-6 text-yellow-600 font-serif">Panel del Administrador</h1>

    <div className="space-y-4">
      <Link
        to="/admin/categorias"
        className="block bg-[#0a1f44] hover:bg-[#7b1e1e] text-white py-3 rounded-lg font-serif transition-colors duration-300"
      >
        Gestionar Categorías
      </Link>

      <Link
        to="/admin/productos"
        className="block bg-[#0a1f44] hover:bg-[#7b1e1e] text-white py-3 rounded-lg font-serif transition-colors duration-300"
      >
        Gestionar Productos
      </Link>

      <Link
        to="/admin/reservas"
        className="block bg-[#0a1f44] hover:bg-[#7b1e1e] text-white py-3 rounded-lg font-serif transition-colors duration-300"
      >
        Gestionar Reservas
      </Link>

      <Link
        to="/admin/pedidos"
        className="block bg-[#0a1f44] hover:bg-[#7b1e1e] text-white py-3 rounded-lg font-serif transition-colors duration-300"
      >
        Gestionar Pedidos
      </Link>
    </div>
  </div>
</MainLayout>
  );
}
