import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../api/api"


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

export const get_user_unSaw_message = createAsyncThunk(
    'chat/get_user_unSaw_message',
    async (receverId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/chat/get-user-unSaw-message/${receverId}`, { withCredentials: true })
           
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const update_message_status = createAsyncThunk(
    'chat/update_message_status',
    async (receverId, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/chat/user/update/message-status/${receverId}`, { withCredentials: true })
           
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const update_one_message_status = createAsyncThunk(
    'chat/update_one_message_status',
    async (receverId, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/chat/user/update/one-message-status/${receverId}`, { withCredentials: true })
           
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
        messages: [],
        activeAdmin: '',
        unSaw_message: [],
        total_unSaw_message: 0,
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
            state.activeAdmin = payload;
        },
        unSaw_message_count_update: (state, { payload }) => {
            if (payload === 'one') {
                state.total_unSaw_message = Math.max(0, state.total_unSaw_message - 1);
            } else if (payload === 'all') {
                state.total_unSaw_message = 0;
            } else {
                state.total_unSaw_message += 1;
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(send_message.fulfilled, (state, { payload }) => {
                state.messages = [...state.messages, payload.add]
            })
            .addCase(get_message.fulfilled, (state, { payload }) => {
                state.messages = payload.chats
            })
            .addCase(get_user_unSaw_message.fulfilled, (state, { payload }) => {
                state.unSaw_message = payload.unSaw_message;
                state.total_unSaw_message = payload.total_unSaw_message;
            })
    }
})


export const { messageClear, updateMessage, active_status_update, total_unSaw_message, unSaw_message_count_update } = chatReducer.actions;
export default chatReducer.reducer;
