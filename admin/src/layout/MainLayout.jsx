import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoChatboxEllipsesOutline, IoClose, IoSettingsOutline } from 'react-icons/io5'
import { RxDashboard } from 'react-icons/rx'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { VscDiffAdded } from 'react-icons/vsc'
import { RiProductHuntLine } from 'react-icons/ri'
import { BsCurrencyDollar } from 'react-icons/bs'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiKnightBanner } from 'react-icons/gi'
import { IoMdLogOut } from 'react-icons/io'
import { MdOutlineRequestPage } from 'react-icons/md'
import { logout } from '../store/reducers/authReducer';
import { socket } from '../utils/utils'
import { showCustomToast } from '../components/CustomToast'
import { get_unSeen_message, total_unSeen_message_update, update_message_count } from '../store/reducers/chatReducer';
import { TbTargetArrow } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet_bg, page_color, sidebar } from '../color/colors'


const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <RxDashboard /> },
    { path: '/admin/category', label: 'Category', icon: <VscDiffAdded /> },
    { path: '/admin/add-product', label: 'Add Product', icon: <VscDiffAdded /> },
    { path: '/admin/products', label: 'All Products', icon: <RiProductHuntLine /> },
    { path: '/admin/orders', label: 'Orders', icon: <AiOutlineShoppingCart /> },
    { path: '/admin/refund_request', label: 'Refund Request', icon: <MdOutlineRequestPage /> },
    { path: '/admin/banners', label: 'All Banners', icon: <GiKnightBanner /> },
    { path: '/admin/payments', label: 'Payments', icon: <BsCurrencyDollar /> },
    { path: '/admin/chat_customer', label: 'Chat Customer', icon: <IoChatboxEllipsesOutline /> },
    { path: '/admin/target-country', label: 'Target Country', icon: <TbTargetArrow /> },
    { path: '/admin/profile', label: 'Profile', icon: <FaRegCircleUser /> },
]

const MainLayout = () => {
    const { pathname } = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showSidebar, setShowSidebar] = useState(false)
    const [recevedMessage, setRecevedMessage] = useState('')

    const { role, userInfo } = useSelector(state => state.auth)
    const { total_unSeen_message, unSeen_message, message_senderImage, senderMessageCount, successMessage } = useSelector((state) => state.chat);



    const Logout = () => {
        dispatch(logout({ navigate, role }))
    };

    useEffect(() => {
        socket.emit('join_admin')
    }, [userInfo])


    useEffect(() => {
        const handleMessage = (msg) => {
            setRecevedMessage(msg);
            dispatch(update_message_count(msg.senderId))
        };

        socket.on('received_user_message', handleMessage);

        return () => {
            socket.off('received_user_message', handleMessage);
        };
    }, [socket]);


    useEffect(() => {

        if (!recevedMessage) return;
        if (pathname !== `/admin/chat_customer/${recevedMessage.senderId}`) {
            showCustomToast({
                name: recevedMessage.senderName,
                message: recevedMessage.message,
                senderId: recevedMessage.senderId,
                image: recevedMessage.image,
                navigate,
            });

            if (recevedMessage.senderId) {
                dispatch(total_unSeen_message_update(recevedMessage.senderId));
            }

        }

        setRecevedMessage('');
    }, [recevedMessage, pathname]);



    return (
        <div className='flex relative min-h-screen overflow-hidden'>
            {/* Sidebar */}
            <div className={`rounded-md z-50 max-lg:absolute w-[220px] max-lg:ml-4 ${page_color?.bg} transition-all duration-300 ${showSidebar ? '-left-4' : '-left-[360px]'}`}>
                <div className={`flex justify-between p-4 max-lg:text-xl border-b-4 ${sidebar?.header}`}>
                    <span className='lg:text-2xl'>My app</span>
                    <span onClick={() => setShowSidebar(false)} className={`cursor-pointer p-1 lg:hidden ${sidebar?.bt_IoClose}`}><IoClose /></span>
                </div>
                <ul className={`px-4 pt-3 pb-36  overflow-y-auto scrollbar-thick h-screen ${sidebar?.menuItems_c}`}>
                    {menuItems?.map((item, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex justify-start items-center py-2 my-4 cursor-pointer hover:duration-150 transition-all ${pathname === item.path ? `${page_color?.bg} ${sidebar?.tex_b} rounded-lg  px-3 hover:pl-4` : 'hover:pl-3'}`}
                            whileHover={{ scale: 1.03 }}
                        >
                            <Link to={item.path} className='flex items-center gap-4'>
                                <span className='text-lg'>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </motion.li>
                    ))}

                    {/* Logout Button */}
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        className="flex justify-start items-center py-2 cursor-pointer hover:pl-2 hover:duration-150 transition-all" >                        <div onClick={Logout} className='flex items-center gap-4'>
                            <span className='text-lg'><IoMdLogOut /></span>
                            <span>Logout</span>
                        </div>
                    </motion.li>
                </ul>
            </div>

            {/* Main Content */}
            <div className={`w-[calc(100%-220px)] max-lg:w-full  min-h-screen pt-16 ${Outlet_bg}`}>
                <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
                <div className='h-screen overflow-y-scroll scrollbar-hide'>
                    <div onClick={() => setShowSidebar(false)} className=' p-2 lg:p-5 max-lg:py-2'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout
