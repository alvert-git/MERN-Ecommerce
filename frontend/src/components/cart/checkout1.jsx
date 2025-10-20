import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice";

const checkout1 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { checkout } = useSelector((state) => state.checkout);
  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "", // Fixed: was postalcode
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Khalti",
          totalPrice: cart.totalPrice,
        })
      );

      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      }
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Checkout finalized successfully");
    } catch (error) {
      console.error("Error finalizing checkout:", error);
    }
  };

  const handlePayment = async () => {
    if (!checkoutId) {
      alert("Please create checkout first");
      return;
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/${checkoutId}/pay`,
        {
          amount: checkout.totalPrice,
          orderId: checkout._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if(response.ok){
        navigate(`${response.url}`)
      }
      
    } catch (error) {
      console.log("Error in handling paymnet",error)
    }
  };

  return   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* left section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout} >
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" value={user?.email} className="w-full p-2 border rounded"
                        disabled />
                    </div>
                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input type="text" className="w-full p-2 border rounded"
                            value={shippingAddress.firstName}
                            onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                            required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input type="text" className="w-full p-2 border rounded"
                            value={shippingAddress.lastName}
                            onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                            required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input type="text" className="w-full p-2 border rounded"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        required />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input type="text" className="w-full p-2 border rounded"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                            required />
                        </div>
                        <div>
                            <label className="block text-gray-700">Pincode</label>
                            <input type="text" className="w-full p-2 border rounded"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                            required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Country</label>
                        <input type="text" className="w-full p-2 border rounded"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                        required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input type="text" className="w-full p-2 border rounded"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        required />
                    </div>
                    <div className="mt-6">
                        {!checkoutId ? (
                            <button type="submit" className="w-full bg-black text-white py-3 rounded">
                            Continue to Payment
                            </button>
                        ) : (
                            <div>
                                <h3 className="text-lg mb-4">Pay with Khalti</h3>
                                <button 
                                    type="button"
                                    onClick={handlePayment} 
                                    disabled={!checkoutId}
                                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    Pay Rs.{cart.totalPrice}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
            {/* ORDER SUMMARY */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="mb-4 text-lg">Order Summary</h3>
                <div className="border-t py-4 mb-4">
                    {cart.products.map((product, index) => (
                        <div key={index} className="flex items-start justify-between py-2 border-b">
                            <div className="flex items-start">
                                <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4" />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    <p className="text-gray-500">Size: {product.size}</p>
                                    <p className="text-gray-500">Color: {product.color}</p>
                                </div>
                            </div>
                            <p className="text-xl">Rs.{product.price?.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-lg mb-4">
                    <p>Subtotal</p>
                    <p>Rs.{cart.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center text-lg ">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t">
                    <p>Total</p>
                    <p>Rs.{cart.totalPrice?.toLocaleString()}</p>             
               </div>
            </div>
        </div>;
};

export default checkout1;
