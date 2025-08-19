import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'



export const get_refund_details = createAsyncThunk(
    'payment/get_refund_details',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/payment/get-refund-details', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)


export const get_payment_details = createAsyncThunk(
    'payment/get_payment_details',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/payment/get-payment-details', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

const paymentReducer = createSlice({
    name: 'payment',
    initialState: {
        successMessage: '',
        errorMessage: '',
        refund_request: [],
        refund_cancelled: [],
        transactions: [],
        refund_details: [],

    },
    reducers: {
        messageClear: (state) => {
            state.successMessage = '';
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_refund_details.fulfilled, (state, { payload }) => {
                state.refund_request = payload.refund_request;
                state.refund_cancelled = payload.refund_cancelled;
            })
            .addCase(get_payment_details.fulfilled, (state, { payload }) => {
                state.transactions = payload.transactions;
                state.refund_details = payload.refund_details
            })

    }
})

export const { messageClear } = paymentReducer.actions;
export default paymentReducer.reducer;

