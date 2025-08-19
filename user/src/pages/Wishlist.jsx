import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Ratings from '../components/Ratings';
import { Link, useNavigate } from 'react-router-dom';
import {
  add_to_card,
  messageClear,
  get_wishlist_products,
  remove_to_wishlist
} from '../store/reducers/cardReducer';
import toast from 'react-hot-toast';
import { page_color, product_card_color, wishlist_color } from '../color/colors';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(null);

  const { userInfo } = useSelector(state => state.auth);
  const { successMessage, errorMessage, wishlist_products } = useSelector(state => state.card);

  const handleClick = (index) => {
    if (window.innerWidth < 1024) {
      setShow(prev => (prev === index ? null : index));
    }
  };

  const add_card = (productId, delivery_charge) => {
    if (userInfo) {
      dispatch(add_to_card({
        userId: userInfo.id,
        quantity: 1,
        productId,
        delivery_charge
      }));
    } else {
      navigate('/login');
    }
  };

  const remove_wishlist = (pro) => {
    if (userInfo) {
      dispatch(remove_to_wishlist({
        userId: userInfo.id,
        wishlistId: pro._id,
      }));
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_wishlist_products(userInfo.id));
    }
  }, [userInfo?.id, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      if (userInfo?.id) {
        dispatch(get_wishlist_products(userInfo.id));
      }
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch, userInfo?.id]);

  const p_color = product_card_color || '';
  const img_d = product_card_color.image_discount || '';
  const btn = product_card_color.btn || '';

  return (
    <div className={`py-[45px] rounded-md ${page_color?.bg}`}>
      <div className='w-[90%] mx-auto'>
        {wishlist_products?.length > 0 ? (
          <>
            <div className={`text-center text-xl ${wishlist_color?.text} font-bold pb-[45px]`}>
              <h1>Wishlist Products</h1>
              <div className={`w-[100px] h-[2px] mx-auto mt-2 ${wishlist_color?.title_buttom_line}`}></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {wishlist_products.map((p, i) => (
                <div
                  key={i}
                  onClick={() => handleClick(i)}
                  className={`border ${p_color.border} rounded-md group transition-all duration-500 hover:shadow-lg hover:-mt-2`}
                >
                  {/* Image + Discount */}
                  <div className="relative overflow-hidden">
                    {p.discount ? (
                      <div className={`flex justify-center items-center absolute ${img_d.text} w-[38px] h-[38px] rounded-full ${img_d.bg} font-semibold text-xs left-2 top-2`}>
                        {p.discount}%
                      </div>
                    ) : null}

                    <img
                      className="w-full h-[150px] sm:h-[220px] object-fill rounded-md"
                      src={p.image}
                      alt={p.name}
                    />

                    {/* Action Buttons */}
                    <ul className={`flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3 ${show === i ? "bottom-3 md:bottom-3" : ""}`}>
                      <li
                        onClick={(e) => { e.stopPropagation(); remove_wishlist(p); }}
                        className={`w-[38px] h-[38px] cursor-pointer ${btn.bg} flex justify-center items-center rounded-full ${btn.hover} transition-all`}
                      >
                        <AiFillHeart />
                      </li>

                      <Link
                        to={`/product/details/${encodeURIComponent(p.slug)}/${p.productId}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-[38px] h-[38px] cursor-pointer ${btn.bg} flex justify-center items-center rounded-full ${btn.hover} transition-all`}
                      >
                        <FaEye />
                      </Link>

                      <li
                        onClick={(e) => { e.stopPropagation(); add_card(p.productId, p.delivery_charge); }}
                        className={`w-[38px] h-[38px] cursor-pointer ${btn.bg} flex justify-center items-center rounded-full ${btn.hover} transition-all`}
                      >
                        <AiOutlineShoppingCart />
                      </li>
                    </ul>
                  </div>

                  {/* Product Info */}
                  <div className="py-3 px-2">
                    <div className="flex justify-between items-center text-lg md:text-xl py-3 gap-3">
                      <span className={`font-bold ${p_color.info_color.price_color}`}>
                        ${Number(p.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex">
                      <Ratings ratings={p.rating} />
                    </div>
                    <h2 className={`text-base md:text-lg text-start font-semibold mb-2 line-clamp-2 ${p_color.info_color.name_color}`}>
                      {p.name}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className={`text-2xl mb-4 ${wishlist_color?.text}`}>Your wishlist is empty!</h2>
            <Link to="/shop" className={`${wishlist_color?.btn} px-5 py-1 rounded transition`}>
              Shop Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
