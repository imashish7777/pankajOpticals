import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Addcolor,
  Addcategory,
  AddframeType,
  Addsize,
  Addbrand,
  Addshape,
} from "./Forms";
import { DeleteOutlined } from "@ant-design/icons";
import {
  FETCH_PROPERTIES,
  DELETE_PROPERTIES,
} from "../redux/features/product/propertiesSlice";
import { Popconfirm } from "antd";
import "../CSS/Properties.css";

function Properties() {
  const properties = useSelector((state) => state.properties);
  const dispatch = useDispatch();
  const [editColor, setEditColor] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [editFrameType, setEditFrameType] = useState(false);
  const [editShape, setEditShape] = useState(false);
  const [editSize, setEditSize] = useState(false);
  const [editBrand, setEditBrand] = useState(false);
  if (properties?.properties?.length > 0) {
    var brands = properties.properties[0].brands;
    var categories = properties.properties[0].categories;
    var colors = properties.properties[0].colors;
    var frameTypes = properties.properties[0].frameTypes;
    var sizes = properties.properties[0].sizes;
    var shapes = properties.properties[0].shapes;
    var genders = properties.properties[0].genders;
  }

  const confirm = (e) => {
    dispatch(DELETE_PROPERTIES(e));
  };
  const cancel = (e) => {};

  useEffect(() => {
    dispatch(FETCH_PROPERTIES());
  }, [dispatch]);

  return (
    <>
      <h1>Properties</h1>
      <div className="container-fluid">
        <div className="row admin-flex-row">
          <Addcolor editColor={editColor} setEditColor={setEditColor} />

          <Addcategory
            editCategory={editCategory}
            setEditCategory={setEditCategory}
          />
          <AddframeType
            editFrameType={editFrameType}
            setEditFrameType={setEditFrameType}
          />
          <Addshape editShape={editShape} setEditShape={setEditShape} />
          <Addsize editSize={editSize} setEditSize={setEditSize} />
          <Addbrand editBrand={editBrand} setEditBrand={setEditBrand} />
        </div>
      </div>

      {/* color */}
      <div className="container-fluid">
        <div className="row row-col-6">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Colors</th>
                  <th scope="col">Count</th>
                </tr>
              </thead>
              <tbody>
                {colors?.map((i, index, value) => {
                  return (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>
                          {value[index]}

                          <Popconfirm
                            title="Go out of stock"
                            description={
                              <p>
                                Are you sure? <br></br>
                                It will put all the products related to{" "}
                                <span className="admin-text-blue">
                                  {" "}
                                  {value[index]}{" "}
                                </span>{" "}
                                color{" "}
                                <span className="admin-text-danger">
                                  out of stock.
                                </span>
                              </p>
                            }
                            onConfirm={() => confirm({ color: value[index] })}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </td>
                        <td></td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Category</th>
                  {/* <th scope="col">Color Code</th> */}
                </tr>
              </thead>
              <tbody>
                {categories?.map((i, index, value) => {
                  // let colorCode = i.colorCode;
                  return (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>
                          {value[index]}
                          <div className="admin-property-dot"></div>
                          <Popconfirm
                            title="Go out of stock"
                            description={
                              <p>
                                Are you sure? <br></br>
                                It will put all the products related to{" "}
                                <span className="admin-text-blue">
                                  {" "}
                                  {value[index]}{" "}
                                </span>{" "}
                                category{" "}
                                <span className="admin-text-danger">
                                  out of stock.
                                </span>
                              </p>
                            }
                            onConfirm={() =>
                              confirm({ category: value[index] })
                            }
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Shapes</th>
                  {/* <th scope="col">Color Code</th> */}
                </tr>
              </thead>
              <tbody>
                {shapes?.map((i, index, value) => {
                  // let colorCode = i.colorCode;
                  return (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>
                          {value[index]}
                          <div className="admin-property-dot"></div>
                          <Popconfirm
                            title="Go out of stock"
                            description={
                              <p>
                                Are you sure? <br></br>
                                It will put all the products related to{" "}
                                <span className="admin-text-blue">
                                  {" "}
                                  {value[index]}{" "}
                                </span>{" "}
                                shape{" "}
                                <span className="admin-text-danger">
                                  out of stock.
                                </span>
                              </p>
                            }
                            onConfirm={() => confirm({ shape: value[index] })}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Size</th>
                  {/* <th scope="col">Color </th> */}
                </tr>
              </thead>
              <tbody>
                {sizes?.map((i, index, value) => {
                  // let colorCode = i.colorCode;
                  return (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>
                          {value[index]}
                          <div className="admin-property-dot"></div>
                          <Popconfirm
                            title="Go out of stock"
                            description={
                              <p>
                                Are you sure? <br></br>
                                It will put all the products related to{" "}
                                <span className="admin-text-blue">
                                  {" "}
                                  {value[index]}{" "}
                                </span>{" "}
                                color{" "}
                                <span className="admin-text-danger">
                                  out of stock.
                                </span>
                              </p>
                            }
                            onConfirm={() => confirm({ size: value[index] })}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">FrameType</th>
                  {/* <th scope="col">Color Code</th> */}
                </tr>
              </thead>
              <tbody>
                {frameTypes?.map((i, index, value) => {
                  // let colorCode = i.colorCode;
                  return (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>
                          {value[index]}
                          <div className="admin-property-dot"></div>
                          <Popconfirm
                            title="Go out of stock"
                            description={
                              <p>
                                Are you sure? <br></br>
                                It will put all the products related to{" "}
                                <span className="admin-text-blue">
                                  {" "}
                                  {value[index]}{" "}
                                </span>{" "}
                                frame type{" "}
                                <span className="admin-text-danger">
                                  out of stock.
                                </span>
                              </p>
                            }
                            onConfirm={() =>
                              confirm({ frameType: value[index] })
                            }
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Brand</th>
                  {/* <th scope="col">Color Code</th> */}
                </tr>
              </thead>

              <tbody>
                {brands?.map((i, index, value) => {
                  // let colorCode = i.colorCode;
                  return (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>
                          {value[index]}
                          <div className="admin-property-dot"></div>

                          <Popconfirm
                            title=" Go out of stock"
                            description={
                              <p>
                                Are you sure? <br></br>
                                It will put all the products related to{" "}
                                <span className="admin-text-blue">
                                  {" "}
                                  {value[index]}{" "}
                                </span>{" "}
                                brand{" "}
                                <span className="admin-text-danger">
                                  out of stock.
                                </span>
                              </p>
                            }
                            onConfirm={() => confirm({ brand: value[index] })}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">GENDERS</th>
                  {/* <th scope="col">Color Code</th> */}
                </tr>
              </thead>

              <tbody>
                {genders?.map((i, index, value) => {
                  // let colorCode = i.colorCode;
                  return (
                    <>
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>

                        <td>
                          {value[index]}
                          <div className="admin-property-dot"></div>
                          {/* <DeleteOutlined
                            onClick={() =>
                              dispatch(
                                DELETE_PROPERTIES({ gender: value[index] })
                              )
                            }
                          /> */}
                          <Popconfirm
                            title="Go out of stock"
                            description={
                              <p>
                                Are you sure? <br></br>
                                It will put all the products related to{" "}
                                <span className="admin-text-blue">
                                  {" "}
                                  {value[index]}{" "}
                                </span>{" "}
                                gender{" "}
                                <span className="admin-text-danger">
                                  out of stock.
                                </span>
                              </p>
                            }
                            onConfirm={() => confirm({ gender: value[index] })}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* category */}

      {/* //shape// */}

      {/* size */}

      {/* frameType */}

      {/* brand */}
    </>
  );
}

export default Properties;
