import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment, listRestaurantOrders, updateRestaurantOrderStatus } from "../controllers/restaurantOrderController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Restaurant QR ordering payment flow
router.post("/create", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

// Admin routes
router.get("/all", adminAuth, listRestaurantOrders);
router.post("/update-status", adminAuth, updateRestaurantOrderStatus);

export default router;
