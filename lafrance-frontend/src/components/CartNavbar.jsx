import { useEffect, useState } from "react";

export default function CartNavbar() {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carritoGuardado.reduce((acc, item) => acc + item.cantidad, 0);
    setCantidad(total);

    const actualizar = () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      setCantidad(carrito.reduce((acc, item) => acc + item.cantidad, 0));
    };

    window.addEventListener("carritoUpdate", actualizar);
    return () => window.removeEventListener("carritoUpdate", actualizar);
  }, []);

  return (
    <div className="relative">
      <span className="text-2xl">🛒</span>

      {cantidad > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2 py-0.5">
          {cantidad}
        </span>
      )}
    </div>
  );
}
