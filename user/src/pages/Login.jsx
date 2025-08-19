import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login, messageClear } from '../store/reducers/authReducer'
import FadeLoader from 'react-spinners/FadeLoader';

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { userInfo, loader, successMessage, errorMessage } = useSelector(state => state.auth)

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const inputHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {
    const { email, password } = form;
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    dispatch(login(form))
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
    }
    if (userInfo?.id) {
      navigate('/')
    }
  }, [errorMessage, successMessage])

  return (
    <div>
      {loader && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#38303033] bg-opacity-40 z-50">
          <FadeLoader color="#6366F1" />
        </div>
      )}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-700 px-4 py-12">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10 transition-all duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back 👋</h2>
          <p className="text-center text-sm text-gray-600 mb-8">Login to continue</p>

          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id='email'
                name='email'
                value={form.email}
                onChange={inputHandler}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                onChange={inputHandler}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={form.password}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full py-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm tracking-wide transition duration-300"
            >
              Login
            </button>

            {/* Register Redirect */}
            <div className="text-center text-sm text-gray-600 mt-4">
              <h1>
                Don't have an account?
                <span
                  onClick={() => navigate('/register')}
                  className="text-indigo-600 hover:underline ml-1 cursor-pointer"
                >
                  Create Now
                </span>
              </h1>
              <h1 onClick={() => navigate('/user/reset-password')} className="text-indigo-600 hover:underline ml-1 cursor-pointer">
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
