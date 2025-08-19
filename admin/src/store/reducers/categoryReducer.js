import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/category/add-category', formData, { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error?.response?.data || { error: 'Unknown error occurred' })
        }
    }
);

export const getCategory = createAsyncThunk(
    'category/getCategory',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/category/get-category', { withCredentials: true });
            return data

        } catch (error) {
            return rejectWithValue(error.response.data || { error: 'Unknown error occured' })
        }
    }
)

export const delete_category = createAsyncThunk(
    'category/delet_category',

    async ( info, { rejectWithValue }) => {
        try {

            const { data } = await api.post('/category/delete_category', info, { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || { error: 'Unkown error accured' })
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

// Slice
const categoryReducer = createSlice({
    name: 'category',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCategory.pending, (state) => {
                state.loader = true;
            })
            .addCase(addCategory.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Unknown error accurred.';
            })
            .addCase(addCategory.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload?.message || "Category added successfully.";
                state.categorys = [...state.categorys, payload?.category];
            })

            .addCase(getCategory.fulfilled, (state, { payload }) => {
                state.totalCategory = payload?.totalCategory
                state.categorys = payload?.categorys
            })
            .addCase(delete_category.pending, (state) => {
                state.loader = true;
            })
            .addCase(delete_category.rejected, (state, {payload}) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Unknown error accurred'
            })
            .addCase(delete_category.fulfilled, (state, {payload}) => {
                state.loader = false;
                state.successMessage = payload?.message || 'Dlete successfully'
            })
    }
})

export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;

