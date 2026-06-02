import React, {
  lazy,
  useState,
  useEffect,
  useMemo,
} from "react";
import "../CSS/header.css";

import { Link, useNavigate } from "react-router-dom";

import { IoGitCompareOutline } from "react-icons/io5";
import { BsHeart, BsCart, BsPerson } from "react-icons/bs";
import { SearchOutlined } from "@ant-design/icons";

import { AutoComplete, Button, Input, message } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { FETCH_PROPERTIES } from "../redux/features/product/propertiesSlice";

const Login = lazy(() => import("../modals/Login"));

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const properties = useSelector((state) => state.properties);

  const [value, setValue] = useState("");
  const [finaloptions, setFinaloptions] = useState([]);

  useEffect(() => {
    dispatch(FETCH_PROPERTIES());
  }, [dispatch]);

  const options = useMemo(() => {
    const propertyData = properties?.properties?.[0];
    if (!propertyData) return [];

    const {
      brands = [],
      categories = [],
      colors = [],
      frameTypes = [],
      sizes = [],
      shapes = [],
      genders = [],
    } = propertyData;

    return [
      ...brands,
      ...categories,
      ...frameTypes,
      ...sizes,
      ...shapes,
      ...genders,
      ...colors,
    ].map((item) => ({
      label: item,
      value: item,
    }));
  }, [properties]);

  const scramble = (string1, string2) =>
    string2
      .split("")
      .every((char) => string1.includes(char));

  const handleFilter = (searchWord) => {
    const filteredOptions = options.filter((item) =>
      scramble(
        item.label?.toLowerCase(),
        searchWord?.toLowerCase()
      )
    );
    setFinaloptions(filteredOptions);
  };

  const handleSearch = (inputValue) => {
    setValue(inputValue);

    const lastWord = inputValue?.split(" ")?.slice(-1)[0];

    if (lastWord) {
      handleFilter(lastWord);
    } else {
      setFinaloptions([]);
    }
  };

  const onSelect = (selectedValue) => {
    const words = value.split(" ");
    words[words.length - 1] = selectedValue;
    setValue(words.join(" "));
  };

  const handleSearchClick = () => {
    if (value?.trim()) {
      navigate(`/products/${value}`);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") return;

    setTimeout(() => {
      handleSearchClick();
    }, 0);
  };

  const handlePrivateLinkClick = (event) => {
    const isLoggedIn =
      localStorage.getItem("loggedin") === "true" &&
      Boolean(localStorage.getItem("token"));

    if (!isLoggedIn) {
      event.preventDefault();
      message.info("Please login first");
      navigate("/");
    }
  };

  return (
    <>
      {/* ================= HEADER UPPER ================= */}
      <header className="header-upper">

        <div className="header-brand-row">
          {/* LOGO */}
          <div className="header-logo">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/pankajoptical/image/upload/v1709921004/pankajoptical_LOGO_ielprm.png"
                alt="logo"
              />
            </Link>
          </div>

        </div>

        {/* SEARCH */}
        <div className="header-searchbar">
          <Input.Group compact>
            <AutoComplete
              className="client-header-autocomplete"
              value={value}
              options={value ? finaloptions : []}
              onSelect={onSelect}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
              size="large"
            />

            <Button
              icon={<SearchOutlined />}
              onClick={handleSearchClick}
              className="search-btn"
            />
          </Input.Group>
        </div>

        {/* LINKS */}
        <div className="header-links">

          {/* LOGIN (UPDATED) */}
          <div className="header-item">
            <Login modalIdPrefix="headerLogin" />
           
          </div>

          <Link
            to="/orders"
            className="header-item"
            onClick={handlePrivateLinkClick}
          >
            <IoGitCompareOutline className="header-icons" />
            <p className="header-text">
              Orders <br /> Returns
            </p>
          </Link>

          <Link
            to="/favorite"
            className="header-item"
            onClick={handlePrivateLinkClick}
          >
            <BsHeart className="header-icons" />
            <p className="header-text">Wishlist</p>
          </Link>

          <Link
            to="/cart"
            className="header-item"
            onClick={handlePrivateLinkClick}
          >
            <BsCart className="header-icons" />
            <p className="header-text">Cart</p>
          </Link>

        </div>
      </header>

      {/* ================= HEADER BOTTOM ================= */}
      <header className="header-bottom">
        <div className="menu-scroll">

          <Link to="/products/eyeglasses">Eyeglasses</Link>
          <Link to="/products/sunglasses">Sunglasses</Link>
          <Link to="/products/computerglasses">Computer Glasses</Link>
          <Link to="/products/menssunglasses">Men's Sunglasses</Link>
          <Link to="/products/womenssunglasses">Women's Sunglasses</Link>

        </div>
      </header>

      <nav className="mobile-bottom-drawer">
        <div className="mobile-bottom-item mobile-bottom-profile">
          <BsPerson className="header-icons" />
          <Login modalIdPrefix="mobileLogin" />
        </div>

        <Link
          to="/orders"
          className="mobile-bottom-item"
          onClick={handlePrivateLinkClick}
        >
          <IoGitCompareOutline className="header-icons" />
          <span>Orders</span>
        </Link>

        <Link
          to="/favorite"
          className="mobile-bottom-item"
          onClick={handlePrivateLinkClick}
        >
          <BsHeart className="header-icons" />
          <span>Wishlist</span>
        </Link>

        <Link
          to="/cart"
          className="mobile-bottom-item"
          onClick={handlePrivateLinkClick}
        >
          <BsCart className="header-icons" />
          <span>Cart</span>
        </Link>
      </nav>
    </>
  );
}

export default Header;
