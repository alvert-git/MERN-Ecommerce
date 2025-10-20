import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slices/cartSlice';

const PaymentStatusPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pidx = queryParams.get('pidx');
        const status = queryParams.get('status');
        const purchase_order_id = queryParams.get('purchase_order_id');


        if (pidx && status === 'Completed' && purchase_order_id) {
            // Now, call your backend to verify and finalize the order
            const verifyAndFinalizePayment = async () => {
                try {
                    // Step 1: Verify the payment with your backend
                    const verifyResponse = await axios.put(
                        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${purchase_order_id}/pay/verify`,
                        { pidx },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                            },
                        }
                    );
                    console.log("Verification Response:", verifyResponse.data);

                    // Step 2: If verification is successful, finalize the order
                    if (verifyResponse.data.status === 'Completed') {
                         const finalizeResponse = await axios.post(
                            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${purchase_order_id}/finalize`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                                },
                            }
                        );
                        console.log("Finalize Response:", finalizeResponse.data);
                        await dispatch(clearCart())
                        // Redirect to a success page or show a success message
                        navigate('/order-confirmation');
                    } else {
                        // Handle failed or pending payment
                        navigate('/order-failed');
                    }
                } catch (error) {
                    console.error("Payment verification or finalization failed:", error);
                    navigate('/order-failed');
                }
            };
            verifyAndFinalizePayment();
        } else {
            // Handle cases where parameters are missing or status is not 'Completed'
            navigate('/order-failed');
        }
    }, [location, navigate]);

    return (
        <div>
            <p>Processing your payment...</p>
            {/* You can add a loading spinner here */}
        </div>
    );
};

export default PaymentStatusPage;