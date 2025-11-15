import { Link } from "react-router-dom";
// Assuming 'homepage' is a local image, but using the remote one for the example
// import homepage from "../../assets/homepage.jpeg"; 

const Hero = () => {
    return(
       <section className="relative">
        <img 
        // The image remains the same
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="A person walking through a city street, representing fashion and style." // Improved alt text
        className="w-full h-[300px] md:h-[400px] lg:h-[600px] object-cover"
        ></img>
        
        {/* IMPROVEMENT: Increased opacity from bg-opacity-5 to bg-opacity-50 for better contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-6">
                
                {/* IMPROVEMENT: Added drop-shadow for text readability over bright areas */}
                <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold tracking-tight uppercase mb-4 drop-shadow-lg">
                    Your<br />Style 
                </h1>
                
                {/* IMPROVEMENT: Slightly larger and more impactful tagline */}
                <p className="text-lg md:text-xl mb-8 drop-shadow-md">
                    Get ready for the FitCheck
                </p>
                
                {/* IMPROVEMENT: Changed button text to pure black for better contrast on the white button */}
                <Link 
                    to="/shop" // Changed to a more meaningful route if possible
                    className="bg-white text-black hover:bg-gray-100 transition duration-300 px-8 py-3 rounded-full text-lg font-semibold shadow-xl"
                > 
                    Shop Now
                </Link>
            </div>
        </div>
       </section>
    )
}

export default Hero;
