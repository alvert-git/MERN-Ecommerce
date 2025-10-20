import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const FilterSidebar = () => {
const [searchParams, setSearchParams] = useSearchParams();
const navigate = useNavigate();
const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: "",
    material:[],
    minPrice: 0,
    maxPrice: 100,
});

const [priceRange, setPriceRange] = useState([0, 100]);
const categories = ["Top Wear", "Bottom Wear", "Shoes", "Accessories"];
const colors = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Orange",
    "Purple",
    "Beige",
    "Navy",
    "Gray",
    "Maroon",
    "Pink",
    "Teal",
];

    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const materials = ["Cotton", "Polyester", "Denim", "Leather"];
    const genders = ["Men", "Women"];

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100
        })
        setPriceRange([0, params.maxPrice || 100]);
    },[searchParams]);
    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = {...filters};
        if(type === "checkbox"){
            if(checked){
                newFilters[name] = [...(newFilters[name] || []), value]; 
            }else{
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
            }
            else{
                newFilters[name] = value;
            }
            setFilters(newFilters);
          updateURLParams(newFilters);

    };

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key])  && newFilters[key].length > 0) {
               
                    params.append(key, newFilters[key].join(","));
                }
             else if (newFilters[key]) {
                params.append(key, newFilters[key]);
             }
            });
            setSearchParams(params);
            navigate(`?${params.toString()}`); 
        };
    
        const handlePriceChange = (e) => {
           const newPrice = e.target.value;
           setPriceRange([0, newPrice]);
           const newFilters = {...filters, minPrice: 0, maxPrice: newPrice};
           setFilters(filters);
           updateURLParams(newFilters);
        };

    return (
        <div className="p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

            {/* category filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label>
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-1">
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            onChange={handleFilterChange}
                            checked={filters.category === category}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
                </div>

                {/* gender filter */}
                <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label>
                {genders.map((gender) => (
                    <div key={gender} className="flex items-center mb-1">
                        <input
                            type="radio"
                            checked={filters.gender === gender}
                            name="gender"
                            value={gender}
                            onChange={handleFilterChange}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                        />
                        <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            
            </div>

            {/* color filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                    <button
                            value={color}
                            onClick={handleFilterChange}
                             key={color}
                            name="color"
                            className={`h-8 w-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${
                                filters.color === color ? "ring-2 ring-blue-500" : ""
                            }`}
                            style={{ backgroundColor: color.toLowerCase() }}>
                        
                    </button>
                ))}
            </div>
            </div>

            {/* size filter */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Size</label>
                    {sizes.map((size) => (
                        <div key={size} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                name="size"
                                value={size}
                                checked={filters.size.includes(size)}
                                onChange={handleFilterChange}
                                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                            />
                            <span className="text-gray-700">{size}</span>
                        </div>
                    ))}
                
            </div>
             {/* material filter */}
             <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Material</label>
                    {materials.map((material) => (
                        <div key={material} className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                name="material"
                                value={material}
                                checked={filters.material.includes(material)}
                                onChange={handleFilterChange}
                                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                            />
                            <span className="text-gray-700">{material}</span>
                        </div>
                    ))}
                </div>
                    {/* Price Range */}
                    <div className="m-8">
                        <label className="block text-gray-600 font-medium m-2">Price Range</label>
                        <input type="range"
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                       
                        name="priceRange"
                        min={0} max={100}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between textgray-600 m-2">
                            <span>₹0</span><span>₹{priceRange[1]}</span>
                          
                        </div>
                    </div>
        </div>
    )}
    export default FilterSidebar;