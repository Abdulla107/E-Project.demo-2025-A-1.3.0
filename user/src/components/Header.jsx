import React, { useState } from "react";
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import HeaderBottom from "./HeaderBottom";
import { useDispatch, useSelector } from 'react-redux';
import { logout, messageClear } from "../store/reducers/authReducer";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { get_card_products, get_wishlist_products } from "../store/reducers/cardReducer";
import { header_color, page_color, shopName_color } from "../color/colors";

const Header = ({ setSearchValue }) => {

  const dispatch = useDispatch();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { userInfo, successMessage, errorMessage } = useSelector(state => state.auth)
  const { card_product_count, wishlist_count } = useSelector(state => state.card)

  const Logout = (e) => {
    e.preventDefault();
    dispatch(logout())
  };


  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_card_products(userInfo.id))
    }
  }, [userInfo])

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_wishlist_products(userInfo.id))
    }
  }, [userInfo])

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
    }
  }, [errorMessage, successMessage])

  const Wishlist_color = header_color?.Wishlist_color || '';
  const cart_color = header_color?.cart_color || '';
  const profile = header_color?.profile_color || '';

  return (
    <div className={`${page_color?.bg} shadow-md sticky top-0 z-50 w-full`}>
      <div className="max-w-[1550px] mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to={'/'} className={`text-xl sm:text-2xl font-bold ${shopName_color?.fast}`}>
          Shop<span className={`${shopName_color.last}`}>Zone</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 mx-6">
          <SearchBar setSearchValue={setSearchValue} />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          {/* Mobile Search Icon */}
          <button
            className={`md:hidden ${header_color?.search_icon_color}`}
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <FaSearch size={20} />
          </button>

          {/* Wishlist */}
          <Link to={'/wishlist'} className={`relative ${Wishlist_color.main_color}`} >
            <FaHeart size={20} />
            <span className={`absolute -top-2 -right-2 ${Wishlist_color.count_color} text-xs w-5 h-5 flex items-center justify-center rounded-full`}>
              {wishlist_count || 0}
            </span>
          </Link>

          {/* Cart */}
          <Link to={'/card'} className={`relative ${cart_color.main_color}`} >
            <FaShoppingCart size={20} />
            <span className={`absolute -top-2 -right-2 ${cart_color.count_color}  text-xs w-5 h-5 flex items-center justify-center rounded-full`}>
              {card_product_count || 0}
            </span>
          </Link>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="cursor-pointer" >
              {userInfo?.image ? (
                <img
                  className={`w-[40px] h-[40px] rounded-full overflow-hidden border-2 ${profile.img_border}`}
                  src={userInfo.image}
                  alt="User"
                />
              ) : (
                <FaUserCircle className={`w-[40px] h-[40px] ${profile.btn_color}`} />
              )}
            </button>

            {profileOpen && (
              userInfo?.id ? (
                <div onClick={() => setProfileOpen(!profileOpen)} className={`absolute right-0 mt-2 w-44 ${profile.dropdoun.color} shadow-md rounded-md text-md z-50`}>
                  <Link to={'/profile'} className={`block px-4 py-2 ${profile.dropdoun.btn_hover}`} >
                    Profile
                  </Link>
                  <Link to={'/dashboard'} className={`block px-4 py-2 ${profile.dropdoun.btn_hover}`} >
                    Dashboard
                  </Link>
                  <span onClick={Logout} className={`block px-4 py-2 ${profile.dropdoun.btn_hover}`} >
                    Logout
                  </span>
                </div>
              ) : (
                <div className={`absolute right-0 mt-2 w-44 ${profile.dropdoun.color} shadow-md rounded-md text-md z-50`}>
                  <Link to={'/login'} className={`block px-4 py-2 ${profile.dropdoun.btn_hover}`} >
                    Login
                  </Link>
                  <Link to={'/register'} className={`block px-4 py-2 ${profile.dropdoun.btn_hover}`} >
                    Register
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className={`px-4 py-1 border ${profile.header_bottom.border}`}>
        <HeaderBottom />
      </div>

      {/* Mobile Search Popup (with smooth Tailwind animation) */}
      {mobileSearchOpen && (
        <div className=" md:hidden pb-5 mx-5 mt-2 w-[90%] shadow-md rounded-md text-md z-50 flex flex-col animate-[fadeIn_0.3s_ease-out]">
          <SearchBar setSearchValue={setSearchValue} />
        </div>
      )}
    </div>
  );
};

export default Header;
