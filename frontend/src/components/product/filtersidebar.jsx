import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa"; // Added for clear button

const MAX_PRICE_LIMIT = 100; // Define a constant for max price

const FilterSidebar = () => {
    // 1. useSearchParams is sufficient for URL state management
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        minPrice: 0,
        maxPrice: MAX_PRICE_LIMIT,
    });

    // We only need one state for the price range slider value (maxPrice)
    const [sliderMaxPrice, setSliderMaxPrice] = useState(MAX_PRICE_LIMIT);

    // Filter Options (Moved outside the component or memoized if they were dynamic)
    const categories = ["Top Wear", "Bottom Wear", "Shoes", "Accessories"];
    const colors = [
        "Red", "Blue", "Green", "Black", "White", "Yellow", "Orange", "Purple",
        "Beige", "Navy", "Gray", "Maroon", "Pink", "Teal",
    ];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const materials = ["Cotton", "Polyester", "Denim", "Leather"];
    const genders = ["Men", "Women"];

    // --- EFFECT: Sync URL Params to Local State ---
    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        
        // Parse array parameters
        const sizeArray = params.size ? params.size.split(",") : [];
        const materialArray = params.material ? params.material.split(",") : [];

        // Parse price parameters, ensuring they are numbers
        const minPrice = Number(params.minPrice) || 0;
        const maxPrice = Number(params.maxPrice) || MAX_PRICE_LIMIT;

        const newFilters = {
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: sizeArray,
            material: materialArray,
            minPrice: minPrice,
            maxPrice: maxPrice,
        };

        setFilters(newFilters);
        setSliderMaxPrice(maxPrice);
    }, [searchParams]);

    // --- FUNCTION: Update URL Parameters ---
    const updateURLParams = useCallback((newFilters) => {
        const params = new URLSearchParams();
        
        Object.keys(newFilters).forEach((key) => {
            const value = newFilters[key];
            
            // Handle array filters (size, material)
            if (Array.isArray(value) && value.length > 0) {
                params.set(key, value.join(","));
            } 
            // Handle string filters (category, gender, color)
            else if (typeof value === 'string' && value) {
                params.set(key, value);
            }
            // Handle price filters (only set if they are not default values)
            else if (key === 'minPrice' && value > 0) {
                 params.set(key, value.toString());
            }
            else if (key === 'maxPrice' && value < MAX_PRICE_LIMIT) {
                 params.set(key, value.toString());
            }
        });
        
        // Use setSearchParams to update the URL
        setSearchParams(params, { replace: true });
        // Removed redundant navigate() call
    }, [setSearchParams]);

    // --- HANDLER: General Filter Change (Radio/Checkbox) ---
    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filters };

        if (type === "checkbox") {
            // Handle array filters (size, material)
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else {
            // Handle radio filters (category, gender)
            // Toggle logic: If the current value is clicked again, clear it.
            newFilters[name] = newFilters[name] === value ? "" : value;
        }

        setFilters(newFilters);
        updateURLParams(newFilters);
    };
    
    // --- HANDLER: Color Filter Change (Button) ---
    const handleColorChange = (color) => {
        let newFilters = { ...filters };
        // Toggle logic: If the current color is clicked again, clear it.
        newFilters.color = filters.color === color ? "" : color;
        
        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    // --- HANDLER: Price Range Change (Slider) ---
    const handlePriceChange = (e) => {
        const newMaxPrice = Number(e.target.value);
        setSliderMaxPrice(newMaxPrice); // Update local slider position immediately

        // Debounce or use a dedicated Apply button for better performance in a real app.
        // For simplicity here, we update filters immediately.
        const newFilters = { ...filters, maxPrice: newMaxPrice };
        setFilters(newFilters);
        updateURLParams(newFilters);
    };
    
    // --- HELPER: Render Filter Section ---
    const renderRadioFilter = (name, options) => (
        <div className="mb-6 border-b border-gray-100 pb-4">
            <label className="block text-gray-700 font-semibold mb-3 capitalize">{name}</label>
            {options.map((option) => (
                <div key={option} className="flex items-center mb-2">
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        onChange={handleFilterChange}
                        checked={filters[name] === option}
                        className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                    />
                    <span className="text-gray-700 text-sm">{option}</span>
                </div>
            ))}
            {/* Clear Button for Radio Filters */}
            {filters[name] && (
                <button 
                    onClick={() => handleFilterChange({ target: { name, value: filters[name], checked: false, type: 'radio' } })}
                    className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center transition-colors"
                >
                    <FaTimesCircle className="w-3 h-3 mr-1" /> Clear {name}
                </button>
            )}
        </div>
    );


    return (
        <div className="p-4 bg-white shadow-lg rounded-lg sticky top-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Filters</h3>

            {/* Category Filter */}
            {renderRadioFilter("category", categories)}

            {/* Gender Filter */}
            {renderRadioFilter("gender", genders)}

            {/* Color Filter */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <label className="block text-gray-700 font-semibold mb-3">Color</label>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                        const isSelected = filters.color === color;
                        return (
                            <button
                                key={color}
                                onClick={() => handleColorChange(color)}
                                aria-label={`Filter by color ${color}`}
                                className={`
                                    h-8 w-8 rounded-full border-2 cursor-pointer transition-all duration-200 
                                    ${isSelected ? "ring-4 ring-offset-2 ring-indigo-500 border-white" : "border-gray-300 hover:scale-105"}
                                `}
                                style={{ backgroundColor: color.toLowerCase() }}
                            >
                                {/* Optional: Add a checkmark icon when selected for better UX */}
                                {isSelected && <span className="sr-only">Selected</span>}
                            </button>
                        );
                    })}
                </div>
                {/* Clear Button for Color Filter */}
                {filters.color && (
                    <button 
                        onClick={() => handleColorChange("")}
                        className="mt-3 text-xs text-red-500 hover:text-red-700 flex items-center transition-colors"
                    >
                        <FaTimesCircle className="w-3 h-3 mr-1" /> Clear color
                    </button>
                )}
            </div>

            {/* Size Filter (Checkbox) */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <label className="block text-gray-700 font-semibold mb-3">Size</label>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <div key={size} className="flex items-center">
                            <input
                                id={`size-${size}`}
                                type="checkbox"
                                name="size"
                                value={size}
                                checked={filters.size.includes(size)}
                                onChange={handleFilterChange}
                                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor={`size-${size}`} className="text-gray-700 text-sm cursor-pointer">{size}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Material Filter (Checkbox) */}
            <div className="mb-6 border-b border-gray-100 pb-4">
                <label className="block text-gray-700 font-semibold mb-3">Material</label>
                {materials.map((material) => (
                    <div key={material} className="flex items-center mb-2">
                        <input
                            id={`material-${material}`}
                            type="checkbox"
                            name="material"
                            value={material}
                            checked={filters.material.includes(material)}
                            onChange={handleFilterChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor={`material-${material}`} className="text-gray-700 text-sm cursor-pointer">{material}</label>
                    </div>
                ))}
            </div>

            {/* Price Range */}
            <div className="mb-4 pt-2">
                <label className="block text-gray-700 font-semibold mb-4">Price Range</label>
                <input 
                    type="range"
                    value={sliderMaxPrice}
                    onChange={handlePriceChange}
                    min={0} 
                    max={MAX_PRICE_LIMIT}
                    step={1}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg" 
                />
                <div className="flex justify-between text-gray-600 mt-2 text-sm font-medium">
                    <span>Rs. {filters.minPrice}</span>
                    <span>Rs. {filters.maxPrice}</span>
                </div>
            </div>
            
            {/* Optional: Clear All Filters Button */}
            {(searchParams.toString().length > 0) && (
                <button
                    onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                    className="w-full mt-6 py-2 px-4 bg-red-300 text-white font-small rounded-lg hover:bg-red-400 transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
};

export default FilterSidebar;
