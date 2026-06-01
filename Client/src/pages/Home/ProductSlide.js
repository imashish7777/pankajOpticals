import React, { useEffect, useState } from "react";
import "../../CSS/home.css";
import { useNavigate } from "react-router-dom";

function ProductSlide({ heading, Products = [], name, category }) {
  const navigate = useNavigate();

  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  // responsive items count
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth <= 576) {
        setItemsPerSlide(1);
      } else if (window.innerWidth <= 992) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(5);
      }
    };

    updateItems();

    window.addEventListener("resize", updateItems);

    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const handleOnclick = (productId) => {
    navigate(`/details/${productId}`);
  };

  const handleViewMore = () => {
    navigate(`/products/${category || heading}`);
  };

  const getSlides = () => {
    if (Products.length <= itemsPerSlide) {
      return [Products];
    }

    const nextSlides = [];

    for (let i = 0; i < Products.length; i += itemsPerSlide) {
      const slide = [];

      for (let j = 0; j < itemsPerSlide; j += 1) {
        slide.push(Products[(i + j) % Products.length]);
      }

      nextSlides.push(slide);
    }

    return nextSlides;
  };

  const slides = getSlides();

  // reusable product card
  const renderProducts = (items) => {
    return items.map((product, index) => (
      <div
        className="slider-product"
        key={`${product._id}-${index}`}
        onClick={() => handleOnclick(product._id)}
      >
        <img
          src={product?.thumnailimages?.[0]?.url}
          alt={product.Brand}
        />

        <div className="slider-product-info">
          <p>{product.Brand}</p>
          <p className="text-muted">₹{product.mPrice}</p>
          <span>View details</span>
        </div>
      </div>
    ));
  };

  return (
    <section className="slider-section">
      <div className="slider-heading-row">
        <p
          className="slider-heading ms-5 fs-6 text-muted client-slider-heading"
        >
          {heading}
        </p>

        <button
          type="button"
          className="slider-more-btn"
          onClick={handleViewMore}
        >
          More items ({Products.length})
        </button>
      </div>

     <div
  id={name}
  className="carousel slide"
  data-bs-ride="carousel"
  data-bs-touch="true"
  data-bs-pause="false"
>
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              data-bs-interval="5000"
            >
              <div className="slider-products">
                <div className="slider-row">
                  {renderProducts(slide)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <>
            <button
              className="carousel-control-prev slider-button"
              type="button"
              data-bs-target={`#${name}`}
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
            </button>

            <button
              className="carousel-control-next slider-button"
              type="button"
              data-bs-target={`#${name}`}
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default ProductSlide;
