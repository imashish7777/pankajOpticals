import { API_BASE_URL } from "../../../utilies/base_URL";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  laoding: "false",
  ratings: {},
  error: "",
  totalratings:""
};

const token=window.localStorage.getItem("token");


export const FETCH_RATINGS = createAsyncThunk("ratings", async (productId) => {
  return axios({
    method: "get",
    url: `${API_BASE_URL}/product/fetchratings/${productId}`,
  }).then((response) => response.data);
});

export const GIVE_RATINGS = createAsyncThunk("ratings", async (data) => {
  return axios({
    method: "put",
    url: `${API_BASE_URL}/product/giveratings`,
    data: data,
    headers: {
      "x-auth-token": token
    },
  }).then((response) => response.data);
});

export const ratingSlice = createSlice({
  name: "ratings",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_RATINGS.pending, (state, action) => {
      state.laoding = "true";
    });
    builder.addCase(FETCH_RATINGS.fulfilled, (state, action) => {
      state.ratings = action.payload;
    });
    builder.addCase(FETCH_RATINGS.rejected, (state, action) => {
      state.error = "bad server response";
    });
  },
});

export default ratingSlice.reducer;
