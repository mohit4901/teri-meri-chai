import { useState } from "react";
import { useCart } from "../context/CartContext";
import MenuItemCard from "../components/MenuItemCard";

const categories = ["All", "Chai", "Coffee", "Snacks(All)", "Drinks", "Special"];

const categoryHierarchy = {
  Chai: ["Chai"],
  Coffee: ["Hot Coffee", "Cold Coffee"],
  Drinks: ["Mocktail", "Milk Shake", "Cold Drinks"],
  "Snacks(All)": [
    "Pizza",
    "Garlic Bread",
    "Cheese Garlic Bread",
    "Stick Garlic Bread",
    "Fries",
    "Grilled Sandwich",
    "Bites",
    "Burger",
    "Wraps",
    "Maggie",
    "Pasta",
    "Momos",
    "Spring Roll",
    "Noodles",
    "Manchurian",
    "Chilli Potato",
    "Potato Spring Twister",
    "Paav Baazi",
    "Boiled Sweet Corn",
    "Burgizza",
    "Calzone"
  ],
  Special: ["Special", "Special Pizza", "Combo Offers"]
};

const MenuPage = () => {
  const { menu, loadingMenu, tableNumber } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  if (loadingMenu) {
    return <p className="p-4 text-gray-500">Loading menu...</p>;
  }

  const subCategories =
    activeCategory !== "All"
      ? categoryHierarchy[activeCategory] || []
      : [];

  const filteredMenu = Array.isArray(menu)
    ? menu.filter((item) => {
        if (activeCategory === "All") return true;
        if (activeSubCategory) return item.category === activeSubCategory;
        return categoryHierarchy[activeCategory]?.includes(item.category);
      })
    : [];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-1">Menu</h1>
      <p className="text-gray-500 mb-4">Table {tableNumber}</p>

      {/* CATEGORY BUTTONS */}
      <div className="flex gap-3 overflow-x-auto py-2 mb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setActiveSubCategory(null);
            }}
            className={`px-4 py-2 rounded-full border text-sm ${
              activeCategory === cat
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SUB CATEGORY */}
      {subCategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-2 mb-4">
          {subCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCategory(sub)}
              className={`px-3 py-1 rounded-full border text-xs ${
                activeSubCategory === sub
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* MENU */}
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
