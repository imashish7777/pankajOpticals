import { combineReducers } from "redux";
import productReducer from "../product/productSlice";
import couponReducer from "../product/couponSlice";
import customerReducer from "./customersSlice";
import orderReducer from "./orderSlice";
import propertiesReducer from "./propertiesSlice";
import uploadReducer from "../upload/uploadSlice"

const rootReducer = combineReducers({
  product: productReducer,
  coupon: couponReducer,
  customer: customerReducer,
  order: orderReducer,
  properties: propertiesReducer,
  upload: uploadReducer
});

export default rootReducer;
