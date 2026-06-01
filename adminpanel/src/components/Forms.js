import React from "react";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { ADD_PROPERTIES } from "../redux/features/product/propertiesSlice";
import { useDispatch } from "react-redux";
import "../CSS/Forms.css";

export function Addcolor({ editColor, setEditColor }) {
  const dispatch = useDispatch();
  const initialValue = {
    color: "",
  };
  const validationSchema = yup.object({
    color: yup.string().required("Color is required"),
  });

  const onSubmit = (values) => {
    dispatch(ADD_PROPERTIES(values));
    setEditColor(false);
  };
  return (
    <>
      {editColor ? (
        <>
          <div className="container-fluid border border-secondary py-4 my-4 rounded">
            <div className="row">
              <div className="col-10">
                <h3>ADD COLOR</h3>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEditColor(false)}
                ></button>
              </div>
            </div>
            <div className="row">
              <div className="col-11">
                <Formik
                  initialValues={initialValue}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    return (
                      <>
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="color" className="form-label">
                              Color
                            </label>
                            <Field
                              type="text"
                              className="form-control"
                              id="color"
                              aria-describedby="emailHelp"
                              name="color"
                            />
                          </div>

                          <button type="submit" className="btn btn-primary">
                            Add Color
                          </button>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={() => setEditColor(true)}>
            <p className="text-primary">+Add New Color</p>
          </div>
        </>
      )}
    </>
  );
}
export function AddframeType({ editFrameType, setEditFrameType }) {
  const dispatch = useDispatch();

  const initialValue = {
    frameType: "",
  };
  const validationSchema = yup.object({
    frameType: yup.string().required("frame Tpe is required"),
  });

  const onSubmit = (values) => {
    dispatch(ADD_PROPERTIES(values));
    setEditFrameType(false);
  };
  return (
    <>
      {editFrameType ? (
        <>
          <div
            className="container-fluid
          border border-secondary py-4 rounded my-4
          "
          >
            <div className="row">
              <div className="col-10">
                <h3>ADD FRAME TYPE</h3>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEditFrameType(false)}
                ></button>
              </div>
            </div>

            <div className="row">
              <div className="col-11">
                <Formik
                  initialValues={initialValue}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    return (
                      <>
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              Frame Type
                            </label>
                            <Field
                              type="text"
                              className="form-control"
                              id="name"
                              aria-describedby="emailHelp"
                              name="frameType"
                            />
                          </div>

                          <button type="submit" className="btn btn-primary">
                            Add Frame Type
                          </button>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={() => setEditFrameType(true)}>
            <p className="text-primary">+Add New Frame Type</p>
          </div>
        </>
      )}
    </>
  );
}

export function Addbrand({ editBrand, setEditBrand }) {
  const dispatch = useDispatch();

  const initialValue = {
    brand: "",
  };
  const validationSchema = yup.object({
    brand: yup.string().required("Brand name is required"),
  });

  const onSubmit = (values) => {
    dispatch(ADD_PROPERTIES(values));
    setEditBrand(false);
  };

  return (
    <>
      {" "}
      {editBrand ? (
        <>
          <div
            className="container-fluid
          border border-secondary py-4 rounded my-4
          "
          >
            <div className="row">
              <div className="col-10">
                <h3>ADD BRAND</h3>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEditBrand(false)}
                ></button>
              </div>
            </div>

            <div className="row">
              <div className="col-11">
                <Formik
                  initialValues={initialValue}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    return (
                      <>
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              Brand name
                            </label>
                            <Field
                              type="text"
                              className="form-control"
                              id="name"
                              aria-describedby="emailHelp"
                              name="brand"
                            />
                          </div>

                          <button type="submit" className="btn btn-primary">
                            Add Brand
                          </button>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={() => setEditBrand(true)}>
            <p className="text-primary">+Add New Brand</p>
          </div>
        </>
      )}
    </>
  );
}

export function Addsize({ editSize, setEditSize }) {
  const dispatch = useDispatch();

  const initialValue = {
    size: "",
  };
  const validationSchema = yup.object({
    size: yup.string().required(" size is required"),
  });

  const onSubmit = (values) => {
    dispatch(ADD_PROPERTIES(values));
    setEditSize(false);
  };
  return (
    <>
      {editSize ? (
        <>
          <div
            className="container-fluid
          border border-secondary py-4 rounded my-4
          
          "
          >
            <div className="row">
              <div className="col-10">
                <h3>ADD SIZE</h3>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEditSize(false)}
                ></button>
              </div>
            </div>

            <div className="row">
              <div className="col-11">
                <Formik
                  initialValues={initialValue}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    return (
                      <>
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              Size
                            </label>
                            <Field
                              type="text"
                              className="form-control"
                              id="name"
                              aria-describedby="emailHelp"
                              name="size"
                            />
                          </div>

                          <button type="submit" className="btn btn-primary">
                            Add Size
                          </button>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={() => setEditSize(true)}>
            <p className="text-primary">+Add New Size</p>
          </div>
        </>
      )}
    </>
  );
}

export function Addshape({ editShape, setEditShape }) {
  const dispatch = useDispatch();

  const initialValue = {
    shape: "",
  };
  const validationSchema = yup.object({
    shape: yup.string().required(" Shape is required"),
  });

  const onSubmit = (values) => {
    dispatch(ADD_PROPERTIES(values));
    setEditShape(false);
  };
  return (
    <>
      {editShape ? (
        <>
          <div
            className="container-fluid
          
          
          border border-secondary py-4 rounded my-4
          "
          >
            <div className="row">
              <div className="col-10">
                <h3>ADD SHAPE</h3>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEditShape(false)}
                ></button>
              </div>
            </div>

            <div className="row">
              <div className="col-11">
                <Formik
                  initialValues={initialValue}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    return (
                      <>
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              Shape
                            </label>
                            <Field
                              type="text"
                              className="form-control"
                              id="name"
                              aria-describedby="emailHelp"
                              name="shape"
                            />
                          </div>

                          <button type="submit" className="btn btn-primary">
                            Add Shape
                          </button>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={() => setEditShape(true)}>
            <p className="text-primary">+Add New Shape</p>
          </div>
        </>
      )}
    </>
  );
}

export function Addcategory({ editCategory, setEditCategory }) {
  const dispatch = useDispatch();

  const initialValue = {
    category: "",
  };
  const validationSchema = yup.object({
    category: yup.string().required("Brand name is required"),
  });

  const onSubmit = (values) => {
    dispatch(ADD_PROPERTIES(values));
    setEditCategory(false);
  };
  return (
    <>
      {editCategory ? (
        <>
          <div
            className="container-fluid
          border border-secondary py-4 rounded my-4
          
          "
          >
            <div className="row">
              <div className="col-10">
                <h3>ADD CATEGORY</h3>
              </div>
              <div className="col-2">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setEditCategory(false)}
                ></button>
              </div>
            </div>

            <div className="row">
              <div className="col-11">
                <Formik
                  initialValues={initialValue}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    return (
                      <>
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                              Category
                            </label>
                            <Field
                              type="text"
                              className="form-control"
                              id="name"
                              aria-describedby="emailHelp"
                              name="category"
                            />
                          </div>

                          <button type="submit" className="btn btn-primary">
                            Add Category
                          </button>
                        </Form>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div onClick={() => setEditCategory(true)}>
            <p className="text-primary">+Add New Category</p>
          </div>
        </>
      )}
    </>
  );
}
