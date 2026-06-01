import React from "react";
import { DELETE_COUPON } from "../redux/features/product/couponSlice";
import { useDispatch } from "react-redux";
import "../CSS/couponboxBasic.css";

function CouponboxBasic({ name, upTo, discount, _id, discribtion }) {
  const dispatch = useDispatch();

  return (
    <>
      <div className="d-flex justify-content-center align-items-center container">
        <div className="d-flex card text-center">
          <div className="image">
            <img src="https://i.imgur.com/DC94rZe.png" width={150} alt="" />
          </div>
          <div className="image2">
            <img src="https://i.imgur.com/DC94rZe.png" width={150} alt="" />
          </div>
          <h1>{discount}% OFF</h1>
          <span className="d-block">Up To: ₹{upTo}</span>
          <span className="d-block">{discribtion}</span>
          <span className="d-block">Today</span>
          <div className="mt-4">
            <small>With Code : {name}</small>
          </div>
        </div>
      </div>
      <button
        className="btn btn-danger ms-5 mt-2"
        onClick={() => dispatch(DELETE_COUPON({ _id: _id }))}
      >
        Remove
      </button>
    </>
  );
}

export default CouponboxBasic;
