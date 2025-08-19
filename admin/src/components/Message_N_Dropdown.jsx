import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { useEffect, useState, useCallback } from "react";
import { get_unSeen_message, update_message_status } from "../store/reducers/chatReducer";
import { MdOutlineMessage } from "react-icons/md";
import { socket } from "../utils/utils";
import { header, message_sideber } from "../color/colors";

const Message_N_Dropdown = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [messageOpen, setMessageOpen] = useState(false);
    const [recevedMessage, setRecevedMessage] = useState('');

    const {
        total_unSeen_message,
        unSeen_message,
        message_senderImage,
        senderMessageCount,
        loader
    } = useSelector((state) => state.chat);

    const handleNavigate = useCallback((e, senderId) => {
        e.preventDefault();
        if (!senderId) return;
        dispatch(update_message_status(senderId));
        navigate(`/admin/chat_customer/${senderId}`);
        setMessageOpen(false);
    }, [dispatch, navigate]);

    useEffect(() => {
        const handleMessage = (msg) => setRecevedMessage(msg);

        socket.on('received_user_message', handleMessage);

        if (messageOpen && recevedMessage) {
            dispatch(get_unSeen_message());
            setRecevedMessage('');
        }

        return () => {
            socket.off('received_user_message', handleMessage);
        };
    }, [messageOpen, recevedMessage]);

    const panel = message_sideber?.sidebar_panel || ''
    const avatar = message_sideber?.avatar || ''

    return (
        <div className="relative z-50">
            {/* Message Icon */}
            <div onClick={() => setMessageOpen(true)} className="relative cursor-pointer mr-4">
                <MdOutlineMessage
                    size={26}
                    className={`${header?.icon?.text} transition`}
                />
                {total_unSeen_message > 0 && (
                    <span  className={`absolute -top-2 -right-2 text-xs w-5 h-5 flex items-center justify-center rounded-full ${header?.icon?.number}`}>
                        {total_unSeen_message}
                    </span>
                )}
            </div>

            {/* Animate Sidebar and Overlay */}
            <AnimatePresence>
                {messageOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className={`fixed inset-0 ${message_sideber?.overlay_bg}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMessageOpen(false)}
                        />

                        {/* Sidebar Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className={`fixed top-0 right-0 h-full w-[315px] ${panel.main} flex flex-col`}
                        >
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className={`text-lg font-semibold ${panel.text}`}>New Messages</h2>
                                <button
                                    onClick={() => setMessageOpen(false)}
                                    className={`border px-2 py-[0.5px]  rounded-md text-xl font-bold ${panel.btn}`}
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 custom-scroll">
                                <ul className={`divide-y ${panel.ul}`}>
                                    {unSeen_message?.length > 0 ? (
                                        unSeen_message.map((m, i) => {
                                            const sender = message_senderImage.find(d => d.customerId === m.senderId);
                                            const messageCount = senderMessageCount.find(d => d.customerId === m.senderId)?.messageCount || 0;
                                            const initials = m.senderName?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?";
                                            const timeDisplay = m.date === moment().format("DD/MM/YYYY") ? m.time : `${m.time}, ${m.date}`;

                                            return (
                                                <motion.li
                                                    key={i}
                                                    onClick={(e) => handleNavigate(e, m.senderId)}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className={`cursor-pointer ${panel.hover} transition`}
                                                >
                                                    <div className="flex items-start gap-3 px-4 py-3">
                                                        {/* Avatar */}
                                                        {sender?.image ? (
                                                            <div className="relative">
                                                                <img
                                                                    src={sender.image}
                                                                    alt={m.senderName}
                                                                    className="w-10 h-10 rounded-full border object-cover"
                                                                />
                                                                {messageCount > 0 && (
                                                                    <span className={`absolute -top-1 -right-1 ${avatar.messageCount} text-[10px] min-w-[18px] h-4 flex items-center justify-center px-1 rounded-full`}>
                                                                        {messageCount}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="relative">
                                                                <div className={`w-10 h-10 rounded-full ${avatar.initials_user} flex items-center justify-center text-sm font-bold`}>
                                                                    {initials}
                                                                </div>
                                                                {messageCount > 0 && (
                                                                    <span className={`absolute -top-1 -right-1 ${avatar.messageCount} text-[10px] min-w-[18px] h-4 flex items-center justify-center px-1 rounded-full`}>
                                                                        {messageCount}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Message Content */}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center">
                                                                <h4 className={`font-semibold text-sm ${avatar.sender_n}`}>
                                                                    {m.senderName}
                                                                </h4>
                                                                <span className={`text-xs ${avatar.timeDisplay_c}`}>
                                                                    {timeDisplay}
                                                                </span>
                                                            </div>
                                                            <p className={`text-sm  mt-1 line-clamp-2 ${avatar.sender_m}`}>
                                                                {m.message.slice(0, 80)}...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.li>
                                            );
                                        })
                                    ) : (
                                        <li className={`px-4 py-6 text-center text-sm ${avatar.logind}`}>
                                            {loader ? <span>Loading...</span> : <span>No new messages</span>}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Message_N_Dropdown;
