import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  memo,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { GrNext } from "react-icons/gr";

import { GiCardboardBoxClosed } from "react-icons/gi";

import { useSelector, useDispatch } from "react-redux";

import { FETCH_ORDERS } from "../../redux/features/product/orderSlice";

import { PLACE_ORDER } from "../../redux/features/product/placeOrderSlice";

import { PageInfo, Page500 } from "../ResultPages/ResultPage";

import Skelton from "../../component/skelton";
import Pagination from "../../component/Pagination";
import "../../CSS/orders.css";

const ORDERS_PER_PAGE = 6;

const parseDateTime = (value) => {
  if (!value) return 0;

  const valueString = String(value).trim();
  const customDateParts = valueString.match(
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?/i,
  );

  if (customDateParts) {
    const [
      ,
      day,
      month,
      year,
      hour = "0",
      minute = "0",
      second = "0",
      meridiem,
    ] = customDateParts;

    const fullYear =
      year.length === 2 ? `20${year}` : year;

    let hours = Number(hour);

    if (meridiem?.toUpperCase() === "PM" && hours < 12) {
      hours += 12;
    }

    if (meridiem?.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return new Date(
      Number(fullYear),
      Number(month) - 1,
      Number(day),
      hours,
      Number(minute),
      Number(second),
    ).getTime();
  }

  const parsedDate = Date.parse(valueString);

  return Number.isNaN(parsedDate) ? 0 : parsedDate;
};

const getObjectIdTime = (id) => {
  if (!/^[a-f\d]{24}$/i.test(id || "")) return 0;

  return parseInt(id.slice(0, 8), 16) * 1000;
};

const getOrderDateValue = (order) => {
  const dateCandidates = [
    order?.createdAt,
    order?.paymentIntet?.paymentDate ||
      order?.paymentIntent?.paymentDate,
    order?.updatedAt,
    order?.updatedDate ||
      order?.orderDate,
  ];

  const parsedDate = dateCandidates
    .map(parseDateTime)
    .find(Boolean);

  return (
    parsedDate ||
    getObjectIdTime(order?._id)
  );
};

function Orders() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const orders = useSelector((state) => state.order);

  const orderList = useMemo(
    () => orders?.orderItems?.order || [],
    [orders?.orderItems?.order],
  );

  const sortedOrders = useMemo(
    () =>
      [...orderList].sort(
        (a, b) =>
          getOrderDateValue(b) -
          getOrderDateValue(a),
      ),
    [orderList],
  );

  const totalPages = Math.ceil(
    sortedOrders.length / ORDERS_PER_PAGE,
  );

  const paginatedOrders = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ORDERS_PER_PAGE;

    return sortedOrders.slice(
      startIndex,
      startIndex + ORDERS_PER_PAGE,
    );
  }, [currentPage, sortedOrders]);

  // handle order click
  const handleOrderClick = useCallback(
    ({ orderStatus, orderId }) => {
      if (orderStatus === "payment pending") {
        dispatch(
          PLACE_ORDER({
            orderId,
          }),
        );

        navigate("/checkout");
      } else {
        navigate(`details/${orderId}`);
      }
    },
    [dispatch, navigate],
  );

  // fetch orders
  useEffect(() => {
    dispatch(FETCH_ORDERS());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [orderList.length]);

  // loading
  if (orders?.loading) {
    return <Skelton type="list" count={3} />;
  }

  // error
  if (orders?.status >= 500) {
    return <Page500 />;
  }

  // empty
  if (!orderList.length) {
    return (
      <div className="orders-empty-page">
        <PageInfo description="No orders found" buttonName="Continue Shopping" />
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Products</Link>
            </li>

            <li className="breadcrumb-item">
              <Link to="/cart">Cart</Link>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              Orders
            </li>
          </ol>
        </nav>

        <div className="orders-title-row">
          <div>
            <p className="orders-eyebrow">Order history</p>
            <h2>My Orders</h2>
          </div>

          <span className="orders-count">
            {sortedOrders.length}{" "}
            {sortedOrders.length === 1
              ? "order"
              : "orders"}
          </span>
        </div>
      </div>

      <main className="orders-body">
        <div className="orders-list">
          {paginatedOrders.map((Item) =>
            Item.products.map((i) => {
              const isPending = Item.orderStatus === "payment pending";
              const orderDate = isPending
                ? Item.orderDate
                : Item?.paymentIntet?.paymentDate || Item.updatedDate;

              return (
                <button
                  key={`${Item._id}-${i.product?._id}`}
                  type="button"
                  className="order-card"
                  onClick={() =>
                    handleOrderClick({
                      orderStatus: Item.orderStatus,
                      orderId: Item._id,
                    })
                  }
                >
                  <div className="order-card-top">
                    <span className="order-icon">
                      <GiCardboardBoxClosed />
                    </span>

                    <div className="order-status-text">
                      <span
                        className={`order-status ${
                          isPending ? "pending" : "success"
                        }`}
                      >
                        {Item.orderStatus}
                      </span>
                      <p>On {orderDate}</p>
                    </div>

                    <span className="order-arrow">
                      <GrNext />
                    </span>
                  </div>

                  <div className="order-product">
                    <div className="order-image-box">
                      <img
                        src={i.product?.thumnailimages?.[0]?.url}
                        alt={i.product?.Brand}
                      />
                    </div>

                    <div className="order-product-details">
                      <p className="order-brand">{i.product?.Brand}</p>
                      <p className="order-description">
                        {i.product?.color} {i.product?.frameType}{" "}
                        {i.product?.shape}
                      </p>
                      <p className="order-meta">
                        Size: {i.product?.size} | Quantity: {i.quantity}
                      </p>
                    </div>
                  </div>
                </button>
              );
            }),
          )}
        </div>

        {totalPages > 1 && (
          <div className="orders-pagination">
            <Pagination
              current={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default memo(Orders);
