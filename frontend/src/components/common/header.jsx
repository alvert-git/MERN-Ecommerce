import Topbar from "../layout/topbar";
import Navbar from "./navbar";
const Header = () => {
    return (
        <header className="border-b border-gray-200">
        
            {/* topbar */}
            <Topbar />
            {/* navbar */}
            <Navbar />
        </header>
        
    );
};

export default Header;