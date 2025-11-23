import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ConfirmacionPedido() {
  const { cart, direccion } = useCart();
const { user } = useAuth(); // info del usuario
  const navigate = useNavigate();

  const total = cart.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  const enviarPedido = async () => {
  try {
    const res = await fetch("http://localhost:8070/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        clienteId: user.id,
        direccion,
        items: cart,
        total,
      }),
    });

    const data = await res.json(); // ✅ siempre JSON gracias al DTO PedidoResponse

    if (!res.ok) {
      alert("Error al procesar el pedido: " + data.message);
      return;
    }

    alert(data.message + " 🎉 (ID: " + data.pedidoId + ")");
    navigate("/pedido-finalizado");
  } catch (error) {
    console.error(error);
    alert("Error de conexión con el servidor.");
  }
};

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Confirmar pedido</h2>

      <h3 className="font-semibold">Cliente:</h3>
      <p>{user.nombre} ({user.email})</p>

      <h3 className="font-semibold mt-4">Dirección:</h3>
      <p>{direccion}</p>

      <h3 className="font-semibold mt-4">Productos:</h3>
      <ul>
        {cart.map((item, i) => (
          <li key={i}>
            {item.nombre} x{item.cantidad} - {item.precio} Bs.
          </li>
        ))}
      </ul>

      <h3 className="font-semibold mt-4">Total:</h3>
      <p className="text-xl font-bold">{total} Bs.</p>

      <button
        className="bg-green-600 text-white mt-5 py-3 px-5 rounded"
        onClick={enviarPedido}
      >
        Finalizar Pedido
      </button>
    </div>
  );
}
