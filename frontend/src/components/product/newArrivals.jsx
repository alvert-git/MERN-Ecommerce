import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

// Define the interval for auto-scrolling (e.g., 3000ms or 3 seconds)
const AUTO_SCROLL_INTERVAL = 500; 

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false); // New state for hover
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
  
    const [newArrivals, setNewArrivals] = useState([]);

    // Create a duplicated list for the near-infinite effect
    const loopedArrivals = useMemo(() => {
        // We duplicate the array twice to ensure a smooth transition
        return newArrivals.length > 0 ? [...newArrivals, ...newArrivals, ...newArrivals] : [];
    }, [newArrivals]);

    // 1. Fetch Data
    useEffect (()=> {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
                setNewArrivals(response.data);
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            }
        }
        fetchNewArrivals();
    },[]);
       
    // 2. Drag Handlers
    const handleMouseDown = (e) => {
        e.preventDefault(); 
        setIsDragging(true);
        // Also pause auto-scroll when dragging starts
        setIsHovering(true); 
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    }

    const handleMouseMove = (e) => {
        if(!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    }

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
        // Resume auto-scroll when dragging stops, unless mouse is still hovering
        setTimeout(() => {
            if (!scrollRef.current.matches(':hover')) {
                setIsHovering(false);
            }
        }, 100);
    }

    // 3. Directional Scroll Function
    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        // Scroll by the width of one item (e.g., 80% of container width)
        const itemWidth = container.querySelector('.flex-shrink-0')?.clientWidth || 300;
        const scrollAmount = itemWidth + 24; // Item width + space-x-6 (24px)
        
        const newScroll = direction === "left" 
            ? container.scrollLeft - scrollAmount 
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: newScroll, 
            behavior: "smooth"
        });
    }

    // 4. Update Scroll Buttons (and check for infinite loop reset)
    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if(container){
            const { scrollLeft, scrollWidth, clientWidth } = container;
            
            // Button visibility
            setCanScrollLeft(scrollLeft > 5); 
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
            
            // --- Infinite Loop Logic ---
            // If we reach the end of the first set of items (which is 1/3 of the total width)
            const itemSetWidth = scrollWidth / 3;
            
            if (scrollLeft >= itemSetWidth * 2) {
                // If we scroll past the second set, instantly jump back to the start of the second set
                // This gives the illusion of infinite scroll without the user noticing the jump
                container.scrollLeft = itemSetWidth;
            } else if (scrollLeft <= 0 && newArrivals.length > 0) {
                // If we scroll past the beginning, instantly jump back to the start of the second set
                container.scrollLeft = itemSetWidth;
            }
        }
    }

    // 5. Scroll Event Listener
    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            updateScrollButtons();
            container.addEventListener("scroll", updateScrollButtons);
            
            // Initial jump to the start of the second set for the infinite loop effect
            if (newArrivals.length > 0) {
                const itemSetWidth = container.scrollWidth / 3;
                container.scrollLeft = itemSetWidth;
            }

            return () => {
                container.removeEventListener("scroll", updateScrollButtons);
            };
        }
    }, [newArrivals]); // Rerun when data changes to set initial scroll

    // 6. Auto-Scroll Logic
    useEffect(() => {
        if (isDragging || isHovering || newArrivals.length === 0) {
            return; // Don't auto-scroll if dragging, hovering, or no items
        }

        const container = scrollRef.current;
        if (!container) return;

        const interval = setInterval(() => {
            // Scroll by a small amount (e.g., 1 item width)
            const itemWidth = container.querySelector('.flex-shrink-0')?.clientWidth || 300;
            const scrollAmount = itemWidth + 24; // Item width + space-x-6 (24px)

            container.scrollTo({
                left: container.scrollLeft + scrollAmount,
                behavior: "smooth"
            });
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval); // Cleanup on unmount or dependency change
    }, [isDragging, isHovering, newArrivals.length]); // Dependencies for control

    
    // ... (omitted the touch handlers for brevity, assume they are still there)
    const handleTouchStart = (e) => {
        handleMouseDown({ pageX: e.touches[0].pageX, offsetLeft: scrollRef.current.offsetLeft });
    };

    const handleTouchMove = (e) => {
        handleMouseMove({ pageX: e.touches[0].pageX, offsetLeft: scrollRef.current.offsetLeft });
    };

    if (newArrivals.length === 0) {
        // ... (loading state)
    }
    
    return(
        <section className="py-16 px-4 lg:px-0">
            {/* ... (Header and Buttons) */}
            <div className="container mx-auto mb-10 relative">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Discover the latest trends and styles from our collection.
                    </p>
                </div>
                
                {/* Scroll Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 md:px-0 pointer-events-none">
                    <button 
                        onClick={() => { scroll("left"); setIsHovering(true); setTimeout(() => setIsHovering(false), 5000); }} // Pause after manual click
                        disabled={!canScrollLeft}
                        className={`p-3 rounded-full shadow-lg transition-colors duration-200 pointer-events-auto
                            ${canScrollLeft ? "bg-white text-black hover:bg-gray-100" : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"}`}
                        aria-label="Scroll left"
                    >
                        <FiChevronLeft className="text-2xl"/>
                    </button>
                    <button 
                        onClick={() => { scroll("right"); setIsHovering(true); setTimeout(() => setIsHovering(false), 5000); }} // Pause after manual click
                        disabled={!canScrollRight}
                        className={`p-3 rounded-full shadow-lg transition-colors duration-200 pointer-events-auto
                            ${canScrollRight ? "bg-white text-black hover:bg-gray-100" : "bg-gray-300 text-gray-600 cursor-not-allowed opacity-50"}`}
                        aria-label="Scroll right"
                    >
                        <FiChevronRight className="text-2xl"/>
                    </button>
                </div>
            </div>
            
            {/* Scrollable Content */}
            <div 
                ref={scrollRef} 
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative scrollbar-hide ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                // Desktop Dragging
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onMouseEnter={() => setIsHovering(true)} // Pause on hover
                onMouseOut={() => setIsHovering(false)} // Resume on mouse out
                // Mobile Touch
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUpOrLeave}
            >
                {/* Looped Arrivals */}
                {loopedArrivals.map((product, index) => (
                    <div 
                        key={`${product._id}-${index}`} 
                        className="min-w-[80%] sm:min-w-[45%] lg:min-w-[30%] xl:min-w-[23%] relative flex-shrink-0"
                    >
                        <img 
                            className="w-full h-[350px] object-cover rounded-lg shadow-md" 
                            draggable="false" 
                            src={product.images[0]?.url} 
                            alt={product.images[0]?.altText || product.name} 
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-4 rounded-b-lg backdrop-blur-sm">
                            <Link to={`/product/${product._id}`} className="block">
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="mt-1 text-sm">Rs. {product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default NewArrivals;
