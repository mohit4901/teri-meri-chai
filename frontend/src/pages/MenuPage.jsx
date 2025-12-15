import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import MenuItemCard from "../components/MenuItemCard";

// React UI categories
const categories = ["All", "Chai", "Coffee", "Snacks(All)", "Drinks", "Special"];

// Mapping MongoDB categories → React categories
const categoryMap = {
  "Hot Coffee": "Coffee",
  "Cold Coffee": "Coffee",
  "Mocktail": "Drinks",
  "Milk Shake": "Drinks",
  "Drinks": "Drinks",
  "Pizza": "Snacks(All)",
  "Garlic Bread": "Snacks(All)",
  "Fries": "Snacks(All)",
  "Sandwich": "Snacks(All)",
  "Bites": "Snacks(All)",
  "Burger": "Snacks(All)",
  "Wraps": "Snacks(All)",
  "Maggie": "Snacks(All)",
  "Momos": "Snacks(All)",
  "Pasta": "Snacks(All)",
  "Rolls": "Snacks(All)",
  "Special Pizza": "Special",
  "Special": "Special",
};

const MenuPage = () => {
  const { menu, setMenu, tableNumber } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch Menu from Backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/api/menu/all");
  
        if (res.data.success) {
          const normalizedMenu = res.data.menu.map((item) => ({
            ...item,
            category: categoryMap[item.category] || "Snacks(All)",
          }));
  
          setMenu(normalizedMenu);
        }
      } catch (err) {
        console.error("Menu Fetch Error:", err);
      }
    };
  
    fetchMenu();
  }, []);
  
  // Filter logic
  const filteredMenu =
    activeCategory === "All"
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  // Recommended items
  const recommended = menu.filter((item) => item.recommended === true);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-1">Menu</h1>
      <p className="text-gray-500 mb-4">Table {tableNumber}</p>

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto py-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm transition
              ${
                activeCategory === cat
                  ? "bg-red-500 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">⭐ Recommended</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommended.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Menu Section */}
      <h2 className="text-xl font-semibold mb-3">
        {activeCategory === "All" ? "All Items" : activeCategory}
      </h2>

      {filteredMenu.length === 0 ? (
        <p className="text-gray-500">No items available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMenu.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
