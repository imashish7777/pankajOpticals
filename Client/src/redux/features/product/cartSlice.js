import { API_BASE_URL } from "../../../utilies/base_URL";
import { getAuthHeaders } from "../../../utilies/authHeaders";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  loading: false,
  cartItems: {},
  status: "",
  couponStatus: "notApplied",
};

export const FETCH_CART = createAsyncThunk("cart", async () => {
  return axios({
    method: "get",
    url: `${API_BASE_URL}/product/fetchcart`,
    headers: getAuthHeaders(),
  }).then((response) => response);
});

export const ADD_TO_CART = createAsyncThunk("cartmethod", async (data) => {
  return axios({
    method: "post",
    url: `${API_BASE_URL}/product/addtocart`,
    data: data,
    headers: getAuthHeaders(),
  }).then((response) => response);
});

export const REMOVE_FROM_CART = createAsyncThunk("cartmethod", async (data) => {
  return axios({
    method: "post",
    url: `${API_BASE_URL}/product/removefromcart`,
    headers: getAuthHeaders(),
    data: data,
  }).then((response) => response);
});

export const DECREMENT = createAsyncThunk("cartmethod", async (data) => {
  return axios({
    method: "post",
    url: `${API_BASE_URL}/product/decrement`,
    headers: getAuthHeaders(),
    data: data,
  }).then((response) => response);
});

export const INCREMENT = createAsyncThunk("cartmethod", async (data) => {
  return axios({
    method: "post",
    url: `${API_BASE_URL}/product/increment`,
    headers: getAuthHeaders(),
    data: data,
  }).then((response) => response);
});

export const APPLY_COUPON = createAsyncThunk("couponmethod", async (data) => {
  return axios({
    method: "post",
    url: `${API_BASE_URL}/product/applycoupon`,
    headers: getAuthHeaders(),
    data: data,
  }).then((response) => response);
});
export const REMOVE_COUPON = createAsyncThunk("couponmethod", async (data) => {
  return axios({
    method: "put",
    url: `${API_BASE_URL}/product/removecoupon`,
    headers: getAuthHeaders(),
    data: data,
  }).then((response) => response);
});

export const emptycart = createAsyncThunk("cartmethod", async (req, res) => {
  return axios({
    method: "delete",
    url: `${API_BASE_URL}/product/emptycart`,
    headers: getAuthHeaders(),
  }).then((response) => response);
});

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_CART.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(FETCH_CART.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload?.data) {
        state.cartItems = action.payload?.data;
       

        state.status = "200";
      }
    });

    builder.addCase(FETCH_CART.rejected, (state, action) => {
      state.loading = false;
      state.status = "500";
    });
    builder.addCase(ADD_TO_CART.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload?.data) {
        state.cartItems = action.payload?.data;

        state.status = "200";
      }
    });

    builder.addCase(ADD_TO_CART.rejected, (state, action) => {
      state.loading = false;
      state.status = "500";
    });
    builder.addCase(APPLY_COUPON.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.data === "COUPON EXPIRED") {
        state.couponStatus = "INVAILID COUPON";
      } else {
        state.cartItems = action.payload?.data;

        state.status = "200";
      }
    });

    builder.addCase(APPLY_COUPON.rejected, (state, action) => {
      state.loading = false;
      state.status = "500";
    });
  },
});

export default CartSlice.reducer;
