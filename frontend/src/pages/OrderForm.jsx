import { useState } from "react";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const CUSTOMISATIONS = [
  { label: "Extra Dip (White Cheeze)", price: 20 },
  { label: "Extra Dip (Mayo)", price: 20 },
  { label: "Extra Dip (Tandoori)", price: 30 },
  { label: "Extra Dip (Chilli Garlic)", price: 30 },
  { label: "Extra Cheese (S pizza)", price: 15 },
  { label: "Extra Cheese (M pizza)", price: 20 },
  { label: "Extra Cheese (L pizza)", price: 30 },
  { label: "Thin Crust (S Pizza)", price: 10 },
  { label: "Thin Crust (M Pizza)", price: 15 },
  { label: "Thin Crust (L Pizza)", price: 30 },
  { label: "Extra Single Topping (S Pizza)", price: 10 },
  { label: "Extra Single Topping (M Pizza)", price: 15 },
  { label: "Extra Single Topping (L Pizza)", price: 30 },
];

const OrderForm = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("dine-in"); // dine-in | takeaway

  const [form, setForm] = useState({
    tableNumber: "",
    name: "",
    phone: "",
    note: "",
    customisations: [],
  });

  const baseAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const customisationAmount = form.customisations.reduce(
    (sum, c) => sum + c.price,
    0
  );

  const totalAmount = baseAmount + customisationAmount;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCustomisation = (item) => {
    const exists = form.customisations.find(c => c.label === item.label);
    if (exists) {
      setForm({
        ...form,
        customisations: form.customisations.filter(c => c.label !== item.label),
      });
    } else {
      setForm({
        ...form,
        customisations: [...form.customisations, item],
      });
    }
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

    try {
      const res = await api.post("/api/restaurant-order/create", {
        orderType,
        tableNumber: orderType === "dine-in" ? form.tableNumber : null,
        customer: {
          name: form.name,
          phone: form.phone,
        },
        note: form.note,
        customisations: form.customisations,
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
        name: "Teri Meri Chai",
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

        theme: { color: "#EF4444" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
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

        {/* Table Number (Only for Dine In) */}
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

        {/* Paid Customisation */}
        <div>
          <p className="text-sm font-medium mb-2">
            Food Customisation (Extra Charges)
          </p>
          <div className="space-y-2">
            {CUSTOMISATIONS.map((c) => (
              <label key={c.label} className="flex justify-between items-center">
                <span>
                  <input
                    type="checkbox"
                    checked={form.customisations.some(x => x.label === c.label)}
                    onChange={() => toggleCustomisation(c)}
                    className="mr-2"
                  />
                  {c.label}
                </span>
                <span className="text-sm text-gray-600">₹{c.price}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Note */}
        <textarea
          name="note"
          placeholder="Any extra instructions..."
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
