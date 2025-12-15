import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAdminAuth();

  if (!token) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
