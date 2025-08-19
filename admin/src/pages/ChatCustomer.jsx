import React, { useRef, useState, useEffect, useMemo } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FaList, FaUserCircle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { TbMessageDown } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { active_status_update, get_customer, get_message, get_unSeen_message, send_message, update_customer_list, update_message_status, update_one_message_status, updateMessage } from '../store/reducers/chatReducer';
import { motion } from 'framer-motion';
import { socket } from '../utils/utils';
import PulseLoader from 'react-spinners/PulseLoader';
import { chat_customer, sidebar } from '../color/colors';

const ChatCustomer = () => {

  const { customerId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const scrollRef = useRef();
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [recevedMessage, setRecevedMessage] = useState('')
  const [typing, setTyping] = useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const { customers, messages, activeCustomer, senderMessageCount, total_unSeen_message, unSeen_message } = useSelector(state => state.chat);



  const currentCustomer = useMemo(() => {
    return customers?.find(c => c._id === customerId);
  }, [customers, customerId]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const now = moment();

    const newMessage = {
      senderName: userInfo?.name,
      sender: 'admin',
      senderId: null,
      receverId: customerId,
      message: text.trim(),
      time: now.format('hh:mm A'),
      date: now.format('DD/MM/YYYY'),
    };

    dispatch(send_message(newMessage));
    socket.emit('send_message_admin_to_user', newMessage)
    setText('');
  };

  const navigetHendler = (e, id) => {
    e.preventDefault();
    socket.emit('admin_typing_status', { text: '', userId: customerId });
    navigate(`/admin/chat_customer/${id}`)
  }

  useEffect(() => {
    const handleActiveUser = (data) => {
      dispatch(active_status_update(data));
    };

    const handleReceivedMessage = (msg) => {
      setRecevedMessage(msg);
    };

    socket.on('activeUser', handleActiveUser);
    socket.on('received_user_message', handleReceivedMessage);

    return () => {
      socket.off('activeUser', handleActiveUser);
      socket.off('received_user_message', handleReceivedMessage);
    };
  }, []);


  useEffect(() => {
    const handleMessage = (msg) => {
      dispatch(update_customer_list(msg))

    };

    socket.on('received_user_message', handleMessage);

    return () => {
      socket.off('received_user_message', handleMessage);
    };
  }, [socket]);


  useEffect(() => {

    const handleTyping = (data) => {
      if (data.userId !== customerId) return;
      if (data.text && data.text.trim() !== '') {
        setTyping(true);
      } else {
        setTyping(false);
      }
    };

    socket.on('user_typing', handleTyping);
    return () => {
      socket.off('user_typing', handleTyping);
    };

  }, [customerId]);

  useEffect(() => {
    setTyping(false)
  }, [customerId])


  useEffect(() => {
    if (text.trim() !== '') {
      socket.emit('admin_typing_status', { text, userId: customerId });
    }
  }, [text, customerId]);

  useEffect(() => {
    if (text.trim() === '') {
      socket.emit('admin_typing_status', { text, userId: customerId });
    }
  }, [!text, customerId]);


  useEffect(() => {
    if (!senderMessageCount || !customerId) return;

    const isMatched = unSeen_message?.some(c => c.senderId === customerId);

    if (isMatched && total_unSeen_message) {
      dispatch(update_message_status(customerId));
    }
  }, [customerId]);


  useEffect(() => {
    if (recevedMessage) {
      if (recevedMessage.senderId === customerId) {

        dispatch(updateMessage(recevedMessage))
        dispatch(update_one_message_status(customerId))
      }
    }

  }, [recevedMessage])


  useEffect(() => {
    if (userInfo) {
      dispatch(get_customer());
    }
  }, [userInfo]);

  useEffect(() => {
    if (customerId) {
      dispatch(get_message(customerId));
    }
  }, [userInfo, customerId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sidebar = chat_customer?.sidebar || '';
  const cu_color = chat_customer?.sidebar?.customer || '';
  const header = chat_customer?.chat_header || '';
  const body = chat_customer?.chat_body || '';
  const inp = chat_customer?.inp || '';
  const btn = chat_customer?.btn || '';

  return (
    <div className="md:p-2 mt-2 md:mx-1">
      <div className={`w-full shadow-xl ${chat_customer?.bg} border ${chat_customer?.border} rounded-xl h-[calc(100vh-30px)]`}>
        <div className="flex h-full relative">

          {/* Sidebar */}
          <div className={`w-[280px] ${sidebar.bg} border-r ${sidebar.border} absolute z-10 ${show ? 'left-0' : '-left-[336px]'} md:relative md:left-0 transition-all duration-300`}>
            <div className="h-[calc(100vh-135px)] overflow-y-auto scrollbar-thin">
              <div className={`flex justify-between items-center px-4 py-3 border-b ${sidebar.border}`}>
                <h2 className={`text-lg font-semibold ${sidebar.text_gr} flex items-center gap-2`}>
                  Customers <TbMessageDown className={`text-xl ${sidebar.text_bl}`} />
                </h2>
                <button onClick={() => setShow(false)} className={`md:hidden ${sidebar.text_btn} rounded p-1 text-lg cursor-pointer`}>
                  <IoMdClose />
                </button>
              </div>

              {customers?.map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => navigetHendler(e, c._id)}
                  className={`flex items-center w-full gap-3 px-4 py-3 cursor-pointer ${cu_color.btn_hover} transition ${customerId === c._id ? `${cu_color.btn_tr}` : ''}`}
                >
                  <div className="relative">
                    {c.image ? (
                      <img src={c.image} alt="" className={`w-10 h-10 rounded-full border-2 ${cu_color.img_border} object-cover`} />
                    ) : (
                      <FaUserCircle className={`w-10 h-10 ${body.icon_tex}`} />
                    )}
                    {activeCustomer?.some(a => a.userId === c._id) && (
                      <span className={`absolute bottom-0 right-0 w-3 h-3 border-2  ${cu_color.active} rounded-full`}></span>
                    )}
                  </div>
                  <span className={`font-medium ${cu_color.text}`}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-full md:w-[calc(100%-280px)] flex flex-col justify-between">
            {/* Header */}
            <div className={`flex justify-between items-center ${customerId ? `py-4 px-2 border ${header.border}` : 'max-md:py-4 max-md:px-2'}`}>
              {currentCustomer && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {currentCustomer.image ? (
                      <img src={currentCustomer.image} alt="" className={`w-10 h-10 rounded-full border-2 ${header.img_border}`} />
                    ) : (
                      <FaUserCircle className={`w-10 h-10 border-2 rounded-full ${header.icon_color}`} />
                    )}

                    {activeCustomer.some(a => a.userId === currentCustomer._id) && (
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${header.active}`}></span>
                    )}

                  </div>
                  <span className={`font-semibold text-base ${header.text}`}>{currentCustomer.name}</span>
                </div>
              )}
              <button onClick={() => setShow(!show)} className={`md:hidden rounded p-2 cursor-pointer ${header.btn}`}>
                <FaList />
              </button>
            </div>

            {/* Chat Body */}
            <div onClick={() => setShow(false)} className={`flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin ${body.bg}`}>
              {customerId ? (
                messages.map((msg, i) => {
                  const isCustomer = msg.sender === 'customer';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-end ${isCustomer ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCustomer && (
                        userInfo.image ? <img src={userInfo.image} className="w-8 h-8 rounded-full mr-2" alt="Admin" /> : <FaUserCircle className={`w-10 h-10 rounded-full mr-2 ${body.icon_tex}`} />
                      )}
                      <div className={`max-w-[75%] p-3 rounded-2xl shadow ${body.massage_text} relative
                        ${isCustomer ? `rounded-br-none ${body.customer_m}` : ` rounded-bl-none ${body.admin_m}`}`}>
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                        <span className="text-xs text-right block mt-1 opacity-70">
                          {msg.date === moment().format('DD/MM/YYYY') ? msg.time : `${msg.time}, ${msg.date}`}
                        </span>
                      </div>
                      {isCustomer && (
                        currentCustomer?.image ? (
                          <img src={currentCustomer.image} className="w-8 h-8 rounded-full ml-2" alt="Customer" />
                        ) : (<FaUserCircle className={`w-10 h-10 ml-2 ${body.icon_tex}`} />)
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className={`flex flex-col items-center justify-center h-full ${body.icon_tex}`}>
                  <BsEmojiSmile className="text-4xl" />
                  <span className="mt-2 text-sm">Select a customer to start chatting</span>
                </div>
              )}

              {/* Typing Indicator */}
              {typing && (
                <div className="flex justify-end items-center pt-3 gap-2 text-sm font-medium italic">
                  {/* Admin is typing */}
                  <span className={`pt-1 px-3 py-1 rounded-full ${body.type_bg}`}>
                    <div className='-scale-x-100'>
                      <PulseLoader size={6} color={`${body.loader_color}`} speedMultiplier={0.7} />
                    </div>
                  </span>
                  {currentCustomer?.image ?
                    <img src={currentCustomer?.image} className="w-6 h-6 rounded-full" alt="Typing" /> : <FaUserCircle className={`w-8 h-8 rounded-full mr-2 ${body.icon_tex}`} />}
                </div>
              )}
              <div ref={scrollRef}></div>
            </div>

            {/* Input */}
            <form onSubmit={send} className={`flex items-center gap-3 border-t py-3 px-2 ${inp.border}`}>
              <input
                disabled={!customerId}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inp.inp_color}`}
                type="text"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className={`px-3 py-2 rounded-full ${btn.text_color} font-semibold transition ${text.trim()
                  ? `${btn.btn_tru}`
                  : `${btn.btn_fal} cursor-not-allowed`
                  }`}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCustomer;
