import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import ProtectRoutes from "./utils/ProtectRoutes"
import MainLayout from "./layout/MainLayout"
import Dashboard from "./pages/Dashboard"
import AddProduct from "./pages/AddProduct"
import AllProducts from "./pages/AllProducts"
import Payments from "./pages/Payments"
import Orders from "./pages/Orders"
import ChatCustomer from "./pages/ChatCustomer"
import Banners from "./pages/Banners"
import EditProduct from "./pages/EditProduct"
import AddBanner from "./pages/AddBanner"
import ProductDetails from "./pages/ProductDetails"
import OrderDetails from "./pages/OrderDetails"
import Category from "./pages/Category"
import RefundRequest from "./pages/RefundRequest"
import NotFound from "./pages/NotFound"
import TargetCountry from './pages/TargetCountry';
import Profile from './pages/Profile';


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="" element={<Navigate to='/admin/dashboard' replace />} />
        <Route path="/admin" element={<ProtectRoutes />}>
          <Route path="" element={<MainLayout />} >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="category" element={<Category />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="product/details/:productId" element={<ProductDetails />} />
            <Route path="product/edit-product/:productId" element={<EditProduct />} />
            <Route path="product/add-banner/:productId" element={<AddBanner />} />
            <Route path="orders" element={<Orders />} />
            <Route path="refund_request" element={<RefundRequest />} />
            <Route path="order/details/:orderId" element={<OrderDetails />} />
            <Route path="banners" element={<Banners />} />
            <Route path="payments" element={<Payments />} />
            <Route path="target-country" element={<TargetCountry />} />
            <Route path="chat_customer" element={<ChatCustomer />} />
            <Route path="chat_customer/:customerId" element={<ChatCustomer />} />
            <Route path="profile" element={<Profile />} />

          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
