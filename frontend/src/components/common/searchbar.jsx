import {useState } from "react";
import {HiMagnifyingGlass, HiMiniXMark} from "react-icons/hi2";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
import { setFilters } from "../../redux/slices/productsSlice";
import { fetchProductsByFilters } from "../../redux/slices/productsSlice";

const SearchBar = ()=>{
    
    const [searchTerm, setsearchTerm]= useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearchToggle =()=>{
        setIsOpen(!isOpen);
    };

    const handleSearch=(e)=>{
        e.preventDefault();
        dispatch(setFilters({search: searchTerm}));
        dispatch(fetchProductsByFilters({search: searchTerm}));
        navigate(`/collections/all?search=${searchTerm}`);
        setIsOpen(false);
    };
    return(
        <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "w-full absolute top-0 left-0 bg-white h-24 z-50" : "w-auto"}`}>
           {isOpen ?(
            <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full">
                <div className="relative w-1/2">
                    <input type="text" placeholder="Search"
                    value={searchTerm} 
                    onChange={(e)=>setsearchTerm(e.target.value)} className="bg-gray-100 px-4 py-2 rounded-lg pr-12 pl-2 w-full focus:outline-none placeholder:text-gray-700"/>
                    {/* search icon */}
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                        <HiMagnifyingGlass className="h-6 w-6 "></HiMagnifyingGlass>
                    </button>
                </div>
                {/* class button */}
                <button  onClick={handleSearchToggle} type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                <HiMiniXMark className="h-6 w-6"/>
                </button>
            </form>): (
            <button onClick={handleSearchToggle}> 
            <HiMagnifyingGlass className="h-6 w-6"/>
            </button>
           )
        }
        </div>
    )
}

export default SearchBar;