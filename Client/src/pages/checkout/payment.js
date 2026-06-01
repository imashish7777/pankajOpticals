import React, {
  memo,
  useCallback,
  useState,
} from "react";
import "../../CSS/checkout.css";
import { useOutletContext } from "react-router-dom";

const paymentMethods = [
  {
    id: "COD",
    value: "COD",
    label: "Cash on Delivery",
  },
  // {
  //   id: "Googlepay",
  //   value: "Google Pay",
  //   label: "Google Pay",
  //   image:
  //     "https://w7.pngwing.com/pngs/667/120/png-transparent-google-pay-2020-hd-logo-thumbnail.png",
  // },
  // {
  //   id: "phonepay",
  //   value: "Phone Pay",
  //   label: "Phone Pay",
  //   image:
  //     "https://w7.pngwing.com/pngs/332/615/png-transparent-phonepe-india-unified-payments-interface-india-purple-violet-text-thumbnail.png",
  // },
  // {
  //   id: "UPI",
  //   value: "UPI",
  //   label: "UPI",
  //   image:
  //     "https://w7.pngwing.com/pngs/795/596/png-transparent-logo-line-angle-brand-line-angle-triangle-logo-thumbnail.png",
  // },
];

function Payment() {
  // FIXED
  const { setMethod } = useOutletContext();
  const [selectedMethod, setSelectedMethod] =
    useState("");
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] =
    useState(false);

  const handleMethodChange = useCallback(
    (method) => {
      setSelectedMethod(method);
      setMethod(method);
      setIsPaymentDropdownOpen(false);
    },
    [setMethod]
  );

  return (
    <div className="container-fluid payment-page">
      <p className="fs-4 payment-title">Payment Methods</p>

      <select
        className="form-select payment-method-select"
        value={selectedMethod}
        onChange={(e) => handleMethodChange(e.target.value)}
      >
        <option value="" disabled>
          Select payment method
        </option>

        {paymentMethods.map((method) => (
          <option key={method.id} value={method.value}>
            {method.label}
          </option>
        ))}
      </select>

      <div className="payment-method-dropdown">
        <button
          type="button"
          className="payment-method-dropdown-button"
          onClick={() =>
            setIsPaymentDropdownOpen((prev) => !prev)
          }
        >
          <span>
            {selectedMethod || "Select payment method"}
          </span>
        </button>

        {isPaymentDropdownOpen && (
          <div className="payment-method-dropdown-menu">
            {paymentMethods.map((method) => (
              <button
                type="button"
                key={method.id}
                className={`payment-method-dropdown-option ${
                  selectedMethod === method.value
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleMethodChange(method.value)
                }
              >
                {method.image && (
                  <img src={method.image} alt="" />
                )}

                <span>{method.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-11 gap-5 payment-options-col">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className="form-check paymentType w-100 my-4 p-4 client-cursor-pointer"
              htmlFor={method.id}
            >
              <div className="d-flex align-items-center payment-option-content">
                <input
                  className="form-check-input mx-3"
                  type="radio"
                  name="paymentMethod"
                  id={method.id}
                  value={method.value}
                  onChange={() =>
                    handleMethodChange(method.value)
                  }
                />

                {method.image && (
                  <img
                    src={method.image}
                    className="paymentType-logo"
                    alt={method.label}
                  />
                )}

                <span>{method.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Payment);
