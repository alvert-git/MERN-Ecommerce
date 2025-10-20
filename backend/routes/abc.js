const express = require("express");
const Checkout = require("../models/checkout");
const Cart = require("../models/Cart");
const Product = require("../models/product");
const Order = require("../models/order");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;
  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "no items in checkout" });
  }
  try {
    // create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating checkout sessions", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/pay", protect, async (req, res) => {
  const checkout = await Checkout.findById(req.params.id);
  if (!checkout) {
    return res.status(404).json({ message: "Checkout not found" });
  }
  try {
    const { amount, orderId } = req.body;
    const data = {
      return_url: `${process.env.VITE_FRONTEND_URL}`,
      website_url: `${process.env.VITE_FRONTEND_URL}`,
      amount: amount * 100,
      purchase_order_id: orderId,
      purchase_order_name: "Order_" + orderId,
    };
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      data,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET}`,
        },
      }
    );
    const khaltiResponse = response.data;
    checkout.paymentDetails = {
      pidx: khaltiResponse.pidx,
    };
    await checkout.save();
    res.status(201).json({
      message: "Order Created Sussefully",
      url: khaltiResponse.payment_url,
      pidx: khaltiResponse.pidx,
    });
  } catch (error) {
    conosle.log("Failed to initiate payment Request", error);
    res.status(500).send("Server Error");
  }
});

//verify payment
router.put("/:/id/pay/verify", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({
        message: "Please Provide Pidx",
      });
      return;
    }
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET}`,
        },
      }
    );
    const paymentData = response.data
    if(paymentData.status === 'Completed'){
        checkout.isPaid = true;
        checkout.paymentStatus = "paid";
        checkout.paidAt = Date.now();
    }else{
       res.send("Failed")
    }
  } catch (error) {
    console.error("Error verifying payment", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      // create final order
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        isDelivered: false,
        paymentStatus: "paid",

        paymentDetails: checkout.paymentDetails,
      });
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();

      await checkout.save();
      await Cart.findOneAndDelete({ user: checkout.user });
      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400).json({ message: "Checkout already finalized" });
    } else {
      res.status(400).json({ message: "Checkout is not paid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
