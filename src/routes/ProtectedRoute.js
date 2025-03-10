import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const {userRole, isLoggedIn} = useSelector(state=>state.auth);


    if (!isLoggedIn) return <Navigate to="/" />;
    if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;
  
    return <Outlet />;
}

export default ProtectedRoute
