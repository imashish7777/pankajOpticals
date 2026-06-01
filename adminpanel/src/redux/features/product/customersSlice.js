import { API_BASE_URL } from "../../../utilies/base_URL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

export const initialState = {
  loading: false,
  customers: [],
  error: "",
};

///fetch product////
export const FETCH_CUSTOMERS = createAsyncThunk(
  "fetchcustomers",
  async (data) => {
    return await axios({
      method: "post",
      url: `${API_BASE_URL}/admin/customers`,
      data: data,
      headers: {
        "x-auth-token": window.localStorage.getItem("admintoken"),
      },
    }).then((response) => response.data);
  }
);

//add product////
export const BLOCK_CUSTOMERS = createAsyncThunk(
  "blockcustomer",
  async (data) => {
    return await axios({
      method: "put",
      url: `${API_BASE_URL}/admin/customers/block`,
      data: data,
      headers: {
        "x-auth-token": window.localStorage.getItem("admintoken"),
      },
    }).then((response) => response.data);
  }
);
export const UNBLOCK_CUSTOMERS = createAsyncThunk(
  "blockcustomer",
  async (data) => {
    return await axios({
      method: "put",
      url: `${API_BASE_URL}/admin/customers/unblock`,
      data: data,
      headers: {
        "x-auth-token": window.localStorage.getItem("admintoken"),
      },
    }).then((response) => response.data);
  }
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_CUSTOMERS.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(FETCH_CUSTOMERS.fulfilled, (state, action) => {
      state.loading = false;

      state.customers = action.payload;

      state.error = "No Error";
    });
    builder.addCase(FETCH_CUSTOMERS.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch customers";
      message.error("something went wrong , couldn't get customers");
    });

    builder.addCase(BLOCK_CUSTOMERS.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(BLOCK_CUSTOMERS.fulfilled, (state, action) => {
      state.loading = false;
      var findIndex = state.customers.findIndex(
        (i) => i._id === action.payload._id
      );
      state.customers[findIndex] = action.payload;

      state.error = "No Error";
      message.success("successful");
    });
    builder.addCase(BLOCK_CUSTOMERS.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch wishlist";
      message.error("something went wrong ");
    });
  },
});

export default customerSlice.reducer;
