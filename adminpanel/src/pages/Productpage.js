import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Product from "../components/Product";
import "../CSS/Productpage.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import { useSelector, useDispatch } from "react-redux";
import {
  UPDATE_PRODUCT,
  FETCH_PRODUCTS,
} from "../redux/features/product/productSlice";
import Productmodal from "../components/productmodal";
import EmptyProduct from "../components/emptyProduct";
import { FETCH_PROPERTIES } from "../redux/features/product/propertiesSlice";
import {
  Select,
  Space,
  Switch,
  AutoComplete,
  Button,
  Pagination,
} from "antd";
import { CloseOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Addcolor,
  Addcategory,
  AddframeType,
  Addsize,
  Addbrand,
  Addshape,
} from "../components/Forms";

const Filter = forwardRef(
  (
    {
      handleFrameType,
      handleBrand,
      handleColor,
      handleSize,
      handleShape,
      handleGender,
      handleCategory,
      brands,
      colors,
      frameTypes,
      sizes,
      shapes,
      genders,
      categories,
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      getUncheck(value) {
        const element = document.getElementById(value);
        element.checked = false;
      },
    }));
    return (
      <div className="filter admin-filter-panel">
        <form className="container">
          <div className="row">
            <p>FRAME TYPE</p>
            {frameTypes?.map((i, index, value) => {
              return (
                <>
                  <label key={value[index]}>
                    <input
                      type="checkbox"
                      name={value[index]}
                      value={value[index]}
                      onClick={handleFrameType}
                      id={value[index]}
                    />
                    <span> {value[index]}</span>
                  </label>
                </>
              );
            })}
          </div>

          <div className="row">
            <p> SHAPE</p>
            {shapes?.map((i, index, value) => {
              return (
                <>
                  <label key={index}>
                    <input
                      type="checkbox"
                      name={value[index]}
                      value={value[index]}
                      onClick={handleShape}
                      id={value[index]}
                    />
                    <span> {value[index]}</span>
                  </label>
                </>
              );
            })}
          </div>
          <div className="row ">
            <p>BRAND</p>
            {brands?.map((i, index, value) => {
              return (
                <>
                  <label key={index}>
                    <input
                      type="checkbox"
                      name={value[index]}
                      value={value[index]}
                      id={value[index]}
                      onClick={handleBrand}
                    />
                    <span> {value[index]}</span>
                  </label>
                </>
              );
            })}
          </div>
          <div className="row ">
            <p>SIZE</p>
            {sizes?.map((i, index, value) => {
              return (
                <>
                  <label key={index}>
                    <input
                      type="checkbox"
                      name={value[index]}
                      value={value[index]}
                      onClick={handleSize}
                      id={value[index]}
                    />
                    <span> {value[index]}</span>
                  </label>
                </>
              );
            })}
          </div>
          <div className="row ">
            <p>COLOR</p>
            {colors?.map((i, index, value) => {
              return (
                <>
                  <label key={index}>
                    <input
                      type="checkbox"
                      name={value[index]}
                      value={value[index]}
                      onClick={handleColor}
                      id={value[index]}
                    />
                    <span> {value[index]}</span>
                  </label>
                </>
              );
            })}
          </div>
          <div className="row">
            <p>CATEGORIES</p>
            {categories?.map((i, index, value) => {
              return (
                <>
                  <label key={value[index]}>
                    <input
                      type="checkbox"
                      name={value[index]}
                      value={value[index]}
                      onClick={handleCategory}
                      id={value[index]}
                    />
                    <span> {value[index]}</span>
                  </label>
                </>
              );
            })}
          </div>
          <div className="row ">
            <p>GENDER</p>
            {genders?.map((i, index, value) => {
              return (
                <>
                  <label key={index}>
                    <input
                      type="checkbox"
                      name={value[index]}
                      value={value[index]}
                      onClick={handleGender}
                      id={value[index]}
                    />
                    <span> {value[index]}</span>
                  </label>
                </>
              );
            })}
          </div>
        </form>
      </div>
    );
  }
);

///filter

