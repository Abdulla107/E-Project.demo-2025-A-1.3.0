import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const add_shipping_info = createAsyncThunk(
    'order/shipping_info',
    async (info, { rejectWithValue }) => {

        try {
            const { data } = await api.post('order/shipping-info', info, { withCredentials: true })
          
            return data

        } catch (error) {
            return rejectWithValue(error?.message)
        }
    }
)

export const get_shipping_info = createAsyncThunk(
    'order/get_shipping_info',
    async (userId, { rejectWithValue }) => {

        try {
            const { data } = await api.get(`order/get-shipping-info/${userId}`, { withCredentials: true })
          
            return data

        } catch (error) {
            return rejectWithValue(error?.message)
        }
    }
)

export const place_order = createAsyncThunk(
    'order/place_order',
    async (info, { rejectWithValue }) => {

        try {
            const { data } = await api.post('order/place-order', info, { withCredentials: true })
            return data;

        } catch (error) {
            return rejectWithValue(error?.message)
        }
    }
)

export const payment_create = createAsyncThunk(
    'order/payment_create',
    async (info, { rejectWithValue }) => {
        try {
            const response = await api.post("/customer/order/createPayment", info, { withCredentials: true });

            if (response.data?.approvalUrl) {
                window.location.href = response.data.approvalUrl;
            } else {
                return rejectWithValue("Payment link not received");
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Payment request failed");
        }
    }
);


export const get_deshboard_orders = createAsyncThunk(
    'order/get_deshboard_orders',
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`order/get-deshboard-orders/${userId}`, { withCredentials: true })
          
            return data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'server error')
        }
    }
)

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async ({ userId, status }, { rejectWithValue }) => {

        try {
            const { data } = await api.get('order/get-orders', {
                params: { userId, status }, withCredentials: true
            });
          
            return data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'server error')
        }
    }
)

export const get_order = createAsyncThunk(
    'order/get_order',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`order/get-order/${orderId}`, { withCredentials: true })
          
            return data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'server error')
        }
    }
)

export const refund_request = createAsyncThunk(
    'refund/refund_request',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/payment/refund/refund-request/${orderId}`, { withCredentials: true });
          
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'server error')
        }
    }
)


export const get_target_country = createAsyncThunk(
  'auth/get_target_country',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/get/target-country', { withCredentials: true });
      return data;

    } catch (error) {
      return rejectWithValue(error.response.data || 'server error')
    }
  }
)




const orderReducer = createSlice({
    name: 'order',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        shippingInfo: [],
        newOrder: [],
        new_orders: [],
        total_order: '',
        pending_order: '',
        unpaid_order: '',
        orders: [],
        order: [],
        target_country: [],

    },
    reducers: {
        messageClear: (state, _) => {
            state.successMessage = '';
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_shipping_info.pending, (state) => {
                state.loader = true;
            })
            .addCase(add_shipping_info.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(add_shipping_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(get_shipping_info.fulfilled, (state, { payload }) => {
                state.shippingInfo = payload.shippingInfo
            })
            .addCase(place_order.fulfilled, (state, { payload }) => {
                state.newOrder = payload.order
            })
            .addCase(get_deshboard_orders.fulfilled, (state, { payload }) => {
                state.new_orders = payload.new_orders;
                state.total_order = payload.total_order;
                state.pending_order = payload.pending_order;
                state.unpaid_order = payload.unpaid_order;
            })
            .addCase(get_orders.fulfilled, (state, { payload }) => {
                state.orders = payload.orders;
            })
            .addCase(payment_create.pending, (state) => {
                state.loader = true;
            })
            .addCase(payment_create.rejected, (state) => {
                state.loader = false;
            })
            .addCase(payment_create.fulfilled, (state) => {
                state.loader = false;
            })
            .addCase(get_order.fulfilled, (state, { payload }) => {
                state.order = payload.order
            })
            .addCase(refund_request.pending, (state) => {
                state.loader = true;
            })
            .addCase(refund_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(refund_request.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(get_target_country.fulfilled, (state, {payload}) => {
                state.target_country = payload.country;
            })
    }
})


export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;


