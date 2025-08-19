import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaQuestion } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, reset_password } from '../store/reducers/authReducer';
import FadeLoader from 'react-spinners/FadeLoader';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    email: '',
    secretAnswer: '',
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

  const handleReset = () => {
    const { email, secretAnswer, password } = form;

    if (!email || !secretAnswer || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    dispatch(reset_password(form))
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setForm({
        email: '',
        secretAnswer: '',
        password: ''
      });
      navigate('/login');
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div>
      {loader && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#38303033] bg-opacity-40 z-50">
          <FadeLoader color="#6366F1" />
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-700 px-4 py-10">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-lg transition-all duration-300">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Enter your credentials to reset your password.
          </p>

          <div className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                onChange={inputHandler}
                value={form.email}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Secret Answer */}
            <div className="relative">
              <FaQuestion className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="secretAnswer"
                id="secretAnswer"
                value={form.secretAnswer}
                onChange={inputHandler}
                placeholder="What is your secret answer?"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={form.password}
                onChange={inputHandler}
                placeholder="New Password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Submit */}
            <button
              onClick={handleReset}
              className="w-full py-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm tracking-wide transition duration-300"
            >
              Reset Password
            </button>

            {/* Redirect */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Remembered your password?
              <span
                className="text-indigo-600 hover:underline ml-1 cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
