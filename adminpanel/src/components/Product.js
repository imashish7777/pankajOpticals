import React from "react";
import "../CSS/Product.css";
import { useDispatch } from "react-redux";
import { UPDATE_PRODUCT } from "../redux/features/product/productSlice";
import Productmodal from "./productmodal";
import { useNavigate } from "react-router-dom";

function Product({
  _id,
  Brand,
  mPrice,
  totolratings,
  images,
  thumnailimages,
  size,
  color,
  ratings,
  frameType,
  category,
  quantity,
  shape,
  productId,
  gender,
  brands,
  colors,
  frameTypes,
  sizes,
  shapes,
  categories,
  genders,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="product admin-product-card">
      <div
        className="product-image-section "
        onClick={() => navigate(`/admin/products/details/${_id}`)}
      >
        {(thumnailimages || []).map((i) => {
          return (
            <>
              <img className="product-image" src={i.url} alt={Brand || "Product"} />
            </>
          );
        })}
      </div>

      <div className="product-details ">
        <p className="fs-6 ">{Brand}</p>
        <p className="text-muted">
          {size} • {shape} • {color}• {frameType} • {gender}
        </p>
        <p className="">₹{mPrice}</p>
        <p>In stock : {quantity}</p>
        <div className="d-flex align-items-center admin-product-rating-pill">
          <div>{totolratings}</div>
          <div className="admin-product-rating-star">
            &#9733;
          </div>
          <div className="admin-product-rating-divider"></div>

          <div className="admin-product-rating-count">{(ratings || []).length}</div>
        </div>
        <div className="d-flex gap-4 mt-2 align-items-center">
          <Productmodal
            _id={_id}
            Brand={Brand}
            mPrice={mPrice}
            thumnailimages={thumnailimages}
            images={images}
            size={size}
            color={color}
            frameType={frameType}
            category={category}
            quantity={quantity}
            shape={shape}
            productId={productId}
            gender={gender}
            brands={brands}
            categories={categories}
            colors={colors}
            frameTypes={frameTypes}
            sizes={sizes}
            shapes={shapes}
            genders={genders}
          />

          {quantity > 0 ? (
            <>
              <button
                className=" btn btn-success btn-sm mt-1"
                onClick={() =>
                  dispatch(UPDATE_PRODUCT({ _id: _id, quantity: 0 }))
                }
              >
                Go Out of stock
              </button>
            </>
          ) : (
            <>
              <button className=" btn btn-danger btn-sm mt-1" disabled>
                Out of stock
              </button>
            </>
          )}
        </div>
        {/* <div>
          <button
            className="btn btn-danger"
            onClick={() => dispatch(DELETE_PRODUCT({ _id: _id }))}
          >
            delete
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Product;
