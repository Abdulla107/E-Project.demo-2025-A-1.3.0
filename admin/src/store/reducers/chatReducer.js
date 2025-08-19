import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from '../../api/api'


export const get_customer = createAsyncThunk(
    'chat/get_customer',
    async (_, { rejectWithValue }) => {

        try {
            const { data } = await api.get('/chat/admin-get-customer', { withCredentials: true })
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/chat/send-message', info, { withCredentials: true })
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const get_message = createAsyncThunk(
    'chat/get_message',
    async (Id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/chat/get-message/${Id}`, { withCredentials: true })
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const get_unSeen_message = createAsyncThunk(
    'chat/get_unSeen_message',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/chat/admin/get-unSeen_message', { withCredentials: true })
            
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const update_message_status = createAsyncThunk(
    'chat/update_message_status',
    async (senderId, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/chat/update/message-status/${senderId}`, { withCredentials: true })
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const update_one_message_status = createAsyncThunk(
    'chat/update_one_message_status',
    async (senderId, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/chat/update/one-message-status/${senderId}`, { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)



export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        errorMessage: '',
        successMessage: '',
        loader: false,
        messages: [],
        customers: [],
        activeCustomer: [],
        total_unSeen_message: 0,
        unSeen_message: [],
        message_senderImage: [],
        senderMessageCount: []
    },
    reducers: {
        messageClear: (state, _) => {
            state.successMessage = '';
            state.errorMessage = ''
        },
        updateMessage: (state, { payload }) => {
            state.messages = [...state.messages, payload]
        },
        active_status_update: (state, { payload }) => {
            state.activeCustomer = payload;
        },
        update_message_count: (state, { payload }) => { 

            if (!payload) return;
            const sender = state.senderMessageCount.some((d) => d.customerId === payload);

            if (!sender) {
                const add_sender = { customerId: payload, messageCount: 1 }
                state.senderMessageCount = [...state.senderMessageCount, add_sender]

            }

        },
        total_unSeen_message_update: (state) => { 

            if (state.senderMessageCount.length !== state.total_unSeen_message) {
                state.total_unSeen_message = state.total_unSeen_message + 1;
            }
        },

        update_customer_list: (state, action) => { 
            const { senderId } = action.payload;

            const userIndex = state.customers.findIndex(c => c._id === senderId);

            if (userIndex > 0) {
                const [user] = state.customers.splice(userIndex, 1);
                state.customers.unshift(user);
            }

        },


    },
    extraReducers: (builder) => {
        builder
            .addCase(get_customer.fulfilled, (state, { payload }) => {
                state.customers = payload.customers;
            })
            .addCase(send_message.fulfilled, (state, { payload }) => {
                state.messages = [...state.messages, payload.add]
            })
            .addCase(get_message.fulfilled, (state, { payload }) => {
                state.messages = payload.chats
            })

            .addCase(get_unSeen_message.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(get_unSeen_message.rejected, (state, { payload }) => { 
                state.loader = false;
                if (payload.error === 'unSeen message not found') {
                    state.unSeen_message = [];
                    state.total_unSeen_message = 0;
                    state.message_senderImage = [];
                    state.senderMessageCount = [];
                }
            })
            .addCase(get_unSeen_message.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.unSeen_message = payload.unSeen_message;
                state.total_unSeen_message = payload.total_unSeen_message;
                state.message_senderImage = payload.senderInfo;
                state.senderMessageCount = payload.senderMessageCount;
            })
            .addCase(update_message_status.fulfilled, (state, { payload }) => { 
                if (state.total_unSeen_message === 1) {
                    state.unSeen_message = [];
                    state.total_unSeen_message = 0;
                    state.message_senderImage = [];
                    state.senderMessageCount = [];
                } else {

                    const unSend_message_Index = state.unSeen_message.findIndex(c => c.senderId === payload.senderId);
                    const Index = state.senderMessageCount.findIndex(c => c.customerId === payload.senderId);

                    state.total_unSeen_message -= 1;

                    if (Index >= 0) {
                        state.senderMessageCount.splice(Index, 1);
                    }

                    if (unSend_message_Index >= 0) {
                        state.unSeen_message.splice(unSend_message_Index, 1);
                    }

                }
            })

    }
})


export const {
    messageClear,
    updateMessage,
    active_status_update,
    message_status_Clear,
    total_unSeen_message_update,
    update_customer_list,
    update_message_count,
} = chatReducer.actions;

export default chatReducer.reducer;