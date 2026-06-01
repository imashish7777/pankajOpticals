import { API_BASE_URL } from "../../utilies/base_URL";
import React, { useCallback, useState } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";

function Profile() {
  const [loading, setLoading] = useState(false);

  const initialValuesProfile = {
    lastname:
      localStorage.getItem("userlast") || "",

    gender: "Male",
  };

  const validationSchemaProfile = yup.object({
    lastname: yup.string(),

    gender: yup.string().required(
      "Gender is required"
    ),
  });

  const handleSubmit = useCallback(
    async (values, { resetForm }) => {
      try {
        setLoading(true);

        const response = await axios({
          method: "put",
          url: `${API_BASE_URL}/auth/update`,

          data: values,

          headers: {
            "x-auth-token":
              localStorage.getItem("token"),
          },
        });

        if (response.data) {
          alert("Profile updated successfully");

          localStorage.setItem(
            "userlast",
            values.lastname
          );
        }
      } catch (error) {

        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h3>Edit Account Information</h3>
          <p>Manage your personal details.</p>
        </div>

          <Formik
            initialValues={initialValuesProfile}
            validationSchema={
              validationSchemaProfile
            }
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="profile-form">
                
                {/* First Name */}
                <div className="profile-field">
                  <label htmlFor="firstnameProfile">
                    First Name
                  </label>

                  <Field
                    type="text"
                    className="form-control"
                    id="firstnameProfile"
                    value={
                      localStorage.getItem(
                        "username"
                      ) || ""
                    }
                    disabled
                    name="firstname"
                  />
                </div>

                {/* Last Name */}
                <div className="profile-field">
                  <label htmlFor="lastnameProfile">
                    Last Name
                  </label>

                  <Field
                    type="text"
                    name="lastname"
                    className="form-control"
                    id="lastnameProfile"
                  />

                  <div className="text-danger">
                    <ErrorMessage name="lastname" />
                  </div>
                </div>

                {/* Email */}
                <div className="profile-field profile-field-full">
                  <label htmlFor="emailProfile">
                    Email
                  </label>

                  <Field
                    type="email"
                    className="form-control"
                    id="emailProfile"
                    value={
                      localStorage.getItem(
                        "userEmail"
                      ) || ""
                    }
                    disabled
                    name="email"
                  />
                </div>

                {/* Gender */}
                <div className="profile-field">
                  <label htmlFor="gender">
                    Gender
                  </label>

                  <Field
                    id="gender"
                    as="select"
                    className="form-select"
                    name="gender"
                  >
                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>
                  </Field>

                  <div className="text-danger">
                    <ErrorMessage name="gender" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="profile-actions">
                  <button
                    type="submit"
                    className="btn profile-submit"
                    disabled={
                      isSubmitting || loading
                    }
                  >
                    {loading
                      ? "Saving..."
                      : "Save & Continue"}
                  </button>
                </div>

              </Form>
            )}
          </Formik>
      </div>
    </div>
  );
}

export default React.memo(Profile);
