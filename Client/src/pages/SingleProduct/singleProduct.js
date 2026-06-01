import { API_BASE_URL } from "../../utilies/base_URL";
import React, { useEffect, useState } from "react";

import "../../CSS/singleProduct.css";

import { useDispatch, useSelector } from "react-redux";

import { useParams, Link } from "react-router-dom";

import { ADD_TO_CART } from "../../redux/features/product/cartSlice";

import {
  FETCH_RATINGS,
} from "../../redux/features/product/ratingsSlice";

import Skelton from "../../component/skelton";

import { ADD_TO_WISHLIST } from "../../redux/features/product/wishlistSlice";

import axios from "axios";

import SimilarProduct from "../../component/similarProduct";

import {
  BsHeart,
  BsCart,
} from "react-icons/bs";

function SingleProduct() {
  const [products, setProducts] =
    useState(null);

  const [
    similarProudct,
    setSimilarProudct,
  ] = useState([]);

  const ratings = useSelector(
    (state) => state.ratings
  );
  const reviewItems =
    ratings?.ratings?.ratings || [];
  const totalRatings =
    ratings?.ratings?.totolratings || 0;

  const dispatch = useDispatch();

  const { id } = useParams();

  const scrollSimilarProducts = (amount) => {
    const container = document.querySelector(".similar-products-scroll");
    container?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  // fetch product
  const fetchproduct = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/product/details/${id}`
      );

      const postData = response.data;

      setProducts(postData);

      fetchsimilarproudct({
        shape: postData.shape,
        category: postData.category,
        gender: postData.gender,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // fetch similar product
  const fetchsimilarproudct = async (
    similar
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/product/fetchsimilarproudct`,
        similar
      );

      setSimilarProudct(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchproduct();

    dispatch(FETCH_RATINGS(id));

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // loading
  if (!products) {
    return <Skelton type="product-details" />;
  }

  return (
    <div className="singleProduct">
      {/* breadcrumb */}

      <nav
        aria-label="breadcrumb"
        className="breadcrumb-nav ms-3"
      >
        <ol className="breadcrumb mt-2">
          <Link
            to="/"
            className="breadcrumb-item"
          >
            Products
          </Link>

          <Link
            to="/products/Eyeglasses"
            className="breadcrumb-item"
          >
            {products.category}
          </Link>

          <Link className="breadcrumb-item active">
            Details
          </Link>
        </ol>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* images */}

          <div className="col-8">
            <div className="row row-cols-2 mx-4">
              {products?.thumnailimages?.map(
                (i) => (
                  <div
                    className="col my-4 product-image-wrapper"
                    key={i.url}
                  >
                    <img
                      className="image product-image-card"
                      alt=""
                      src={i.url}
                    />
                  </div>
                )
              )}

              {products?.images?.map(
                (i) => (
                  <div
                    className="col my-4 product-image-wrapper"
                    key={i._public_id}
                  >
                    <img
                      className="image product-image-card"
                      alt=""
                      src={i.url}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* product details */}

          <div className="product-details-section col-4 my-4">
            <div className="product-details-panel">
              <div className="details">
                <p className="brand-name fs-5">
                  {products.Brand}
                </p>

                <p className="type fs-6 text-muted">
                  {products.color}{" "}
                  {products.frameType}{" "}
                  {products.shape}
                </p>

                {/* rating */}

                <div className="rating-box d-flex align-items-center">
                  <div>
                    {totalRatings}
                  </div>

                  <div className="rating-star">
                    &#9733;
                  </div>

                  <div className="rating-divider"></div>

                  <div className="rating-count">
                    {reviewItems.length}
                  </div>
                </div>

                <p className="price fs-5">
                  ₹{products.mPrice}
                </p>

                <p className="size text-muted fs-6">
                  Size : {products.size}
                </p>
              </div>

              {/* product info */}

              <div className="imformation-section">
                <div className="imformation">
                  <p className="fs-6 fw-semibold bold">
                    Product Details
                  </p>

                  <div className="product-spec-grid">
                    <div>
                      <span>Size</span>
                      <strong>{products.size}</strong>
                    </div>

                    <div>
                      <span>Frame</span>
                      <strong>{products.frameType}</strong>
                    </div>

                    <div>
                      <span>Color</span>
                      <strong>{products.color}</strong>
                    </div>

                    <div>
                      <span>Shape</span>
                      <strong>{products.shape}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* buttons */}

              <div className="product-action-row">
                <button
                  className="addtocart btn"
                  type="button"
                  onClick={() =>
                    dispatch(
                      ADD_TO_CART({
                        productId:
                          products._id,

                        mPrice:
                          products.mPrice,
                      })
                    )
                  }
                >
                  <BsCart /> Add to Cart
                </button>

                <button
                  className="btn addtocart wishlist-btn"
                  type="button"
                  onClick={() =>
                    dispatch(
                      ADD_TO_WISHLIST({
                        productId:
                          products._id,
                      })
                    )
                  }
                >
                  <BsHeart /> Wishlist
                </button>
              </div>
            </div>

            {/* reviews */}

            <div className="review-section">
              <div className="review-title-row">
                <p className="review-heading">
                  Customer Reviews
                </p>

                <span>
                  {reviewItems.length}
                </span>
              </div>

              <div className="ratings">
                {reviewItems.length ? (
                  reviewItems.map((i) => (
                  <div
                    key={i._id}
                    className="review-card"
                  >
                    <div className="review-user">
                      {
                        i.postedby
                          ?.firstname
                      }{" "}
                      {
                        i.postedby
                          ?.lastname
                      }
                    </div>

                    <div>
                      <span className="review-rating">
                        {[
                          ...Array(
                            i?.star
                          ),
                        ].map(
                          (
                            _,
                            index
                          ) => (
                            <span
                              key={
                                index
                              }
                            >
                              &#9733;
                            </span>
                          )
                        )}
                      </span>
                    </div>

                    <div className="review-comment">
                      {i?.comment}
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="review-empty">
                    <div className="review-empty-rating">
                      <span>{totalRatings}</span>
                      <span className="rating-star">&#9733;</span>
                      <span className="rating-divider"></span>
                      <span className="rating-count">0</span>
                    </div>
                    <p>No reviews yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* similar products */}

      <div className="container-fluid similar-products-section">
        <div className="similar-products-header">
          <h4>Similar Products</h4>

          <div className="similar-scroll-actions">
            <button
              type="button"
              onClick={() => scrollSimilarProducts(-260)}
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => scrollSimilarProducts(260)}
            >
              →
            </button>
          </div>
        </div>

        <div className="similar-products-wrap">
          <div className="similar-products-scroll">
            {similarProudct?.map((i) => {
              const thumnailimages =
                i?.thumnailimages?.[0];

              return (
                <div
                  key={i._id}
                  className="similar-products-item"
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior:
                        "smooth",
                    })
                  }
                >
                  <SimilarProduct
                    _id={i._id}
                    id={i.productId}
                    Brand={i.Brand}
                    mPrice={i.mPrice}
                    size={i.size}
                    thumnailimages={
                      thumnailimages
                    }
                    frameType={
                      i.frameType
                    }
                    color={i.color}
                    shape={i.shape}
                    totolratings={
                      i.totolratings
                    }
                    ratings={i.ratings}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
