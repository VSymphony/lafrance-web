import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [direccionCliente, setDireccionCliente] = useState(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        direccionCliente,
        setDireccionCliente
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
