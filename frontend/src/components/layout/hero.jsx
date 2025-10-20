import {Link} from "react-router-dom";
import homepage from "../../assets/homepage.jpeg";

const Hero = () => {
    return(
       <section className="relative">
        <img 
        src={homepage}
        alt="OceanKart"
        className="w-full h-[300px] md:h-[400px] lg:h-[600px] object-cover"
        ></img>
        <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
            <div className="text-center text-white p-6">
                <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
                    Your<br />Style 
                </h1>
                <p className="text-sm tracking-tighter md:text-lg mb-6">
                    Get ready for the FitCheck y'all
                </p>
                <Link to="#" className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"> Shop Now</Link>
            </div>
        </div>
       </section>
    )
}

export default Hero;