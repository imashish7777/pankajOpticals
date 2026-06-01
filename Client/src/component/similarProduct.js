import React, {
  memo,
  useMemo,
} from "react";
import "../CSS/similarProduct.css";

import { Link } from "react-router-dom";

function SimilarProduct({
  _id,
  Brand,
  mPrice,
  thumnailimages = {},
  size,
  color,
  ratings = 0,
}) {

  // render stars
  const ratingStars = useMemo(() => {
    const totalStars =
      ratings > 0 ? ratings : 5;

    return Array.from({
      length: totalStars,
    }).map((_, index) => (
      <span
        key={index}
        className={`similar-product-star ${
          ratings > 0 ? "is-rated" : "is-muted"
        }`}
      >
        ★
      </span>
    ));
  }, [ratings]);

  return (
    <div className="similarproduct">

      {/* image */}

      <Link to={`/details/${_id}`}>
        <div className="similarproduct-image-section">
          <img
            src={thumnailimages?.url}
            alt={Brand}
            loading="lazy"
          />
        </div>
      </Link>

      {/* details */}

      <div className="similarProduct-details">

        {/* ratings */}

        <div>{ratingStars}</div>

        <p className="similar-product-brand">
          {Brand}
        </p>

        <p className="text-muted similar-product-meta">
          Size: {size} • {color}
        </p>

        <p>₹{mPrice}</p>
      </div>
    </div>
  );
}

export default memo(SimilarProduct);
