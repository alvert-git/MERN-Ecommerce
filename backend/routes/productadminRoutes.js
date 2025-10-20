const express = require("express");
const Product = require("../models/product");
const {protect, admin} = require("../middleware/authmiddleware");

const router = express.Router();

// route GET /api/admin/products
// get all products (admin only)
// private

router.get("/", protect, admin, async (req, res) => {
    try {
        const products = await Product.find({})
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"})
        
    }
})

module.exports = router;