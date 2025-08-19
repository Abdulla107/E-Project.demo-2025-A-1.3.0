import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaQuestion } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, register } from '../store/reducers/authReducer';
import FadeLoader from 'react-spinners/FadeLoader';

const Register = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    koscen: '',
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

  const handleRegister = () => {
    const { name, email, koscen, password } = form;
    if (!name || !email || !koscen || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    dispatch(register(form))

  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setForm({
        name: '',
        email: '',
        koscen: '',
        password: ''
      })
      navigate('/login');
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }

  }, [successMessage, errorMessage]);

  return (
    <div>
      {loader && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#38303033] bg-opacity-40 z-50">
          <FadeLoader color="#6366F1" />
        </div>
      )}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-700 px-4 py-10">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-lg transition-all duration-300">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2">Join</h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Create your account. It takes less than a minute.
          </p>

          <div className="space-y-5">
            {/* Name */}
            <div className="relative">
              <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name='name'
                id='name'
                value={form.name}
                placeholder="Full Name"
                onChange={inputHandler}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name='email'
                id='email'
                placeholder="Email Address"
                onChange={inputHandler}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={form.email}
              />
            </div>

            {/* Secret Question */}
            <div className="relative">
              <FaQuestion className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name='koscen'
                id='koscen'
                value={form.koscen}
                placeholder="What is your secret answer?"
                onChange={inputHandler}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                value={form.password}
                onChange={inputHandler}
                placeholder="Password"
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
              onClick={handleRegister}
              className="w-full py-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm tracking-wide transition duration-300"
            >
              Create Account
            </button>

            {/* Redirect */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?
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

export default Register;
