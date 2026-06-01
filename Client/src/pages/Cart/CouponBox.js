import React, { useCallback } from "react";
import "../../CSS/cart.css";
import { useDispatch } from "react-redux";
import { Formik, Field, Form } from "formik";

import {
  APPLY_COUPON,
  REMOVE_COUPON,
} from "../../redux/features/product/cartSlice";

function CouponBox({ CouponApplied }) {
  const dispatch = useDispatch();

  const initialValues = {
    coupon: "",
  };

  const handleSubmit = useCallback(
    (values, { resetForm }) => {
      if (!values.coupon.trim()) return;

      dispatch(
        APPLY_COUPON({
          coupon: values.coupon.trim(),
        })
      );

      resetForm();
    },
    [dispatch]
  );

  const handleRemoveCoupon = useCallback(() => {
    dispatch(REMOVE_COUPON());
  }, [dispatch]);

  return (
    <>
      {CouponApplied ? (
        <div
          className="alert alert-primary d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>
            Coupon Applied! {CouponApplied?.name}
          </span>

          <button
            type="button"
            className="btn border-0 shadow-none"
            onClick={handleRemoveCoupon}
          >
            X
          </button>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <Form className="mb-3 py-3 offer border-0">
            <p className="fs-6 text-center">
              Apply Coupon
            </p>

            <div className="input-group">
              <Field
                type="text"
                name="coupon"
                className="form-control"
                placeholder="Enter Coupon code..."
                aria-label="Coupon"
                aria-describedby="button-addon2"
              />

              <button
                type="submit"
                className="btn couponCodeButton"
                id="button-addon2"
              >
                Apply
              </button>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
}

export default React.memo(CouponBox);
