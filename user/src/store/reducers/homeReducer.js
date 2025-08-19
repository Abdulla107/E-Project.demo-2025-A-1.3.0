import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";



// get products
export const get_products = createAsyncThunk(
    "product/get_products",
    async (_, { fulfillWithValue }) => {
        try {
            const { data } = await api.get("/home/get-products");
            return fulfillWithValue(data);
        } catch (error) {
          
            return rejectWithValue(error.response.data.message)
        }
    }
);

export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/price-range-product', { withCredentials: true });
           
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data.message)
        }
    }
)


export const query_products = createAsyncThunk(
    "product/query_products",
    async (query, { rejectWithValue }) => {
        try {

            const params = new URLSearchParams({
                category: query.category,
                rating: query.rating,
                lowPrice: query.low,
                highPrice: query.high,
                sortPrice: query.sortPrice,
                pageNumber: query.pageNumber,
                searchValue: query.searchValue || ""
            }).toString();

            const { data } = await api.get(`/home/query-products?${params}`);
            return data;

        } catch (error) {
            return rejectWithValue(error.response?.data || 'server error');
        }
    }
);


export const get_productDetails = createAsyncThunk(
    'product/get_productDetails',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`home/product/get-productDetails/${productId}`, { withCredentials: true })
           
            return data;

        } catch (error) {
            return rejectWithValue(error?.response?.data || 'server error')
        }
    }
)

export const add_customer_review = createAsyncThunk(
    'review/add_customer_review',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/home/product/add-customer-review', info, { withCredentials: true });
           
            return data;

        } catch (error) {
            return rejectWithValue(error.response?.data || 'server error')
        }
    }
)

export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async ({ productId, pageNumber }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`, {withCredentials: true});
           
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const review_authorise = createAsyncThunk(
    'review/review_authorise', 
    async({ productId,customerId }, {rejectWithValue}) => {
        try{
            const {data} = await api.get(`/home/customer/review_authorise/${productId}?customerId=${customerId}`, {withCredentials: true} )
           
            return data;
        }catch(error){
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)




const homeReducer = createSlice({
    name: 'home',
    initialState: {
        products: [],
        totalProduct: 0,
        parPage: 0,
        priceRange: {
            low: 0,
            high: 100,
        },
        product: {},
        relatedProducts: [],
        successMessage: '',
        errorMessage: '',
        loader: false,
        totalReview: 0,
        rating_review: [],
        reviews: [],
        order_review: '',
        banners: [],
        order_review: '',
    },
    reducers: {
        messageClear: (state, _) => {
            state.successMessage = '';
            state.errorMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.products = payload.products;
            })
            .addCase(price_range_product.fulfilled, (state, { payload }) => {
                state.priceRange = payload.priceRange;
            })
            .addCase(query_products.fulfilled, (state, { payload }) => {
                state.products = payload.products;
                state.totalProduct = payload.totalProduct;
                state.parPage = payload.parPage;
            })
            .addCase(get_productDetails.fulfilled, (state, { payload }) => {
                state.product = payload.product;
                state.relatedProducts = payload.relatedProducts;
            })
            .addCase(add_customer_review.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(add_customer_review.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(add_customer_review.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(get_reviews.fulfilled, (state, {payload}) => {
                state.rating_review = payload.rating_review;
                state.reviews = payload.reviews;
                state.totalReview = payload.totalReview;
                 state.parPage = payload.parPage;
            })
            .addCase(review_authorise.fulfilled, (state, {payload}) => {
               state.order_review = payload
            })

    }
})

export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;