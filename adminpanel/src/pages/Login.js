import { API_BASE_URL } from "../utilies/base_URL";
import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import "../CSS/Login.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import Loader from "../components/loader";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

function Login() {
  const navigate = useNavigate();

  const [showpassword, setShowpassword] = useState(false);
  const initialValuesLogin = {
    email: "",
    password: "",
  };

  const validationSchemaLogin = yup.object({
    email: yup.string().email("invalid Email").required(),
    password: yup.string().required(),
  });

  const onSubmitLogin = async (values, onSubmitProps) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.user) {
      onSubmitProps.resetForm();
      onSubmitProps.setSubmitting(false);
      window.localStorage.setItem("admintoken", data.user.token);
      window.localStorage.setItem("adminusername", data.user.firstname);
      window.localStorage.setItem("adminuserEmail", data.user.email);
      window.localStorage.setItem("adminuserlast", data.user.lastname);
      window.localStorage.setItem("adminuser", "true");
      message.success(`Welcome ${data.user.firstname}`);
      navigate("/admin");
    } else {
      message.error(data);
    }
  };

  return (
    <>
      <div className="Login">
        <div className="login-body">
          <Formik
            initialValues={initialValuesLogin}
            validationSchema={validationSchemaLogin}
            onSubmit={onSubmitLogin}
          >
            {(formik) => {
              return (
                <Form className="login">
                  <div className="login-fillups m-5">
                    <p className="signin-text fs-4">Sign In</p>
                    {/* Email input */}

                    <div className="form-outline mb-2">
                      <div className="input-group">
                        <Field
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                          id="emailLogin"
                        />
                      </div>
                      <div className="error">
                        <ErrorMessage name="email" />
                      </div>
                    </div>

                    {/* Password input */}

                    <div className="form-outline mb-2">
                      <div className="input-group ">
                        <Field
                          type={showpassword ? "text" : "password"}
                          className="form-control"
                          placeholder="password"
                          name="password"
                          id="passwordLogin"
                          aria-describedby="basic-addon2"
                        />
                        <span
                          className="input-group-text"
                          onClick={() => setShowpassword(!showpassword)}
                        >
                          {showpassword ? (
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
                    {/* 2 column grid layout for inline styling */}
                    <div className="row mb-4">
                      <div className="col">
                        {/* Simple link */}
                        <a
                          href="/forgotpassword"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/forgotpassword");
                          }}
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div className="d-grid">
                      {/* login Submit button */}

                      <button
                        type="submit"
                        className=" login-button btn  mb-3"
                        disabled={
                          formik.isSubmitting ||
                          !(formik.dirty && formik.errors)
                        }
                      >
                        {formik.isSubmitting ? <Loader /> : <>Sign In</>}
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Login;
