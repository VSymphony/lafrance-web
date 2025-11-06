import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function Pedidos() {
  const [menu, setMenu] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Cargar menú desde el backend
  useEffect(() => {
    axios
      .get("http://localhost:8070/api/menu")
      .then((res) => setMenu(res.data))
      .catch(() => setMensaje("Error al cargar el menú 😢"));
  }, []);

  // Agregar producto al carrito
  const agregarAlCarrito = (item) => {
    const existente = carrito.find((p) => p.id === item.id);
    if (existente) {
      setCarrito(
        carrito.map((p) =>
          p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...item, cantidad: 1 }]);
    }
  };

  // Quitar un producto del carrito
  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  // Calcular total
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // Confirmar pedido (enviar al backend)
  const confirmarPedido = async () => {
    if (carrito.length === 0) {
      setMensaje("Tu carrito está vacío 🛒");
      return;
    }

    try {
      const pedido = {
        fecha_pedido: new Date().toISOString().slice(0, 10),
        estado: "PENDIENTE",
        total,
        detalles: carrito.map((item) => ({
          menu_id: item.id,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad,
        })),
        usuario_id: 2, // ⚠️ Cambia esto para tomar el ID real del usuario autenticado
      };

      await axios.post("http://localhost:8070/api/pedidos", pedido);

      setMensaje("✅ Pedido realizado con éxito");
      setCarrito([]);
    } catch {
      setMensaje("Error al enviar el pedido ❌");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8">🛍️ Hacer Pedido</h2>

        {/* Menú de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={item.imagen || "/placeholder.png"}
                alt={item.nombre}
                className="h-32 rounded mb-3"
              />
              <h3 className="font-bold">{item.nombre}</h3>
              <p className="text-gray-500">{item.descripcion}</p>
              <p className="text-yellow-600 font-semibold mt-2">
                ${item.precio.toFixed(2)}
              </p>
              <button
                onClick={() => agregarAlCarrito(item)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-3"
              >
                Agregar
              </button>
            </div>
          ))}
        </div>

        {/* Carrito */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">🧾 Carrito</h3>

          {carrito.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {carrito.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
                >
                  <span>
                    {p.nombre} x {p.cantidad}
                  </span>
                  <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                  <button
                    onClick={() => quitarDelCarrito(p.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✖
                  </button>
                </div>
              ))}
              <div className="text-right font-bold text-xl mt-4">
                Total: ${total.toFixed(2)}
              </div>
              <button
                onClick={confirmarPedido}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded w-full mt-4"
              >
                Confirmar Pedido
              </button>
            </div>
          )}
        </div>

        {mensaje && (
          <p className="text-center mt-6 font-semibold text-green-600">
            {mensaje}
          </p>
        )}
      </div>
    </MainLayout>
  );
}
