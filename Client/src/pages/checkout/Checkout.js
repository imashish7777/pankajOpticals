import React, {
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import "../../CSS/checkout.css";

import {
  Outlet,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import PriceDetails from "../Cart/PriceDetails";
import CouponBox from "../Cart/CouponBox";
import Button from "../../component/button";

import { PLACE_ORDER } from "../../redux/features/product/placeOrderSlice";

import { PageSuccess } from "../ResultPages/ResultPage";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const placeorder = useSelector(
    (state) => state.placeorder
  );

  const cart = useSelector(
    (state) => state.cart
  );

  const [buttonText, setButtonText] =
    useState("Process to Payment");

  const [addressId, setAddressId] =
    useState(null);

  const [method, setMethod] =
    useState(null);

  const orderItems = useMemo(
    () => placeorder?.orderItems || {},
    [placeorder?.orderItems]
  );

  const cartItems = useMemo(
    () => cart?.cartItems || {},
    [cart?.cartItems]
  );

  const isOrdered =
    orderItems?.orderStatus ===
    "ordered";

  const outletContext = useMemo(
    () => ({
      setAddressId,
      setMethod,
    }),
    [setAddressId, setMethod]
  );

  const handleCheckout =
    useCallback(() => {
      const shippingAddressId =
        addressId;

      const orderId = orderItems?._id;

      if (
        !shippingAddressId ||
        !orderId
      )
        return;

      dispatch(
        PLACE_ORDER({
          shippingAddressId,
          orderId,
          ...(method && { method }),
        })
      );

      setButtonText("Checkout");

      navigate("/checkout/payment");
    }, [
      addressId,
      orderItems,
      method,
      dispatch,
      navigate,
    ]);

  if (isOrdered) {
    return <PageSuccess />;
  }

  return (
    <div className="checkout-page client-soft-page-bg">
      <div className="cart-header">
        <Link to="/">
          <img
            className="cart-logo ms-5 client-cart-logo"
            src="https://res.cloudinary.com/pankajoptical/image/upload/v1709921004/pankajoptical_LOGO_ielprm.png"
            alt="Pankaj Opticals"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="container mt-5 checkout-container">
        <div className="row checkout-layout-row">
          <div className="col-8 checkout-main-col">
            <Outlet
              context={outletContext}
            />
          </div>

          <div className="col-4 d-flex flex-column checkout-bill-col">
            <p className="fs-3 mb-2">
              Bill details:
            </p>

            <PriceDetails
              totalPrice={
                cartItems?.cartTotal
              }
              totalAfterDiscount={
                cartItems?.totalAfterDiscount
              }
            />

            <div
              onClick={handleCheckout}
            >
              <Button
                name={buttonText}
              />
            </div>

            <CouponBox
              CouponApplied={
                cartItems?.CouponApplied
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Checkout);
