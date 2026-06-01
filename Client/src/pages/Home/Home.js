import { API_BASE_URL } from "../../utilies/base_URL";
import React, { useEffect, useState } from "react";
import "../../CSS/home.css";
import ProductSlide from "./ProductSlide";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState({
    eyeglasses: [],
    sunglasses: [],
    computerGlasses: [],
    femaleEyeglasses: [],
    femaleSunglasses: [],
  });

  // reusable fetch function
  const fetchProducts = async (category, gender) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/product/fetchhomeproducts/${category}/${gender}`,
      );

      return await response.json();
    } catch (error) {
      return [];
    }
  };

  // authentication check
  const isAuthenticated = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/isAuthicated`,
        {
          headers: {
            "x-auth-token": window.localStorage.getItem("token"),
          },
        },
      );

      if (response.data === "true") {
        window.localStorage.setItem("user", "true");
      } else {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
      }
    } catch (error) {
      window.localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    isAuthenticated();

    const loadProducts = async () => {
      const [
        eyeglasses,
        sunglasses,
        computerGlasses,
        femaleEyeglasses,
        femaleSunglasses,
      ] = await Promise.all([
        fetchProducts("eyeglasses", "male"),
        fetchProducts("sunglasses", "male"),
        fetchProducts("computerglasses", "male"),
        fetchProducts("eyeglasses", "female"),
        fetchProducts("sunglasses", "female"),
      ]);

      setProducts({
        eyeglasses,
        sunglasses,
        computerGlasses,
        femaleEyeglasses,
        femaleSunglasses,
      });
    };

    loadProducts();
  }, []);

  return (
    <div className="home mt-3">
      {products.eyeglasses.length > 0 && (
        <div className="ProductSlide">
          <ProductSlide
            name="first"
            heading="EYEGLASSES"
            category="eyeglasses"
            Products={products.eyeglasses}
          />
        </div>
      )}

      {products.sunglasses.length > 0 && (
        <div className="ProductSlide">
          <ProductSlide
            name="second"
            heading="SUNGLASSES"
            category="sunglasses"
            Products={products.sunglasses}
          />
        </div>
      )}

      {products.femaleEyeglasses.length > 0 && (
        <div className="ProductSlide">
          <ProductSlide
            name="third"
            heading="WOMEN'S EYEGLASSES"
            category="eyeglasses"
            Products={products.femaleEyeglasses}
          />
        </div>
      )}

      {products.femaleSunglasses.length > 0 && (
        <div className="ProductSlide">
          <ProductSlide
            name="fourth"
            heading="WOMEN'S SUNGLASSES"
            category="sunglasses"
            Products={products.femaleSunglasses}
          />
        </div>
      )}

      {products.computerGlasses.length > 0 && (
        <div className="ProductSlide">
          <ProductSlide
            name="fifth"
            heading="WITH ZERO POWER COMPUTER BLU LENSES"
            category="computerglasses"
            Products={products.computerGlasses}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
