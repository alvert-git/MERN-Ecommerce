const express = require("express");
const Subscriber = require("../models/subscriber");
const router = express.Router();

// route POST /api/subscribe
// handle register subscribe
// access private

router.post("/subscribe", async (req, res) => {
    const { email } = req.body;

    if(!email){
        return res.status(400).json({message: "Email is required"});
    }

    try {
        let subscriber = await Subscriber.findOne({email});
        if(subscriber){
            return res.status(400).json({message: "Email already exists"});
        }
        subscriber = new Subscriber({email});
        await subscriber.save();
        res.status(200).json({message: "Successfully subscribed to the newsletter"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
    });



    module.exports = router;