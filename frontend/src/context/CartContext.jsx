import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Table number
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) setTableNumber(table);
  }, []);

  // ✅ SINGLE SOURCE OF TRUTH — MENU FETCH
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/menu/all`
        );
        if (!res.ok) throw new Error("Menu fetch failed");

        const data = await res.json();
        // backend response: { success: true, menu: [] }
        setMenu(Array.isArray(data.menu) ? data.menu : []);
      } catch (err) {
        console.error("Menu Fetch Error:", err);
        setMenu([]);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, []);

  const addItem = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === item._id);
      if (exists) {
        return prev.map((p) =>
          p._id === item._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id) =>
    setCart((prev) => prev.filter((item) => item._id !== id));

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        menu,
        loadingMenu,
        tableNumber,
        addItem,
        removeItem,
        increaseQty,
        decreaseQty,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
