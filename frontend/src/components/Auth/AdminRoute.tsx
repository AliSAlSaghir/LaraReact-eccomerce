import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute: React.FC = () => {
  const { userInfo } = useAppSelector(state => state.auth);
  return userInfo?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
