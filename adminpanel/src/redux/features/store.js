import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./product/rootReducer";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
