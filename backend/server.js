const express = require("express");
const app = express();

const cors = require("cors");
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productadminRoutes = require("./routes/productadminRoutes");
const adminorderRoutes = require("./routes/adminorderRoutes");
const googleRoutes = require("./routes/googleRoutes");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieParser = require("cookie-parser");

const User = require("./models/users"); // Import the User model

dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // This is the key line
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_Client_ID,
      clientSecret: process.env.Google_Client_secrets,
      callbackURL: "http://localhost:9000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists by googleId
        let user = await User.findOne({ googleId: profile.id });

        // 2. If user not found, check by email
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
          } else {
            // 3. Create new Google user
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            });
            await user.save();
          }
        }

        // Attach token & user to request
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by their database ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const PORT = 9000;

// connecting database
connectDB();

app.get("/", (req, res) => {
  res.send("hello");
});


app.get("/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.status(200).json({
    message: "Google Login Success",
    data: {
      user: req.user,
    },
  });
});

// api routes

app.use("/api/users", userRoutes);
app.use("/auth/google", googleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);


app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productadminRoutes);
app.use("/api/admin/orders", adminorderRoutes);

// app.listen(PORT, () => {
//   console.log(`server is running on ${PORT}`);
// });
module.export = app