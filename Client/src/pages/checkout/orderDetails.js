import { API_BASE_URL } from "../../utilies/base_URL";
import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import "../../CSS/orders.css";

import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaBox } from "react-icons/fa";
import Skelton from "../../component/skelton";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import { GIVE_RATINGS } from "../../redux/features/product/ratingsSlice";

function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState({});

  const token = localStorage.getItem("token");

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/order/fetchorderdetails`,
        data: { orderId },
        headers: {
          "x-auth-token": token,
        },
      });

      if (response?.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) {
    return <Skelton type="order-details" />;
  }

  if (!order) {
    return (
      <div className="order-details">
        <div className="order-details-shell">
          <p className="order-details-empty">Order details not found.</p>
        </div>
      </div>
    );
  }

  const isPending = order.orderStatus === "payment pending";
  const displayDate = isPending
    ? order.orderDate
    : order?.paymentIntet?.paymentDate || order.updatedDate || order.orderDate;
  const shippingAddress = order.shippingAddress || {};
  const bill = order.bill || {};
  const payment = order.paymentIntet || {};
  const finalAmount = bill.finalAmout || bill.totalprice || 0;

  return (
    <div className="order-details">
      <div className="order-details-shell">
        <nav aria-label="breadcrumb" className="order-details-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Products</Link>
            </li>

            <li className="breadcrumb-item">
              <Link to="/orders">Orders</Link>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              Details
            </li>
          </ol>
        </nav>

        <section className="order-details-hero">
          <div>
            <p className="orders-eyebrow">Order details</p>
            <h2>Order Summary</h2>
            <p className="order-details-id">Order ID: {payment.id || order._id}</p>
          </div>

          <span className={`order-status ${isPending ? "pending" : "success"}`}>
            <FaBox /> {order.orderStatus}
          </span>
        </section>

        <div className="order-details-grid">
          <section className="order-details-card order-details-products">
            <div className="order-details-card-header">
              <h3>Products</h3>
              <span>{order.products?.length || 0} item(s)</span>
            </div>

            <div className="order-details-product-list">
              {order.products?.map((item) => {
                const product = item.product || {};
                const image =
                  product?.thumnailimages?.[0]?.url ||
                  product?.images?.[0]?.url ||
                  product?.images?.[0];

                return (
                  <div className="order-details-product" key={product._id || item._id}>
                    {product._id ? (
                      <Link
                        to={`/details/${product._id}`}
                        className="order-details-image"
                        aria-label={`View ${product.Brand || "product"} details`}
                      >
                        {image && <img src={image} alt={product.Brand} />}
                      </Link>
                    ) : (
                      <div className="order-details-image">
                        {image && <img src={image} alt={product.Brand} />}
                      </div>
                    )}

                    <div className="order-details-product-info">
                      <p className="order-brand">{product.Brand}</p>
                      <p className="order-description">
                        {product.color} {product.frameType} {product.shape}
                      </p>
                      <p className="order-meta">
                        Size: {product.size} | Quantity: {item.quantity}
                      </p>
                      <p className="order-details-price">₹{product.mPrice}</p>

                      <Formik
                        initialValues={{
                          rating: "",
                          comment: "",
                          productId: product._id,
                        }}
                        onSubmit={(values, onSubmitProps) => {
                          dispatch(GIVE_RATINGS(values));
                          onSubmitProps.resetForm();
                          setHover((prev) => ({
                            ...prev,
                            [product._id]: null,
                          }));
                        }}
                      >
                        {(formik) => (
                          <Form className="order-rate-form">
                            <div className="order-rate-stars">
                              {[...Array(5)].map((_, index) => {
                                const currentRating = index + 1;

                                return (
                                  <label key={index}>
                                    <Field
                                      className="hidden-radio"
                                      type="radio"
                                      name="rating"
                                      value={currentRating}
                                    />

                                    <span
                                      className={`review-star ${
                                        currentRating <= hover[product._id]
                                          ? "active-star"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        setHover((prev) => ({
                                          ...prev,
                                          [product._id]: currentRating,
                                        }))
                                      }
                                    >
                                      &#9733;
                                    </span>
                                  </label>
                                );
                              })}
                            </div>

                            <div className="order-rate-input-row">
                              <Field
                                type="text"
                                className="form-control"
                                placeholder="Write review..."
                                name="comment"
                              />

                              <button
                                className="btn submit-review-btn"
                                type="submit"
                                disabled={!formik.dirty}
                              >
                                Rate
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="order-details-side">
            <section className="order-details-card">
              <div className="order-details-card-header">
                <h3>Status</h3>
              </div>

              <div className="order-info-list">
                <div>
                  <span>Status</span>
                  <strong>{order.orderStatus}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{displayDate || "N/A"}</strong>
                </div>
                <div>
                  <span>Payment</span>
                  <strong>{payment.method || "Pending"}</strong>
                </div>
              </div>
            </section>

            <section className="order-details-card">
              <div className="order-details-card-header">
                <h3>Delivery Address</h3>
              </div>

              {typeof shippingAddress === "string" ? (
                <p className="order-details-muted">{shippingAddress}</p>
              ) : (
                <div className="order-address">
                  <strong>
                    {shippingAddress.firstname} {shippingAddress.lastname}
                  </strong>
                  <p>{shippingAddress.phone}</p>
                  <p>
                    {shippingAddress.addresslineOne}, {shippingAddress.addresslineTwo}
                  </p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                  </p>
                </div>
              )}
            </section>

            <section className="order-details-card">
              <div className="order-details-card-header">
                <h3>Price Details</h3>
              </div>

              <div className="order-bill">
                <div>
                  <span>Item total</span>
                  <strong>₹{bill.totalprice || 0}</strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong className="text-primary">-₹{bill.discount || 0}</strong>
                </div>
                <div className="order-bill-total">
                  <span>Total paid</span>
                  <strong>₹{finalAmount}</strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default React.memo(OrderDetails);
