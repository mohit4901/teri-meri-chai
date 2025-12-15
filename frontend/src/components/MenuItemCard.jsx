import { useCart } from "../context/CartContext";

const MenuItemCard = ({ item }) => {
  const { addItem } = useCart();

  return (
    <div className="bg-white shadow rounded p-3 flex flex-col text-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover rounded"
      />

      <h2 className="text-lg font-semibold mt-2">{item.name}</h2>

      <p className="text-gray-600 text-sm">{item.description}</p>

      <p className="font-bold text-lg mt-1">₹{item.price}</p>

      <button
        onClick={() => addItem(item)}
        className="mt-auto bg-red-500 text-white py-1 rounded hover:bg-red-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default MenuItemCard;