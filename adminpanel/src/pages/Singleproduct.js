import { API_BASE_URL } from "../utilies/base_URL";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/loader";
import "../CSS/Singleproduct.css";

function SingleProduct() {
  const [products, setProducts] = useState();
  const { id } = useParams();

  const fetchproduct = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/products/details/${id}`
      );
      const postData = await response.json();
      setProducts(postData);
    } catch (error) {}
  };

  useEffect(() => {
    fetchproduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!products) {
    return <Loader />;
  }

  const imageItems = [
    ...(products?.thumnailimages || []),
    ...(products?.images || []),
  ];
  const reviewItems = products?.ratings || [];
  const statItems = [
    { label: "Ratings", value: products?.totolratings || 0 },
    { label: "Views", value: products?.views || 0 },
    { label: "Wishlisted", value: products?.wishlistcount || 0 },
    { label: "In cart", value: products?.cartcount || 0 },
    { label: "Orders", value: products?.ordercount || 0 },
  ];

  return (
    <div key={products?._id} className="singleProduct admin-single-product">
      <div className="admin-single-header">
        <div>
          <p>{products?.category}</p>
          <h3>{products?.Brand}</h3>
        </div>
        <span>Product ID: {products?.productId}</span>
      </div>

      <div className="container-fluid">
        <div className="row admin-single-main">
          <div className="col-8 admin-single-images">
            <div className="admin-single-image-grid">
              {imageItems.map((i, index) => (
                <div
                  className="admin-single-image-card"
                  key={i?.url || i?.public_id || index}
                >
                  <img
                    className="admin-single-product-image"
                    alt={products?.Brand || "Product"}
                    src={i?.url}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="product-details-section col-4 my-4">
            <div className="product-details-panel">
              <div className="details">
                <p className="brand-name fs-5">{products?.Brand}</p>
                <p className="type fs-6 text-muted">
                  {products?.color} {products?.frameType} {products?.shape}
                </p>

                <div className="rating-box">
                  <div>{products?.totolratings || 0}</div>
                  <div className="rating-star">&#9733;</div>
                  <div className="rating-divider"></div>
                  <div className="rating-count">{reviewItems.length}</div>
                </div>

                <p className="price fs-5">Rs. {products?.mPrice}</p>
                <p className="size text-muted fs-6">Size : {products?.size}</p>
              </div>

              <div className="admin-product-stat-grid">
                {statItems.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="imformation-section">
                <div className="imformation">
                  <p className="fs-6 fw-semibold bold">Product Details</p>

                  <div className="product-spec-grid">
                    <div>
                      <span>Product ID</span>
                      <strong>{products?.productId}</strong>
                    </div>
                    <div>
                      <span>Size</span>
                      <strong>{products?.size}</strong>
                    </div>
                    <div>
                      <span>Frame</span>
                      <strong>{products?.frameType}</strong>
                    </div>
                    <div>
                      <span>Color</span>
                      <strong>{Array.isArray(products?.color) ? products.color.join(", ") : products?.color}</strong>
                    </div>
                    <div>
                      <span>Shape</span>
                      <strong>{products?.shape}</strong>
                    </div>
                    <div>
                      <span>Gender</span>
                      <strong>{products?.gender}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-section">
              <div className="review-title-row">
                <p className="review-heading">Customer Reviews</p>
                <span>{reviewItems.length}</span>
              </div>

              <div className="ratings">
                {reviewItems.length ? (
                  reviewItems.map((i, index) => (
                    <div key={i?._id || index} className="review-card">
                      <div className="review-user">
                        {i?.postedby?.firstname} {i?.postedby?.lastname}
                      </div>
                      <div>
                        <span className="review-rating">
                          {[...Array(i?.star || 0)].map((_, starIndex) => (
                            <span key={starIndex}>&#9733;</span>
                          ))}
                        </span>
                      </div>
                      <div className="review-comment">{i?.comment}</div>
                    </div>
                  ))
                ) : (
                  <div className="review-empty">
                    <div className="review-empty-rating">
                      <span>{products?.totolratings || 0}</span>
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

    </div>
  );
}

export default SingleProduct;
