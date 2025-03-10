import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

const NonProtectedAdminRoutes = ({children}) => {
    const {isLoggedIn} = useSelector(state=>state.auth);

    if (isLoggedIn) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}

export default NonProtectedAdminRoutes
