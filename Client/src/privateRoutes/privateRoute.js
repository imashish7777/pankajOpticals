import React from "react";
import { Navigate } from "react-router-dom";
import { message } from "antd";

export const Privateroutes = ({ children }) => {
  const islogin =
    window.localStorage.getItem("loggedin") === "true" &&
    Boolean(window.localStorage.getItem("token"));

  if (!islogin) {
    message.info("Please login first");

    return <Navigate to="/" replace />;
  }

  return children;
};
