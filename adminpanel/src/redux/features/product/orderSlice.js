import { API_BASE_URL } from "../../../utilies/base_URL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";


export const initialState = {
  loading: false,
  orderItem: {},
  error: "",
  orderAnalysis:{},
};

///fetch product////
export const FETCH_ORDER = createAsyncThunk("order", async (data) => {
  return await axios({
    method: "post",
    url: `${API_BASE_URL}/admin/customers/orders/details`,
    data: data,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});
export const FETCH_ORDERS_ANALYSIS = createAsyncThunk("orderanalysis", async (data) => {
  return await axios({
    method: "get",
    url: `${API_BASE_URL}/admin/ordersayalysis`,
    params: data,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});

//add product////
export const UPDATE_ORDER = createAsyncThunk("order", async (data) => {
  return await axios({
    method: "put",
    url: `${API_BASE_URL}/admin/customers/orders/updateorder`,
    data: data,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});

export const orderSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_ORDER.pending, (state, action) => {
      state.loading = true;
      message.open({ type: "loading", content: "Loading..." });

    });
    builder.addCase(FETCH_ORDER.fulfilled, (state, action) => {
      state.loading = false;
      state.orderItem = action.payload;

      state.error = "No Error";
    });
    builder.addCase(FETCH_ORDER.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch order";
      message.error("something went wrong , couldn't get order");

    });
    builder.addCase(FETCH_ORDERS_ANALYSIS.pending, (state, action) => {
      state.loading = true;
      message.open({ type: "loading", content: "Loading..." });

    });
    builder.addCase(FETCH_ORDERS_ANALYSIS.fulfilled, (state, action) => {
      state.loading = false;
      state.orderAnalysis = action.payload;

      state.error = "No Error";
    });
    builder.addCase(FETCH_ORDERS_ANALYSIS.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch order";
      message.error("something went wrong , couldn't get order");

    });
  },
});

export default orderSlice.reducer;
