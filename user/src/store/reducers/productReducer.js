import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';




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

export const get_faeaturl_products = createAsyncThunk(
    'product/get_faeaturl_product',

    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('product/faeature-product', { withCredentials: true });
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



// Inital state
const initialState = {
    successMessage: '',
    errorMessage: '',
    loader: false,
    totalProduct: 0,
    product: '',
    products: [],
    faeaturlProducts: [],
    banner: [],
    banners: [],
};



const productReducer = createSlice({
    name: 'product',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_banners.fulfilled, (state, { payload }) => {
                state.banners = payload.banners
            })
            .addCase(get_faeaturl_products.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.faeaturlProducts = payload.faeaturlProducts || 0;
            })
            .addCase(getProducts.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.totalProduct = payload.totalProduct || 0;
                state.products = payload.product || 0;
            })

    }
});

export const { messageClear } = productReducer.actions;
export default productReducer.reducer;

