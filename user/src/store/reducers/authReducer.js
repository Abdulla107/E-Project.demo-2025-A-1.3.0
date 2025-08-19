import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";


export const register = createAsyncThunk(
    'user/register',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('user/user-register', info);
            return data;

        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Register failed')
        }
    }
)

export const login = createAsyncThunk(
    'user/login',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('user/user-login', info)
            
            localStorage.setItem('accessToken', data.token);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Login failed')
        }
    }
)

// authorization with user
export const authorization_user = createAsyncThunk(
    'auth/authorization_user',

    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('user/authorization-user', info, { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    });



export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('user/logout', { withCredentials: true });

            if (data) {
                setTimeout(() => {
                    localStorage.removeItem('accessToken');
                    window.location.href = data.navigetUrl;
                }, 2200);
            }
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || 'Logout failed');
        }
    }
);


export const reset_password = createAsyncThunk(
    'auth/reset_password',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.patch('/user/acount/password/reset-password', info)
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const add_profile_info = createAsyncThunk(
    'auth/add_profile_info',
    async (formData, { rejectWithValue }) => {

        try {

            const { data } = await api.post('user/add-profile-info', formData, { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)


export const updated_password = createAsyncThunk(
    'auth/updated_password',
    async (info, { rejectWithValue }) => {
        try {

            const { data } = await api.post('user/update-password', info, { withCredentials: true });
            if (data) {
                setTimeout(() => {
                    localStorage.removeItem('accessToken');
                    window.location.href = data.navigetUrl;
                }, 4000);
            }
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)

export const user_get_admin_image = createAsyncThunk(
    'auth/user_get_admin_image',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/user/get/admin-image', { withCredentials: true });
            return data;

        } catch (error) {
            return rejectWithValue(error.response.data || 'server error')
        }
    }
)


const returnRole = (token) => {
    try {
        if (!token) return "";

        const decoded = jwtDecode(token);
        const expireTime = new Date(decoded.exp * 1000);

        if (new Date() > expireTime) {
            localStorage.removeItem("accessToken");
            return "";
        }

        return decoded?.role || "";
    } catch (error) {
        localStorage.removeItem("accessToken");
        return "";
    }
};


const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: "",
        errorMessage: "",
        loader: false,
        userInfo: '',
        admin_image: '',
        role: returnRole(localStorage.getItem("accessToken")),
        token: localStorage.getItem("accessToken"),
    },
    reducers: {
        messageClear: (state, _) => {
            state.successMessage = '';
            state.errorMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loader = true;
            })
            .addCase(register.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload;
            })
            .addCase(register.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })

            .addCase(login.pending, (state) => {
                state.loader = true;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.data;
                state.token = payload.token;
                state.role = returnRole(payload.token);
                state.successMessage = payload.message;
            })

            .addCase(authorization_user.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.data;
                state.role = payload.data.role;
            })

            .addCase(logout.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(logout.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.message;
            })
            .addCase(logout.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = null;
                state.token = null;
                state.successMessage = payload.message
            })

            .addCase(add_profile_info.pending, (state) => {
                state.loader = true;
            })
            .addCase(add_profile_info.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(add_profile_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo.image = payload.image;
                state.successMessage = payload.message;
            })

            .addCase(updated_password.pending, (state) => {
                state.loader = true;
            })
            .addCase(updated_password.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })
            .addCase(updated_password.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(user_get_admin_image.fulfilled, (state, { payload }) => {
                state.admin_image = payload.admin_image;
            })
            .addCase(reset_password.pending, (state) => {
                state.loader = true;
            })
            .addCase(reset_password.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error;
            })
            .addCase(reset_password.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })


    }
})

export const { messageClear } = authReducer.actions;
export default authReducer.reducer