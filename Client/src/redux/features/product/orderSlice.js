import { API_BASE_URL } from "../../../utilies/base_URL";
import { getAuthHeaders } from "../../../utilies/authHeaders";
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  loading: false,
  orderItems: {},
  status: "",
};

export const FETCH_ORDERS = createAsyncThunk("order", async () => {
  return axios({
    method: "get",
    url: `${API_BASE_URL}/order/fetchorders`,
    headers: getAuthHeaders(),
  }).then((response) => response);
});

export const RESET_STATE = createAction("orders/reset-state");

export const orderSlice = createSlice({
  name: "order",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_ORDERS.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(FETCH_ORDERS.fulfilled, (state, action) => {
      state.loading = false;
      state.orderItems = action.payload?.data;
      state.status = 200;
    });

    builder.addCase(FETCH_ORDERS.rejected, (state, action) => {
      state.loading = false;
      state.status = 500;
    });
    // builder.addCase(RESET_STATE.fulfilled, (state) => {
    //   state.orderItems = {};
    // });
  },
});

export default orderSlice.reducer;
