import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaQuestion } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, reset_password } from '../store/reducers/authReducer';
import FadeLoader from 'react-spinners/FadeLoader';
import { resetPasswordColors as c } from '../color/colors';

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

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const inputHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    dispatch(reset_password(form));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setForm({ email: '', secretAnswer: '', password: '' });
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
        <div className={`fixed inset-0 flex justify-center items-center ${c.loader_bg} z-50`}>
          <FadeLoader color={c.loader_icon} />
        </div>
      )}

      <div className={`min-h-screen flex items-center justify-center ${c.gradient_bg} px-4 py-10`}>
        <div className={`shadow-2xl rounded-3xl p-10 w-full max-w-lg transition-all duration-300 ${c.card_bg}`}>
          <h2 className={`text-3xl font-bold text-center mb-2 ${c.card_text}`}>Reset Password</h2>
          <p className={`text-center text-sm mb-8 ${c.card_subtext}`}>
            Enter your credentials to reset your password.
          </p>

          <div className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${c.icon}`} />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                onChange={inputHandler}
                value={form.email}
                className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${c.input_border} ${c.input_focus} text-sm`}
              />
            </div>

            {/* Secret Answer */}
            <div className="relative">
              <FaQuestion className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${c.icon}`} />
              <input
                type="text"
                name="secretAnswer"
                id="secretAnswer"
                value={form.secretAnswer}
                onChange={inputHandler}
                placeholder="What is your secret answer?"
                className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${c.input_border} ${c.input_focus} text-sm`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${c.icon}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={form.password}
                onChange={inputHandler}
                placeholder="New Password"
                className={`w-full pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 ${c.input_border} ${c.input_focus} text-sm`}
              />
              <span
                onClick={togglePasswordVisibility}
                className={`absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer ${c.password_icon}`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Submit */}
            <button
              onClick={handleReset}
              className={`w-full py-3 cursor-pointer font-bold rounded-xl text-sm tracking-wide transition duration-300 ${c.button_bg} ${c.button_text}`}
            >
              Reset Password
            </button>

            {/* Redirect */}
            <p className={`text-center text-sm mt-4 ${c.remember_text}`}>
              Remembered your password?
              <span
                className={`ml-1 cursor-pointer ${c.link_text}`}
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
