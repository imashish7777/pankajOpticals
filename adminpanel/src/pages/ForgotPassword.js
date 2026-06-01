import { API_BASE_URL } from "../utilies/base_URL";
import React from "react";
import "../CSS/ForgotPassword.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import Loader from "../components/loader";

function Login() {


  const initialValuesLogin = {
    email: "",
  };

  const validationSchemaLogin = yup.object({
    email: yup.string().email("invalid Email").required(),
  });

  const onSubmitLogin = async (values, onSubmitProps) => {
    const response = await fetch(`${API_BASE_URL}/admin/forgotpassword`, {
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
      window.localStorage.setItem("user", "true");
     
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
            validationSchema={validationSchemaLogin}
            onSubmit={onSubmitLogin}
          >
            {(formik) => {
              return (
                <Form className="login">
                  <div className="login-fillups m-5">
                    <p className="signin-text fs-4">Forgot Password</p>
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
                        {formik.isSubmitting ? <Loader /> : <>Sumbit</>}
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
