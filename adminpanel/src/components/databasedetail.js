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
  DELETE_PROPERTIES,
  PROPERTIES_DETAILS,
} from "../redux/features/product/propertiesSlice";
import { Popconfirm, Tag } from "antd";
import "../CSS/databasedetail.css";

// import{FETCH}

function PropertiesCount() {
  const properties = useSelector((state) => state.properties);
  const dispatch = useDispatch();
  const [editColor, setEditColor] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [editFrameType, setEditFrameType] = useState(false);
  const [editShape, setEditShape] = useState(false);
  const [editSize, setEditSize] = useState(false);
  const [editBrand, setEditBrand] = useState(false);
  if (properties?.properties_details) {
    var brands = properties?.properties_details.Brandcount;
    var frameTypes = properties?.properties_details.frameTypecount;
    var genders = properties?.properties_details.gendercount;
    var sizes = properties?.properties_details.sizecount;
    var shapes = properties?.properties_details.shapecount;
    var categories = properties?.properties_details.categorycount;
    var colors = properties?.properties_details.colorcount;
  }

  const confirm = (e) => {
    dispatch(DELETE_PROPERTIES(e));
  };
  const cancel = (e) => {};

  useEffect(() => {
    // dispatch(FETCH_PROPERTIES());
    dispatch(PROPERTIES_DETAILS());
  }, [dispatch]);

  const handleClick = () => {
    // dispatch()
  };

  return (
    <>
      <div className="admin-properties-page">
      <h1>Properties</h1>

      <div className="admin-property-actions">
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

      {/* color */}

      <div className="container-fluid">
        <div className="row row-col-4">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">categories</th>
                  <th scope="col">Product-Count</th>
                </tr>
              </thead>
              <tbody>
                {categories ? (
                  <>
                    {Object.keys(categories)?.map((key, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{key}</td>
                          <td>
                            <Tag className="admin-count-tag">
                              {categories[key]}
                            </Tag>

                            <Popconfirm
                              title="Go out of stock"
                              description={
                                <p>
                                  Are you sure? <br></br>
                                  It will put all the products related to{" "}
                                  <span className="admin-text-blue">
                                    {" "}
                                    {key}{" "}
                                  </span>{" "}
                                  category{" "}
                                  <span className="admin-text-danger">
                                    out of stock.
                                  </span>
                                </p>
                              }
                              onConfirm={() => confirm({ category: key })}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">frame Type</th>
                  <th scope="col">Product-Count</th>
                </tr>
              </thead>
              <tbody>
                {frameTypes ? (
                  <>
                    {Object.keys(frameTypes)?.map((key, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{key}</td>
                          <td>
                            <Tag className="admin-count-tag">
                              {frameTypes[key]}
                            </Tag>

                            <Popconfirm
                              title="Go out of stock"
                              description={
                                <p>
                                  Are you sure? <br></br>
                                  It will put all the products related to{" "}
                                  <span className="admin-text-blue">
                                    {" "}
                                    {key}{" "}
                                  </span>{" "}
                                  frame Type{" "}
                                  <span className="admin-text-danger">
                                    out of stock.
                                  </span>
                                </p>
                              }
                              onConfirm={() => confirm({ frameType: key })}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>{" "}
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Genders</th>
                  <th scope="col">Product-Count</th>
                </tr>
              </thead>
              <tbody>
                {genders ? (
                  <>
                    {Object.keys(genders)?.map((key, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{key}</td>
                          <td>
                            <Tag className="admin-count-tag">
                              {genders[key]}
                            </Tag>

                            <Popconfirm
                              title="Go out of stock"
                              description={
                                <p>
                                  Are you sure? <br></br>
                                  It will put all the products related to{" "}
                                  <span className="admin-text-blue">
                                    {" "}
                                    {key}{" "}
                                  </span>{" "}
                                  gender{" "}
                                  <span className="admin-text-danger">
                                    out of stock.
                                  </span>
                                </p>
                              }
                              onConfirm={() => confirm({ gender: key })}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Sizes</th>
                  <th scope="col">Product-Count</th>
                </tr>
              </thead>
              <tbody>
                {sizes ? (
                  <>
                    {Object.keys(sizes)?.map((key, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{key}</td>
                          <td>
                            <Tag className="admin-count-tag">
                              {sizes[key]}
                            </Tag>

                            <Popconfirm
                              title="Go out of stock"
                              description={
                                <p>
                                  Are you sure? <br></br>
                                  It will put all the products related to{" "}
                                  <span className="admin-text-blue">
                                    {" "}
                                    {key}{" "}
                                  </span>{" "}
                                  size{" "}
                                  <span className="admin-text-danger">
                                    out of stock.
                                  </span>
                                </p>
                              }
                              onConfirm={() => confirm({ size: key })}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
         
          <div className="row row-cols-3">
            <div className="col">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Shapes</th>
                    <th scope="col">Product-Count</th>
                  </tr>
                </thead>
                <tbody>
                  {shapes ? (
                    <>
                      {Object.keys(shapes)?.map((key, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{key}</td>
                            <td>
                              <Tag className="admin-count-tag">
                                {shapes[key]}
                              </Tag>

                              <Popconfirm
                                title="Go out of stock"
                                description={
                                  <p>
                                    Are you sure? <br></br>
                                    It will put all the products related to{" "}
                                    <span className="admin-text-blue">
                                      {" "}
                                      {key}{" "}
                                    </span>{" "}
                                    shape{" "}
                                    <span className="admin-text-danger">
                                      out of stock.
                                    </span>
                                  </p>
                                }
                                onConfirm={() => confirm({ shape: key })}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined />
                              </Popconfirm>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Colors</th>
                  <th scope="col">Product-Count</th>
                </tr>
              </thead>
              <tbody>
                {colors ? (
                  <>
                    {Object.keys(colors)?.map((key, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{key}</td>
                          <td>
                            <Tag
                              className="admin-count-tag"
                              onClick={() => handleClick()}
                            >
                              {colors[key]}
                            </Tag>

                            <Popconfirm
                              title="Go out of stock"
                              description={
                                <p>
                                  Are you sure? <br></br>
                                  It will put all the products related to{" "}
                                  <span className="admin-text-blue">
                                    {" "}
                                    {key}{" "}
                                  </span>{" "}
                                  color{" "}
                                  <span className="admin-text-danger">
                                    out of stock.
                                  </span>
                                </p>
                              }
                              onConfirm={() => confirm({ color: key })}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Brands</th>
                  <th scope="col">Product-Count</th>
                </tr>
              </thead>
              <tbody>
                {brands ? (
                  <>
                    {Object.keys(brands)?.map((key, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{key}</td>
                          <td>
                            <Tag className="admin-count-tag">
                              {brands[key]}
                            </Tag>

                            <Popconfirm
                              title="Go out of stock"
                              description={
                                <p>
                                  Are you sure? <br></br>
                                  It will put all the products related to{" "}
                                  <span className="admin-text-blue">
                                    {" "}
                                    {key}{" "}
                                  </span>{" "}
                                  brand{" "}
                                  <span className="admin-text-danger">
                                    out of stock.
                                  </span>
                                </p>
                              }
                              onConfirm={() => confirm({ Brand: key })}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>{" "}
          
          </div>
          
        </div>
      </div>
      </div>
    </>
  );
}

export default PropertiesCount;
