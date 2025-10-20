import { Link } from "react-router-dom";

const Footer = () =>{
    return <footer className="border-t py-12">
        <div className="cntainer mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:px-0">
            <div>
                <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
                <p className="text-gray-500 mb-4">
                    Be the first to hear about new products, exclusive events, and online offers.
                </p>
                <p>Sign up and get 5% off your first order.</p>
                {/* Newsletter form */}
                <form className="flex">
                    <input type="email" placeholder="Enter your email" className="p-3 w-full text-sm border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all" required></input>
                    <button type="Submit" className="bg-black text-white px-5 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all">Subscribe</button>
                </form>
            </div>
            {/* Support links */}
            <div>
                <h3 className="text-lg text-gray-800 mb-4"> Support </h3>
                <ul className="space-y-2 text-gray-600">
                    <li>
                        <Link to="#" className="hover:text-gray-500 transtion-colors" >Contact Us</Link>
                    </li>
                    <li>
                        <Link to="#" className="hover:text-gray-500 transtion-colors" >About Us</Link>
                    </li>
                   
                </ul>
            </div>
        </div>
        {/* footer bottom */}
        <div className="container mx-auto mt-12 px-4 lg:px-0 border-1 border-gray-200 pt-6">
            <p className="text-gray-500 text-sm tracking-tighter text-center"> 2025 CompileTab. All Rights Reserved.</p>
        </div>
    </footer>
}

export default Footer;