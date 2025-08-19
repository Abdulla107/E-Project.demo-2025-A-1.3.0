import React, { useState } from 'react';
import { FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import { MdWifiProtectedSetup } from "react-icons/md";
import { motion } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import { updated_password } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { passwordColors } from '../../color/colors';

const Chang_password = () => {
  const dispatch = useDispatch();
  const [changePassword, setChangePassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { userInfo } = useSelector(state => state.auth)

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const passwordInputHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updatePassword = (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6 || form.oldPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    const data = { ...form, userId: userInfo.id }
    dispatch(updated_password(data))
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!changePassword ? (
          <>
            <div className={`flex items-center gap-3 mb-3 font-semibold text-lg ${passwordColors.headerText}`}>
              <FaLock /> Security Settings
            </div>
            <p className={`${passwordColors.bodyText} mb-2`}>Do you want to change your password? Go to password settings via the change password button and change the old password with your old password and new password.</p>
            <button onClick={() => setChangePassword(true)} className="text-blue-500 hover:underline text-sm cursor-pointer">
              Change Password
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className={`flex items-center gap-3 mb-3 font-semibold text-lg ${passwordColors.headerText}`}>
                <MdWifiProtectedSetup size={26} /> <span>Change</span> Password
              </div>
              <span onClick={() => setChangePassword(false)} className={`h-[32px] p-2 cursor-pointer ${passwordColors.closeBtnBg} ${passwordColors.closeBtnHoverBg} text-white rounded-md max-md:hidden`}>
                <IoCloseSharp />
              </span>
            </div>

            <form onSubmit={updatePassword}>
              <div className="flex flex-col w-full my-3 gap-5">
                {/* Old Password */}
                <div className="relative">
                  <MdWifiProtectedSetup size={20} className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${passwordColors.iconColor}`} />
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    name='oldPassword'
                    id='oldPassword'
                    value={form.oldPassword}
                    onChange={passwordInputHandler}
                    placeholder="Old Password"
                    className={`w-full pl-10 pr-10 py-3 border ${passwordColors.inputBorder} rounded-xl focus:outline-none focus:ring-2 ${passwordColors.inputFocusRing} text-sm`}
                    required
                  />
                  <span
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className={`absolute top-1/2 right-3 transform -translate-y-1/2 ${passwordColors.toggleIcon} cursor-pointer`}
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* New Password */}
                <div className="relative">
                  <FaLock className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${passwordColors.iconColor}`} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name='newPassword'
                    id='newPassword'
                    value={form.newPassword}
                    onChange={passwordInputHandler}
                    placeholder="New Password"
                    className={`w-full pl-10 pr-10 py-3 border ${passwordColors.inputBorder} rounded-xl focus:outline-none focus:ring-2 ${passwordColors.inputFocusRing} text-sm`}
                    required
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute top-1/2 right-3 transform -translate-y-1/2 ${passwordColors.toggleIcon} cursor-pointer`}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button className={`w-full py-2 mt-3 cursor-pointer ${passwordColors.buttonBg} ${passwordColors.buttonHoverBg} ${passwordColors.buttonText} font-bold rounded-xl text-sm tracking-wide transition duration-300`}>
                Change Password
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Chang_password;
