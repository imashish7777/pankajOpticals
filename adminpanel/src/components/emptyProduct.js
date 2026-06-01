import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { ADD_PRODUCT } from "../redux/features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import "react-widgets/styles.css";
import Multiselect from "react-widgets/Multiselect";
import "../CSS/emptyProduct.css";

import Dropzone from "react-dropzone";
import DropdownList from "react-widgets/DropdownList";
import { useState } from "react";
import {
  AVAILABLE_PRODUCT_ID,
  RESET_STATE,
} from "../redux/features/product/productSlice";
import {
  UPLOAD_IMAGE,
  RESET_IMAGES,
  THUMNAIL_IMAGES,
  DELETE_IMAGE,
  DELETE_THUMNAIL_IMAGE,
} from "../redux/features/upload/uploadSlice";
import { Modal, Button } from "antd";
import Loader from "./loader";
import { PageSubmissonFailed } from "./ResultPage";

function EmptyProduct({
  edit,
  setEdit,

  genders,


  brands,
  colors,
  frameTypes,
  sizes,
  shapes,
  categories,
}) {
  const isSuccess = useSelector((state) => state.product.addProductIssucess);
  //dispatch//select//
  const dispatch = useDispatch();
  const upload = useSelector((state) => state.upload);
  const isIdavilable = useSelector((state) => state.product.isIdavilable);
  const hasThumbnailImages = (upload?.thumnailimages || []).length > 0;
  const hasProductImages = (upload?.images || []).length > 0;

  //model//
  const [isModalOpen, setIsModalOpen] = useState([false, false]);

  const toggleModal = (idx, target) => {
    setIsModalOpen((p) => {
      p[idx] = target;
      return [...p];
    });
  };

  const initialValuesProduct = {
    productId: "",
    Brand: "",
    mPrice: "",
    size: "",
    color: "",
    frameType: "",
    shape: "",
    gender: "male",
    quantity: "",
    category: "",
    thumnailimages: [],
    images: [],
  };

  const validationSchemaProduct = yup.object().shape({
    productId: yup.number().required("Product Id is required"),
    Brand: yup.string().required("Company Name is required"),
    mPrice: yup.number().required("Price is required"),
    size: yup.string().required("Size is required"),
    color: yup.array().min(1, "Select at least one color").required("Color is required"),
    frameType: yup.string().required("Frame Type is required"),
    shape: yup.string().required("Shape is required"),
    gender: yup.string().required("Gender is required"),
    quantity: yup.number().required("Quantity is required"),
    category: yup.string().required("Category is required"),
    thumnailimages: yup
      .array()
      .test("thumbnail-required", "Thumbnail image is required", () => hasThumbnailImages),
    images: yup
      .array()
      .test("images-required", "Product images are required", () => hasProductImages),
  });

  const handleSubmit = (values) => {
    values.thumnailimages = upload?.thumnailimages;
    values.images = upload?.images;
    dispatch(ADD_PRODUCT(values));
  };
  if (isSuccess===true) {
    setEdit(false);
    dispatch(RESET_IMAGES());
    dispatch(RESET_STATE());
  }

  const handleCloseButton = () => {
    setEdit(false);
  };

  const handleimageupload = (acceptedFiles) => {
    dispatch(UPLOAD_IMAGE(acceptedFiles));
  };
  const handlethumnailimage = (acceptedFiles) => {
    dispatch(THUMNAIL_IMAGES(acceptedFiles));
  };
  const handleDelete = (id) => {
    // alert(asset_id);
    dispatch(DELETE_IMAGE(id));
  };

  const handleThumnailDetete = (id) => {
    dispatch(DELETE_THUMNAIL_IMAGE(id));
  };

  // preview of images///
  const handleAvailablityCheck = (id) => {
    dispatch(AVAILABLE_PRODUCT_ID({ productId: id }));
  };

  return (
    <>
      {edit ? (
        <>
          <div className="admin-add-product-form-card">
            <div className="container-fluid ">
              <div className="row px-3 py-5 ">
                <h4>ADD PRODUCT</h4>

                <div className="col-11  ">
                  <Formik
                    validationSchema={validationSchemaProduct}
                    initialValues={initialValuesProduct}
                    onSubmit={handleSubmit}
                  >
                    {(formik) => {
                      return (
                        <Form className="row g-2">
                          <div className="col-md-6">
                            <label htmlFor="ProducId">Product Id</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="ProductId"
                              placeholder="Product Id "
                              name="productId"
                              required
                            />
                            <Button
                              onClick={() =>
                                handleAvailablityCheck(formik.values.productId)
                              }
                            >
                              check availablity
                            </Button>
                            <div className="error">
                              <ErrorMessage name="productId" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="Brand"> Company Name</label>

                            <DropdownList
                              data={brands}
                              placeholder="Brand"
                              id="Brand"
                              onChange={(e) => formik.setFieldValue("Brand", e)}
                            />
                            <div className="error">
                              {formik.touched.Brand && formik.errors.Brand}
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="mPrice">Price</label>

                            <Field
                              type="text"
                              className="form-control"
                              id="mPrice"
                              placeholder="Price*"
                              name="mPrice"
                              required
                            />
                            <div className="error">
                              <ErrorMessage name="mPrice" />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="quntity"> Quantity</label>

                            <Field
                              type="text"
                              className="form-control"
                              id="quantity"
                              placeholder="Quantity*"
                              name="quantity"
                              required
                            />
                            <div className="error">
                              <ErrorMessage name="quantity" />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="size"> Size</label>

                            <DropdownList
                              data={sizes}
                              placeholder="size"
                              onChange={(e) => formik.setFieldValue("size", e)}
                            />

                            <div className="error">
                              <ErrorMessage name="size" />
                            </div>
                          </div>
                          <div className="col-4">
                            <label htmlFor="colors">Colors</label>

                            <Multiselect
                              placeholder="colors"
                              id="colors"
                              data={colors}
                              onChange={(e) => formik.setFieldValue("color", e)}
                            />
                            <div className="error">
                              <ErrorMessage name="color" />
                            </div>
                          </div>
                          <div className="col-4">
                            <label htmlFor="frameType"> Frame Type</label>

                            <DropdownList
                              placeholder="Frame Tyoe"
                              id="frameType"
                              data={frameTypes}
                              onChange={(e) => formik.setFieldValue("frameType", e)}
                            />
                            <div className="error">
                              <ErrorMessage name="frameType" />
                            </div>
                          </div>
                          <div className="col-4">
                            <label htmlFor="shape"> Shape</label>

                            <DropdownList
                              placeholder="shape"
                              data={shapes}
                              onChange={(e) => formik.setFieldValue("shape", e)}
                            />
                            <div className="error">
                              <ErrorMessage name="shape" />
                            </div>
                          </div>
                          <div className="col-6">
                            <label htmlFor="category"> Category</label>

                            <DropdownList
                              placeholder="category"
                              id="category"
                              data={categories}
                              onChange={(e) => formik.setFieldValue("category", e)}
                            />
                            <div className="error">
                              <ErrorMessage name="category" />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="gender"> Gender</label>

                            <DropdownList
                              placeholder="gender"
                              id="gender"
                              data={genders}
                              onChange={(e) => formik.setFieldValue("gender", e)}
                            />
                            <div className="error">
                              <ErrorMessage name="gender" />
                            </div>
                          </div>
                          <hr></hr>
                          <div className="col-12">
                            <h4>Thumnail Image</h4>
                            <div className="text-center">
                              {isIdavilable === true ? (
                                <>
                                  <Dropzone
                                    onDrop={(acceptedFiles) =>
                                      handlethumnailimage(acceptedFiles)
                                    }
                                  >
                                    {({ getRootProps, getInputProps }) => (
                                      <section>
                                        <div
                                          {...getRootProps()}
                                          className="border admin-dropzone"
                                        >
                                          <input {...getInputProps()} />
                                          <p className="admin-dropzone-text">
                                            click to select file
                                          </p>
                                        </div>
                                      </section>
                                    )}
                                  </Dropzone>
                                </>
                              ) : (
                                <>please provide valid product Id</>
                              )}

                              {upload?.thumisLoadiing ? (
                                <>
                                  <h5>
                                    Image is uploading..don't refresh tha page
                                  </h5>
                                  <Loader />
                                </>
                              ) : upload?.thumisSuccess ? (
                                upload?.thumnailimages.map((i, index) => {
                                  return (
                                    <>
                                      {" "}
                                      <Modal
                                        open={isModalOpen[index]}
                                        footer={null}
                                        onCancel={() =>
                                          toggleModal(index, false)
                                        }
                                      >
                                        <img
                                          alt="example"
                                          className="admin-modal-preview-image"
                                          src={i.url}
                                        />
                                      </Modal>
                                      <div className="admin-upload-preview admin-upload-preview-sm">
                                        <img
                                          alt="example"
                                          className="admin-upload-preview-image admin-upload-preview-image-sm"
                                          src={i.url}
                                          onClick={() =>
                                            toggleModal(index, true)
                                          }
                                        />
                                        <Button
                                          className="admin-upload-preview-button-sm"
                                          danger
                                          onClick={() =>
                                            handleThumnailDetete({
                                              id: i.public_id,
                                            })
                                          }
                                        >
                                          delete
                                        </Button>
                                      </div>
                                    </>
                                  );
                                })
                              ) : upload?.thumisError ? (
                                <>
                                  <PageSubmissonFailed />
                                </>
                              ) : (
                                <></>
                              )}

                              {!hasThumbnailImages && (
                                <div className="error">Thumbnail image is required</div>
                              )}
                            </div>
                          </div>
                          <div className="col-12">
                            <h4> Images</h4>

                            <div className=" text-center">
                              {isIdavilable === true ? (
                                <>
                                  <Dropzone
                                    onDrop={(acceptedFiles) =>
                                      handleimageupload(acceptedFiles)
                                    }
                                  >
                                    {({ getRootProps, getInputProps }) => (
                                      <section>
                                        <div
                                          {...getRootProps()}
                                          className="border admin-dropzone"
                                        >
                                          <input {...getInputProps()} />
                                          <p className="admin-dropzone-text">
                                            click to select file
                                          </p>
                                        </div>
                                      </section>
                                    )}
                                  </Dropzone>
                                </>
                              ) : (
                                <>Please provide valid product Id</>
                              )}

                              {upload?.isLoading ? (
                                <>
                                  <h5>
                                    Images are uploading..don't refresh tha page
                                  </h5>
                                  <Loader />
                                </>
                              ) : upload?.isSuccess ? (
                                <>
                                  <div className="admin-upload-preview-row">
                                    {upload?.images.map((i, index) => {
                                      return (
                                        <>
                                          {" "}
                                          <Modal
                                            open={isModalOpen[index]}
                                            footer={null}
                                            onCancel={() =>
                                              toggleModal(index, false)
                                            }
                                          >
                                            <img
                                              alt="example"
                                              className="admin-modal-preview-image"
                                              src={i.url}
                                            />
                                          </Modal>
                                          <div className="admin-upload-preview">
                                            <img
                                              alt="example"
                                              className="admin-upload-preview-image"
                                              src={i.url}
                                              onClick={() =>
                                                toggleModal(index, true)
                                              }
                                            />

                                            <Button
                                              className="admin-upload-preview-button"
                                              danger
                                              onClick={() =>
                                                handleDelete({
                                                  id: i.public_id,
                                                })
                                              }
                                            >
                                              delete
                                            </Button>
                                          </div>
                                        </>
                                      );
                                    })}
                                  </div>
                                </>
                              ) : upload?.isError ? (
                                <>
                                  <PageSubmissonFailed />
                                </>
                              ) : (
                                <></>
                              )}

                              {!hasProductImages && (
                                <div className="error">Product images are required</div>
                              )}

                              {/* antd */}
                            </div>
                          </div>

                          <div className="col-12">
                            <button
                              type="submit"
                              className="btn admin-save-product-button"
                              disabled={
                                isIdavilable === false ||
                                !formik.dirty ||
                                !formik.isValid ||
                                !hasThumbnailImages ||
                                !hasProductImages
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
                <div className="col-1">
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
          <div
            className="admin-add-product-button"
            onClick={() => setEdit(true)}
          >
            <p className="text-muted">Add New Product</p>
          </div>
        </>
      )}
    </>
  );
}

export default EmptyProduct;