export default function Productpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refElement = useRef();
  ///product data///
  const Products = useSelector((state) => state.product);

  const [current, setCurrent] = useState(1);

  const showingCount = Products?.limit;
  const lowerbound = (current - 1) * showingCount + 1;
  const upperbound = lowerbound + showingCount - 1;
  let { name } = useParams();

  var [frameType, setFrameType] = useState([]);
  var [shape, setShape] = useState([]);
  var [Brand, setBrand] = useState([]);
  var [gender, setGender] = useState([]);
  var [size, setSize] = useState([]);
  var [color, setColor] = useState([]);
  var [category, setCategory] = useState([]);

  var [sortby, setSortby] = useState();

  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [editColor, setEditColor] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [editFrameType, setEditFrameType] = useState(false);
  const [editShape, setEditShape] = useState(false);
  const [editSize, setEditSize] = useState(false);
  const [editBrand, setEditBrand] = useState(false);

  //antd pagination//
  const onChange = (page) => {
    setCurrent(page);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  ///fetcch properties//

  const properties = useSelector((state) => state.properties);

  if (properties?.properties?.length > 0) {
    var brands = properties.properties[0].brands;
    var categories = properties.properties[0].categories;
    var colors = properties.properties[0].colors;
    var frameTypes = properties.properties[0].frameTypes;
    var sizes = properties.properties[0].sizes;
    var shapes = properties.properties[0].shapes;
    var genders = properties.properties[0].genders;

    var optionArray = brands?.concat(
      categories,
      frameType,
      sizes,
      shapes,
      genders,
      colors
    );
    var options = optionArray.map((i) => {
      return {
        label: i,
        value: i,
      };
    });
  }

  const handleChange = (value) => {
    setSortby(value);
    setCurrent(1);
  };

  const handleGender = (e) => {
    setCurrent(1);

    let updatedList = [...gender];

    if (e.target.checked) {
      updatedList = [...gender, { gender: e.target.value }];

      setGender({ gender: e.target.value });
    } else {
      updatedList.splice(
        gender.findIndex((i) => i.gender === e.target.value),
        1
      );
    }

    setGender(updatedList);
  };
  const handleCategory = (e) => {
    setCurrent(1);

    let updatedList = [...category];

    if (e.target.checked) {
      updatedList = [...category, { category: e.target.value }];

      setCategory({ category: e.target.value });
    } else {
      updatedList.splice(
        category.findIndex((i) => i.category === e.target.value),
        1
      );
    }

    setCategory(updatedList);
  };

  const handleFrameType = (e) => {
    setCurrent(1);
    let updatedList = [...frameType];

    if (e.target.checked) {
      updatedList = [...frameType, { frameType: e.target.value }];

      setFrameType({ frameType: e.target.value });
    } else {
      updatedList.splice(
        frameType.findIndex((i) => i.frameType === e.target.value),
        1
      );
    }

    setFrameType(updatedList);
  };

  const handleShape = (e) => {
    setCurrent(1);
    let updatedList = [...shape];
    if (e.target.checked) {
      updatedList = [...shape, { shape: e.target.value }];
      setShape({ shape: e.target.value });
    } else {
      updatedList.splice(
        shape.findIndex((i) => i.shape === e.target.value),
        1
      );
    }
    setShape(updatedList);
  };

  const handleBrand = (e) => {
    setCurrent(1);
    var updatedList = [...Brand];
    if (e.target.checked) {
      setBrand({ Brand: e.target.value });
      updatedList = [...Brand, { Brand: e.target.value }];
    } else {
      updatedList.splice(
        Brand.findIndex((i) => i.Brand === e.target.value),
        1
      );
    }
    setBrand(updatedList);
  };
  const handleColor = (e) => {
    setCurrent(1);
    var updatedList = [...color];
    if (e.target.checked) {
      setColor({ color: e.target.value });
      updatedList = [...color, { color: e.target.value }];
    } else {
      updatedList.splice(
        color.findIndex((i) => i.color === e.target.value),
        1
      );
    }
    setColor(updatedList);
  };

  const handleSize = (e) => {
    setCurrent(1);
    var updatedList = [...size];
    if (e.target.checked) {
      setSize({ size: e.target.value });
      updatedList = [...size, { size: e.target.value }];
    } else {
      updatedList.splice(
        size.findIndex((i) => i.size === e.target.value),
        1
      );
    }
    setSize(updatedList);
  };

  const [value, setValue] = useState("");
  const [finaloptions, setFinaloptions] = useState();

  // /fetchproducts/; ///
  useEffect(() => {
    dispatch(
      FETCH_PRODUCTS({
        searchstring: value,
        frameType: frameType,
        shape: shape,
        Brand: Brand,
        size: size,
        gender: gender,
        color: color,
        category: category,
        current: current,
        sortby: sortby,
      })
    );
    
  }, [
    dispatch,
    value,
    frameType,
    shape,
    Brand,
    color,
    gender,
    size,
    current,
    sortby,
    category,
  ]);

  useEffect(() => {
    dispatch(FETCH_PROPERTIES());
  }, [dispatch]);

  //searching autocomplete//

  function scramble(string1, string2) {
    return string2.split("").every(function (character) {
      return string1.includes(character);
    });
  }

  const handlefilter = (word) => {
    var finaloptions = options?.filter((i) =>
      scramble(i.label?.toLowerCase(), word[0]?.toLowerCase())
    );
    setFinaloptions(finaloptions);
  };
  const handleSearch = (value) => {
    const word = value?.split(" ").splice(-1);
    if (word) {
      setValue(value);
      handlefilter(word);
    }
  };

  const onSelect = (selectvalue) => {
    let value1 = value?.split(" ");
    value1[value1.length - 1] = selectvalue;
    value1 = value1.join(" ");

    setValue(value1);
  };

  return (
    <>
      <div className="container-fluid admin-product-page">
        <div className="row admin-product-toolbar">
          <div className="col-2 admin-view-toggle">
            <Space>
              <Switch checked={show} onChange={() => setShow(!show)} />
              View
            </Space>
          </div>
          <div className="col-7 admin-search-box">
            <Space.Compact compact className="admin-search-control">
              <AutoComplete
                className="admin-search-input"
                value={value}
                options={value ? finaloptions : []}
                onSelect={onSelect}
                onChange={handleSearch}
                size="large"
                allowClear={true}
              ></AutoComplete>
              <Button
                className="admin-search-button"
                onClick={() => {
                  dispatch(
                    FETCH_PRODUCTS({
                      searchstring: value,
                      frameType: frameType,
                      shape: shape,
                      Brand: Brand,
                      size: size,
                      gender: gender,
                      color: color,
                      category: category,
                      current: current,
                      sortby: sortby,
                    })
                  );
                }}
                icon={<SearchOutlined />}
              ></Button>
            </Space.Compact>
          </div>
        </div>

        <div>
          <p>
            showing {lowerbound}-{" "}
            {upperbound < Products?.count ? upperbound : Products?.count} of
            over {Products?.count}
          </p>
        </div>

        <div className="row d-flex admin-filter-summary">
          <div className="col-2 admin-filter-title">
            <button
              type="button"
              className="admin-mobile-filter-btn"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <FilterOutlined />
              <span>Filter</span>
            </button>
            <p className="admin-filter-label">FILTER</p>
          </div>

          
          <div
            className=" col-3  d-flex mb-2 admin-sort-control"
          >
            <p className="fs-6 me-2"> Sort By:</p>
            <Select
              className="admin-sort-select"
              popupClassName="admin-sort-dropdown"
              defaultValue="WN"
              label="What's new"
              onChange={handleChange}
              options={[
                {
                  value: "HtL",
                  label: "High to Low",
                },

                {
                  value: `LtH`,
                  label: "Low to High",
                },
                {
                  value: `WN`,
                  label: "What's New",
                },
                {
                  value: `CR`,

                  label: "Customer Ratings",
                },
                {
                  value: `WL`,

                  label: "Wishlist",
                },
                {
                  value: `C`,

                  label: "Cart",
                },
                {
                  value: `O`,

                  label: "Order",
                },
                {
                  value: `V`,

                  label: "Views",
                },
                {
                  value: `ISLtH`,

                  label: "Stock: Low to High",
                },
                {
                  value: `ISHtL`,

                  label: "Stock: High to Low",
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <hr></hr>
        {isMobileFilterOpen && (
          <button
            type="button"
            className="admin-filter-backdrop"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-label="Close filters"
          />
        )}
        <div className="row admin-product-body">
          <div
            className={`col-2 admin-filter-column ${
              isMobileFilterOpen ? "open" : ""
            }`}
          >
            <div className="admin-mobile-filter-header">
              <p>Filters</p>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                <CloseOutlined />
              </button>
            </div>
            <Filter
              handleBrand={handleBrand}
              handleFrameType={handleFrameType}
              handleShape={handleShape}
              handleGender={handleGender}
              handleColor={handleColor}
              handleSize={handleSize}
              handleCategory={handleCategory}
              brands={brands}
              colors={colors}
              frameTypes={frameTypes}
              sizes={sizes}
              shapes={shapes}
              genders={genders}
              categories={categories}
              ref={refElement}
            />
          </div>
          <div
            className="products col-10 admin-products-column
          "
          >
            <div className="container-fluid">
              <div className="row">
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
              </div>

              <div className="row">
                <div>
                  <EmptyProduct
                    edit={edit}
                    setEdit={setEdit}
                    category={name}
                    brands={brands}
                    categories={categories}
                    colors={colors}
                    frameTypes={frameTypes}
                    sizes={sizes}
                    shapes={shapes}
                    genders={genders}
                  />
                </div>
              </div>
              {show ? (
                <>
                  <div className="row row-cols-3 admin-product-grid">
                    {Products?.ProductsItems?.length !== -1 ? (
                      Products?.ProductsItems?.map((i, index) => {
                        return (
                          <div key={index} className="col my-3">
                            <Product
                              name={name}
                              _id={i?._id}
                              id={i?.productId}
                              Brand={i?.Brand}
                              mPrice={i?.mPrice}
                              size={i?.size}
                              thumnailimages={i?.thumnailimages}
                              images={i?.images}
                              frameType={i?.frameType}
                              color={i?.color}
                              shape={i?.shape}
                              totolratings={i?.totolratings}
                              ratings={i?.ratings}
                              quantity={i?.quantity}
                              productId={i?.productId}
                              gender={i?.gender}
                              category={i?.category}
                              brands={brands}
                              categories={categories}
                              colors={colors}
                              frameTypes={frameTypes}
                              sizes={sizes}
                              shapes={shapes}
                              genders={genders}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <Loader />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <table className="table mt-3">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Image</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Price</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Colors</th>
                        <th scope="col">Shape</th>
                        <th scope="col">Frame</th>
                        <th scope="col">In stock</th>
                        {sortby ? (
                          sortby === "WL" ? (
                            <>
                              <th>Wishlist</th>
                            </>
                          ) : sortby === "C" ? (
                            <>
                              <th>Cart</th>
                            </>
                          ) : sortby === "O" ? (
                            <>
                              <th>Order</th>
                            </>
                          ) : sortby === "V" ? (
                            <>
                              <th>Views</th>
                            </>
                          ) : (
                            <></>
                          )
                        ) : (
                          <></>
                        )}

                        <th scope="col"></th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Products?.ProductsItems?.length !== -1 ? (
                        Products?.ProductsItems?.map((i, index) => {
                          return (
                            <>
                              <tr>
                                <th scope="row">{index + 1}</th>
                                {i?.thumnailimages &&
                                i?.thumnailimages?.length > 0 ? (
                                  <td>
                                    <img
                                      src={i?.thumnailimages[0]?.url}
                                      className="admin-product-table-image"
                                      alt={i?.Brand || "Product"}
                                      onClick={() =>
                                        navigate(
                                          `/admin/products/details/${i?._id}`
                                        )
                                      }
                                    />
                                  </td>
                                ) : (
                                  <td></td>
                                )}
                                <td>{i.Brand}</td>
                                <td>₹{i.mPrice}</td>
                                <td>{i.gender}</td>
                                <td>{i.color} </td>
                                <td>{i.shape}</td>
                                <td>{i.frameType}</td>
                                <td>{i.quantity}</td>
                                {sortby ? (
                                  sortby === "WL" ? (
                                    <>
                                      <td>{i.wishlistcount}</td>
                                    </>
                                  ) : sortby === "C" ? (
                                    <>
                                      <td>{i.cartcount}</td>
                                    </>
                                  ) : sortby === "O" ? (
                                    <>
                                      <td>{i.ordercount}</td>
                                    </>
                                  ) : sortby === "V" ? (
                                    <>
                                      <td>{i.views}</td>
                                    </>
                                  ) : (
                                    <></>
                                  )
                                ) : (
                                  <></>
                                )}

                                <td>
                                  <Productmodal
                                    _id={i._id}
                                    Brand={i.Brand}
                                    mPrice={i.mPrice}
                                    totolratings={i.totolratings}
                                    thumnailimages={i.thumnailimages}
                                    images={i.images}
                                    size={i.size}
                                    color={i.color}
                                    ratings={i.ratings}
                                    frameType={i.frameType}
                                    category={i.category}
                                    quantity={i.quantity}
                                    shape={i.shape}
                                    productId={i.productId}
                                    gender={i.gender}
                                    brands={brands}
                                    categories={categories}
                                    colors={colors}
                                    frameTypes={frameTypes}
                                    sizes={sizes}
                                    shapes={shapes}
                                    genders={genders}
                                  />
                                </td>
                                <td>
                                  {i?.quantity > 0 ? (
                                    <>
                                      <button
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                          dispatch(
                                            UPDATE_PRODUCT({
                                              _id: i._id,
                                              quantity: 0,
                                            })
                                          )
                                        }
                                      >
                                        Go out of stock
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="btn  btn-danger btn-sm"
                                        disabled
                                      >
                                        OUT OF STOCK
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            </>
                          );
                        })
                      ) : (
                        <>
                          <Loader />
                        </>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <div className="py-4">
              <Pagination
                className="admin-pagination"
                current={current}
                onChange={onChange}
                total={Products?.count}
                pageSize={18}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
