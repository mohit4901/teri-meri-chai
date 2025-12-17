import { useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tableNumber: "",
    name: "",
    phone: "",
    note: "",
  });

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!form.tableNumber || !form.name || !form.phone) {
      alert("Please enter Table Number, Name & Phone");
      return;
    }

    try {
      const res = await api.post("/api/restaurant-order/create", {
        tableNumber: form.tableNumber,
        customer: {
          name: form.name,
          phone: form.phone,
        },
        note: form.note,
        items: cart,
        amount: totalAmount,
      });

      if (!res.data.success) {
        alert("Order creation failed");
        return;
      }

      const { orderId, razorpayOrder } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Restaurant Order",
        description: "Food Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          const verifyRes = await api.post("/api/restaurant-order/verify", {
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
          name: form.name,
          contact: form.phone,
        },

        theme: {
          color: "#EF4444",
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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Place Your Order
      </h1>

      <div className="bg-white shadow rounded-lg p-5 space-y-4">
        {/* Table Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Table Number
          </label>
          <input
            type="text"
            name="tableNumber"
            placeholder="Enter table number"
            value={form.tableNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Food Customisation */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Food Instructions (Optional)
          </label>
          <textarea
            name="note"
            placeholder="e.g. Less spicy, no onion, extra cheese…"
            value={form.note}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded resize-none"
          />
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          className="w-full bg-red-500 text-white py-3 rounded text-lg font-semibold"
        >
          Pay ₹{totalAmount}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
