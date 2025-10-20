const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");
const {protect, admin} = require("../middleware/authmiddleware");

const router = express.Router();

// route GET /api/admin/orders
// get all the admin orders
// access private

router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email")
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"})
        
    }
})

// route PUT /api/admin/ordes/:id
// UPDate order status
// access private

router.put("/:id", protect, admin, async (req, res) => {
try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(order){
        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === "Delivered" ? true: order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

        const updateOrder = await order.save();
        res.json(updateOrder);
    }else{
        res.status(404).json({message: "Order does not exists"})
    }
} catch (error) {
    console.error(error);
        res.status(500).json({message: "Server error"})
}
})


// route DELETE /api/admin/orders/:id
// delete an order
// access private/admin only

router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');;
        if(order){
            await order.deleteOne();
            res.json({message: "Order removed"});
        } else {
            res.status(404).json({message: "Order not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
})
module.exports = router;