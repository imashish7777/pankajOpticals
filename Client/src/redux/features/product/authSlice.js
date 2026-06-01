import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { base_URL } from "../../../utilies/base_URL";
import axios from "axios";

const initialState = {
  loading: false,
  user: {},
  error: false,
  status: "",
  massage: "",
  isSuccess: false,
};

export const LOGIN = createAsyncThunk("auth/login", async (values) => {
  return await axios({
    method: "post",
    url: `${base_URL}auth/login`,
    data: values,
  }).then((response) => response);
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(LOGIN.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(LOGIN.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.data;

      state.error = false;

      state.status = 200;
      state.isSuccess = true;
    });

    builder.addCase(LOGIN.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.status = 500;
      state.isSuccess = false;
    });
  },
});

export default authSlice.reducer;
