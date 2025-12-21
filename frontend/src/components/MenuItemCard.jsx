import { useState } from "react";
import { useCart } from "../context/CartContext";
import ProductCustomizationModal from "./ProductCustomizationModal";

const MenuItemCard = ({ item }) => {
  const { addItem } = useCart();
  const [showCustomization, setShowCustomization] = useState(false);

  const handleAddToCart = (data) => {
    /*
      data structure coming from ProductCustomizationModal:
      {
        product,
        customisations,
        note,
        extraPrice
      }
    */

    addItem({
      ...data.product,
      qty: 1,
      customisations: data.customisations,
      note: data.note,
      extraPrice: data.extraPrice,
      finalPrice: data.product.price + data.extraPrice,
    });

    setShowCustomization(false);
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white shadow rounded p-3 flex flex-col text-center">
        <h2 className="text-lg font-semibold mt-2">
          {item.name}
        </h2>

        {item.description && (
          <p className="text-gray-600 text-sm">
            {item.description}
          </p>
        )}

        <p className="font-bold text-lg mt-1">
          ₹{item.price}
        </p>

        <button
          onClick={() => setShowCustomization(true)}
          className="mt-auto bg-red-500 text-white py-1.5 rounded hover:bg-red-600 transition"
        >
          Add to Cart
        </button>
      </div>

      {/* CUSTOMIZATION MODAL */}
      {showCustomization && (
        <ProductCustomizationModal
          product={item}
          onClose={() => setShowCustomization(false)}
          onConfirm={handleAddToCart}
        />
      )}
    </>
  );
};

export default MenuItemCard;

