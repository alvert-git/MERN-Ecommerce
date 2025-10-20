const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId; // password only required if not Google login
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows some users to have it, some not
    },
    avatar: {
      type: String, // store Google profile picture URL
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password only if it’s modified and exists
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Match the user entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // google-only users don’t have passwords
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
