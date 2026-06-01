import React from "react";
import "../CSS/skelton.css";

function Skelton({ type = "page", count = 4 }) {
  if (type === "button") {
    return (
      <span className="skelton-button">
        <span />
      </span>
    );
  }

  if (type === "product-grid") {
    return (
      <div className="skelton-grid">
        {[...Array(count)].map((_, index) => (
          <div className="skelton-card" key={index}>
            <div className="skelton-image" />
            <div className="skelton-line wide" />
            <div className="skelton-line short" />
            <div className="skelton-pill" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "product-details") {
    return (
      <div className="skelton-product-details">
        <div className="skelton-detail-images">
          {[...Array(4)].map((_, index) => (
            <div className="skelton-large-image" key={index} />
          ))}
        </div>
        <div className="skelton-detail-panel">
          <div className="skelton-line wide" />
          <div className="skelton-line medium" />
          <div className="skelton-pill" />
          <div className="skelton-line short" />
          <div className="skelton-specs">
            {[...Array(6)].map((_, index) => (
              <div className="skelton-spec" key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "cart") {
    return (
      <div className="skelton-cart">
        <div>
          {[...Array(2)].map((_, index) => (
            <div className="skelton-row-card" key={index}>
              <div className="skelton-thumb" />
              <div className="skelton-row-content">
                <div className="skelton-line wide" />
                <div className="skelton-line medium" />
                <div className="skelton-line short" />
              </div>
            </div>
          ))}
        </div>
        <div className="skelton-summary">
          <div className="skelton-line wide" />
          <div className="skelton-line medium" />
          <div className="skelton-line medium" />
          <div className="skelton-pill" />
        </div>
      </div>
    );
  }

  if (type === "order-details") {
    return (
      <div className="skelton-order-details">
        <div className="skelton-line medium" />
        <div className="skelton-row-card">
          <div className="skelton-thumb" />
          <div className="skelton-row-content">
            <div className="skelton-line wide" />
            <div className="skelton-line medium" />
            <div className="skelton-line short" />
          </div>
        </div>
        <div className="skelton-summary">
          <div className="skelton-line wide" />
          <div className="skelton-line medium" />
          <div className="skelton-line medium" />
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="skelton-list">
        {[...Array(count)].map((_, index) => (
          <div className="skelton-row-card" key={index}>
            <div className="skelton-thumb" />
            <div className="skelton-row-content">
              <div className="skelton-line wide" />
              <div className="skelton-line medium" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skelton-page">
      <div className="skelton-line wide" />
      <div className="skelton-line medium" />
      <div className="skelton-line short" />
    </div>
  );
}

export default Skelton;
