import axios from "axios";
import { loadScript } from "./razorscript";

// Modified to work with your existing checkout system
export const RazorpayButton = async (amount, checkoutId, navigate, handleFinalizeCheckout) => {
  try {
    // Load Razorpay script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay failed to load. Please check your internet connection.");
      return;
    }

    // Create Razorpay order using your existing API
    const orderResponse = await createRazorpayOrder(amount);
    if (!orderResponse.order_id) {
      alert("Failed to create order. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_TJhLrl8M72QeVQ", // Make sure to set this in your .env file
      amount: orderResponse.amount, // Amount in paise (already converted in backend)
      currency: orderResponse.currency,
      name: "E-commerce",
      description: "Order Payment",
      image: "https://example.com/your_logo.jpg",
      order_id: orderResponse.order_id, // Razorpay order ID from backend
      handler: function (response) {
        handlePaymentSuccess(response, checkoutId, navigate, handleFinalizeCheckout);
      },
      prefill: {
        name: "Customer", // You can pass customer details as parameters
        email: "customer@example.com",
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment cancelled by user");
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    
  } catch (error) {
    console.error("Payment initiation error:", error);
    alert("Failed to initiate payment. Please try again.");
  }
};

// Function to create Razorpay order using your existing endpoint
const createRazorpayOrder = async (amount) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/pay`, // Your existing endpoint
      {
        amount: amount // Amount in rupees (will be converted to paise in backend)
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Order creation error:", error);
    throw error;
  }
};

// Modified to work with your existing payment verification endpoint
const handlePaymentSuccess = async (details, checkoutId, navigate, handleFinalizeCheckout) => {
  try {
    const { razorpay_payment_id, razorpay_signature, razorpay_order_id } = details;
    
    // Update payment status using your existing endpoint
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
      {
        razorpay_payment_id,
        razorpay_signature,
        razorpay_order_id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status === 201) {
      console.log("Payment verified successfully");
      
      // Call your existing finalize checkout function
      await handleFinalizeCheckout(checkoutId);
      navigate("/order-confirmation");
    } else {
      throw new Error("Payment verification failed");
    }

  } catch (error) {
    console.error("Payment processing error:", error);
    alert("Payment was successful but there was an error processing it. Please contact support.");
  }
};

// Enhanced version that integrates with your existing checkout flow
export const initializePayment = async (config) => {
  const {
    amount,
    checkoutId,
    navigate,
    handleFinalizeCheckout,
    customerDetails = {}
  } = config;

  try {
    // Load Razorpay script
    const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!scriptLoaded) {
      throw new Error("Failed to load Razorpay script");
    }

    // Create Razorpay order
    const orderData = await createRazorpayOrder(amount);

    const options = {
      key: "rzp_test_TJhLrl8M72QeVQ",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Your E-commerce Store",
      description: "Order Payment",
      order_id: orderData.order_id,
      handler: async function (response) {
        try {
          await handlePaymentSuccess(response, checkoutId, navigate, handleFinalizeCheckout);
        } catch (error) {
          console.error("Payment handling error:", error);
        }
      },
      prefill: {
        name: customerDetails.name || "",
        email: customerDetails.email || "",
        contact: customerDetails.phone || "",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal closed by user");
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment initialization error:", error);
    alert("Failed to initialize payment. Please try again.");
  }
};

// Simple wrapper for backward compatibility
export const startPayment = (amount, checkoutId, navigate, handleFinalizeCheckout, customerDetails) => {
  return initializePayment({
    amount,
    checkoutId,
    navigate,
    handleFinalizeCheckout,
    customerDetails
  });
};