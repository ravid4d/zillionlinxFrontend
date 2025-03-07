import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles, userRole }) => {
    const { isLoggedIn } = useSelector(state=>state.auth);

    if (!isLoggedIn) return <Navigate to="/" />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;
  
    return <Outlet />;
}

export default ProtectedRoute
