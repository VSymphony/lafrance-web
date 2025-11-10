import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

export default function Pedidos() {
  const [menu, setMenu] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const usuarioId = localStorage.getItem("usuarioId");

  // 🔹 Cargar menú
  useEffect(() => {
    axios
      .get("http://localhost:8070/api/menu")
      .then((res) => setMenu(res.data))
      .catch(() => setMensaje("Error al cargar el menú 😢"));
  }, []);

  // 🔹 Agregar producto al carrito
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

  // 🔹 Quitar producto del carrito
  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  // 🔹 Calcular total
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // 🔹 Confirmar pedido
  const confirmarPedido = async () => {
    if (!usuarioId) {
      setMensaje("⚠️ Debes iniciar sesión para hacer un pedido.");
      return;
    }

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
        usuario_id: Number(usuarioId),
      };

      await axios.post("http://localhost:8070/api/pedidos", pedido);
      setMensaje("✅ Pedido realizado con éxito");
      setCarrito([]);
    } catch {
      setMensaje("❌ Error al enviar el pedido");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pergamino-card mt-10 p-8">
        <h2 className="pergamino-title text-3xl text-center mb-10">
          Hacer un Pedido
        </h2>

        {/* Menú - 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-[#fffdf5] border border-[#e3d4a5] rounded-2xl shadow-md p-5 flex flex-col items-center text-center transition transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={item.imagen || "/placeholder.png"}
                alt={item.nombre}
                className="h-40 w-full object-cover rounded-lg mb-3"
              />
              <h3 className="font-bold text-[#3e2f1c] text-lg">{item.nombre}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.descripcion}</p>
              <p className="text-[#a47528] font-semibold text-base mb-3">
                ${item.precio.toFixed(2)}
              </p>
              <button
                onClick={() => agregarAlCarrito(item)}
                className="sello-btn w-full"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>

        {/* Carrito */}
        <div className="bg-[#fffdf5] border border-[#e3d4a5] p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-[#3e2f1c] mb-5 text-center">
            🧾 Tu Pedido
          </h3>

          {carrito.length === 0 ? (
            <p className="text-gray-600 text-center">Tu carrito está vacío</p>
          ) : (
            <div className="space-y-3">
              {carrito.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-white border border-[#e3d4a5] p-3 rounded-lg shadow-sm"
                >
                  <span className="text-[#3e2f1c]">
                    {p.nombre} x {p.cantidad}
                  </span>
                  <span className="text-[#a47528] font-semibold">
                    ${ (p.precio * p.cantidad).toFixed(2) }
                  </span>
                  <button
                    onClick={() => quitarDelCarrito(p.id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ✖
                  </button>
                </div>
              ))}

              <div className="text-right font-bold text-xl text-[#3e2f1c] mt-4">
                Total: ${total.toFixed(2)}
              </div>

              <button
                onClick={confirmarPedido}
                className="sello-btn w-full mt-6"
              >
                Confirmar Pedido
              </button>
            </div>
          )}
        </div>

        {mensaje && (
          <p className="text-center mt-6 font-semibold text-green-700">
            {mensaje}
          </p>
        )}
      </div>
    </MainLayout>
  );
}
