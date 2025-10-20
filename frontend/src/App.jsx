import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import Home from "./pages/home";
import {Toaster} from "sonner";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import CollectionPage from "./pages/collection"
import ProductDetails from "./components/product/product.detail";
import Checkout from "./components/cart/checkout";
import AdminLayout from "./components/admin/adminlayout";
import AdminHomePage from "./pages/adminhome";
import UserManageMent from "./components/admin/usermanagement";
import ProductManageMent from "./components/admin/productmanagement";
import EditProduct from "./components/admin/editproduct";
import OrderManagement from "./components/admin/ordermanagement";
import {Provider} from "react-redux";
import store from "./redux/store";
import OrderConfirmationPage from "./pages/orderConfirmationpage";
import OrderDetails from "./pages/orderdetail";
import MyOrders from "./pages/myorders";
import ProtectedRoute from "./components/common/ProtectedRoute";
import OauthSuccess from "./pages/OauthSuccess";
import PaymentStatusPage from "./components/checkout/payment-status";
import Failed from "./components/checkout/failed";

const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Toaster position="top-right"/>
      <Routes>
      <Route path="/" element={<UserLayout />}>
          <Route index element={<Home/>}/>
          <Route path="login" element={<Login />}></Route>
          <Route path="/oauth-success" element={<OauthSuccess />} />
          <Route path="register" element={<Register />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="collections/:collection" element={<CollectionPage />}></Route>
          <Route path="product/:id" element={<ProductDetails />}></Route>
          <Route path="checkout" element={<Checkout/>}></Route>
          <Route path="order-confirmation" element={<OrderConfirmationPage/>}></Route>
          <Route path="order/:id" element={<OrderDetails/>}></Route>
          <Route path="/my-orders" element={<MyOrders/>}></Route>
          <Route path="/checkout/payment-status" element={<PaymentStatusPage/>}></Route>
          <Route path="/order-failed" element={<Failed/>}></Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>}>
        
        <Route index element={<AdminHomePage/>}></Route>
        <Route path="users" element={<UserManageMent/>}></Route>
        <Route path="products" element={<ProductManageMent/>}></Route>
        <Route path="products/:id/edit" element={<EditProduct/>}></Route>
        <Route path="orders" element={<OrderManagement/>}></Route>
        </Route>
       
      </Routes>
    </BrowserRouter>
    </Provider>
  );
};

export default App;