import "./App.css";
import Mainlayout from "./components/Mainlayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Productpage from "./pages/Productpage";
import Coupon from "./pages/Coupon";
import CustomerDetails from "./pages/customerDetails";
import OrderDetailsByadmin from "./pages/orderDetailsByAdmin";
import PropertiesCount from "./components/databasedetail";
import SingleProduct from "./pages/Singleproduct";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="/admin" element={<Mainlayout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<PropertiesCount />} />

            <Route path="customers" element={<Customers />} />
            <Route path="products" element={<Productpage />} />
            <Route path="coupons" element={<Coupon />} />
            <Route
              path="customers/details/:_id"
              element={<CustomerDetails />}
            />
            <Route
              path="customers/orders/details/:orderId"
              element={<OrderDetailsByadmin />}
            />
            <Route path="products/details/:id" element={<SingleProduct />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
