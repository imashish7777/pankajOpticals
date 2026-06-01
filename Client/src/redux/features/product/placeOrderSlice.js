import { API_BASE_URL } from "../../../utilies/base_URL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  loading: "false",
  orderItems: {},
  status: "",
};

const token=window.localStorage.getItem("token");

export const PLACE_ORDER = createAsyncThunk("placeorder", async (body) => {
  return axios({
    method: "post",
    url: `${API_BASE_URL}/order/placeorder`,
    headers: {
      "x-auth-token": token
    },
    data: body,
  }).then((response) => response.data);
});

export const placeorderSlice = createSlice({
  name: "placeorder",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(PLACE_ORDER.pending, (state, action) => {
      state.loading = "true";
    });
    builder.addCase(PLACE_ORDER.fulfilled, (state, action) => {
      state.loading = "false";
      state.orderItems = action.payload;
      state.status=200
    });
    builder.addCase(PLACE_ORDER.rejected, (state, action) => {
      state.loading = "false";
      state.status=500
    });
  },
});

export default placeorderSlice.reducer;


