import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { increaseQty, decreaseQty, removeItem } = useCart();

  return (
    <div className="flex items-center bg-white p-3 shadow rounded">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded mr-3"
      />

      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <p className="text-gray-700">₹{item.price}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            className="px-2 bg-gray-200 rounded"
            onClick={() => decreaseQty(item._id)}
          >
            −
          </button>

          <span className="text-lg">{item.qty}</span>

          <button
            className="px-2 bg-gray-200 rounded"
            onClick={() => increaseQty(item._id)}
          >
            +
          </button>

          <button
            className="ml-4 text-red-500"
            onClick={() => removeItem(item._id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
