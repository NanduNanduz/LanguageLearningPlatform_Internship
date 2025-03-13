import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const token = sessionStorage.getItem("logintoken");

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
