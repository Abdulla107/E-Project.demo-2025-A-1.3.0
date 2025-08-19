import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const get_orders = createAsyncThunk(
    'order/get_orders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/order/get-orders', { withCredentials: true });
            
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)


export const get_order = createAsyncThunk(
    'order/get_order',
    async(orderId, {rejectWithValue}) => {
        try{
            const {data} = await api.get(`/admin/order/get-order/${orderId}`, {withCredentials: true});
            
            return data;

        }catch(error){
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const update_order_status = createAsyncThunk(
    'order/update_order_status',
    async(info, {rejectWithValue}) => {
        try{
            const {data} = await api.patch('/admin/order/order-status-update', info, {withCredentials: true});
            
            return data;

        }catch(error){
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const update_refund_status = createAsyncThunk(
    'payment/update_refund_status',
    async(info, {rejectWithValue}) => {
        try{
            const {data} = await api.patch('/admin/order/payment/update-refund-status', info, {withCredentials: true});
            
            return data;
        }catch(error){
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
        order: {},
        running_orders: [],
        completed_orders: [],
        cancelled_orders: [],
        refunded_orders: [],
    },
    reducers: {
        messageClear: (state) => {
            state.successMessage = '';
            state.errorMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_orders.fulfilled, (state, { payload }) => {
                state.running_orders = payload.running_orders;
                state.completed_orders = payload.completed_orders;
                state.cancelled_orders = payload.cancelled_orders;
                state.refunded_orders = payload.refunded_orders;
            })
            .addCase(get_order.fulfilled, (state, {payload}) => {
                state.order = payload.order;
            })
            .addCase(update_order_status.rejected, (state, {payload}) => {
                state.errorMessage = payload.error;
            })
            .addCase(update_order_status.fulfilled, (state, {payload}) => {
                state.successMessage = payload.message;
            })
            .addCase(update_refund_status.pending, (state, {payload}) => {
                state.loader = true;
            })
            .addCase(update_refund_status.rejected, (state, {payload}) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(update_refund_status.fulfilled, (state, {payload}) => {
                state.loader = false;
                state.successMessage = payload.message;
            })

    }
})

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;