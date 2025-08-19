import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { FaEye } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Ratings from '../Ratings'
import { add_to_card, messageClear, add_to_wishlist } from '../../store/reducers/cardReducer'
import { home_color, product_card_color } from '../../color/colors'


const FeatucProducts = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [show, setShow] = useState(null)

    const { userInfo } = useSelector(state => state.auth)
    const { successMessage, errorMessage } = useSelector(state => state.card);
    const { faeaturlProducts } = useSelector(state => state.product)

    const handleClick = (index) => {
        if (window.innerWidth < 1024) {
            setShow(prev => (prev === index ? null : index));
        }
    };


    const add_card = (id, delivery_charge) => {
        if (userInfo) {
            dispatch(add_to_card({
                userId: userInfo.id,
                quantity: 1,
                productId: id,
                delivery_charge
            }))
        } else {
            navigate('/login')
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

    const color = home_color?.category_color?.featuc_product_color || '';
    const p_color = product_card_color || '';
    const img_d = product_card_color.image_discount || '';
    const btn = product_card_color.btn || '';

    return (
        <div className={`py-[45px] ${color.bg}`}>
            <div className="w-[90%] mx-auto">
                {/* Title Section */}
                <div className={`text-center text-xl font-bold pb-[30px] ${color.title.text}`}>
                    <h2>Feature Products</h2>
                    <div className={`w-[100px] h-[2px] mx-auto mt-2 ${color.title.bg_b}`}></div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {faeaturlProducts.map((p, i) => (
                        <div key={i} onClick={() => handleClick(i)} className={`border ${p_color.border} rounded-md group transition-all duration-500 hover:shadow-lg hover:-mt-2`} >
                            {/* Image + Discount */}
                            <div className="relative overflow-hidden">
                                {p.discount ? (
                                    <div className={`flex justify-center items-center absolute ${img_d.text} w-[38px] h-[38px] rounded-full ${img_d.bg} font-semibold text-xs left-2 top-2`}>
                                        {p.discount}%
                                    </div>
                                ) : null}

                                <img
                                    className="w-full h-[150px] sm:h-[220px] object-fill rounded-md"
                                    src={p.images[0]}
                                    alt="product image"
                                />

                                {/* Action Buttons */}
                                <ul className={`flex transition-all duration-700 -bottom-10 justify-center items-center gap-2 absolute w-full group-hover:bottom-3 ${show === i ? "bottom-3 md:bottom-3" : ""}`} >
                                    <li
                                        onClick={() => add_wishlist(p)}
                                        className={`w-[38px] h-[38px] cursor-pointer ${btn.bg} flex justify-center items-center rounded-full ${btn.hover} hover:rotate-[720deg] transition-all`}
                                    >
                                        <AiFillHeart />
                                    </li>

                                    <Link
                                        to={`/product/details/${encodeURIComponent(p.slug)}/${p._id}`}
                                        className={`w-[38px] h-[38px] cursor-pointer ${btn.bg} flex justify-center items-center rounded-full ${btn.hover} hover:rotate-[720deg] transition-all`}
                                    >
                                        <FaEye />
                                    </Link>

                                    <li
                                        onClick={() => add_card(p._id, p.delivery_charge)}
                                        className={`w-[38px] h-[38px] cursor-pointer ${btn.bg} flex justify-center items-center rounded-full ${btn.hover} hover:rotate-[720deg] transition-all`}
                                    >
                                        <AiOutlineShoppingCart />
                                    </li>
                                </ul>
                            </div>

                            {/* Product Info */}
                            <div className="py-3 px-2">
                                <div className="flex justify-between items-center text-lg md:text-xl py-3 gap-3">
                                    <span className={`font-bold ${p_color.info_color.price_color}`}>${p.price}</span>
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
            </div>
        </div>

    )
}

export default FeatucProducts
