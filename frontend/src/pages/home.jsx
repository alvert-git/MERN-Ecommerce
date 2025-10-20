import { useEffect, useState } from "react";
import Hero from "../components/layout/hero";
import GenderCollectionSection from "../components/product/gendercollectionsection";
import NewArrivals from "../components/product/newArrivals";
import ProductDetails from "../components/product/product.detail";
import {useDispatch, useSelector} from "react-redux";
import ProductGrid from "../components/product/productgrid";
import axios from "axios";

const Home = () => {
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.products);
    const [bestSellerProduct, setBestSellerProduct] = useState(null);

    useEffect(() => {
       const fetchBestSeller = async () => {
           try {
               const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
               setBestSellerProduct(response.data);
           } catch (error) {
               console.error("Error fetching best seller:", error);
           }
       }
       fetchBestSeller();
    }, []);
    return (
        <div>
        <Hero/>
        <GenderCollectionSection/>
        <NewArrivals/>
        {/* best seller */}
        <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
        {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id}/>) : (<p className="text-center">Loading Best Seller Proucts...</p>)}

        <ProductGrid products={products} loading={loading} error={error} />
        </div>
    )
};

export default Home;