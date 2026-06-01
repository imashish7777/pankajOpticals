import React, {
  useState,
  useCallback,
  memo,
} from "react";

import { RiHeart3Fill } from "react-icons/ri";

import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";

import "../CSS/product.css";

import { ADD_TO_WISHLIST,REMOVE_FROM_WISHLIST } from "../redux/features/product/wishlistSlice";

import { ADD_TO_CART } from "../redux/features/product/cartSlice";

function Product({
  _id,
  Brand,
  mPrice,
  totolratings,
  thumnailimages = [],
  size,
  color,
  ratings = [],
  hearted,
}) {
  const dispatch = useDispatch();
  if (!hearted) {
    hearted = false;
  }

  const [toggleHeart, setToggleHeart] =
    useState(hearted);

  // wishlist
  const handleWishlist =
    useCallback(() => {
      setToggleHeart((prev) => {
        const updated = !prev;

        if (updated) {
          dispatch(
            ADD_TO_WISHLIST({
              productId: _id,
            })
          );
        }
          else{
            dispatch(
              REMOVE_FROM_WISHLIST({
                productId: _id,
              })
            );
          }

        return updated;
      }
      );
    }, [dispatch, _id]);

  // add to cart
  const handleAddToCart =
    useCallback(() => {
      dispatch(
        ADD_TO_CART({
          productId: _id,
          mPrice,
        })
      );
    }, [dispatch, _id, mPrice]);

  return (
    <div className="product">

      {/* wishlist */}

      <RiHeart3Fill
        role="button"
        tabIndex={0}
        className={
          toggleHeart
            ? "heart active"
            : "heart"
        }
        onClick={handleWishlist}
      />

      {/* product image */}

      <Link to={`/details/${_id}`}>
        <div className="product-image-section">
          <img
            className="product-image"
            src={thumnailimages?.[0]?.url}
            alt={Brand}
            loading="lazy"
          />
        </div>
      </Link>

      {/* product details */}

      <div className="product-details">

        <p className="product-brand">
          {Brand}
        </p>

        <p className="product-meta text-muted">
          Size: {size} • {color}
        </p>

        <p className="product-price">
          ₹{mPrice}
        </p>

        {/* ratings */}

        <div className="product-rating">

          <div>
            {totolratings}
          </div>

          <div className="rating-star">
            ★
          </div>

          <div className="rating-divider"></div>

          <div className="rating-count">
            {ratings?.length}
          </div>
        </div>
      </div>

      {/* add to cart */}

      <button
        type="button"
        onClick={handleAddToCart}
        className="btn addtocartButton"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default memo(Product);