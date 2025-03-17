import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userRole} = useSelector((state) => state.auth);
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;
