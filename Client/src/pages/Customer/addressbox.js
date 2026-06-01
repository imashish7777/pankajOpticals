import React, {
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import "../../CSS/customer.css";

import { Formik, Form, Field, ErrorMessage } from "formik";

import * as yup from "yup";

import { useDispatch } from "react-redux";

import {
  addAddress,
  deleteAddress,
  updateAddress,
} from "../../redux/features/product/addressSlice";

import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";

function Addressbox({
  edit,
  show,
  save,
  update,
  _id,
  firstname = "",
  lastname = "",
  email = "",
  phone = "",
  addresslineOne = "",
  addresslineTwo = "",
  zip = "",
  city = "",
  state = "Uttar Pradesh",
}) {
  const dispatch = useDispatch();

  const [editmode, setEditmode] = useState(edit);
  const [isshow, setIsShow] = useState(show);

  const initialValuesAddress = useMemo(
    () => ({
      firstname,
      lastname,
      email,
      phone,
      addresslineOne,
      addresslineTwo,
      zip,
      city,
      state,
    }),
    [
      firstname,
      lastname,
      email,
      phone,
      addresslineOne,
      addresslineTwo,
      zip,
      city,
      state,
    ]
  );

  const validationSchemaAddress = yup.object({
    firstname: yup
      .string()
      .required("Firstname is required"),

    lastname: yup.string(),

    phone: yup
      .string()
      .required("Phone number is required"),

    addresslineOne: yup
      .string()
      .required("Address is required"),

    addresslineTwo: yup
      .string()
      .required("Address is required"),

    zip: yup
      .string()
      .required("Zip code is required"),

    city: yup
      .string()
      .required("City is required"),

    state: yup
      .string()
      .required("State is required"),
  });

  const handleSubmit = useCallback(
    (values) => {
      if (save === "true") {
        dispatch(addAddress(values));
        setIsShow("false");
      }

      if (update === "true") {
        dispatch(
          updateAddress({
            values,
            _id,
          })
        );

        setEditmode("false");
      }
    },
    [dispatch, save, update, _id]
  );

  const handleDelete = useCallback(() => {
    dispatch(deleteAddress(_id));
  }, [dispatch, _id]);

  const handleCloseButton = useCallback(() => {
    if (save === "true") {
      setIsShow("false");
    }

    if (update === "true") {
      setEditmode("false");
    }
  }, [save, update]);

  return (
    <>
      {editmode === "true" &&
      isshow === "true" ? (
        <div className="addressbox my-4">
          <div className="container-fluid">
            <div className="row address-form-row">
              <div className="col-11 address-form-col">
                <Formik
                  initialValues={
                    initialValuesAddress
                  }
                  validationSchema={
                    validationSchemaAddress
                  }
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {(formik) => (
                    <Form className="row g-2">
                      <div className="col-md-6">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Firstname*"
                          name="firstname"
                        />

                        <div className="error">
                          <ErrorMessage name="firstname" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Lastname"
                          name="lastname"
                        />

                        <div className="error">
                          <ErrorMessage name="lastname" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <Field
                          type="email"
                          className="form-control"
                          placeholder={(localStorage.getItem("userEmail"))}
                          name="email"
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Phone*"
                          name="phone"
                        />

                        <div className="error">
                          <ErrorMessage name="phone" />
                        </div>
                      </div>

                      <div className="col-12">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Address line 1*"
                          name="addresslineOne"
                        />

                        <div className="error">
                          <ErrorMessage name="addresslineOne" />
                        </div>
                      </div>

                      <div className="col-12">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Address line 2*"
                          name="addresslineTwo"
                        />

                        <div className="error">
                          <ErrorMessage name="addresslineTwo" />
                        </div>
                      </div>

                      <div className="col-md-5">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="City*"
                          name="city"
                        />

                        <div className="error">
                          <ErrorMessage name="city" />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <Field
                          as="select"
                          className="form-select"
                          name="state"
                        >
                          <option value="Uttar Pradesh">
                            Uttar Pradesh
                          </option>

                          <option value="Delhi">
                            Delhi
                          </option>

                          <option value="Maharashtra">
                            Maharashtra
                          </option>

                          <option value="Karnataka">
                            Karnataka
                          </option>

                          <option value="Tamil Nadu">
                            Tamil Nadu
                          </option>
                        </Field>
                      </div>

                      <div className="col-md-3">
                        <Field
                          type="text"
                          className="form-control"
                          placeholder="Zip Code*"
                          name="zip"
                        />

                        <div className="error">
                          <ErrorMessage name="zip" />
                        </div>
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn client-primary-action"
                          disabled={
                            !formik.isValid ||
                            !formik.dirty ||
                            formik.isSubmitting
                          }
                        >
                          Save & Proceed
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="col-1 address-close-col">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseButton}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {isshow === "true" && (
            <div
              className="container-fluid my-4 saved-address-card"
            >
              <div className="row saved-address-row">
                <div
                  className="col-8 text-muted saved-address-details client-line-height-1"
                >
                  <p className="text-dark fs-6">
                    {firstname} {lastname}
                  </p>

                  <p>
                    {addresslineOne},{" "}
                    {addresslineTwo}
                  </p>

                  <p>
                    {city}, {state}, {zip}
                  </p>

                  <p>INDIA</p>

                  <p>Phone - {phone}</p>
                </div>

                <div className="col-2 saved-address-spacer"></div>

                <div className="col-2 d-flex gap-2 saved-address-actions">
                  <CiEdit className="address-box-icon client-cursor-pointer"
                    onClick={() =>
                      setEditmode("true")
                    }
                  />

                  <AiOutlineDelete
                  className="address-box-icon client-cursor-pointer"
                    onClick={handleDelete}
                  />
                </div>
              </div>

              <hr />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default memo(Addressbox);
