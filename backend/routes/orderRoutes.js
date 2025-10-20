const express = require("express");
const Order = require("../models/order");
const {protect} = require("../middleware/authmiddleware");
const router = express.Router();


// route GET /api/orders/my-orders
// get logged in user orders
// access private

router.get("/my-orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id}).populate("user", "name email").sort({createdAt: -1});
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});
// route GET /api/orders/:id
// get all orders
// access private

router.get("/:id", protect, async (req, res) => {
    try {
       const order = await Order.findById(req.params.id).populate("user", "name email");

       if(!order){
        return res.status(404).json({message: "Order not found"});
       }

       res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});



module.exports = router;