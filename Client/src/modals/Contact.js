import { API_BASE_URL } from "../utilies/base_URL";
import React from "react";

import "../CSS/contact.css";

import {
  Field,
  Form,
  Formik,
  ErrorMessage,
} from "formik";

import axios from "axios";

import { message } from "antd";

import { RxCross1 } from "react-icons/rx";

import * as yup from "yup";

function Contact({ showContactus }) {

  // initial values
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    query: "",
  };

  // validation
  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required"),

    email: yup
      .string()
      .email("Invalid Email")
      .required("Email is required"),

    phone: yup
      .string()
      .matches(
        /^[0-9]{10}$/,
        "Invalid phone number"
      )
      .required("Phone is required"),

    query: yup
      .string()
      .required("Query is required"),
  });

  // submit handler
  const handleOnSubmit = async (
    values,
    onSubmitProps
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/askQurey`,
        values
      );

      if (response.status === 200) {

        message.success(
          "We got your question"
        );

        onSubmitProps.resetForm();

      } else {

        message.error(
          "Something went wrong"
        );

      }
    } catch (error) {

      console.log(error);

      message.error(
        "Couldn't send message"
      );

    }

    onSubmitProps.setSubmitting(false);
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden={showContactus}
    >
      <div className="modal-dialog">

        <div className="modal-content">

          <RxCross1
            className="hoverIcon"
            data-bs-dismiss="modal"
          />

          <div className="modal-body">

            <Formik
              initialValues={initialValues}
              validationSchema={
                validationSchema
              }
              onSubmit={handleOnSubmit}
            >
              {(formik) => (
                <Form className="contact">

                  <div className="login-fillups m-5">

                    <p className="contact-text fs-4">
                      Contact Us
                    </p>

                    {/* Name */}

                    <div className="form-outline mb-2">

                      <Field
                        placeholder="Name"
                        type="text"
                        className="form-control"
                        name="name"
                      />

                      <div className="error">
                        <ErrorMessage name="name" />
                      </div>

                    </div>

                    {/* Email */}

                    <div className="form-outline mb-2">

                      <Field
                        placeholder="Email"
                        type="email"
                        className="form-control"
                        name="email"
                      />

                      <div className="error">
                        <ErrorMessage name="email" />
                      </div>

                    </div>

                    {/* Phone */}

                    <div className="form-outline mb-2">

                      <Field
                        placeholder="Phone"
                        type="text"
                        className="form-control"
                        name="phone"
                      />

                      <div className="error">
                        <ErrorMessage name="phone" />
                      </div>

                    </div>

                    {/* Query */}

                    <div className="form-outline mb-2">

                      <Field
                        as="textarea"
                        className="form-control"
                        placeholder="Write your question"
                        name="query"
                        rows="4"
                      />

                      <div className="error">
                        <ErrorMessage name="query" />
                      </div>

                    </div>

                    {/* Submit */}

                    <div className="d-grid">

                      <button
                        type="submit"
                        className="contact-button btn mb-3"
                        disabled={
                          formik.isSubmitting ||
                          !(
                            formik.dirty &&
                            formik.isValid
                          )
                        }
                      >
                        {formik.isSubmitting
                          ? "Sending..."
                          : "Send Us"}
                      </button>

                    </div>

                  </div>
                </Form>
              )}
            </Formik>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;