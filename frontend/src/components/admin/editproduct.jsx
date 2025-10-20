import {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";
import { updateProduct } from "../../redux/slices/productsSlice";
import { useEffect } from "react";
import axios from "axios";

 const EditProduct = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const {id} = useParams();
const {selectProduct, loading, error} = useSelector((state) => state.products);
  
        const [productData, setProductData] = useState({
            name: "",
            description: "",
            price: 0,
            countInStock: 0,
            sku: "",
            category: "",
            images: [],
            sizes:[],
            colors:[],
            collections:"",
            material:"",
            gender:"",
        });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if(id){
            dispatch(fetchProductDetails(id));
        }
    },[dispatch, id]);

    useEffect(() => {
        if(selectProduct){
            setProductData(selectProduct);
        }
    },[selectProduct]);

    const handleImageUpload = async (e) => {
        // Fix 1: Get the first file from the FileList
        const file = e.target.files[0]; // Get the actual File object, not FileList
        
        // Add validation
        if (!file) {
            console.error("No file selected");
            return;
        }
        
        // Optional: Add file type validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            console.error('Invalid file type:', file.type);
            alert('Please select a valid image file');
            return;
        }
        
        // Optional: Add file size validation (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            console.error('File too large:', file.size);
            alert('File size must be less than 5MB');
            return;
        }
        
        const formData = new FormData();
        formData.append("image", file); // Now appending the actual File object
        
        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`, 
                formData,
                {
                    headers: {
                        // Fix 2: Remove Content-Type header - let browser set it automatically
                        // "Content-Type": "multipart/form-data" // Remove this line
                    }
                }
            );
            
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }],
            }));
            
            setUploading(false);
        } catch (error) {
            console.error("Upload error:", error);
            console.error("Error details:", error.response?.data);
            setUploading(false);
        }
    };

        const handleChange = (e) => {
            const {name, value} = e.target;
            setProductData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        };
const handleSubmit = (e) => {
    e.preventDefault();
   dispatch(updateProduct({id,productData} ));
   navigate("/admin/products");
}

if(loading){
    return <p>Loading...</p>
}

if(error){
    return <p>Error: {error}</p>
}
    return (
        <div className="max-w-5xlmx-auto p-6 shadow-md rounded-md">
            <h2 className="font-bold mb-6 text-3xl">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* name */}
                <div className="mb-6">
                    <label className=" font-semibold mb-2 block">Product Name</label>
                    <input type="text" name="name"
                    value={productData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required />
                </div>

                {/* description */}
                <div className="mb-6">
                    <label className=" font-semibold mb-2 block">Description</label>
                    <textarea name="description"
                    value={productData.description} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2" rows={4} required></textarea>
                </div>

                {/* price */}
                <div className="mb-6">
                    <label className=" font-semibold mb-2 block">Price</label>
                    <input type="number" name="price"
                    value={productData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required />
                </div>

                {/* countInStock */}
                <div className="mb-6">
                    <label className=" font-semibold mb-2 block">Count In Stock</label>
                    <input type="number" name="countInStock"
                    value={productData.countInStock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required />
                </div>
                {/* sku */}
                <div className="mb-6">
                    <label className=" font-semibold mb-2 block">SKU</label>
                    <input type="text" name="sku"
                    value={productData.sku}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required />
                </div>

                {/* sizes */}
                <div className="mb-6">
                    <label className=" font-semibold mb-2 block">Sizes (comma-separated)</label>
                    <input type="text" name="sizes"
                    value={productData.sizes.join(",")}
                    onChange={(e) => setProductData({...productData, sizes: e.target.value.split(",").map((size) => size.trim())})}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required />
                </div>
                {/* colors */}
                <div className="mb-6">
                    <label className=" font-semibold mb-2 block">Colors</label>
                    <input type="text" name="colors"
                    value={productData.colors.join(",")}
                    onChange={(e) => setProductData({...productData,
                        colors: e.target.value.split(",").map((color) => color.trim())})}
                    className="w-full border border-gray-300 rounded-md p-2"
                    required />
                </div>
                {/* image */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input type="file"
                   
                    onChange={handleImageUpload} />
                     {uploading && <p>Uploading...</p>}
                    <div className="flex gap-4 mt-4">
                        {productData.images.map((image, index) => (
                            <div key={index}>
                                <img src={image.url} alt={image.altText || "Product Image"} 
                                className="w-20 h-20 object-cover rounded-md shadow-sm"/>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700 transition-colors">Submit</button>
            </form>
        </div>
    )
}
export default EditProduct;