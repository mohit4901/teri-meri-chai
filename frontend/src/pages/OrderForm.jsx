import { useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("dine-in"); // dine-in | takeaway

  const [form, setForm] = useState({
    tableNumber: "",
    name: "",
    phone: "",
    note: ""
  });

  const baseAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const totalAmount = baseAmount;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!form.name || !form.phone) {
      alert("Please enter Name & Phone");
      return;
    }

    if (orderType === "dine-in" && !form.tableNumber) {
      alert("Please enter Table Number for Dine In");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      // 🔹 CREATE RAZORPAY ORDER
      const res = await api.post("/api/restaurant-order/create", {
        amount: totalAmount
      });

      if (!res.data.success) {
        alert("Unable to initiate payment");
        return;
      }

      const { razorpayOrder } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Teri Meri Chai",
        description: "Food Order Payment",
        order_id: razorpayOrder.id,

        // 🔥 FIXED VERIFY HANDLER
        handler: async function (response) {
          try {
            const verifyRes = await api.post(
              "/api/restaurant-order/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                tableNumber:
                  orderType === "dine-in"
                    ? form.tableNumber
                    : "TAKEAWAY",

                customerName: form.name,
                customerMobile: form.phone,

                items: cart,
                subtotal: baseAmount,
                tax: 0,
                total: totalAmount,
                notes: form.note
              }
            );

            if (verifyRes.data.success) {
              clearCart();
              navigate("/verify?status=success");
            } else {
              navigate("/verify?status=failed");
            }
          } catch (err) {
            console.error("VERIFY ERROR 👉", err);
            navigate("/verify?status=failed");
          }
        },

        prefill: {
          name: form.name,
          contact: form.phone
        },

        theme: { color: "#EF4444" }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("PAYMENT SETUP ERROR 👉", err);
      alert("Payment setup failed");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Place Your Order
      </h1>

      <div className="bg-white shadow rounded-lg p-5 space-y-5">
        {/* Order Type */}
        <div className="flex gap-3">
          <button
            onClick={() => setOrderType("dine-in")}
            className={`flex-1 py-2 rounded font-semibold ${
              orderType === "dine-in"
                ? "bg-red-500 text-white"
                : "border"
            }`}
          >
            Dine In
          </button>

          <button
            onClick={() => setOrderType("takeaway")}
            className={`flex-1 py-2 rounded font-semibold ${
              orderType === "takeaway"
                ? "bg-red-500 text-white"
                : "border"
            }`}
          >
            Take Away
          </button>
        </div>

        {/* Table Number */}
        {orderType === "dine-in" && (
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
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            name="name"
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
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Note */}
        <textarea
          name="note"
          placeholder="Review for Ye Teri Meri Chai"
          value={form.note}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded resize-none"
        />

        <h4>Taxes will be included in final payment</h4>

        {/* Pay */}
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
