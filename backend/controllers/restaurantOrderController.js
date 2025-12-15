import restaurantOrderModel from "../models/restaurantOrderModel.js";
import createRazorpayInstance from "../services/razorpay.js";
import crypto from "crypto";

// Create Razorpay Order for Restaurant
export const createRazorpayOrder = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.json({ success: false, message: "Empty request body" });
    }

    const {
      tableNumber,
      customerName,
      customerMobile,
      items,
      subtotal,
      total
    } = req.body;

    if (!tableNumber || !customerName || !customerMobile || !items) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const razorpay = createRazorpayInstance();

    const rpOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR"
    });

    const order = await restaurantOrderModel.create({
      tableNumber,
      customerName,
      customerMobile,
      items,
      subtotal,
      total,
      razorpayOrderId: rpOrder.id
    });

    res.json({ success: true, rpOrder, orderId: order._id });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};



// Verify payment for restaurant
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    await restaurantOrderModel.findByIdAndUpdate(orderId, {
      status: "paid",
      razorpayPaymentId,
      razorpaySignature
    });

    // Emit new order to kitchen panel
    const io = req.app.get("io");
    io.to("kitchen").emit("new-order", { orderId });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Admin: list all restaurant orders
export const listRestaurantOrders = async (req, res) => {
  try {
    const orders = await restaurantOrderModel.find({});
    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Admin: update status
export const updateRestaurantOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await restaurantOrderModel.findByIdAndUpdate(orderId, { status });

    const io = req.app.get("io");
    io.to("kitchen").emit("order-updated", { orderId, status });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
