import { API_BASE_URL } from "../utilies/base_URL";
import React, { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import "../CSS/ResetPassword.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Loader from "../components/loader";

function Login() {
  const [showpassword, setShowpassword] = useState(false);
  const initialValuesLogin = {
    password: "",
  };


  const onSubmitLogin = async (values, onSubmitProps) => {
    const response = await fetch(`${API_BASE_URL}/admin/resetpassword`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data === "SIGNIN_DENIED") {
      alert("ACCESS_DENIED");
    } else if (data.user) {
      onSubmitProps.resetForm();
      onSubmitProps.setSubmitting(false);

      // alert("login Successfully");

      //   });
      // }
    } else {
      alert("please check email and password");
    }
  };

  return (
    <>
      <div className="Login">
        <div className="login-body">
          <Formik
            initialValues={initialValuesLogin}
            onSubmit={onSubmitLogin}
          >
            {(formik) => {
              return (
                <Form className="login">
                  <div className="login-fillups m-5">
                    <p className="signin-text fs-4">Reset Password</p>
                    {/* Email input */}

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
                      {/* not a member */}
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
