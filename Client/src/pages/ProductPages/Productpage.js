import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";

import Product from "../../component/Product";
import "../../CSS/productpage.css";

import { useParams } from "react-router-dom";
import Skelton from "../../component/skelton";

import { useSelector, useDispatch } from "react-redux";
import { FETCH_PRODUCTS } from "../../redux/features/product/productSlice";
import { FETCH_PROPERTIES } from "../../redux/features/product/propertiesSlice";

import { Pagination, Select, Tag } from "antd";
import { BsSliders, BsX } from "react-icons/bs";

/* ================= FILTER ================= */

const Filter = forwardRef(({ filters, handlers }, ref) => {
  useImperativeHandle(ref, () => ({
    getUncheck(value) {
      const el = document.getElementById(value);
      if (el) el.checked = false;
    },
  }));

  const renderFilter = (title, data, handler) => {
    const id = title.replace(/\s/g, "").toLowerCase();

    return (
      <div className="filter-block">

        {/* dropdown toggle */}
        <input type="checkbox" id={id} className="filter-toggle" />

        <label htmlFor={id} className="filter-title">
          {title}
          <span className="arrow">▼</span>
        </label>

        {/* content */}
        <div className="filter-content">
          {data?.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                value={item}
                id={item}
                onChange={handler}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="filter">
      {renderFilter("FRAME TYPE", filters.frameTypes, handlers.handleFrameType)}
      {renderFilter("SHAPE", filters.shapes, handlers.handleShape)}
      {renderFilter("BRAND", filters.brands, handlers.handleBrand)}
      {renderFilter("SIZE", filters.sizes, handlers.handleSize)}
      {renderFilter("COLOR", filters.colors, handlers.handleColor)}
      {renderFilter("GENDER", filters.genders, handlers.handleGender)}
    </div>
  );
});

/* ================= PAGE ================= */

export default function Productpage() {
  const dispatch = useDispatch();
  const { name } = useParams();
  const refElement = useRef();

  const Products = useSelector((state) => state.product);
  const properties = useSelector((state) => state.properties);

  const [current, setCurrent] = useState(1);
  const [sortby, setSortby] = useState();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [frameType, setFrameType] = useState([]);
  const [shape, setShape] = useState([]);
  const [Brand, setBrand] = useState([]);
  const [gender, setGender] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);

  const propertyData = properties?.properties?.[0] || {};
  const { brands, colors, frameTypes, sizes, shapes, genders } = propertyData;

  const showingCount = Products?.limit || 20;
  const routeFilter = useMemo(() => {
    const normalizedName = name?.toLowerCase() || "";

    const presets = {
      eyeglasses: {
        label: "Eyeglasses",
        searchstring: "",
        category: [{ category: "eyeglasses" }],
        gender: [],
      },
      sunglasses: {
        label: "Sunglasses",
        searchstring: "",
        category: [{ category: "sunglasses" }],
        gender: [],
      },
      computerglasses: {
        label: "Computer Glasses",
        searchstring: "",
        category: [{ category: "computerglasses" }],
        gender: [],
      },
      menssunglasses: {
        label: "Men's Sunglasses",
        searchstring: "",
        category: [{ category: "sunglasses" }],
        gender: [{ gender: "male" }],
      },
      womenssunglasses: {
        label: "Women's Sunglasses",
        searchstring: "",
        category: [{ category: "sunglasses" }],
        gender: [{ gender: "female" }],
      },
    };

    return (
      presets[normalizedName] || {
        label: name,
        searchstring: name,
        category: [],
        gender: [],
      }
    );
  }, [name]);

  const lowerbound = (current - 1) * showingCount + 1;
  const upperbound = Math.min(lowerbound + showingCount - 1, Products?.count || 0);

  const updateFilter = (checked, value, state, setter, key) => {
    setCurrent(1);

    if (checked) {
      setter([...state, { [key]: value }]);
    } else {
      setter(state.filter((i) => i[key] !== value));
    }
  };

  const removeFilter = (value, state, setter, key) => {
    setCurrent(1);
    setter(state.filter((i) => i[key] !== value));
    refElement.current.getUncheck(value);
  };

  const handleFrameType = (e) =>
    updateFilter(e.target.checked, e.target.value, frameType, setFrameType, "frameType");

  const handleShape = (e) =>
    updateFilter(e.target.checked, e.target.value, shape, setShape, "shape");

  const handleBrand = (e) =>
    updateFilter(e.target.checked, e.target.value, Brand, setBrand, "Brand");

  const handleGender = (e) =>
    updateFilter(e.target.checked, e.target.value, gender, setGender, "gender");

  const handleColor = (e) =>
    updateFilter(e.target.checked, e.target.value, color, setColor, "color");

  const handleSize = (e) =>
    updateFilter(e.target.checked, e.target.value, size, setSize, "size");

  const searchObj = useMemo(
    () => ({
      searchstring: routeFilter.searchstring,
      frameType,
      shape,
      Brand,
      size,
      category: routeFilter.category,
      gender: routeFilter.gender.length ? routeFilter.gender : gender,
      color,
      current,
      sortby,
    }),
    [routeFilter, frameType, shape, Brand, size, gender, color, current, sortby]
  );

  useEffect(() => {
    setCurrent(1);
  }, [name]);

  useEffect(() => {
    dispatch(FETCH_PRODUCTS(searchObj));
  }, [dispatch, searchObj]);

  useEffect(() => {
    dispatch(FETCH_PROPERTIES());
  }, [dispatch]);

  return (
    <div className="product-page">

      {/* HEADER */}
      <div className="products-header">

        <p className="result-title">
          Showing {lowerbound}-{upperbound} of {Products?.count} for{" "}
          <span className="result-name">{routeFilter.label}</span>
        </p>

        <div className="filter-tags">
          {Brand.map((i) => (
            <Tag key={i.Brand} closable onClose={() => removeFilter(i.Brand, Brand, setBrand, "Brand")}>
              {i.Brand}
            </Tag>
          ))}
        </div>

        <div className="mobile-actions">
          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Open filters"
          >
            <BsSliders />
            Filter
          </button>

          <div className="sort-section">
            <p className="sort-title">Sort By:</p>

            <Select
              defaultValue="R"
              className="sort-select"
              onChange={(value) => {
                setSortby(value);
                setCurrent(1);
              }}
              options={[
                { value: "R", label: "Recommended" },
                { value: "HtL", label: "High to Low" },
                { value: "LtH", label: "Low to High" },
                { value: "WN", label: "What's New" },
                { value: "CR", label: "Customer Ratings" },
              ]}
            />
          </div>
        </div>
      </div>

      <hr />

      {/* LAYOUT */}
      <div className="layout">

        {/* FILTER */}
        {isMobileFilterOpen && (
          <button
            type="button"
            className="filter-backdrop"
            aria-label="Close filters"
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}

        <aside className={`filter-section ${isMobileFilterOpen ? "open" : ""}`}>
          <div className="mobile-filter-header">
            <p>Filters</p>
            <button
              type="button"
              className="mobile-filter-close"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-label="Close filters"
            >
              <BsX />
            </button>
          </div>

          <Filter
            ref={refElement}
            filters={{ brands, colors, frameTypes, sizes, shapes, genders }}
            handlers={{
              handleBrand,
              handleFrameType,
              handleShape,
              handleGender,
              handleColor,
              handleSize,
            }}
          />
        </aside>

        {/* PRODUCTS */}
        <section className="products-section">

          {Products?.loading ? (
            <Skelton type="product-grid" count={8} />
          ) : Products?.ProductsItems?.length > 0 ? (
            <div className="products-grid">
              {Products.ProductsItems.map((i) => (
                <Product key={i._id} {...i} />
              ))}
            </div>
          ) : (
            <div className="no-products-found">
              <p>No items found</p>
              <span>Try changing your search or filters.</span>
            </div>
          )}

          <div className="pagination-wrapper">
            <Pagination
              current={current}
              onChange={(p) => {
                setCurrent(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              total={Products?.count}
              pageSize={20}
            />
          </div>

        </section>
      </div>
    </div>
  );
}
