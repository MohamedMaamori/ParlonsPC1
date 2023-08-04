import React from "react";
import { Route, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ authenticated, redirectTo, ...props }) => {
  const navigate = useNavigate();
  if (authenticated) {
    return <Route {...props} />;
  } else {
    navigate(redirectTo, { replace: true });
    return null; // Return null to avoid rendering anything while redirecting
  }
};

export default ProtectedRoute;

// To be Done
