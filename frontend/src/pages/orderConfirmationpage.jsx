import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearCart } from "../redux/slices/cartSlice";


const OrderConfirmationPage = () => {
const navigate = useNavigate();
const dispatch = useDispatch();
const { checkout } = useSelector((state) => state.checkout);

// clear the cart when the order is confirmed
    useEffect(() => {
       if(checkout && checkout._id){
        dispatch(clearCart());
        localStorage.removeItem("cart");
       } else{
        navigate("/my-orders");
       }
    }, [dispatch]);

    const calculateEstimatedDelivery = (createdAt) =>{
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10);
        return orderDate.toLocaleDateString();
    }
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="font-bold text-4xl text-center text-emerald-700 mb-8">
                Thank you for your Order!
            </h1>
          {checkout && <div className="p-6 rounded-lg border">
            <div className="flex justify-between mb-20">
                {/* order id and date */}
                <div>
                    <h2 className="text-xl font-semibold">
                        Order ID: {checkout._id}
                    </h2>
                    <p className="text-gray-600">
                        Date: {new Date(checkout.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {/* estimated deliverry */}
                <div>
                    <p className="text-emerald-700 text-sm">
                        Estimated Delivery:{" "}
                        {calculateEstimatedDelivery(checkout.createdAt)}
                    </p>
                </div>
            </div>

            {/* order items */}
            <div className="mb-20">
                {checkout.checkoutItems.map((item) => (
                    <div key={item.productId} className="flex items-center mb-4">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div>
                            <h4 className="text-md font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.color} | {item.size}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-md">₹{item.price}</p>
                            <p className="text-sm text-gray-500">{item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-8 ">
                {/* payment info */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Payment</h4>
                    <p className="text-gray-600">UPI</p>
                </div>
                {/* shipping info */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                    <p className="text-gray-600">
                        {checkout.shippingAddress.address}
                    </p>
                    <p className="text-gray-600">{checkout.shippingAddress.city}, {" "}
                    {checkout.shippingAddress.country}
                    </p>
                </div>
            </div>
            </div>}
        </div>
    );
}
export default OrderConfirmationPage;