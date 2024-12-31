import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import OrdersList from "./components/Admin/Orders/OrdersList";
import AddProduct from "./components/Admin/Products/AddProduct";
import ManageStocks from "./components/Admin/Products/ManageStocks";
import UpdateProduct from "./components/Admin/Products/UpdateProduct";
import AddCoupon from "./components/Admin/Coupons/AddCoupon";
import ManageCoupons from "./components/Admin/Coupons/ManageCoupons";
import UpdateCoupon from "./components/Admin/Coupons/UpdateCoupon";
import ManageOrders from "./components/Admin/Orders/ManageOrders";
import OrderPayment from "./components/Users/Products/OrderPayment";
import Customers from "./components/Admin/Orders/Customers";
import ProductsFilters from "./components/Users/Products/ProductsFilters";
import Product from "./components/Users/Products/Product";
import AllCategories from "./components/HomePage/AllCategories";
import AddReview from "./components/Users/Reviews/AddReview";
import ShoppingCart from "./components/Users/Products/ShoppingCart";
import Login from "./components/Users/Forms/Login";
import RegisterForm from "./components/Users/Forms/RegisterForm";
import CustomerProfile from "./components/Users/Profile/CustomerProfile";
import AdminDashboard from "./components/Admin/AdminDashboard";
import HomePage from "./components/HomePage/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./components/Auth/AdminRoute";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AddAttribute from "./components/Admin/Attributes/AddAttribute";
import ManageAttributes from "./components/Admin/Attributes/ManageAttributes";

const App: React.FC = () => {
  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (
      expirationTime &&
      new Date().getTime() > new Date(expirationTime).getTime()
    ) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar />
      {/* hide navbar if admin */}
      <Routes>
        {/* nested route */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />}>
            {/* products */}
            <Route path="add-product" element={<AddProduct />} />
            <Route path="manage-products" element={<ManageStocks />} />
            <Route path="products/edit/:id" element={<UpdateProduct />} />
            {/* coupons */}
            <Route path="add-coupon" element={<AddCoupon />} />
            <Route path="manage-coupons" element={<ManageCoupons />} />
            <Route
              path="manage-coupons/edit/:code"
              element={<UpdateCoupon />}
            />
            {/* Attributes */}
            <Route path="add-attribute" element={<AddAttribute />} />
            <Route path="all-attributes" element={<ManageAttributes />} />
            {/* Orders */}
            <Route path="" element={<OrdersList />} />
            <Route path="manage-orders" element={<ManageOrders />} />
            <Route path="order-payment" element={<OrderPayment />} />
            <Route path="customers" element={<Customers />} />
          </Route>
        </Route>
        {/* public links */}
        {/* Products */}
        <Route index element={<HomePage />} />
        <Route path="/products-filters" element={<ProductsFilters />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/all-categories" element={<AllCategories />} />
        {/* shopping cart */}
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route element={<ProtectedRoute />}>
          {/* review */}
          <Route path="/add-review/:id" element={<AddReview />} />

          <Route path="/order-payment" element={<OrderPayment />} />
          {/* users */}
          <Route path="/customer-profile" element={<CustomerProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
