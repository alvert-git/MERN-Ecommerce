import {createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// async thunk for fetching admin products
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts", async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
    });
    return response.data;
})

export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, productData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
    });
    return response.data;
})

// async thunk for updating an existing product

export const updateProduct = createAsyncThunk("adminProducts/updateProduct", async ({id, productData}) => {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`, productData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
    });
    return response.data;
})

// asynnc thunk to delete products

export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct", async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
    });
    return id;
})

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;                
                state.error = action.error.message; 
            })            
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
           
                const index = state.products.findIndex((product) => product._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product._id !== action.payload);
            })

        }
});

export default adminProductSlice.reducer;