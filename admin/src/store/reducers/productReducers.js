import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const addProduct = createAsyncThunk(
    'product/addProduct',

    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('product/add-product', formData, { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error?.response?.data || { error: 'Unknown error occurred' })
        }
    }
)

export const getProducts = createAsyncThunk(
    'product/getProducts',

    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('product/get-product', { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error?.response?.data || { error: 'Unknown error occurred' })
        }
    }
)

export const get_product = createAsyncThunk(
    'product/get_product',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/product/product-get/${productId}`, { withCredentials: true })
            return (data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const update_product = createAsyncThunk(
    'product/updateProduct',
    async (product, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/product/product-update', product, { withCredentials: true })
            
            return (data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// delet product 
export const delete_product = createAsyncThunk(
    'product/delete_product',
    async (product, { rejectWithValue }) => {

        try {
            const { data } = await api.post('/product/delete-product', product, { withCredentials: true })
            
            return (data);
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// product banner add
export const addBanner = createAsyncThunk(
    'product/addBanner',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/product/add-banner', formData, { withCredentials: true })
            
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// get product banners--all
export const get_banners = createAsyncThunk(
    'product/get_banners',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/product/get-banners', { withCredentials: true });
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// get product banner 
export const getBanner = createAsyncThunk(
    'product/getBanner',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/product/get-banner/${productId}`, { withCredentials: true });
            
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// delet product banner
export const delete_banner = createAsyncThunk(
    'product/banner',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/prouct/delete-banner`, info, { withCredentials: true });
            
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async ({ productId, pageNumber }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`, { withCredentials: true });
            
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)


// Initial state
const initialState = {
    successMessage: '',
    errorMessage: '',
    loader: false,
    totalProduct: 0,
    product: '',
    products: [],
    banner: [],
    banners: [],
    parPage: 0,
    totalReview: 0,
    rating_review: [],
    reviews: [],
};

// Slice 
const productReducer = createSlice({
    name: 'produce',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addProduct.pending, (state) => {
                state.loader = true;
            })
            .addCase(addProduct.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Unknown error occurred'
            })
            .addCase(addProduct.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload?.message || "Product added successfully.";
                state.products = Array.isArray(state.products) ? [...state.products, payload.product] : [payload.product];
            })

            .addCase(getProducts.rejected, (state) => {
                state.totalProduct = 0;
                state.products = 0;
            })
            .addCase(getProducts.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.totalProduct = payload.totalProduct || 0;
                state.products = payload.product || 0;
            })
            .addCase(get_product.fulfilled, (state, { payload }) => {
                state.product = payload.product
            })
            // update product 
            .addCase(update_product.pending, (state) => {
                state.loader = true;
            })
            .addCase(update_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Unknown error occurred'
            })
            .addCase(update_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.product = payload.product;
                state.successMessage = payload.message;
            })
            .addCase(delete_product.pending, (state) => {
                state.loader = true;
            })
            .addCase(delete_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error || 'Unknown error accurred'
            })
            .addCase(delete_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(addBanner.pending, (state) => {
                state.loader = true;
            })
            .addCase(addBanner.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message || 'Unknow error accurred'
            })
            .addCase(addBanner.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
                state.banners = [...state.banners, payload.banner]
            })
            .addCase(get_banners.fulfilled, (state, { payload }) => {
                state.banners = payload.banners
            })
            .addCase(getBanner.fulfilled, (state, { payload }) => {
                state.banner = payload.banner
            })
            .addCase(delete_banner.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(delete_banner.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(delete_banner.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message
            })
            .addCase(get_reviews.fulfilled, (state, { payload }) => {
                state.rating_review = payload.rating_review;
                state.reviews = payload.reviews;
                state.totalReview = payload.totalReview;
                state.parPage = payload.parPage;
            })


    }

})

export const { messageClear } = productReducer.actions;
export default productReducer.reducer;