import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userRole, isLoggedIn} = useSelector((state) => state.auth);
  if (!isLoggedIn) {
    return <Navigate to="/" />; // Redirect to home if not logged in
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Redirect to unauthorized if role not allowed
  }
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;
