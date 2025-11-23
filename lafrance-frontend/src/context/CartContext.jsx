import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("carrito")) || []);
  const [direccion, setDireccion] = useState(JSON.parse(localStorage.getItem("direccionCliente")) || null);

  const addToCart = (item) => {
    const exist = cart.find(p => p.id === item.id);
    let updated;
    if (exist) {
      updated = cart.map(p => p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p);
    } else {
      updated = [...cart, { ...item, cantidad: 1 }];
    }
    setCart(updated);
    localStorage.setItem("carrito", JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(p => p.id !== id);
    setCart(updated);
    localStorage.setItem("carrito", JSON.stringify(updated));
  };

  const saveDireccion = (dir) => {
    setDireccion(dir);
    localStorage.setItem("direccionCliente", JSON.stringify(dir));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, direccion, saveDireccion }}>
      {children}
    </CartContext.Provider>
  );
};
