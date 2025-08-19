import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MainLayout from './layout/MainLayout';
import Shop from './pages/Shop';
import Register from './pages/Register';
import Card from './pages/Card';
import ShippingInfo from './pages/ShippingInfo';
import PaymentCucceded from './pages/PaymentCucceded';
import PaymentFailed from './pages/PaymentFailed';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Orders from './pages/dashboard/Orders';
import OrderDetails from './pages/dashboard/OrderDetails';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import UserProfile from './pages/UserProfile';
import ChatSupport from './pages/dashboard/ChatSupport';
import ExtaLayout from './layout/ExtaLayout';
import Reset_password from './pages/Reset_password';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/user/reset-password' element={<Reset_password/>} />
        <Route path='/payment/success/:orderId/:customerId' element={<PaymentCucceded />} />
        <Route path='/payment/failed' element={<PaymentFailed />} />

        <Route path='/' element={<ExtaLayout />} >

          <Route path='' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='shop' element={<Shop />} />
            <Route path='card' element={<Card />} />
            <Route path='wishlist' element={<Wishlist />} />
            <Route path='shipping-info' element={<ShippingInfo />} />
            <Route path='product/details/:slug/:productId' element={<ProductDetails />} />
            <Route path='profile' element={<UserProfile />} />
          </Route>

          <Route path='dashboard' element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='orders' element={<Orders />} />
            <Route path='order-details/:orderId' element={<OrderDetails />} />
            <Route path='chat-support' element={<ChatSupport />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;
