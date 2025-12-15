import { useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const { cart, tableNumber, clearCart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // CREATE ORDER + START PAYMENT
  // -----------------------------
  const handlePayment = async () => {
    if (!customer.name || !customer.phone) {
      alert("Please enter name & phone");
      return;
    }

    try {
      // 1️⃣ Create Razorpay order from backend
      const res = await api.post("/restaurant-order/create", {
        tableNumber,
        customer,
        items: cart,
        amount: totalAmount,
      });

      if (!res.data.success) {
        alert("Order creation failed");
        return;
      }

      const { orderId, razorpayOrder } = res.data;

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Restaurant Order",
        description: "Food Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          // 3️⃣ Verify payment on backend
          const verifyRes = await api.post("/restaurant-order/verify", {
            orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            clearCart();
            navigate("/verify?status=success");
          } else {
            navigate("/verify?status=failed");
          }
        },

        prefill: {
          name: customer.name,
          contact: customer.phone,
        },

        theme: {
          color: "#EF4444", // Tailwind red-500
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment setup failed");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Enter Details</h1>

      {tableNumber ? (
        <p className="text-gray-600 mb-4">Table Number: {tableNumber}</p>
      ) : (
        <p className="text-red-600 mb-4">
          Table number missing — scan QR again.
        </p>
      )}

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={customer.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          value={customer.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handlePayment}
          className="w-full bg-red-500 text-white py-2 rounded text-lg"
        >
          Pay ₹{totalAmount}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
