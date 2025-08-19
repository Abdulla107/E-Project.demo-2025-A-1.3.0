import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { update_password } from '../../store/reducers/authReducer';
import toast from "react-hot-toast";
import { change_password_color } from '../../color/colors';

const Change_password = ({ fadeUp }) => {

    const dispatch = useDispatch();
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [state, setState] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })
    const { successMessage, loader } = useSelector((state) => state.auth);


    const inputHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    }

    const isFormValid = () => {
        return (
            state.current_password &&
            state.new_password && state.confirm_password
        )
    }

    const submitHandlear = (e) => {
        e.preventDefault();
        if (state.current_password.length < 6 || state.new_password.length < 6 || state.confirm_password.length < 6) {
            return toast.error('Password must be at least 6 characters long.');
        }
        if (state.new_password !== state.confirm_password) {
            return toast.error('New & Confirm password not match!.')
        }

        dispatch(update_password(state))
    }


    useEffect(() => {
        if (successMessage) {
            setState({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
        }
    }, [successMessage])

    const color = change_password_color || ''
    const inp = change_password_color?.form_color || ''
    const btn = change_password_color?.submit_btn || ''


    return (
        <motion.div
            className={`${color.main_color} p-8 rounded-2xl shadow-xl border`}
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-full shadow-sm ${color.keyRound_color}`}>
                    <KeyRound className="w-6 h-6" />
                </div>
                <h2 className={`text-2xl font-semibold ${color.header_text}`}>
                    Change Password
                </h2>
            </div>

            <form onSubmit={submitHandlear} className="space-y-6">
                <div className="space-y-1">
                    <label className={`block text-sm font-medium ${inp.text}`}>
                        Current Password
                    </label>
                    <input
                        onChange={inputHandler}
                        value={state.current_password}
                        name='current_password'
                        type="password"
                        placeholder="Enter current password"
                        className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 ${inp.inp_color} transition`}
                    />
                </div>

                <div className="space-y-1">
                    <label className={`block text-sm font-medium ${inp.text}`}>
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            onChange={inputHandler}
                            value={state.new_password}
                            name='new_password'
                            type={showNew ? "text" : "password"}
                            placeholder="Enter new password"
                            className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 ${inp.inp_color} transition`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className={`absolute right-3 top-3 ${inp.eye_btn}`}
                        >
                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={`block text-sm font-medium ${inp.text}`}>
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            onChange={inputHandler}
                            value={state.confirm_password}
                            name='confirm_password'
                            type={showConfirm ? "text" : "password"}
                            placeholder="Re-enter new password"
                            className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 ${inp.inp_color} transition`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className={`absolute right-3 top-3 ${inp.eye_btn}`}
                        >
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={!isFormValid() || loader}
                    className={`w-full py-3 rounded-xl font-semibold shadow-md transition duration-300
                   ${!isFormValid() || loader ? `${btn.disabled_btn} cursor-not-allowed` : `${btn.active_btn} hover:shadow-xl cursor-pointer`}`}
                >
                    {loader ? 'Updating...' : 'Update Password'}
                </motion.button>

            </form>
        </motion.div>
    )
}

export default Change_password
