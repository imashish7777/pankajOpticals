import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import "../../CSS/checkout.css";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  deleteAddress,
  fetchaddress,
} from "../../redux/features/product/addressSlice";

import CheckoutAddressbox from "./checkoutAddressBox";

import { useOutletContext } from "react-router-dom";

function CheckoutAddress() {
  const dispatch = useDispatch();

  const { addresses = [] } =
    useSelector(
      (state) => state.address
    );

  // FIXED
  const { setAddressId } =
    useOutletContext();

  const [selectedAddressId, setSelectedAddressId] =
    useState("");
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] =
    useState(false);

  const selectedAddress = useMemo(
    () =>
      addresses.find(
        (address) =>
          address._id === selectedAddressId
      ),
    [addresses, selectedAddressId]
  );

  useEffect(() => {
    dispatch(fetchaddress());
  }, [dispatch]);

  const handleDelete =
    useCallback(
      (id) => {
        dispatch(deleteAddress(id));
      },
      [dispatch]
    );

  const handleSelectAddress =
    useCallback(
      (id) => {
        setSelectedAddressId(id);
        setAddressId(id);
        setIsAddressDropdownOpen(false);
      },
      [setAddressId]
    );

  return (
    <>
      <p className="fs-3 checkout-section-title">
        Select Address
      </p>

      {addresses.length > 0 && (
        <>
          <select
            className="form-select checkout-address-select"
            value={selectedAddressId}
            onChange={(event) =>
              handleSelectAddress(event.target.value)
            }
          >
            <option value="" disabled>
              Select delivery address
            </option>

            {addresses.map((i) => (
              <option key={i._id} value={i._id}>
                {i.firstname} {i.lastname} - {i.city}, {i.zip}
              </option>
            ))}
          </select>

          <div className="checkout-address-dropdown">
            <button
              type="button"
              className="checkout-address-dropdown-button"
              onClick={() =>
                setIsAddressDropdownOpen((prev) => !prev)
              }
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.firstname} ${selectedAddress.lastname} - ${selectedAddress.city}, ${selectedAddress.zip}`
                  : "Select delivery address"}
              </span>
            </button>

            {isAddressDropdownOpen && (
              <div className="checkout-address-dropdown-menu">
                {addresses.map((i) => (
                  <button
                    type="button"
                    key={i._id}
                    className={`checkout-address-dropdown-option ${
                      selectedAddressId === i._id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectAddress(i._id)
                    }
                  >
                    <strong>
                      {i.firstname} {i.lastname}
                    </strong>
                    <span>
                      {i.addresslineOne}, {i.addresslineTwo}
                    </span>
                    <span>
                      {i.city}, {i.state} {i.zip}
                    </span>
                    <span>Phone - {i.phone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <form
        className={`form-check gap-5 p-0 checkout-address-list ${
          addresses.length > 0
            ? "checkout-address-list-has-items"
            : ""
        }`}
      >
        {addresses.length > 0 ? (
          addresses.map((i) => (
            <label
              key={i._id}
              className="text-dark fs-6 form-check p-3 d-flex gap-3 align-items-center mb-4 checkout-address-card client-checkout-address-card"
              htmlFor={i._id}
            >
              <input
                type="radio"
                className="form-check-input ms-3 client-radio-lg"
                name="address"
                id={i._id}
                value={i._id}
                onChange={() =>
                  handleSelectAddress(
                    i._id
                  )
                }
              />

              <div className="me-4 flex-grow-1 checkout-address-details">
                <div className="fs-5">
                  {i.firstname}{" "}
                  {i.lastname}
                </div>

                <hr />

                <p className="mb-0">
                  {i.addresslineOne},{" "}
                  {i.addresslineTwo},{" "}
                  {i.city}, {i.state},
                  {" "}{i.zip}, INDIA,
                  {" "}{i.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDelete(i._id)
                }
                className="btn btn-danger"
              >
                Delete
              </button>
            </label>
          ))
        ) : (
          <CheckoutAddressbox
            edit="true"
            save="true"
            show="true"
          />
        )}
      </form>

      {addresses.length > 0 && (
        <CheckoutAddressbox
          save="true"
          show="true"
        />
      )}
    </>
  );
}

export default React.memo(
  CheckoutAddress
);
