import { API_BASE_URL } from "../../../utilies/base_URL";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";
import uploadService from "../upload/uploadService";

export const initialState = {
  loading: false,
  ProductsItems: [],
  error: "",
  addProductIssucess: false,
  count: 0,
  limit: 0,
  isIdavilable: false,
  thumnaiimages: [],
  images: [],
};

///fetch product////

export const FETCH_PRODUCTS = createAsyncThunk(
  "fetchproducts",
  async (data) => {
    return await axios({
      method: "post",
      url: `${API_BASE_URL}/admin/products?page=${data?.current}`,
      data: data,
      headers: {
        "x-auth-token": window.localStorage.getItem("admintoken"),
      },
    }).then((response) => response.data);
  }
);

//add product////
export const ADD_PRODUCT = createAsyncThunk("addproduct", async (data) => {
  return await axios({
    method: "post",
    url: `${API_BASE_URL}/admin/products/addproduct`,
    data: data,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});

///delete product///
export const DELETE_PRODUCT = createAsyncThunk("deleteprodct", async (data) => {

  return axios({
    method: "delete",
    url: `${API_BASE_URL}/admin/products/deleteproduct`,
    data: data,
    headers: {
      "x-auth-token": window.localStorage.getItem("admintoken"),
    },
  }).then((response) => response.data);
});
export const UPDATE_PRODUCT = createAsyncThunk(
  "updateproduct",
  async (data) => {
    return axios({
      method: "put",
      url: `${API_BASE_URL}/admin/products/updateproduct`,
      data: data,
      headers: {
        "x-auth-token": window.localStorage.getItem("admintoken"),
      },
    }).then((response) => response.data);
  }
);

export const AVAILABLE_PRODUCT_ID = createAsyncThunk(
  "availableproductId",
  async (data) => {
    return axios({
      method: "post",
      url: `${API_BASE_URL}/admin/products/availableId`,
      data: data,
      headers: {
        "x-auth-token": window.localStorage.getItem("admintoken"),
      },
    }).then((response) => response.data);
  }
);
export const REMOVE_THUMNAIL_FROM_PRODUCT = createAsyncThunk(
  "removethumnailfromproduct",
  async (data, thunkAPI) => {
    try {
      return await uploadService.removethumnailfromproduct(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const REMOVE_IMAGE_FROM_PRODUCT = createAsyncThunk(
  "removeimagefromproduct",
  async (data, thunkAPI) => {
    try {
      return await uploadService.removeimagefromproduct(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const THUMNAIL_IMAGES = createAsyncThunk(
  "upload/thumnailimages",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.acceptedFiles.length; i++) {
        formData.append("images", data.acceptedFiles[i]);
      }
      formData.append("_id", data._id);
      return await uploadService.uploadthumtoproduct(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const UPLOAD_IMAGE = createAsyncThunk(
  "upload/images",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.acceptedFiles.length; i++) {
        formData.append("images", data.acceptedFiles[i]);
      }
      formData.append("_id", data._id);

      return await uploadService.uploadImgtoproduct(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const RESET_STATE = createAction("reset-state");

export const productSlice = createSlice({
  name: "Products",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(FETCH_PRODUCTS.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(FETCH_PRODUCTS.fulfilled, (state, action) => {
      state.loading = false;
      state.ProductsItems = action.payload?.products;
      state.count = action.payload?.count;
      state.limit = action.payload?.limit;
      message.success(`Total ${state.count}`);

      state.error = "No Error";
    });
    builder.addCase(FETCH_PRODUCTS.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch products";
      message.error("something went wrong , couldn't get products");
    });

    builder.addCase(ADD_PRODUCT.pending, (state, action) => {
      state.loading = true;
      message.open({ type: "loading", content: "Loading..." });
    });
    builder.addCase(ADD_PRODUCT.fulfilled, (state, action) => {
      state.loading = false;
      state.addProductIssucess = true;

      state.ProductsItems.push(action.payload);
      state.count = state.count + 1;

      state.error = "No Error";
      message.success("Proudct added successfully");
      state.isIdavilable = false;
    });
    builder.addCase(ADD_PRODUCT.rejected, (state, action) => {
      state.loading = false;
      state.addProductIssucess = false;

      state.error = action.error.message || "couldn't add proudct";
      message.error("something went wrong , couldn't add product");
    });
    builder.addCase(DELETE_PRODUCT.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DELETE_PRODUCT.fulfilled, (state, action) => {
      state.loading = false;

      state.ProductsItems = state.ProductsItems.filter(
        (i) => i._id !== action.payload._id
      );
      state.error = "No Error";
      state.count = state.count - 1;

      message.success("Proudct deleted successfully");
    });

    builder.addCase(DELETE_PRODUCT.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch proudct";
      message.error("something went wrong , couldn't delete product");
    });
    builder.addCase(UPDATE_PRODUCT.pending, (state, action) => {
      state.loading = true;
      message.open({ type: "loading", content: "Loading..." });
    });
    builder.addCase(UPDATE_PRODUCT.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.ProductsItems.findIndex(
        (i) => i._id === action.payload._id
      );
      state.ProductsItems[index] = action.payload;
      state.error = "No Error";
      message.success("Product updated successfully");
    });
    builder.addCase(UPDATE_PRODUCT.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "couldn't fetch product";
      message.error("something went wrong , couldn't update product");
    });

    builder.addCase(AVAILABLE_PRODUCT_ID.fulfilled, (state, action) => {
      state.error = "No Error";
      if (action.payload === true) {
        state.isIdavilable = false;
        message.info("already taken please provide another product Id");
      } else if (action.payload === false) {
        message.success("Id is available please continue");
        state.isIdavilable = true;
      }
    });
    builder.addCase(AVAILABLE_PRODUCT_ID.rejected, (state, action) => {
      state.availableproductId = false;
      message.error("something went wrong , couldn't update product");
    });
    builder.addCase(RESET_STATE, (state) => {
      state.addProductIssucess = false;
    });

    builder.addCase(REMOVE_THUMNAIL_FROM_PRODUCT.fulfilled, (state, action) => {
      const index = state.ProductsItems.findIndex(
        (i) => i._id === action.payload._id
      );
      state.ProductsItems[index] = action.payload;
    });
    builder.addCase(REMOVE_THUMNAIL_FROM_PRODUCT.rejected, (state, action) => {
      message.error("something went wrong, coulon't delete image");
    });
    builder.addCase(REMOVE_IMAGE_FROM_PRODUCT.fulfilled, (state, action) => {
      const index = state.ProductsItems.findIndex(
        (i) => i._id === action.payload._id
      );
      state.ProductsItems[index] = action.payload;
    });
    builder.addCase(REMOVE_IMAGE_FROM_PRODUCT.rejected, (state, action) => {
      message.error("REMOVE_IMAGE_FROM_PRODUCT rejected");
    });

    builder.addCase(UPLOAD_IMAGE.fulfilled, (state, action) => {
      state.isSuccess = true;
      const index = state.ProductsItems.findIndex(
        (i) => i._id === action.payload._id
      );
      state.ProductsItems[index] = action.payload;

      message.success("Images uploaded successfully");
    });
    builder.addCase(UPLOAD_IMAGE.rejected, (state, action) => {
      message.error("something went wrong , couldn't upload images");
    });
    builder.addCase(THUMNAIL_IMAGES.fulfilled, (state, action) => {
      state.isSuccess = true;

      const index = state.ProductsItems.findIndex(
        (i) => i._id === action.payload._id
      );
      state.ProductsItems[index] = action.payload;


      message.success("Images uploaded successfully");
    });
    builder.addCase(THUMNAIL_IMAGES.rejected, (state, action) => {
      message.error("something went wrong , couldn't upload images");
    });
  },
});

export default productSlice.reducer;
