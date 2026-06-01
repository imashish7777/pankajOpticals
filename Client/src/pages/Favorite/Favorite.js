import React, { useEffect } from "react";
import "../../CSS/favorite.css";
import { useSelector, useDispatch } from "react-redux";
import Skelton from "../../component/skelton";
import { Page500, PageInfo } from "../ResultPages/ResultPage";
import Product from "../../component/Product";
import { FETCH_WISHLIST } from "../../redux/features/product/wishlistSlice";

function Favorite() {
  const dispatch = useDispatch();

  const {
    loading,
    status,
    WishlistItems = [],
  } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(FETCH_WISHLIST());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="client-loading-pad">
        <Skelton type="product-grid" count={4} />
      </div>
    );
  }

  if (status > 400) {
    return <Page500 />;
  }

  if (!WishlistItems.length) {
    return (
      <div className="favorite-empty-page">
        <PageInfo
          description="Wishlist is Empty"
          buttonName="Continue Shopping"
        />
      </div>
    );
  }

  return (
    <div className="favorite  p-4" >
      <h2 className="text-muted">WishList</h2>
      
  <div className="products-grid">
            {WishlistItems?.length > 0 ? (
              WishlistItems.map((i) => (
                <Product key={i._id} {...i} hearted={true} />
              ))
            ) : (
              <Skelton type="product-grid" count={4} />
            )}
          

</div>
      
    </div>
  );
}

export default React.memo(Favorite);
