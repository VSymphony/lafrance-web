import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

export default function AdminDashboard() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 text-center">
        <h1 className="text-3xl font-bold mb-6 text-yellow-600">Panel del Administrador</h1>

        <div className="space-y-4">
          <Link
            to="/admin/categorias"
            className="block bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
          >
            Gestionar Categorías
          </Link>

          <Link
            to="/admin/productos"
            className="block bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
          >
            Gestionar Productos
          </Link>

          {/* ✅ Nueva opción: Gestión de Reservas */}
          <Link
            to="/admin/reservas"
            className="block bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
          >
            Gestionar Reservas
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
