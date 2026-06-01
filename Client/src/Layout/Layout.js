import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <div className="w-100 sticky-top">
        <Header/>
      </div>
      <div className="w-100 layout">
        <Outlet />
      </div>
      <div className="w-100">
        <Footer />
      </div>
    </>
  );
}

export default Layout;
