import { API_BASE_URL } from "../../../utilies/base_URL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";

export const initialState = {
  loading: false,
  properties: [],
  error: "",
  properties_details: {},
};

const token = window.localStorage.getItem("admintoken");

///fetch product////
export const CREATE_PROPERTIES = createAsyncThunk(
  "properties",
  async (values) => {
    return await axios({
      method: "post",
      url: `${API_BASE_URL}/admin/createproperties`,
      data: values,

      headers: {
        "x-auth-token": token,
      },
    }).then((response) => response.data);
  }
);

export const FETCH_PROPERTIES = createAsyncThunk("properties", async () => {
  return await axios({
    method: "get",
    url: `${API_BASE_URL}/admin/fetchproperties`,

    headers: {
      "x-auth-token": token,
    },
  }).then((response) => response.data);
});

export const PROPERTIES_DETAILS = createAsyncThunk(
  "schemadetails",
  async () => {
    return await axios({
      method: "get",
      url: `${API_BASE_URL}/admin/FETCH_PROPERTIES_DETAILS`,

      headers: {
        "x-auth-token": token,
      },
    }).then((response) => response.data);
  }
);

export const ADD_PROPERTIES = createAsyncThunk(
  "propertiesmethod",
  async (values) => {
    return await axios({
      method: "put",
      url: `${API_BASE_URL}/admin/addproperties`,
      data: values,

      headers: {
        "x-auth-token": token,
      },
    }).then((response) => response.data);
  }
);

//add product////
export const DELETE_PROPERTIES = createAsyncThunk(
  "propertiesmethod",
  async (values) => {
    return await axios({
      method: "put",
      url: `${API_BASE_URL}/admin/deleteproperties`,
      data: values,

      headers: token,
    }).then((response) => response.data);
  }
);

export const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_PROPERTIES.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(FETCH_PROPERTIES.fulfilled, (state, action) => {
      state.loading = false;

      state.properties = action.payload;
    });
    builder.addCase(FETCH_PROPERTIES.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch properties";
      message.error("something went wrong , couldn't fetch properties");
    });
    builder.addCase(DELETE_PROPERTIES.fulfilled, (state, action) => {
      state.loading = false;

      state.properties = action.payload;
      message.success("success");
    });
    builder.addCase(DELETE_PROPERTIES.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch properties";
      message.error("something went wrong , couldn't fetch properties");
    });
    builder.addCase(PROPERTIES_DETAILS.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(PROPERTIES_DETAILS.fulfilled, (state, action) => {
      state.loading = false;

      state.properties_details = action.payload;
    });
    builder.addCase(PROPERTIES_DETAILS.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch properties";
      message.error("something went wrong , couldn't fetch properties");
    });
  },
});

export default propertiesSlice.reducer;
