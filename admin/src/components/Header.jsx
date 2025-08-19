import React, { useEffect } from "react";
import { FaList, FaUserCircle } from "react-icons/fa";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { get_unSeen_message } from "../store/reducers/chatReducer";
import Message_N_Dropdown from "./Message_N_Dropdown";
import { get_new_ordersCount } from "../store/reducers/authReducer";
import { Link } from "react-router-dom";
import { header } from "../color/colors";


const Header = ({ showSidebar, setShowSidebar }) => {

  const dispatch = useDispatch();
  const { userInfo, count_new_orders } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(get_unSeen_message())
    dispatch(get_new_ordersCount())
  }, [userInfo])



  return (
    <div className="fixed top-0 left-0 w-full z-40 ">
      <div className={`ml-0 lg:ml-[200px] h-[65px] flex justify-end max-lg:justify-between ${header?.bg} items-center px-5 transition-all border-b-4  py-8`}>
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className={`w-[35px] flex h-[35px] rounded-sm ${header?.btn?.bg} hover:shadow-lg justify-center items-center cursor-pointer lg:hidden`}
        >
          <span className={`${header?.btn?.text}`} >
            <FaList />
          </span>
        </div>

        <div className="flex justify-center items-center gap-8 relative">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center gap-3">

              <Link to={'/admin/orders'} className="relative mr-4">
                <IoNotificationsOutline
                  size={26}
                  className={`${header?.icon?.text} transition`}
                />
                {count_new_orders > 0 && (
                  <span className={`absolute -top-2 -right-2 text-xs w-5 h-5 flex items-center justify-center rounded-full ${header?.icon?.number}`}>
                    {count_new_orders}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Message_N_Dropdown />

              {userInfo?.image ? (
                <img
                  className={`w-[45px] h-[45px] rounded-full overflow-hidden border-2 ${header?.img_border}`}
                  src={userInfo.image}
                  alt="admin"
                />
              ) : (
                <FaUserCircle className={`w-[45px] h-[45px] ${header?.FaUserCircle_text}`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
