import {Link} from "react-router-dom";
import menimg from "../../assets/mensection.jpg";
import womenimg from "../../assets/womensection.jpg";

const GenderCollectionSection = () => {
    return (
       <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto flex flex-col md:flex-row gap-8">
            {/* Women's collection */}
            <div className="relative flex-1">
                <img src="https://plus.unsplash.com/premium_photo-1683121266311-04c92a01f5e6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                 alt="Women's Collection" className="w-full h-[500px] object-cover" />
                <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3"> Women's Collection</h2>
                    <Link to="/collections/all?gender=Women" className="text-gray-900 underline">Shop Now</Link>
                </div>
            </div>
             {/* Men's collection */}
             <div className="relative flex-1">
                <img src="https://plus.unsplash.com/premium_photo-1688497830977-f9ab9f958ca7?q=80&w=751&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Men's Collection" className="w-full h-[500px] object-cover" />
                <div className="absolute bottom-8 left-8 bg-white bg-opacity-90 p-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3"> Men's Collection</h2>
                    <Link to="/collections/all?gender=Men" className="text-gray-900 underline">Shop Now</Link>
                </div>
            </div>
        </div>
       </section>
    )
}

export default GenderCollectionSection;