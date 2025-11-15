import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { useState } from "react";
import SearchBar from "./searchbar";
import CartDrawer from "../layout/cartdrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  
 
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  const { user } = useSelector((state) => state.auth);
  
  const cartItemCount = 0; 

  return (
    <>

      <nav className="sticky top-0 z-40 bg-white shadow-md">
      
        <div className="container mx-auto flex justify-between items-center py-4 px-4 lg:px-6">
          
          <div>
            <Link
              to="/"
             
              className="text-3xl font-extrabold font-kapakana text-purple-700 hover:text-purple-900 transition duration-150"
            >
              Ecommerce
            </Link>
          </div>
          
        
          <div className="hidden md:flex space-x-8">
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-700 hover:text-black font-medium uppercase transition duration-150"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-700 hover:text-black font-medium uppercase transition duration-150"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              className="text-gray-700 hover:text-black font-medium uppercase transition duration-150"
            >
              Topwear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              className="text-gray-700 hover:text-black font-medium uppercase transition duration-150"
            >
              Bottom Wear
            </Link>
          </div>

         
          <div className="flex items-center space-x-4">
       
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="block bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm text-white transition duration-150"
              >
                Admin
              </Link>
            )}

            <div className="hidden sm:block">
              <SearchBar />
            </div>

            <Link to="/profile" className="hover:text-black">
              {user && user.avatar ? (
                <img
                  className="rounded-full size-8 object-cover border border-gray-300"
                  src={user.avatar}
                  alt={`${user.name || "User"} avatar`}
                />
              ) : (
                <HiOutlineUser className="h-6 w-6 text-gray-600 hover:text-black transition duration-150" />
              )}
            </Link>
            
            <button
              onClick={toggleCartDrawer}
              className="relative hover:text-black"
              aria-label="Shopping Cart"
            >
              <HiOutlineShoppingBag className="h-6 w-6 text-gray-600 hover:text-black transition duration-150"></HiOutlineShoppingBag>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={toggleNavDrawer} 
              className="md:hidden"
              aria-label="Open navigation menu"
            >
              <HiBars3BottomRight className="h-6 w-6 text-gray-600 hover:text-black transition duration-150"></HiBars3BottomRight>
            </button>
          </div>
        </div>
      </nav>
      
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

     {/* Mobile */}
      {navDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={toggleNavDrawer}
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 max-w-xs h-full bg-white shadow-2xl transform transition-transform duration-300 z-50 md:hidden`}
        role="dialog" 
        aria-modal="true" 
        aria-label="Main Navigation"
        style={{
            transform: navDrawerOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex justify-end p-4 border-b">
          <button onClick={toggleNavDrawer} aria-label="Close navigation menu">
            <IoMdClose className="h-6 w-6 text-gray-600 hover:text-black"></IoMdClose>
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Shop Categories</h2>
          <nav className="space-y-3">
            <Link
              to="collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-purple-700 font-medium transition duration-150 py-1"
            >
              Men
            </Link>
            <Link
              to="collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-purple-700 font-medium transition duration-150 py-1"
            >
              Women
            </Link>
            <Link
              to="collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-purple-700 font-medium transition duration-150 py-1"
            >
              Topwear
            </Link>
            <Link
              to="collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-700 hover:text-purple-700 font-medium transition duration-150 py-1"
            >
              Bottom wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
