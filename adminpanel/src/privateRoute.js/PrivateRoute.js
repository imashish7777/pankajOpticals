import React from "react";
import { Navigate } from "react-router-dom";

export const Privateroutes = ({ children }) => {
  const islogin = window.localStorage.getItem("token")
  if (!islogin) {
    alert("Please login first");
    return <Navigate to="/"/>;
  }
  return children;
};
