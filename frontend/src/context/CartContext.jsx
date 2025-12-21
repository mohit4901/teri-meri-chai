import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api"; // ✅ named import

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // ===============================
  // TABLE NUMBER FROM URL
  // ===============================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) setTableNumber(table);
  }, []);

  // ===============================
  // FETCH MENU
  // ===============================
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/api/menu/all");
        setMenu(Array.isArray(res.data.menu) ? res.data.menu : []);
      } catch (err) {
        console.error("Menu fetch error:", err);
        setMenu([]);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);

  // ===============================
  // HELPERS
  // ===============================
  const isSameCustomisation = (a = {}, b = {}) =>
    JSON.stringify(a) === JSON.stringify(b);

  // ===============================
  // ADD ITEM (WITH CUSTOMISATIONS)
  // ===============================
  const addItem = (item) => {
    /*
      Expected item structure:
      {
        _id,
        name,
        price,
        qty,
        customisations,
        note,
        extraPrice,
        finalPrice
      }
    */

    setCart((prev) => {
      const index = prev.findIndex(
        (p) =>
          p._id === item._id &&
          isSameCustomisation(p.customisations, item.customisations) &&
          p.note === item.note
      );

      if (index !== -1) {
        // Same product + same customisation → increase qty
        return prev.map((p, i) =>
          i === index
            ? {
                ...p,
                qty: p.qty + 1,
                finalPrice:
                  p.finalPrice + item.finalPrice,
              }
            : p
        );
      }

      // New product OR different customisation
      return [...prev, item];
    });
  };

  // ===============================
  // REMOVE ITEM (by index-safe id)
  // ===============================
  const removeItem = (index) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  // ===============================
  // QUANTITY CONTROLS
  // ===============================
  const increaseQty = (index) =>
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              qty: item.qty + 1,
              finalPrice:
                item.finalPrice + item.price + item.extraPrice,
            }
          : item
      )
    );

  const decreaseQty = (index) =>
    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index
            ? {
                ...item,
                qty: item.qty - 1,
                finalPrice:
                  item.finalPrice - (item.price + item.extraPrice),
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );

  // ===============================
  // CLEAR CART
  // ===============================
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
