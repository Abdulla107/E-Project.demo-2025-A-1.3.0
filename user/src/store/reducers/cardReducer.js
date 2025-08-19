import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './../../api/api';


// card stard
export const add_to_card = createAsyncThunk(
    'card/add_to_card',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/product/add-to-card', info, { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const get_card_products = createAsyncThunk(
    "card/get_card_products",
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/product/get-card-product/${userId}`, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error');
        }
    }
);

export const quantity_inc = createAsyncThunk(
    'card/quantity_inc',
    async (info, { rejectWithValue }) => {

        try {
            const { data } = await api.post('/product/quantity-inc', info, { withCredentials: true })
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const quantity_dec = createAsyncThunk(
    'card/quantity_dec',
    async (info, { rejectWithValue }) => {

        try {
            const { data } = await api.post('/product/quantity-dec', info, { withCredentials: true })
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)
export const delete_card_product = createAsyncThunk(
    'card/delete_card_product',
    async (productId, { rejectWithValue }) => {

        try {
            const { data } = await api.post(`/product/delete-card-product/${productId}`, { withCredentials: true })
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

// wishlist stard
export const add_to_wishlist = createAsyncThunk(
    'wishlist/add_to_wishlist',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/wishlist/add-to-wishlist', info, { withCredentials: true });
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const get_wishlist_products = createAsyncThunk(
    'wishlist/get_wishlist_products',
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/wishlist/get-wishlist/${userId}`, { withCredentials: true });
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const remove_to_wishlist = createAsyncThunk(
    'wishlist/remove_to_wishlist',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/wishlist/remove-to-wishlist`, info, { withCredentials: true });
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)
// wishlist end


export const cardReducer = createSlice({
    name: 'card',
    initialState: {
        errorMessage: "",
        successMessage: "",
        loader: false,
        card_products: [],
        card_product_count: 0,
        buy_product_item: 0,
        price: 0,
        shipping_fee: 0,
        outofstock_products: [],
        wishlist_count: 0,
        wishlist_products: [],

    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
        reset_count: (state, _) => {
            state.card_product_count = 0;
            state.wishlist_count = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // card
            .addCase(add_to_card.rejected, (state, { payload }) => {
                state.errorMessage = payload.error
            })
            .addCase(add_to_card.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.card_product_count = state.card_product_count + 1;
            })
            .addCase(get_card_products.fulfilled, (state, { payload }) => {
                state.card_products = payload.card_products;
                state.price = payload.price;
                state.card_product_count = payload.card_product_count;
                state.shipping_fee = payload.shipping_fee;
                state.outofstock_products = payload.outOfStockProduct;
                state.buy_product_item = payload.buy_product_item;
            })
            .addCase(quantity_inc.rejected, (state, { payload }) => {
                state.errorMessage = payload.error
            })
            .addCase(quantity_inc.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message
            })
            .addCase(quantity_dec.rejected, (state, { payload }) => {
                state.errorMessage = payload.error
            })
            .addCase(quantity_dec.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message
            })
            .addCase(delete_card_product.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(delete_card_product.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error
            })
            .addCase(delete_card_product.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message
            })


            // wishlist 
            .addCase(add_to_wishlist.rejected, (state, { payload }) => {
                state.errorMessage = payload.message;
            })
            .addCase(add_to_wishlist.fulfilled, (state, { payload }) => {
                state.successMessage = payload.message;
                state.wishlist_count = state.wishlist_count + 1;
            })
            .addCase(get_wishlist_products.fulfilled, (state, { payload }) => {
                state.wishlist_products = payload.wishlist_products;
                state.wishlist_count = payload.wishlist_product_count;
            })
            .addCase(remove_to_wishlist.rejected, (state, { payload }) => {
               state.errorMessage = payload.error;
            })
            .addCase(remove_to_wishlist.fulfilled, (state, { payload }) => {
               state.successMessage = payload.message;
            })
    }
})


export const { messageClear, reset_count } = cardReducer.actions;
export default cardReducer.reducer;