import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userRole, isLoggedIn, token } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.bookmark);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token || status === 401) {
      dispatch(logout());
      navigate("/");
    }
  }, [token, dispatch, navigate, status]);

  if (!isLoggedIn) return <Navigate to="/" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;
