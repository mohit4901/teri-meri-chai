import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-6 p-4 bg-white shadow rounded">
          <h2 className="text-xl font-bold mb-2">Total: ₹{total}</h2>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded text-lg w-full"
            onClick={() => navigate("/order")}
          >
            Proceed to Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
