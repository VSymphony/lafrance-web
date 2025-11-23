import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

export default function Carrito() {
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );

  const [direccionGuardada, setDireccionGuardada] = useState(
    JSON.parse(localStorage.getItem("direccionCliente")) || null
  );

  const quitarDelCarrito = (id) => {
    const actualizado = carrito.filter((p) => p.id !== id);
    setCarrito(actualizado);
    localStorage.setItem("carrito", JSON.stringify(actualizado));
  };

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const confirmarPedido = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para confirmar el pedido.");
      return;
    }

    if (!direccionGuardada) {
      alert("Debes seleccionar una dirección.");
      return;
    }

    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const pedido = {
      direccion: direccionGuardada.direccion,
      lat: direccionGuardada.lat,
      lng: direccionGuardada.lng,
      total,
      detalles: carrito.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad,
      })),
    };

    try {
      const res = await fetch("http://localhost:8070/api/pedidos/confirmar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(pedido),
      });

      let data = null;
      try {
        data = await res.json(); // ✅ siempre JSON gracias al DTO PedidoResponse
      } catch {
        data = { message: "Respuesta vacía del servidor", pedidoId: null };
      }

      if (!res.ok) {
        alert("Error al confirmar pedido: " + data.message);
        return;
      }

      alert(data.message + " 🎉 (ID: " + data.pedidoId + ")");

      // Vaciar carrito y dirección
      localStorage.removeItem("carrito");
      localStorage.removeItem("direccionCliente");
      setCarrito([]);
      setDireccionGuardada(null);

      // Redirigir a historial de pedidos
      window.location.href = "/pedidos";
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mt-10 pergamino-card p-8">
        <h2 className="text-3xl pergamino-title text-center mb-6">🛒 Tu Carrito</h2>

        {carrito.length === 0 ? (
          <p className="text-center text-gray-600">El carrito está vacío</p>
        ) : (
          <>
            {carrito.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white border p-3 rounded-lg shadow mb-3"
              >
                <span>{item.nombre} x {item.cantidad}</span>
                <strong>${(item.precio * item.cantidad).toFixed(2)}</strong>
                <button
                  className="text-red-600 font-bold"
                  onClick={() => quitarDelCarrito(item.id)}
                >
                  ✖
                </button>
              </div>
            ))}

            <div className="text-right font-bold text-xl mt-4">
              Total: ${total.toFixed(2)}
            </div>

            {!direccionGuardada ? (
              <button
                className="btn sello-btn mt-6"
                onClick={() => (window.location.href = "/carrito/direccion")}
              >
                Elegir Dirección
              </button>
            ) : (
              <>
                <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mt-6">
                  <h3 className="font-bold mb-1">📍 Dirección de Entrega</h3>
                  <p>{direccionGuardada.direccion}</p>

                  <button
                    className="mt-3 text-blue-600 underline"
                    onClick={() => (window.location.href = "/carrito/direccion")}
                  >
                    Cambiar dirección
                  </button>
                </div>

                <button
                  className="btn sello-btn mt-6 w-full"
                  onClick={confirmarPedido}
                >
                  Confirmar Pedido
                </button>
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}