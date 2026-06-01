import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import uploadService from "./uploadService";
import { message } from "antd";

export const THUMNAIL_IMAGES = createAsyncThunk(
  "upload/thumnailimages",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.length; i++) {
        formData.append("images", data[i]);
      }
      return await uploadService.uploadImg(formData);
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
      for (let i = 0; i < data.length; i++) {
        formData.append("images", data[i]);
      }
      return await uploadService.uploadImg(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const DELETE_IMAGE = createAsyncThunk(
  "delete/images",
  async (id, thunkAPI) => {
    try {
      return await uploadService.deleteImg(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const DELETE_THUMNAIL_IMAGE = createAsyncThunk(
  "delete/thumnailimages",
  async (id, thunkAPI) => {
    try {
      return await uploadService.deleteImg(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const RESET_IMAGES = createAction("reset-state");

const initialState = {
  thumnailimages: [],
  thumisError: false,
  thumisLoadiing: false,
  thumisSuccess: false,

  images: [],

  isError: false,
  isLoading: false,
  isSuccess: false,

  message: "",
};
export const uploadSlice = createSlice({
  name: "imaegs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(UPLOAD_IMAGE.pending, (state) => {
      state.isLoading = true;
      message.open({ type: "loading", content: "Loading..." });
    });
    builder.addCase(UPLOAD_IMAGE.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      if (action.payload && Array.isArray(action.payload)) {
        action.payload.forEach((i) => {
          state.images.push(i);
        });
      }

      message.success("Images uploaded successfully");
    });
    builder.addCase(UPLOAD_IMAGE.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.error;
      message.error("something went wrong , couldn't upload images");
    });
    builder.addCase(DELETE_IMAGE.pending, (state) => {
      state.isLoading = true;
      message.open({ type: "loading", content: "Loading..." });
    });
    builder.addCase(DELETE_IMAGE.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      if (action.payload === "failed") {
        message.error("something went wrong , couldn't delete images");
      } else {
        state.images = state.images.filter(
          (i) => i.public_id !== action.payload
        );
        message.success("Image deleted succesfully");
      }
      // state.images = [];
    });
    builder.addCase(DELETE_IMAGE.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload;
      message.error("something went wrong , couldn't delete image");
    });

    builder.addCase(THUMNAIL_IMAGES.pending, (state) => {
      state.thumisLoadiing = true;
      message.open({ type: "loading", content: "Loading..." });
    });
    builder.addCase(THUMNAIL_IMAGES.fulfilled, (state, action) => {
      state.thumisLoadiing = false;
      state.thumisError = false;
      state.thumisSuccess = true;
      if (action.payload && Array.isArray(action.payload)) {
        action.payload.forEach((i) => {
          state.thumnailimages.push(i);
        });
      }

      message.success("Thumnail Image uploaded successfully");
    });
    builder.addCase(THUMNAIL_IMAGES.rejected, (state, action) => {
      state.thumisLoadiing = false;
      state.thumisError = true;
      state.thumisSuccess = false;

      state.message = action.error;
      message.error("something went wrong , couldn't upload thumnail image");
    });
    builder.addCase(DELETE_THUMNAIL_IMAGE.pending, (state) => {
      message.open({ type: "loading", content: "Loading..." });
    });
    builder.addCase(DELETE_THUMNAIL_IMAGE.fulfilled, (state, action) => {
      state.thumisLoadiing = false;
      state.thumisError = false;
      state.thumisSuccess = true;
      if (action.payload === "failed") {
        message.error("something went wrong , couldn't delete thumnail image");
      } else {
        state.thumnailimages = [];
        message.success(" Thumbail Image deleted succesfully");
      }
      // state.images = [];
    });
    builder.addCase(DELETE_THUMNAIL_IMAGE.rejected, (state, action) => {
      state.thumisLoadiing = false;
      state.thumisError = true;
      state.thumisSuccess = false;
      state.message = action.payload;
      message.error("something went wrong , couldn't thumnail delete image");
    });

    builder.addCase(RESET_IMAGES, (state) => {
      state.images = [];
      state.thumnailimages = [];
    });
  },
});
export default uploadSlice.reducer;
