const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");
const User = require("./models/users");
const products = require("./data/products");
const Cart = require("./models/Cart");
dotenv.config();

mongoose.connect(process.env.MONGO_URI);
const seedData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // create an admin user
        const createdUser = await User.create({
            name: "admin",
            email: "X2r4e@example.com",
            password: "123467",
            role: "admin",
        });

        // assign default user id to the each product
        const userID = createdUser._id;
        const sampleProducts = products.map((product) => {
            return {
                ...product,
               user: userID
            };
        });

        await Product.insertMany(sampleProducts);
        console.log("Product Data seeded successfully");
        process.exit();
    } catch (error)
    {
        console.error(error);
        process.exit(1);
        
    }
};
seedData();