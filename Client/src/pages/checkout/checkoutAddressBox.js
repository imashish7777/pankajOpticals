import React, { useState } from "react";
import "../../CSS/checkout.css";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addAddress } from "../../redux/features/product/addressSlice";

import { GrNext } from "react-icons/gr";
function CheckoutAddressbox({
  edit,
  show,
  save,
  update,
  _id,
  firstname,
  lastname,
  phone,
  addresslineOne,
  addresslineTwo,
  zip,
  city,
  state,
}) {
  const [editmode, setEditmode] = useState(edit);
  const [isshow, setIsShow] = useState(show);
  const dispatch = useDispatch();
  const initialValuesAddress = {
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    addresslineOne: addresslineOne,
    addresslineTwo: addresslineTwo,
    zip: zip,
    city: city,
    state: city,
  };

  const validationSchemaAddress = yup.object({
    firstname: yup.string().required(),
    lastname: yup.string(),
    phone: yup.number().required(),
    addresslineOne: yup.string().required(),
    addresslineTwo: yup.string().required(),
    zip: yup.number().required(),
    city: yup.string().required(),
    state: yup.string().required(),
  });

  const handleSubmit = (values) => {
    if (save === "true") {
      dispatch(addAddress(values));
      //   navigate("/checkout/payment");
      setIsShow("false");
    }
    if (update === "true") {
      setEditmode("false");
    }
  };

  const handleCloseButton = () => {
    if (save === "true") {
      setEditmode("false");
    }
    if (update === "true") {
      setIsShow("flase");
    }
  };

  return (
    <>
      {editmode === "true" && isshow === "true" ? (
        <>
          <div
            className="addressbox my-4 checkout-addressbox client-white-soft-card"
          >
            <div className="container-fluid ">
              <div className="row px-3 py-5 checkout-addressbox-row">
                <div className="col-11 checkout-addressbox-form-col">
                  <Formik
                    validationSchema={validationSchemaAddress}
                    initialValues={initialValuesAddress}
                    onSubmit={handleSubmit}
                    validator={() => ({})}
                  >
                    {(formik) => {
                      return (
                        <Form className="row g-2">
                          <div className="col-md-6">
                            <Field
                              type="text"
                              className="form-control"
                              id="inputEmail4"
                              placeholder="firstname*"
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
                              id="inputPassword4"
                              placeholder="lastname*"
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
                              id="email"
                              placeholder={window.localStorage.getItem(
                                "userEmail"
                              )}
                              name="email"
                              disabled
                            />
                            <div className="error">
                              <ErrorMessage name="email" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <Field
                              type="text"
                              className="form-control"
                              id="phone"
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
                              id="inputAddress"
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
                              id="inputAddress2"
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
                              id="inputCity"
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
                              id="state"
                              className="form-select"
                            >
                              <option defaultValue="Uttar Pradesh">
                                Uttar Pradesh
                              </option>

                              <option value="Andhra Pradesh">
                                Andhra Pradesh
                              </option>
                              <option value="Andaman and Nicobar Islands">
                                Andaman and Nicobar Islands
                              </option>
                              <option value="Arunachal Pradesh">
                                Arunachal Pradesh
                              </option>
                              <option value="Assam">Assam</option>
                              <option value="Bihar">Bihar</option>
                              <option value="Chandigarh">Chandigarh</option>
                              <option value="Chhattisgarh">Chhattisgarh</option>
                              <option value="Dadar and Nagar Haveli">
                                Dadar and Nagar Haveli
                              </option>
                              <option value="Daman and Diu">
                                Daman and Diu
                              </option>
                              <option value="Delhi">Delhi</option>
                              <option value="Lakshadweep">Lakshadweep</option>
                              <option value="Puducherry">Puducherry</option>
                              <option value="Goa">Goa</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Himachal Pradesh">
                                Himachal Pradesh
                              </option>
                              <option value="Jammu and Kashmir">
                                Jammu and Kashmir
                              </option>
                              <option value="Jharkhand">Jharkhand</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Madhya Pradesh">
                                Madhya Pradesh
                              </option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Manipur">Manipur</option>
                              <option value="Meghalaya">Meghalaya</option>
                              <option value="Mizoram">Mizoram</option>
                              <option value="Nagaland">Nagaland</option>
                              <option value="Odisha">Odisha</option>
                              <option value="Punjab">Punjab</option>
                              <option value="Rajasthan">Rajasthan</option>
                              <option value="Sikkim">Sikkim</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Telangana">Telangana</option>
                              <option value="Tripura">Tripura</option>
                              <option value="Uttarakhand">Uttarakhand</option>
                              <option value="West Bengal">West Bengal</option>
                            </Field>
                          </div>
                          <div className="col-md-3">
                            <Field
                              type="text"
                              className="form-control"
                              id="inputZip"
                              placeholder="Zip Code*"
                              name="zip"
                            />
                            <div className="error ">
                              <ErrorMessage name="zip" />
                            </div>
                          </div>

                          <div className="col-12">
                            <button
                              type="submit"
                              onClick={() => handleSubmit(formik.values)}
                              className="btn client-primary-action"
                              disabled={
                                save === "true" &&
                                !(formik.dirty && formik.errors)
                              }
                            >
                              Save & Proceed
                            </button>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
                <div className="col-1 checkout-addressbox-close-col">
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => handleCloseButton()}
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {isshow === "true" ? (
            <>
              <div
                className="container-fluid checkout-add-address-card client-white-soft-card"
                onClick={() => setEditmode("true")}
              >
                <div className="row py-3 checkout-add-address-row">
                  <div className="col-10 d-flex align-items-center checkout-add-address-text">
                    <p className="client-add-address-title">
                      Add New Address
                    </p>
                  </div>
                  <div className="col-2 checkout-add-address-icon">
                    <GrNext />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

export default CheckoutAddressbox;
