import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { Upload, X, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ProductManageMent = () => {
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.adminProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    },[dispatch]);

    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to delete this product?"))
            dispatch(deleteProduct(id));
    }

    const handleProductCreated = () => {
        setIsModalOpen(false);
        dispatch(fetchAdminProducts()); // Refresh the product list
    }

    if(loading){
        return <p>Loading...</p>
    }

    if(error){
        return <p>Error: {error}</p>
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">Product Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">SKU</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b hover:bg-gray-50 cursor-pointer">
                                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                                    <td className="p-4">Rs.{product.price}</td>
                                    <td className="p-4">{product.sku}</td>
                                    <td className="p-4">
                                        <Link to={`/admin/products/${product._id}/edit`}
                                            className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600">
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(product._id)}
                                            className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="4" className="py-4 px-4 text-center text-gray-500">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ProductModal 
                    onClose={() => setIsModalOpen(false)}
                    onProductCreated={handleProductCreated}
                />
            )}
        </div>
    )
}

// Product Creation Modal Component
const ProductModal = ({ onClose, onProductCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        countInStock: '',
        category: '',
        material: '',
        gender: '',
        sku: '',
        weight: '',
        sizes: [],
        colors: [],
        collections: '',
        tags: [],
        images: [],
        dimensions: {
            length: '',
            width: '',
            height: ''
        }
    });

    const [currentInput, setCurrentInput] = useState({
        size: '',
        color: '',
        collection: '',
        tag: ''
    });

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const getToken = () => localStorage.getItem('userToken');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const addToArray = (field) => {
        const value = currentInput[field].trim();
        if (value && !formData[`${field}s`].includes(value)) {
            setFormData(prev => ({
                ...prev,
                [`${field}s`]: [...prev[`${field}s`], value]
            }));
            setCurrentInput(prev => ({ ...prev, [field]: '' }));
        }
    };

    const removeFromArray = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        setUploadProgress(files.map(() => ({ status: 'uploading', url: null })));

        const token = getToken();
        if (!token) {
            setMessage({ type: 'error', text: 'No authentication token found' });
            setUploading(false);
            return;
        }

        try {
            const uploadPromises = files.map(async (file, index) => {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) throw new Error(`Upload failed for ${file.name}`);
                
                const data = await response.json();
                setUploadProgress(prev => {
                    const newProgress = [...prev];
                    newProgress[index] = { status: 'success', url: data.imageUrl };
                    return newProgress;
                });
                
                return data.imageUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            const imageObjects = uploadedUrls.map(url => ({ url }));
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...imageObjects]
            }));
            setMessage({ type: 'success', text: `${uploadedUrls.length} image(s) uploaded successfully` });
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: 'Failed to upload images' });
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress([]), 2000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        const token = getToken();
        if (!token) {
            setMessage({ type: 'error', text: 'No authentication token found' });
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
                    countInStock: parseInt(formData.countInStock),
                    weight: formData.weight ? parseFloat(formData.weight) : undefined
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create product');
            }

            setMessage({ type: 'success', text: 'Product created successfully!' });
            
            setTimeout(() => {
                onProductCreated();
            }, 1500);
        } catch (error) {
            console.error('Submit error:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to create product' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter product description"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., PROD-001"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Clothing"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                                    <input
                                        type="number"
                                        name="discountPrice"
                                        value={formData.discountPrice}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count *</label>
                                    <input
                                        type="number"
                                        name="countInStock"
                                        value={formData.countInStock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Product Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                    <input
                                        type="text"
                                        name="material"
                                        value={formData.material}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Cotton"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Unisex">Unisex</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentInput.size}
                                    onChange={(e) => setCurrentInput(prev => ({ ...prev, size: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('size'))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., S, M, L, XL"
                                />
                                <button
                                    type="button"
                                    onClick={() => addToArray('size')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.sizes.map((size, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2 text-sm">
                                        {size}
                                        <button type="button" onClick={() => removeFromArray('sizes', index)}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentInput.color}
                                    onChange={(e) => setCurrentInput(prev => ({ ...prev, color: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('color'))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Red, Blue, Black"
                                />
                                <button
                                    type="button"
                                    onClick={() => addToArray('color')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.colors.map((color, index) => (
                                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-2 text-sm">
                                        {color}
                                        <button type="button" onClick={() => removeFromArray('colors', index)}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Collections */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Collections</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    name="collections"
                                    value={formData.collections}
                                    onChange={handleChange}
                                   
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Summer 2024, New Arrivals"
                                />
                             
                            </div>
                            
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={currentInput.tag}
                                    onChange={(e) => setCurrentInput(prev => ({ ...prev, tag: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('tag'))}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., bestseller, trending"
                                />
                                <button
                                    type="button"
                                    onClick={() => addToArray('tag')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-2 text-sm">
                                        {tag}
                                        <button type="button" onClick={() => removeFromArray('tags', index)}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Product Images</h3>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <label className="flex flex-col items-center cursor-pointer">
                                    <Upload className="text-gray-400 mb-2" size={40} />
                                    <span className="text-sm text-gray-600 mb-2">Click to upload images</span>
                                    <span className="text-xs text-gray-500">PNG, JPG up to 10MB</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {uploading && (
                                <div className="space-y-2">
                                    {uploadProgress.map((progress, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            {progress.status === 'uploading' && (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} />
                                                    <span>Uploading image {index + 1}...</span>
                                                </>
                                            )}
                                            {progress.status === 'success' && (
                                                <>
                                                    <CheckCircle className="text-green-600" size={16} />
                                                    <span className="text-green-600">Image {index + 1} uploaded</span>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {formData.images.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFromArray('images', index)}
                                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || uploading}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Product'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManageMent;