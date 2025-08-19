import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineMessage } from 'react-icons/md';
import { FaList, FaSignOutAlt } from 'react-icons/fa';
import { RiCloseLargeLine } from 'react-icons/ri';
import { logout } from '../store/reducers/authReducer';
import NotFound from '../pages/NotFound';
import Header from '../components/Header';
import { get_user_unSaw_message } from '../store/reducers/chatReducer';
import { page_color } from '../color/colors';
import { dashboard_layoutColors } from '../color/colors';

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const { total_unSaw_message } = useSelector(state => state.chat);

  const Logout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_user_unSaw_message(userInfo.id));
    }
  }, [userInfo?.id]);

  return (
    <div className={`${page_color?.outlet_bg}`}>
      <Header />
      <div className="flex relative min-h-screen mt-8 overflow-hidden">
        {/* Sidebar */}
        <div className={`rounded-md z-40 max-lg:absolute w-[220px] max-lg:ml-4 ${dashboard_layoutColors.sidebarBg} transition-all duration-300 mb-5 ${showSidebar ? '-left-4' : '-left-[360px]'}`}>
          <div className='flex justify-end items-center p-2 lg:hidden'>
            <button onClick={() => setShowSidebar(false)} className={`cursor-pointer ${dashboard_layoutColors.sidebarBtn}`}>
              <RiCloseLargeLine />
            </button>
          </div>

          <ul className={`px-4 lg:pt-3 pb-36 ${dashboard_layoutColors.sidebarText} overflow-y-auto h-screen`}>
            <li className={`flex justify-start items-center py-2 my-4 cursor-pointer hover:duration-150 transition-all ${pathname === '/dashboard' ? `rounded-lg ${dashboard_layoutColors.sidebarLinkActiveBg} ${dashboard_layoutColors.sidebarLinkActiveText} px-3 ${dashboard_layoutColors.sidebarLinkHoverPadding}` : dashboard_layoutColors.sidebarLinkHoverDefault}`} >
              <Link to={'/dashboard'} className='flex items-center gap-4'>
                <span className='text-lg'> <RxDashboard /></span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={`flex justify-start items-center py-2 my-4 cursor-pointer hover:duration-150 transition-all ${pathname === '/dashboard/orders' ? `rounded-lg ${dashboard_layoutColors.sidebarLinkActiveBg} ${dashboard_layoutColors.sidebarLinkActiveText} px-3 ${dashboard_layoutColors.sidebarLinkHoverPadding}` : dashboard_layoutColors.sidebarLinkHoverDefault}`} >
              <Link to={'/dashboard/orders'} className='flex items-center gap-4'>
                <span className='text-lg'> <AiOutlineShoppingCart /></span>
                <span>Orders</span>
              </Link>
            </li>
            <li className={`flex justify-start items-center py-2 my-4 cursor-pointer hover:duration-150 transition-all ${pathname === "/dashboard/chat-support" ? `rounded-lg ${dashboard_layoutColors.sidebarLinkActiveBg} ${dashboard_layoutColors.sidebarLinkActiveText} px-3 ${dashboard_layoutColors.sidebarLinkHoverPadding}` : dashboard_layoutColors.sidebarLinkHoverDefault}`} >
              <Link to="/dashboard/chat-support" className="flex items-center gap-4 relative">
                <div className="relative text-lg">
                  <MdOutlineMessage />
                  {total_unSaw_message > 0 && (
                    <span className={`absolute -top-2 -right-2 ${dashboard_layoutColors.badgeBg} ${dashboard_layoutColors.badgeText} text-xs w-5 h-5 flex items-center justify-center rounded-full`}>
                      {total_unSaw_message}
                    </span>
                  )}
                </div>
                <span>Chat Support</span>
              </Link>
            </li>
            <li>
              {userInfo?.id &&
                <span onClick={Logout} className={`inline-flex items-center gap-2 ${dashboard_layoutColors.sidebarLogoutText} text-base cursor-pointer hover:duration-150 transition-all hover:pl-2`}>
                  <FaSignOutAlt /> Logout
                </span>
              }
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className='w-[calc(100%-220px)] max-lg:w-full min-h-screen mb-5'>
          <div
            onClick={() => setShowSidebar(!showSidebar)}
            className={`w-[35px] flex h-[35px] m-2 rounded-sm ${dashboard_layoutColors.mobileMenuBtnBg} ${dashboard_layoutColors.mobileMenuBtnHoverBg} justify-center items-center cursor-pointer lg:hidden`}
          >
            <span className={`${dashboard_layoutColors.mobileMenuBtnText}`}><FaList /></span>
          </div>

          <div className='min-h-screen'>
            <div onClick={() => setShowSidebar(false)} className='lg:px-5 max-lg:py-2'>
              {userInfo ? <Outlet /> : <NotFound />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
