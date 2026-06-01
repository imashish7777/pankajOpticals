import React, { useEffect, useCallback, useRef, useState } from "react";
import "../../CSS/cart.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PriceDetails from "./PriceDetails";
import CouponBox from "./CouponBox";
import Button from "../../component/button";
import Skelton from "../../component/skelton";

import {
  FETCH_CART,
  REMOVE_FROM_CART,
  DECREMENT,
  INCREMENT,
  emptycart,
} from "../../redux/features/product/cartSlice";

import { PLACE_ORDER } from "../../redux/features/product/placeOrderSlice";

import {
  PageInfo,
  Page500,
} from "../ResultPages/ResultPage";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    status,
    cartItems = {},
  } = useSelector((state) => state.cart);
  const [quantityActionByProduct, setQuantityActionByProduct] = useState({});
  const quantityActionLocks = useRef({});

  const {
    products = [],
    cartTotal,
    totalAfterDiscount,
    CouponApplied,
  } = cartItems;

  useEffect(() => {
    dispatch(FETCH_CART());
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    dispatch(PLACE_ORDER());
    navigate("/checkout");
  }, [dispatch, navigate]);

  const handleRemove = useCallback(
    (productId, mPrice) => {
      dispatch(
        REMOVE_FROM_CART({
          productId,
          mPrice,
        })
      );
    },
    [dispatch]
  );

  const handleIncrement = useCallback(
    async (productId, mPrice) => {
      if (!productId || quantityActionLocks.current[productId]) return;

      quantityActionLocks.current[productId] = true;

      setQuantityActionByProduct((current) => ({
        ...current,
        [productId]: true,
      }));

      try {
        await dispatch(
          INCREMENT({
            productId,
            mPrice,
          })
        );
      } finally {
        setQuantityActionByProduct((current) => {
          const next = { ...current };
          delete next[productId];
          return next;
        });
        delete quantityActionLocks.current[productId];
      }
    },
    [dispatch]
  );

  const handleDecrement = useCallback(
    async (productId, mPrice, quantity) => {
      if (!productId || quantity <= 1 || quantityActionLocks.current[productId]) return;

      quantityActionLocks.current[productId] = true;

      setQuantityActionByProduct((current) => ({
        ...current,
        [productId]: true,
      }));

      try {
        await dispatch(
          DECREMENT({
            productId,
            mPrice,
          })
        );
      } finally {
        setQuantityActionByProduct((current) => {
          const next = { ...current };
          delete next[productId];
          return next;
        });
        delete quantityActionLocks.current[productId];
      }
    },
    [dispatch]
  );

  const handleEmptyCart = useCallback(() => {
    dispatch(emptycart());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="client-loading-pad">
        <Skelton type="cart" />
      </div>
    );
  }

  if (status > 400) {
    return <Page500 />;
  }

  if (!products.length) {
    return (
      <PageInfo
        discription="Cart is Empty"
        buttonName="Countinue Shopping?"
      />
    );
  }
// console.log("fetched car",FETCH_CART);


  return (
    <div className="root-cart">
      <Link to="/">
        <img
          className="cart-logo ms-5 client-cart-logo"
          src="https://res.cloudinary.com/pankajoptical/image/upload/v1709921004/pankajoptical_LOGO_ielprm.png"
          alt="Pankaj Opticals"
          loading="lazy"
        />
      </Link>

      <div className="cart px-5">
        <nav
          aria-label="breadcrumb"
          className="client-cart-breadcrumb"
        >
          <ol className="breadcrumb mt-2">
            <Link to="/" className="breadcrumb-item">
              Products
            </Link>

            <Link
              className="breadcrumb-item active"
              aria-current="page"
            >
              Cart
            </Link>
          </ol>
        </nav>

        <div className="cart-body mx-4">
          <div className="container-fluid">
            <div className="row cart-summary-row">
              <div className="col-3 cart-count-col">
                <p className="fs-4">
                  Cart : {products.length}
                </p>
              </div>

              <div className="col-5 text-end cart-empty-col">
                <button
                  className="btn btn-danger"
                  onClick={handleEmptyCart}
                >
                  Empty Cart
                </button>
              </div>
            </div>

            <div className="row cart-layout-row">
              <div className="col-8 cart-items-col">
                {products.map((item) => {
                  const product = item.product;
                  const isQuantityUpdating =
                    !!quantityActionByProduct[product?._id];

                  return (
                    <div
                      key={product?._id}
                      className="cartproduct my-4 p-4"
                    >
                      <div className="container-fluid">
                        <div className="row cart-product-row">
                          <div className="col-5 cart-product-image-col">
                            <Link to={`/details/${product?._id}`}>
                              {product?.thumnailimages?.[0]?.url && (
                                <img
                                  src={
                                    product.thumnailimages[0].url
                                  }
                                  alt={product?.Brand}
                                  loading="lazy"
                                />
                              )}
                            </Link>
                          </div>

                          <div className="col-7 cart-product-details-col">
                            <p className="fs-6">
                              {product?.Brand}{" "}
                              {product?.color}{" "}
                              {product?.frameType}{" "}
                              {product?.shape}
                            </p>

                            <hr />

                            <div className="final-price">
                              <p className="fs-6">
                                Final price{" "}
                                <span>
                                  ₹{product?.mPrice}
                                </span>
                              </p>
                            </div>

                            <hr />

                            <div className="d-flex gap-30 cart-product-actions">
                              <button
                                type="button"
                                className="text-primary text-decoration-underline fs-6 border-0 bg-transparent"
                                onClick={() =>
                                  handleRemove(
                                    product?._id,
                                    product?.mPrice
                                  )
                                }
                              >
                                Remove
                              </button>

                              <div className="quantity-meter">
                                <button
                                  type="button"
                                  className="btn quantity"
                                  disabled={item.quantity <= 1 || isQuantityUpdating}
                                  onClick={() =>
                                    handleDecrement(
                                      product?._id,
                                      product?.mPrice,
                                      item.quantity
                                    )
                                  }
                                >
                                  -
                                </button>

                                <div className="fs-6 px-3">
                                  {item.quantity}
                                </div>

                                <button
                                  type="button"
                                  className="btn quantity"
                                  disabled={isQuantityUpdating}
                                  onClick={() =>
                                    handleIncrement(
                                      product?._id,
                                      product?.mPrice
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-4 cart-bill-col">
                <div className="row">
                  <p className="fs-2 ms-3">
                    Bill Details
                  </p>

                  <PriceDetails
                    totalPrice={cartTotal}
                    totalAfterDiscount={
                      totalAfterDiscount
                    }
                  />

                  <div onClick={handleCheckout}>
                    <Button name="Proceed to checkout" />
                  </div>

                  <CouponBox
                    CouponApplied={CouponApplied}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Cart);
