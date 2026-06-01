import { combineReducers } from "redux";
import WishlistReducer from "./wishlistSlice";
import CartReducer from "./cartSlice";
import AddressReducer from "./addressSlice";
import OrderReducer from "./orderSlice";
import placeorderReducer from "./placeOrderSlice";
import ratingsReducer from "./ratingsSlice";
import authReducer from "./authSlice";
import propertiesReducer from "./propertiesSlice";
import productReducer from "./productSlice";

const rootReducer = combineReducers({
  product: productReducer,
  cart: CartReducer,
  wishlist: WishlistReducer,
  address: AddressReducer,
  order: OrderReducer,
  placeorder: placeorderReducer,
  ratings: ratingsReducer,
  auth: authReducer,
  properties: propertiesReducer,
});

export default rootReducer;
