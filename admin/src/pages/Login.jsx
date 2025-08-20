import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { admin_login, messageClear, authorization_admin } from '../store/reducers/authReducer';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import FadeLoader from 'react-spinners/FadeLoader';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { loginColors } from '../color/colors'; 

const Login = () => {
  const { loader, successMessage, errorMessage, userInfo, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const { email, password } = form;
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }
    dispatch(admin_login(form));
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(authorization_admin({ decoded }));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate('/admin/dashboard');
    }
  }, [successMessage, errorMessage, userInfo, navigate, dispatch]);

  if (userInfo) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div>
      {loader && (
        <div className={`fixed inset-0 flex justify-center items-center ${loginColors.loaderOverlay} z-50`}>
          <FadeLoader color={loginColors.loaderColor} />
        </div>
      )}

      <div className={`min-h-screen flex items-center justify-center ${loginColors.wrapperBg} px-4`}>
        <div className={`${loginColors.cardBg} p-10 rounded-3xl shadow-2xl w-full max-w-md`}>
          <h2 className={`text-3xl font-bold text-center ${loginColors.cardText} mb-2`}>Welcome Back 👋</h2>
          <p className={`text-center text-sm ${loginColors.subtitleText} mb-8`}>Login to continue</p>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className={`absolute top-1/2 left-4 -translate-y-1/2 ${loginColors.inputIcon}`} />
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-3 ${loginColors.inputBorder} rounded-xl focus:outline-none ${loginColors.inputFocus} text-sm`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className={`absolute top-1/2 left-4 -translate-y-1/2 ${loginColors.inputIcon}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-12 py-3 ${loginColors.inputBorder} rounded-xl focus:outline-none ${loginColors.inputFocus} text-sm`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute top-1/2 right-4 -translate-y-1/2 ${loginColors.toggleBtn} focus:outline-none`}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className={`w-full py-3 cursor-pointer ${loginColors.loginBtn} font-semibold rounded-xl text-sm tracking-wide transition duration-300`}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
