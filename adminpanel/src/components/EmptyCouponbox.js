import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { CREATE_COUPON } from "../redux/features/product/couponSlice";
import { useDispatch } from "react-redux";
import "react-widgets/styles.css";
import "../CSS/EmptyCouponbox.css";

function EmptyCouponbox() {
  const dispatch = useDispatch();
  const initialState = {
    name: "",
    discount: "",
    upTo: "",
    discribtion: "",
  };

  const validationSchema = yup.object({
    name: yup.string().required(),
    discount: yup.number().required(),
    upTo: yup.number().required(),
    discribtion: yup.string().required(),
  });

  const handleSubmit = (values) => {
    dispatch(CREATE_COUPON(values));
  };

  return (
    <>
      <div className="contanier-fluid admin-coupon-form-card">
        {" "}
        <h4 className="my-3">ADD NEW COUPON</h4>
        <div className="row">
          <Formik
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form className="row">
                  <div className="col-3">
                    <label htmlFor="name">Coupon name</label>
                    <Field
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                    />
                    <div className="error">
                      <ErrorMessage name="name" />
                    </div>
                  </div>

                  <div className="col-3">
                    <label htmlFor="discount">Discount % </label>
                    <Field
                      type="number"
                      className="form-control"
                      id="discount"
                      name="discount"
                    />
                    <div className="error">
                      <ErrorMessage name="discount" />
                    </div>
                  </div>

                  <div className="col-3">
                    <label htmlFor="upTo">Up To </label>
                    <Field
                      type="number"
                      className="form-control"
                      id="upTo"
                      name="upTo"
                    />
                    <div className="error">
                      <ErrorMessage name="upTo" />
                    </div>
                  </div>
                  <div className="col-3">
                    <label htmlFor="discribtion"> discribtion</label>
                    <Field
                      type="text"
                      as="textarea"
                      className="form-control"
                      id="discribtion"
                      name="discribtion"
                    />
                    <div className="error">
                      <ErrorMessage name="discribtion" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={!formik.errors}
                  >
                    submit
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default EmptyCouponbox;
