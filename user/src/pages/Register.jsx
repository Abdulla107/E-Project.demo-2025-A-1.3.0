import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaQuestion } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, register } from '../store/reducers/authReducer';
import FadeLoader from 'react-spinners/FadeLoader';
import { registerColors } from '../color/colors';

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

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

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

    dispatch(register(form));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setForm({ name: '', email: '', koscen: '', password: '' });
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
        <div className={`fixed inset-0 flex justify-center items-center ${registerColors.loaderBg} z-50`}>
          <FadeLoader color={registerColors.loaderIcon} />
        </div>
      )}
      <div className={`min-h-screen flex items-center justify-center ${registerColors.pageBg} px-4 py-10`}>
        <div className={`shadow-2xl rounded-3xl p-10 w-full max-w-lg transition-all duration-300 ${registerColors.cardBg}`}>
          <h2 className={`text-4xl font-extrabold text-center mb-2 ${registerColors.cardText}`}>Join</h2>
          <p className={`text-center text-sm mb-8 ${registerColors.cardSubText}`}>
            Create your account. It takes less than a minute.
          </p>

          <div className="space-y-5">
            {/* Name */}
            <div className="relative">
              <FaUser className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${registerColors.icon}`} />
              <input
                type="text"
                name='name'
                id='name'
                value={form.name}
                placeholder="Full Name"
                onChange={inputHandler}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${registerColors.inputBorder} ${registerColors.inputFocus}`}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${registerColors.icon}`} />
              <input
                type="email"
                name='email'
                id='email'
                placeholder="Email Address"
                onChange={inputHandler}
                value={form.email}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${registerColors.inputBorder} ${registerColors.inputFocus}`}
              />
            </div>

            {/* Secret Question */}
            <div className="relative">
              <FaQuestion className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${registerColors.icon}`} />
              <input
                type="text"
                name='koscen'
                id='koscen'
                value={form.koscen}
                placeholder="What is your secret answer?"
                onChange={inputHandler}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${registerColors.inputBorder} ${registerColors.inputFocus}`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${registerColors.icon}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                value={form.password}
                onChange={inputHandler}
                placeholder="Password"
                className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm ${registerColors.inputBorder} ${registerColors.inputFocus}`}
              />
              <span
                onClick={togglePasswordVisibility}
                className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer ${registerColors.passwordToggle}`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              className={`w-full py-3 cursor-pointer font-bold rounded-xl text-sm tracking-wide transition duration-300 ${registerColors.buttonBg}`}
            >
              Create Account
            </button>

            {/* Redirect */}
            <p className={`text-center text-sm mt-4 ${registerColors.linkMuted}`}>
              Already have an account?
              <span
                className={`ml-1 cursor-pointer ${registerColors.linkText}`}
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
