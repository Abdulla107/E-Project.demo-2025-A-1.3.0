import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';




// get categorys 
export const getCategorys = createAsyncThunk(
    'category/getCategorys',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/category/get-category', { withCredentials: true });
            return data

        } catch (error) {
            return rejectWithValue(error.response.data || { error: 'Unknown error occured' })
        }
    }
)

// Initial state
const initialState = {
    successMessage: '',
    errorMessage: '',
    loader: false,
    totalCategory: 0,
    categorys: [],
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
            .addCase(getCategorys.fulfilled, (state, { payload }) => {
                state.totalCategory = payload?.totalCategory
                state.categorys = payload?.categorys
            })

    }
});

export const { messageClear } = productReducer.actions;
export default productReducer.reducer;

