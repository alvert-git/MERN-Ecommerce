import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-12 md:py-16">
            <div className="container mx-auto px-4 lg:px-0">
                
                {/* Main Grid Section: 4 Columns on Large Screens */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
                    
                    {/* 1. Brand/Newsletter Column (Takes up more space on mobile) */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight mb-4 block">
                            Ecommerce
                        </Link>
                        <p className="text-gray-600 mb-6 text-sm">
                            Be the first to hear about new products, exclusive events, and online offers.
                        </p>
                        
                        
                    </div>

                    {/* 2. Shop Links */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Shop</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/shop/new-arrivals" className="text-gray-600 hover:text-indigo-600 transition-colors">New Arrivals</Link>
                            </li>
                            <li>
                                <Link to="/shop/best-sellers" className="text-gray-600 hover:text-indigo-600 transition-colors">Best Sellers</Link>
                            </li>
                            <li>
                                <Link to="/shop/sale" className="text-gray-600 hover:text-indigo-600 transition-colors">Sale Items</Link>
                            </li>
                            <li>
                                <Link to="/shop/collections" className="text-gray-600 hover:text-indigo-600 transition-colors">Collections</Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Support Links */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-600 hover:text-indigo-600 transition-colors">FAQ</Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-600 hover:text-indigo-600 transition-colors">Shipping & Returns</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* 4. Company Links */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/careers" className="text-gray-600 hover:text-indigo-600 transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-600 hover:text-indigo-600 transition-colors">Blog</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    
                    {/* Copyright */}
                    <p className="text-gray-500 text-sm order-2 md:order-1 mt-6 md:mt-0">
                        &copy; {new Date().getFullYear()} Ecommerce. All Rights Reserved.
                    </p>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4 order-1 md:order-2">
                        <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <FaFacebookF className="w-5 h-5" />
                        </a>
                        <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <FaTwitter className="w-5 h-5" />
                        </a>
                        <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <FaInstagram className="w-5 h-5" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <FaLinkedinIn className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
