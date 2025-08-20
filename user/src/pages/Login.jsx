import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login, messageClear } from '../store/reducers/authReducer';
import FadeLoader from 'react-spinners/FadeLoader';
import { loginColors } from '../color/colors'; 

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const inputHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const { email, password } = form;
    if (!email || !password) return toast.error('Please enter email and password');
    if (password.length < 6) return toast.error('Password must be at least 6 characters long.');
    dispatch(login(form));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (userInfo?.id) navigate('/');
  }, [errorMessage, successMessage]);

  return (
    <div>
      {loader && (
        <div className={`fixed inset-0 flex justify-center items-center ${loginColors.loader_bg} bg-opacity-40 z-50`}>
          <FadeLoader color={loginColors.loader_icon} />
        </div>
      )}
      <div className={`min-h-screen flex items-center justify-center ${loginColors.page_bg} px-4 py-12`}>
        <div className={`p-10 w-full max-w-md rounded-3xl shadow-2xl transition-all duration-300 ${loginColors.card_bg}`}>
          <h2 className={`text-3xl font-bold text-center mb-2 ${loginColors.card_text}`}>Welcome Back 👋</h2>
          <p className={`text-center text-sm mb-8 ${loginColors.card_subtext}`}>Login to continue</p>

          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${loginColors.input_icon}`} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={inputHandler}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${loginColors.input_border} ${loginColors.input_focus}`}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${loginColors.input_icon}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={inputHandler}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${loginColors.input_border} ${loginColors.input_focus}`}
              />
              <span
                onClick={togglePasswordVisibility}
                className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer ${loginColors.password_icon}`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className={`w-full py-3 cursor-pointer font-bold rounded-xl text-sm tracking-wide transition duration-300 ${loginColors.button_bg}`}
            >
              Login
            </button>

            {/* Register & Reset Links */}
            <div className={`text-center text-sm mt-4 ${loginColors.card_subtext}`}>
              <h1>
                Don't have an account?
                <span
                  onClick={() => navigate('/register')}
                  className={`${loginColors.link_text} ${loginColors.link_hover} ml-1 cursor-pointer`}
                >
                  Create Now
                </span>
              </h1>
              <h1
                onClick={() => navigate('/user/reset-password')}
                className={`${loginColors.link_text} ${loginColors.link_hover} ml-1 cursor-pointer`}
              >
                Reset Password
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
