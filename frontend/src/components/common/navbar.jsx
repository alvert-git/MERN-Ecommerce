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
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <nav className=" container nx-auto flex justify-between py-4 px-6">
        {
          // left-loop
        }
        <div>
          <Link
            to="/"
            className="text-2xl font-medium font-kapakana text-purple-900"
          >
            OceanKart
          </Link>
        </div>
        {
          // center nav link
        }
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black-sm- font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black-sm- font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black-sm- font-medium uppercase"
          >
            Topwear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black-sm- font-medium uppercase"
          >
            Bottom Wear
          </Link>
          <Link
            to="/collections/all?category=shoes"
            className="text-gray-700 hover:text-black-sm- font-medium uppercase"
          >
            Shoes
          </Link>
          <Link
            to="/collections/all?category=Accessories"
            className="text-gray-700 hover:text-black-sm- font-medium uppercase"
          >
            Accessories
          </Link>
        </div>

        {
          // right loop
        }
        <div className="flex item-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-black">
            {/* <img src="https://lh3.googleusercontent.com/a/ACg8ocI4MBkrjHoji89ITY7dIVJcFZUnUlUW5sFELKvz3DpVyQHLAg=s96-c" alt="image"/> */}
            {user && user.avatar ? (
              <img
                className="rounded-full size-10"
                src={user.avatar}
                alt={`${user.name || "User"} avatar`}
              />
            ) : (
              <HiOutlineUser className="h-6 w-6 text-gray-700" />
            )}
          </Link>
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700"></HiOutlineShoppingBag>
            <span className="absolute -top-1 big-rabbit-red text-white text-xs rounded-full px-2 py-0.5"></span>
          </button>
          {/* search */}
          <div className="overflow-hidden">
            <SearchBar></SearchBar>
          </div>

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700"></HiBars3BottomRight>
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* mobile navigation */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600 "></IoMdClose>
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav>
            <Link
              to="collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              to="collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              to="collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Topwear
            </Link>
            <Link
              to="collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Bottom wear
            </Link>
            <Link
              to="collections/all?category=Shoes"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Shoes
            </Link>
            <Link
              to="collections/all?category=Accessories"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Accessories
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};
export default Navbar;
