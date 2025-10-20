const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, 
    );

    // Set the JWT in a secure, HTTP-only cookie
    res.cookie("jwt", token, {
      // httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict", // Prevents CSRF attacks
     
    });

    // Redirect to the frontend with no sensitive data in the URL
    res.redirect(`http://localhost:5173/oauth-success`);
  }
);

module.exports = router;
