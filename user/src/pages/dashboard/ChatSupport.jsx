import React, { useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { active_status_update, get_message, send_message, updateMessage } from '../../store/reducers/chatReducer';
import { motion } from 'framer-motion';
import moment from 'moment';
import { socket } from '../../utils/utils';
import PulseLoader from 'react-spinners/PulseLoader';
import { chatColors } from '../../color/colors';

const CustomerChat = () => {

    const dispatch = useDispatch();
    const scrollRef = useRef();
    const [text, setText] = useState('');
    const [typing, setTyping] = useState(false);

    const { userInfo, admin_image } = useSelector(state => state.auth);
    const { messages, activeAdmin } = useSelector(state => state.chat)



    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const now = moment();

        const newMessage = {
            senderName: userInfo?.name,
            sender: 'customer',
            senderId: userInfo?.id,
            receverId: null,
            image: userInfo.image,
            message: text.trim(),
            time: now.format('hh:mm A'),
            date: now.format('DD/MM/YYYY'),
        };

        dispatch(send_message(newMessage));

        socket.emit('send_message_user_to_admin', newMessage)
        setText('');
    };

    useEffect(() => {
        socket.emit('join_user', { userId: userInfo.id })

        const handleActiveAdmin = (status) => {
            dispatch(active_status_update(status))
        }
        socket.on('activeAdmin', handleActiveAdmin);

        const handleReceived_message = (msg) => {
            dispatch(updateMessage(msg));
        }
        socket.on('received_admin_message', handleReceived_message)


        return () => {
            socket.off('activeAdmin', handleActiveAdmin)
            socket.off('received_admin_message', handleReceived_message)
        }

    }, [userInfo?.id])


    useEffect(() => {
        const handleTyping = (status) => {
            setTyping(status);
        };

        socket.on('admin_typing', handleTyping);
        return () => {
            socket.off('admin_typing', handleTyping);
        };
    }, []);


    useEffect(() => {
        if (text.trim() !== '') {
            socket.emit('user_typing_status', { text, userId: userInfo.id });
        }
    }, [text]);

    useEffect(() => {
        if (text.trim() === '') {
            socket.emit('user_typing_status', { text, userId: userInfo.id });
        }
    }, [!text]);


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);


    useEffect(() => {
        if (userInfo?.id) {
            dispatch(get_message(userInfo.id));
        }
    }, [userInfo?.id, dispatch]);

    
    return (
        <div className={`h-[calc(100vh)] lg:h-[calc(100vh-10px)] flex flex-col ${chatColors.chatBox.bg} border ${chatColors.header.border}`}>
            {/* Header */}
            <div className={`p-4 shadow-md sticky top-0 z-10 flex items-center gap-3 ${chatColors.header.bg} border-b ${chatColors.header.border}`}>
                <div className="relative">
                    {admin_image ? (
                        <img src={admin_image} className={`w-10 h-10 rounded-full border ${activeAdmin ? chatColors.avatar.adminActiveBorder : chatColors.avatar.adminBorder}`} alt="Admin" />
                    ) : (
                        <FaUserCircle className={`w-10 h-10 rounded-full border ${chatColors.avatar.adminBorder}`} />
                    )}
                    {activeAdmin && <span className={`absolute bottom-0 right-0 w-3 h-3 ${chatColors.header.activeIndicator} rounded-full`}></span>}
                </div>
                <div>
                    <h2 className={chatColors.header.title}>Chat with Admin</h2>
                </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                {messages.map((msg, index) => {
                    const isCustomer = msg.sender === 'customer';
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-end ${isCustomer ? 'justify-end' : 'justify-start'}`}
                        >
                            {!isCustomer && (
                                admin_image ? (
                                    <img src={admin_image} className="w-8 h-8 rounded-full ml-2" alt="Admin" />
                                ) : (
                                    <FaUserCircle className="w-8 h-8 rounded-full mr-2 text-gray-500" />
                                )
                            )}
                            <div className={`max-w-[75%] p-3 rounded-2xl shadow relative 
                ${isCustomer ? `${chatColors.chatBox.customerMsgBg} ${chatColors.chatBox.customerMsgText} ${chatColors.chatBox.customerMsgRounded}`
                                    : `${chatColors.chatBox.adminMsgBg} ${chatColors.chatBox.adminMsgText} ${chatColors.chatBox.adminMsgRounded}`}`}>
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                <span className="text-xs text-right block mt-1 opacity-70">
                                    {msg.date === moment().format('DD/MM/YYYY') ? msg.time : `${msg.time}, ${msg.date}`}
                                </span>
                            </div>
                            {isCustomer && (
                                userInfo?.image ? (
                                    <img src={userInfo.image} className="w-8 h-8 rounded-full ml-2" alt="Customer" />
                                ) : (
                                    <FaUserCircle className="w-8 h-8 rounded-full ml-2 text-gray-500" />
                                )
                            )}
                        </motion.div>
                    );
                })}

                {/* Typing Indicator */}
                {typing && (
                    <div className="flex justify-start items-center pt-3 gap-2 text-sm font-medium italic">
                        {admin_image ? (
                            <img src={admin_image} className="w-8 h-8 rounded-full ml-2" alt="Admin" />
                        ) : (
                            <FaUserCircle className="w-8 h-8 rounded-full mr-2 text-gray-500" />
                        )}
                        <span className={`${chatColors.chatBox.typingBg} ${chatColors.chatBox.typingText} px-3 py-1 rounded-full`}>
                            <PulseLoader speedMultiplier={0.7} size={6} color='#ffffff' />
                        </span>
                    </div>
                )}

                <div ref={scrollRef}></div>
            </div>

            {/* Input Section */}
            <form onSubmit={handleSend} className={`p-4 flex items-center gap-3 sticky bottom-0 z-10 bg-white border-t ${chatColors.header.border}`}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your message..."
                    className={`flex-1 px-4 py-2 border rounded-full outline-none ${chatColors.input.border} ${chatColors.input.focusRing}`}
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className={`px-4 py-2 rounded-full transition ${chatColors.input.button.text} ${text.trim() ? `${chatColors.input.button.activeBg} cursor-pointer` : chatColors.input.button.disabledBg}`}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default CustomerChat;
