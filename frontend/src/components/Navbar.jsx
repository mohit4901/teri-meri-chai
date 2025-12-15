import { useCart } from "../context/CartContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { cart } = useCart();
  const location = useLocation();

  // Hide navbar on welcome page
  if (location.pathname === "/") return null;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center mb-4 sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-red-600">
        Teri Meri Chai
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/menu"
          className="text-gray-700 hover:text-red-600 transition"
        >
          Menu
        </Link>

        <Link
          to="/cart"
          className="relative text-gray-700 hover:text-red-600 transition"
        >
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
