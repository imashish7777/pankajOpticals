import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaBox } from "react-icons/fa";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  FETCH_ORDER,
  UPDATE_ORDER,
} from "../redux/features/product/orderSlice";
import "../CSS/orderDetailsByAdmin.css";

function OrderDetailsByadmin() {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const { orderId } = useParams();

  useEffect(() => {
    dispatch(FETCH_ORDER({ orderId: orderId }));
  }, [dispatch, orderId]);

  ///ant d //

  const items = [
    {
      key: "1",
      label: (
        <a
          href="/admin/customers/orders/details"
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              UPDATE_ORDER({ orderId: orderId, orderStatus: "Dispatched" })
            );
          }}
        >
          Dispatched
        </a>
      ),
    },

    {
      key: "2",
      label: (
        <a
          href="/admin/customers/orders/details"
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              UPDATE_ORDER({ orderId: orderId, orderStatus: "Delivered" })
            );
          }}
        >
          Delivered
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          href="/admin/customers/orders/details"
          onClick={(e) => {
            e.preventDefault();
            dispatch(UPDATE_ORDER({ orderId: orderId, orderStatus: "Return" }));
          }}
        >
          Return
        </a>
      ),
    },
    {
      key: "4",
      danger: true,
      label: (
        <a
          href="/admin/customers/orders/details"
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              UPDATE_ORDER({ orderId: orderId, orderStatus: "Cancelled" })
            );
          }}
        >
          Cancelled
        </a>
      ),
      icon: <SmileOutlined />,
    },
  ];

  return (
    <>
      <div className="order-details">
        {order?.orderItem ? (
          <>
            <div className="container-fluid pt-2 ">
              <div className="row pt-3 admin-order-line-tight">
                <div className="d-flex">
                  <div className="admin-order-main-width">
                    <div>
                      <Dropdown
                        menu={{
                          items,
                        }}
                      >
                        <a
                          href="/admin/customers/orders/details"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Space>
                            {order.orderItem.orderStatus}
                            <DownOutlined />
                          </Space>
                        </a>
                      </Dropdown>
                    </div>

                    <p className="admin-text-end">
                      shippingID : {order.orderItem?.paymentIntet?.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row row-cols-3 ps-4 admin-border-light">
                {order?.orderItem?.products?.map((i) => {
                  return (
                    <>
                      <div className="col mt-2 d-flex admin-order-product-card">
                        <div className="admin-overflow-hidden">
                          <img
                            src={i?.product?.images[0]}
                            className="admin-order-product-image"
                            alt={i?.product?.Brand || "Product"}
                          />

                          <div className="mt-4 admin-order-line-compact">
                            <p className="admin-font-20">
                              {i?.product?.Brand}
                            </p>
                            <p className="admin-font-13">
                              {i?.product?.frameType} • {i?.product?.shape}
                            </p>
                            <p className="text-muted">
                              Color: {i?.product?.color}
                            </p>

                            <p className="text-muted">
                              Size : {i?.product?.size}
                            </p>
                            <p className="text-muted">
                              Price: ₹{i?.product?.mPrice}, QYT:{i?.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>

              {/* order status div */}
              <div className="row admin-border-light">
                <div className="p-2 ps-4 admin-order-status-banner">
                  <p>
                    <FaBox /> {order.orderItem?.orderStatus}
                  </p>
                  <p>
                    On{" "}
                    {order?.orderItem?.orderStatus === "ordered"
                      ? order.orderItem?.orderDate
                      : order?.orderItem?.updatedDate}
                  </p>
                </div>

                {/* address div */}

                <div className="admin-order-address-block">
                  <p className="admin-order-address-title">
                    Delivery Address
                  </p>
                  <p className="admin-px-10">
                    {order.orderItem?.shippingAddress?.firstname}{" "}
                    {order.orderItem?.shippingAddress?.lastname}
                    {" / "}
                    {order.orderItem?.shippingAddress?.phone}
                  </p>
                  <p className="text-muted admin-px-10">
                    {order.orderItem?.shippingAddress?.addresslineOne}
                    {", "}
                    {order.orderItem?.shippingAddress?.addresslineTwo}
                    {", "}
                    {order.orderItem?.shippingAddress?.city}
                    {", "}
                    {order.orderItem?.shippingAddress?.zip}
                  </p>
                </div>
                <hr></hr>

                {/* price div */}

                <div className="admin-order-price-row">
                  <div className="admin-order-price-copy">
                    <p className="admin-font-15">Total Order Price</p>
                    {order.orderItem?.bill?.discount !== 0 ? (
                      <div className="d-flex">
                        You Saved
                        <p className="admin-success-inline">
                          ₹{order.orderItem?.bill?.discount}
                        </p>{" "}
                        on this order
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <p className="admin-order-final-price">
                    ₹{order.orderItem?.bill?.finalAmout}
                  </p>
                </div>

                {/* payment method div */}

                <div className="admin-order-payment-box">
                  {order.orderItem?.paymentIntet?.method === "COD" ? (
                    <p className="text-muted">Cash on Delivery</p>
                  ) : (
                    <></>
                  )}
                </div>
                <hr></hr>

                {/* orderID div */}

                <div className="">
                  <p className="text-muted">
                    OrderID : {order.orderItem?.paymentIntet?.id}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>{/* <Loader/> */}</>
        )}
      </div>
    </>
  );
}

export default OrderDetailsByadmin;
