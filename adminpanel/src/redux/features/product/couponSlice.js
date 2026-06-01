import { API_BASE_URL } from "../../../utilies/base_URL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

export const initialState = {
  loading: false,
  CouponsItems: [],
  error: "",
};

///fetch product////
export const FETCH_COUPONS = createAsyncThunk("fetchcoupons", async () => {
  return await axios({
    method: "get",
    url: `${API_BASE_URL}/admin/coupons`,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});

//add product////
export const CREATE_COUPON = createAsyncThunk("createcoupon", async (data) => {
  return await axios({
    method: "post",
    url: `${API_BASE_URL}/admin/coupons/createcoupon`,
    data: data,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});

///delete product///
export const DELETE_COUPON = createAsyncThunk("deletcoupon", async (data) => {
  return axios({
    method: "delete",
    url: `${API_BASE_URL}/admin/coupons/deletecoupon`,
    data: data,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});

export const couponSlice = createSlice({
  name: "coupons",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_COUPONS.pending, (state, action) => {
      state.loading = true;


    });
    builder.addCase(FETCH_COUPONS.fulfilled, (state, action) => {
      state.loading = false;
      state.CouponsItems = action.payload;

      state.error = "No Error";

    

    });
    builder.addCase(FETCH_COUPONS.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch coupons";
      message.error("something went wrong , couldn't get coupons");

    });

    builder.addCase(CREATE_COUPON.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(CREATE_COUPON.fulfilled, (state, action) => {
      state.loading = false;
      state.CouponsItems.push(action.payload);
      message.success("coupon created successfully");

      state.error = "No Error";
    });
    builder.addCase(CREATE_COUPON.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch wishlist";
      message.error("something went wrong , couldn't create coupon");
    });
    builder.addCase(DELETE_COUPON.pending, (state, action) => {
      state.loading = true;

    });
    builder.addCase(DELETE_COUPON.fulfilled, (state, action) => {
      state.loading = false;
      state.CouponsItems = state.CouponsItems.filter(
        (i) => i._id !== action.payload._id
      );
      message.success("coupon deleted successfully");

      state.error = "No Error";
    });
    builder.addCase(DELETE_COUPON.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch wishlist";
      message.error("something went wrong , couldn't delete coupon");
    });
  },
});

export default couponSlice.reducer;
