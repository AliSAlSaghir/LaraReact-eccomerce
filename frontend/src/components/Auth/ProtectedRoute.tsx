import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/hooks";

const ProtectedRoute: React.FC = () => {
  const { userInfo } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!userInfo) {
      toast.warn("Restricted to authenticated users");
    }
  }, [userInfo]);

  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
