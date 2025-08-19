import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

// Admin Login
export const admin_login = createAsyncThunk(
  'auth/admin_login',
  async (info, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin-login', info);
      localStorage.setItem("accessToken", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

// authorization with user
export const authorization_admin = createAsyncThunk(
  'auth/authorization_admin',

  async (info, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/authorization-admin', info, { withCredentials: true });
    
      return data;

    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  });


export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/logout', { withCredentials: true });
      localStorage.removeItem('accessToken');
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Logout failed');
    }
  }
);


export const add_target_country = createAsyncThunk(
  'auth/add_target_country',
  async (info, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/add/target-country', info, { withCredentials: true });
      
      return data;

    } catch (error) {
      return rejectWithValue(error.response.data || 'server error')
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

export const delete_target_country = createAsyncThunk(
  'auth/delete_target_country',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/delete/target-country/${id}`, { withCredentials: true });
      
      return data;

    } catch (error) {
      return rejectWithValue(error.response.data || 'server error')
    }
  }
)


export const get_dashboardDetails = createAsyncThunk(
  'auth/get_dashboardDetails',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/dashboard/get-dashboard-details', { withCredentials: true });
      
      return data;

    } catch (error) {
      return rejectWithValue(error.response.data || 'server error')
    }
  }
)

export const add_profileImage = createAsyncThunk(
  'auth/add_profileImage',
  async (info, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/add/admin-profile-image', info, { withCredentials: true });
      
      return data;

    } catch (error) {
      return rejectWithValue(error.response.data || 'server error')
    }
  }
)


export const get_profile_details = createAsyncThunk(
  'auth/get_profile_details',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/get/profile/details', { withCredentials: true });
      
      return data;

    } catch (error) {
      return rejectWithValue(error.response.date || 'server error')
    }
  }
)


export const update_password = createAsyncThunk(
  'auth/update_password',
  async (info, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/admin/password/update-password', info, { withCredentials: true });
      localStorage.removeItem('accessToken')
      return data;

    } catch (error) {
      return rejectWithValue(error.response.data || 'server error')
    }
  }
)

export const get_new_ordersCount = createAsyncThunk(
  'auth/get_new_ordersCount',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/get/new-order/count', { withCredentials: true })
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
    userInfo: "",
    targetCountry: [],
    role: returnRole(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken"),
    order_count: 0,
    sales_count: 0,
    customer_count: 0,
    new_order_count: 0,
    new_orders: [],
    order_chart: [],
    customer_chart: [],
    count_orders: 0,
    count_earnings: 0,
    count_pending_orders: 0,
    count_new_orders: 0
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.data;
        state.token = payload.token;
        state.role = returnRole(payload.token);
        state.successMessage = payload.message;
      })

      .addCase(authorization_admin.pending, (state) => {
        state.loader = true;
      })
      .addCase(authorization_admin.rejected, (state, { payload }) => {
        state.loader = false;
      })
      .addCase(authorization_admin.fulfilled, (state, { payload }) => {
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
        // state.role = null;

      })
      .addCase(add_target_country.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_target_country.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(add_target_country.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.targetCountry = [...state.targetCountry, payload.country]
      })
      .addCase(get_target_country.fulfilled, (state, { payload }) => {
        state.targetCountry = payload.country;
      })
      .addCase(delete_target_country.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(delete_target_country.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(delete_target_country.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(get_dashboardDetails.fulfilled, (state, { payload }) => {
        state.order_count = payload.order_count;
        state.sales_count = payload.sales_count;
        state.customer_count = payload.customer_count;
        state.new_order_count = payload.new_order_count;
        state.new_orders = payload.new_orders;
        state.order_chart = payload.order_chart;
        state.customer_chart = payload.customer_chart;
      })
      .addCase(add_profileImage.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(add_profileImage.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(add_profileImage.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo.image = payload.image;
        state.successMessage = payload.message;
      })
      .addCase(get_profile_details.fulfilled, (state, { payload }) => {
        state.count_orders = payload.count_orders;
        state.count_earnings = payload.count_earnings;
        state.count_pending_orders = payload.count_pending_orders;
      })
      .addCase(update_password.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_password.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(update_password.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = null;
        state.token = null;
        state.successMessage = payload.message;
      })
      .addCase(get_new_ordersCount.fulfilled, (state, { payload }) => {
        state.count_new_orders = payload.countOrder;
      })
  }

});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
