import { API_BASE_URL } from "../utilies/base_URL";
import React, { useState } from "react";

import { RxCross1 } from "react-icons/rx";
import { BsPerson } from "react-icons/bs";
import {
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

import "../CSS/login.css";

import {
  Formik,
  Field,
  Form,
  ErrorMessage,
} from "formik";

import { useNavigate } from "react-router-dom";

import * as yup from "yup";

import Skelton from "../component/skelton";

import { DownOutlined } from "@ant-design/icons";

import {
  Dropdown,
  Space,
  message,
} from "antd";

function Login({ modalIdPrefix = "login" }) {
  const navigate = useNavigate();
  const loginModalId = `${modalIdPrefix}ModalToggle`;
  const signupModalId = `${modalIdPrefix}ModalToggleSignup`;

  const [showModal, setShowModal] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userlast");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loggedin");

    navigate("/");

    setShowModal(true);

    message.success("Logged out");
  };

  // ================= LOGIN =================

  const initialValuesLogin = {
    email: "",
    password: "",
  };

  const validationSchemaLogin =
    yup.object({
      email: yup
        .string()
        .email("Invalid Email")
        .required("Email is required"),

      password: yup
        .string()
        .required("Password is required"),
    });

  const onSubmitLogin = async (
    values,
    onSubmitProps
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (data === "SIGNIN_DENIED") {
        message.error("Access Denied");
      } else if (data?.user) {
        localStorage.setItem(
          "token",
          data.user.token
        );

        localStorage.setItem(
          "username",
          data.user.firstname
        );

        localStorage.setItem(
          "userEmail",
          data.user.email
        );

        localStorage.setItem(
          "userlast",
          data.user.lastname
        );

        localStorage.setItem(
          "loggedin",
          "true"
        );

        message.success(
          "Login Successful"
        );

        onSubmitProps.resetForm();

        setShowModal(false);
      } else {
        message.error(
          "Please check email and password"
        );
      }
    } catch (error) {
      console.log(error);

      message.error(
        "Something went wrong"
      );
    }

    onSubmitProps.setSubmitting(false);
  };

  // ================= SIGNUP =================

  const initialValuesSignup = {
    firstname: "",
    lastname: "",
    mobileNumber: "",
    email: "",
    password: "",
  };

  const validationSchemaSignup =
    yup.object({
      firstname: yup
        .string()
        .required("Required"),

      lastname: yup
        .string()
        .required("Required"),

      mobileNumber: yup
        .string()
        .matches(
          /^[0-9]{10}$/,
          "Invalid Mobile Number"
        )
        .required("Required"),

      email: yup
        .string()
        .email("Invalid Email")
        .required("Required"),

      password: yup
        .string()
        .min(
          6,
          "Password must be 6 characters"
        )
        .required("Required"),
    });

  const onSubmitSignup = async (
    values,
    onSubmitProps
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (data?.user) {
        message.success(
          "Successfully created account"
        );

        onSubmitProps.resetForm();
      } else {
        message.info(
          "User already exists"
        );
      }
    } catch (error) {
      console.log(error);

      message.error(
        "Something went wrong"
      );
    }

    onSubmitProps.setSubmitting(false);
  };

  // dropdown items
  const items = [
    {
      key: "1",

      label: (
        <a
          href="/customer"
          onClick={(e) => {
            e.preventDefault();
            navigate("/customer");
          }}
        >
          Account Information
        </a>
      ),
    },

    {
      key: "2",

      label: (
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Sign Out
        </a>
      ),
    },
  ];

  return (
    <>
      {/* LOGIN MODAL */}

      {showModal && (
        <>
          <div
            className="modal fade"
            id={loginModalId}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <RxCross1
                  className="hoverIcon"
                  data-bs-dismiss="modal"
                />

                <Formik
                  initialValues={
                    initialValuesLogin
                  }
                  validationSchema={
                    validationSchemaLogin
                  }
                  onSubmit={onSubmitLogin}
                >
                  {(formik) => (
                    <Form className="login">
                      <div className="login-fillups m-5">

                        <p className="signin-text fs-4">
                          Sign In
                        </p>

                        {/* Email */}

                        <div className="form-outline mb-2">

                          <Field
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                          />

                          <div className="error">
                            <ErrorMessage name="email" />
                          </div>

                        </div>

                        {/* Password */}

                        <div className="form-outline mb-2">

                          <div className="input-group">

                            <Field
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              className="form-control"
                              placeholder="Password"
                              name="password"
                            />

                            <span
                              className="input-group-text"
                              onClick={() =>
                                setShowPassword(
                                  !showPassword
                                )
                              }
                            >
                              {showPassword ? (
                                <IoEyeOutline />
                              ) : (
                                <IoEyeOffOutline />
                              )}
                            </span>

                          </div>

                          <div className="error">
                            <ErrorMessage name="password" />
                          </div>

                        </div>

                        <div className="d-grid">

                          <button
                            type="submit"
                            className="login-button btn mb-3"
                            disabled={
                              formik.isSubmitting ||
                              !(
                                formik.dirty &&
                                formik.isValid
                              )
                            }
                          >
                            {formik.isSubmitting ? (
                              <Skelton type="button" />
                            ) : (
                              "Sign In"
                            )}
                          </button>

                          <div className="d-flex align-items-center">
                            <p className="text-dark">
                              Not a member?
                            </p>

                            <div
                              className="btn border-0 bg-transparent"
                              data-bs-target={`#${signupModalId}`}
                              data-bs-toggle="modal"
                            >
                              <p className="text-primary">
                                Register
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>

              </div>
            </div>
          </div>

          {/* SIGNUP MODAL */}

          <div
            className="modal fade sigup-modal"
            id={signupModalId}
            aria-hidden="true"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <RxCross1
                  className="hoverIcon"
                  data-bs-dismiss="modal"
                />

                <Formik
                  initialValues={
                    initialValuesSignup
                  }
                  validationSchema={
                    validationSchemaSignup
                  }
                  onSubmit={onSubmitSignup}
                >
                  {(formik) => (
                    <Form className="login signup">

                      <div className="login-fillups m-4">

                        <p className="signin-text fs-4">
                          Create an Account
                        </p>

                        <Field
                          placeholder="First Name"
                          type="text"
                          className="form-control mb-2"
                          name="firstname"
                        />

                        <div className="error">
                          <ErrorMessage name="firstname" />
                        </div>

                        <Field
                          placeholder="Last Name"
                          type="text"
                          className="form-control mb-2"
                          name="lastname"
                        />

                        <div className="error">
                          <ErrorMessage name="lastname" />
                        </div>

                        <div className="input-group mb-2">

                          <span className="input-group-text">
                            +91
                          </span>

                          <Field
                            type="text"
                            name="mobileNumber"
                            className="form-control"
                            placeholder="Mobile Number"
                          />

                        </div>

                        <div className="error">
                          <ErrorMessage name="mobileNumber" />
                        </div>

                        <Field
                          placeholder="Email"
                          type="email"
                          className="form-control mb-2"
                          name="email"
                        />

                        <div className="error">
                          <ErrorMessage name="email" />
                        </div>

                        <div className="input-group mb-2">

                          <Field
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            className="form-control"
                            placeholder="Password"
                            name="password"
                          />

                          <span
                            className="input-group-text"
                            onClick={() =>
                              setShowPassword(
                                !showPassword
                              )
                            }
                          >
                            {showPassword ? (
                              <IoEyeOutline />
                            ) : (
                              <IoEyeOffOutline />
                            )}
                          </span>

                        </div>

                        <div className="error">
                          <ErrorMessage name="password" />
                        </div>

                        <div className="d-grid">

                          <button
                            type="submit"
                            className="login-button btn mb-3"
                            disabled={
                              formik.isSubmitting ||
                              !(
                                formik.dirty &&
                                formik.isValid
                              )
                            }
                          >
                            {formik.isSubmitting ? (
                              <Skelton type="button" />
                            ) : (
                              "Create Account"
                            )}
                          </button>

                        </div>

                        <div className="signinTogglePart d-flex align-items-center">

                          <p className="text-dark ms-5">
                            Already a member?
                          </p>

                          <p
                            className="btn border-0 bg-transparent text-primary"
                            data-bs-target={`#${loginModalId}`}
                            data-bs-toggle="modal"
                          >
                            <small>
                              Sign In
                            </small>
                          </p>

                        </div>

                      </div>
                    </Form>
                  )}
                </Formik>
            </div>
          </div>
          </div>
        </>
      )}

      {/* USER MENU */}

      <div className="login-menu d-flex align-items-center">

        {localStorage.getItem("loggedin") ? (
          <Dropdown
            menu={{ items }}
          >
            <a
              href="/customer"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              <Space>
                <p>
                {" "}
                  {localStorage.getItem(
                    "username"
                  )}{" "}
                  <DownOutlined/>
                </p>
              </Space>
            </a>
          </Dropdown>
        ) : (
          <div
            className="text-dark"
            data-bs-toggle="modal"
            data-bs-target={`#${loginModalId}`}
            href={`#${loginModalId}`}
            role="button"
          >
            <p>
              <BsPerson className="fs-6" />
              Sign In
            </p>
          </div>
        )}

      </div>
    </>
  );
}

export default Login;
