import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik, Field, Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import "../CSS/Addproduct.css";

import Dropzone from "react-dropzone";
import Multiselect from "react-widgets/Multiselect";

import Combobox from "react-widgets/Combobox";

let schema = yup.object().shape({
  shape: yup.string().required("shape is Required"),
  frameType: yup.string().required("frameType is Required"),
  mPrice: yup.number().required("mPrice is Required"),
  Brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  gender: yup.string().required("Tag is Required"),
  color: yup
    .array()
    .min(1, "Pick at least one color")
    .required("Color is Required"),
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = ({ edit, setEdit, category }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);

  const CompanyNameArray = ["John Jacobs", "Lenskart STUDIO"];
  const sizeArray = ["Medium", "Wide"];
  const CategoryArray = ["Eyeglasses", "Sunglasses"];
  const shapeArray = ["Rectangle", "Square"];

  const colors = ["Blue", "Black", "White", "Grey", "Green"];

  const img = [];

  const formik = useFormik({
    initialValues: {
      productId: "",
      Brand: "",
      mPrice: "",
      images: "",
      quantity: "",
      size: "",
      color: "",
      shape: "",
      frameType: "",
      gender: "",
      category: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      formik.resetForm();
      setColor(null);
      setTimeout(() => {}, 3000);
    },
  });
  const handleColors = (e) => {
    setColor(e);

    formik.values.color = color;
  };
  return (
    <>
      {edit ? (
        <>
          <div className="container-fluid">
            <button
              className="btn admin-float-right"
              onClick={() => setEdit(false)}
            >
              X
            </button>
            <h3 className="mb-4 shape">Add Product</h3>

            <div >
              <Formik>
                <Form
                  onSubmit={formik.handleSubmit}
                  className="d-flex gap-3 flex-column"
                >

                  {/* productId */}
                  <div className="row">

                  <div className="col-6">
                  <Field>
                    
                  </Field>
                    <div className="error">
                      {formik.touched.productId && formik.errors.productId}
                    </div>
                  </div>
                  <div className="col-6">

                  <Combobox data={CompanyNameArray} />

                  <div className="error">
                    {formik.touched.Brand && formik.errors.Brand}
                  </div>
                  </div>
                  </div>

                    

                  <CustomInput
                    type="number"
                    label="Enter Product mPrice"
                    name="mPrice"
                    onChng={formik.handleChange("mPrice")}
                    onBlr={formik.handleBlur("mPrice")}
                    val={formik.values.mPrice}
                  />
                  <div className="error">
                    {formik.touched.mPrice && formik.errors.mPrice}
                  </div>

                  <CustomInput
                    type="number"
                    label="Enter Product Quantity"
                    name="quantity"
                    onChng={formik.handleChange("quantity")}
                    onBlr={formik.handleBlur("quantity")}
                    val={formik.values.quantity}
                  />
                  <div className="error">
                    {formik.touched.quantity && formik.errors.quantity}
                  </div>

                  {/* size */}
                  <Combobox data={sizeArray} />
                  <div className="error">
                    {formik.touched.size && formik.errors.size}
                  </div>

                  {/* colors */}
                  <Multiselect
                    data={colors}
                    onChange={(e) => handleColors(e)}
                  />
                  <div className="error">
                    {formik.touched.color && formik.errors.color}
                  </div>

                  {/* Brand */}
                  <Combobox data={CompanyNameArray} />
                  <div className="error">
                    {formik.touched.Brand && formik.errors.Brand}
                  </div>

                  {/* shape */}
                  <Combobox data={shapeArray} />
                  <div className="error">
                    {formik.touched.shape && formik.errors.shape}
                  </div>

                  {/* category */}
                  <Combobox data={CategoryArray} />
                  <div className="error">
                    {formik.touched.category && formik.errors.category}
                  </div>

                  {/* gender */}
                  <Combobox data={["Male", "Female"]} />
                  <div className="error">
                    {formik.touched.gender && formik.errors.gender}
                  </div>

                  {/* images
                   */}
                  <div className="bg-white border-1 p-5 text-center">
                    <Dropzone
                      // onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
                      onDrop={(acceptedFiles) => setImages(acceptedFiles)}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                  <div className="showimages d-flex flex-wrap gap-3">
                    
                  </div>
                  <button
                    className="btn btn-success border-0 rounded-3 my-5"
                    type="submit"
                  >
                    Add Product
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="admin-add-product-legacy-button" onClick={() => setEdit(true)}>
            <p className="text-muted">Add New Product</p>
          </div>
        </>
      )}
    </>
  );
};

export default Addproduct;
