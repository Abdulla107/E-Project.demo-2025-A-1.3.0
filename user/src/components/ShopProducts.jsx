import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Ratings from "../components/Ratings";
import { useDispatch, useSelector } from 'react-redux';
import { add_to_card, add_to_wishlist, messageClear } from '../store/reducers/cardReducer.js'
import { toast } from 'react-hot-toast';
import { shop_color } from "../color/colors.js";

const ShopProducts = ({ styles, products }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
     const [show, setShow] = useState(null)

    const { userInfo } = useSelector((state) => state.auth);
    const { successMessage, errorMessage } = useSelector((state) => state.card);

    const handleClick = (index) => {
    if (window.innerWidth < 1024) {
      setShow(prev => (prev === index ? null : index));
    }
  };

    const add_card = (id, delivery_charge) => {
        if (userInfo) {
            dispatch(
                add_to_card({
                    userId: userInfo.id,
                    quantity: 1,
                    productId: id,
                    delivery_charge,
                })
            );
        } else {
            navigate("/login");
        }
    };

    const add_wishlist = (pro) => {
        if (userInfo) {
            dispatch(add_to_wishlist({
                userId: userInfo.id,
                productId: pro._id,
                name: pro.name,
                price: pro.price,
                image: pro.images[0],
                discount: pro.discount,
                rating: pro.rating,
                slug: pro.slug,
                delivery_charge: pro.delivery_charge,
            }))
        } else {
            navigate('/login')
        }
    };


    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [errorMessage, successMessage])

    const color = shop_color?.shop_product_color || '';

  return (
  <div className={`w-full gap-6 ${ styles === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col" }`}>
    {products.map((p, i) => (
      <div
      key={i}
      onClick={() => handleClick(i)}
        className={`group ring-2 ${color.product_color} rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex ${
          styles === "grid" ? "flex-col" : "flex-col sm:flex-row gap-5"
        }`}
      >
        {/* Image Section */}
        <div
          className={`relative overflow-hidden rounded-t-xl sm:rounded-xl ${
            styles === "grid"
              ? "h-[150px] sm:h-[240px] md:h-[200px] lg:h-[200px] "
              : "w-full sm:w-2/5 h-[180px] sm:h-[220px] md:h-[150px] lg:h-[180px]"
          }`}
        >
          {p.discount && (
            <div className={`absolute top-3 left-3 ${color.discount_color} text-xs font-semibold w-9 h-9 flex justify-center items-center rounded-full shadow-lg z-20`}>
              {p.discount}%
            </div>
          )}

          <img
            src={p.images[0]}
            alt={p.name}
            className="w-full h-full object-fill rounded-t-xl sm:rounded-xl transition-transform duration-500 group-hover:scale-105"
          />

          {/* Action Icons */}
          <ul
            className={`flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3 ${
              show === i ? "bottom-3 md:bottom-3" : ""
            }`}
          >
            <li
              onClick={() => add_wishlist(p)}
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${color.action_icon_color} shadow-lg transition-colors`}
              title="Add to Wishlist"
            >
              <AiFillHeart />
            </li>

            <Link
              to={`/product/details/${encodeURIComponent(p.slug)}/${p._id}`}
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${color.action_icon_color} shadow-lg transition-colors`}
              title="View Details"
            >
              <FaEye />
            </Link>

            <li
              onClick={() => add_card(p._id, p.delivery_charge)}
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${color.action_icon_color} shadow-lg transition-colors`}
              title="Add to Cart"
            >
              <AiOutlineShoppingCart />
            </li>
          </ul>
        </div>

        {/* Product Info */}
        <div
          className={`px-2 flex flex-col justify-between ${
            styles === "grid" ? "" : "sm:w-3/5 h-[100px pt-2"
          }`}
        >
          <div className="flex justify-between items-center text-xl py-3">
            <span className={`font-bold ${color.price_color}`}>${p.price}</span>
          </div>
          <div className="flex">
            <Ratings ratings={p.rating} />
          </div>
          <h2 className={`text-base sm:text-lg text-start font-semibold ${color.text_n} mb-2 line-clamp-2`}>
            {p.name}
          </h2>

        </div>
      </div>
    ))}
  </div>
);

};

export default ShopProducts;
