import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOAuthUser } from "../redux/slices/authSlice";
import Cookies from 'js-cookie';
import axios from "axios";
axios.defaults.withCredentials = true

const OauthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile`);
        const user = response.data.data.user;
        
        if (user) {
          // You might not need to store the token on the client-side
          // since it's in a cookie, but you can if needed.
          const token = Cookies.get('jwt');
          localStorage.setItem("userToken", token);
          
          dispatch(setOAuthUser({ user })); // Update Redux state
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        navigate("/login");
      }
    };

    fetchUserAndRedirect();
  }, [navigate, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl">Logging you in...</h1>
    </div>
  );
};

export default OauthSuccess;