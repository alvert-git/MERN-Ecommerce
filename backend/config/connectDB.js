const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");
    } catch (error) {
        console.error("Mongoose connection error:", error);
        process.exit(1); //0 means success
    }
};

module.exports = connectDB;