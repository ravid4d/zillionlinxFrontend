import React from "react";
import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../services/authService";

const PrivateRoute = ({ children }) => {
    return isUserLoggedIn() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
