import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="login" />;
};

export default ProtectedRoute;
