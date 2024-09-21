import React, { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { Outlet, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminRoute: React.FC = () => {
  const { userInfo } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!(userInfo?.role === "admin")) {
      toast.warn("Restricted to admins");
    }
  }, [userInfo]);

  return userInfo?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
