import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { get_productDetails } from '../store/reducers/homeReducer';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Ratings from '../components/Ratings';
import Reviews from '../components/Reviews';
import { AiFillHeart } from 'react-icons/ai';
import { add_to_card, add_to_wishlist, messageClear } from '../store/reducers/cardReducer';
import toast from 'react-hot-toast';
import { product_details_colors } from '../color/colors';

const ProductDetails = () => {
    const { productId } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [image, setImage] = useState('')
    const [state, setState] = useState('reviews')
    const [quantity, setQuantity] = useState(1)
    const [arrowShow, setArrowShow] = useState(window.innerWidth > 1024);

    const { product, relatedProducts, totalReview } = useSelector(state => state.home)
    const { userInfo } = useSelector(state => state.auth);
    const { successMessage, errorMessage } = useSelector((state) => state.card);


    useEffect(() => {
        const handleResize = () => setArrowShow(window.innerWidth > 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    const inc = () => quantity < product.stock ? setQuantity(quantity + 1) : toast.error('Out of stock')
    const dec = () => quantity > 1 && setQuantity(quantity - 1)

    const add_card = (id, delivery_charge) => {
        if (userInfo) {
            dispatch(add_to_card({ userId: userInfo.id, quantity, productId: id, delivery_charge }));
        } else navigate("/login");
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
        } else navigate('/login')
    };

    useEffect(() => {
        dispatch(get_productDetails(productId))
        setImage('')
    }, [productId])

    useEffect(() => window.scrollTo(0, 0), [productId])

    useEffect(() => {
        if (successMessage) { toast.success(successMessage); dispatch(messageClear()) }
        if (errorMessage) { toast.error(errorMessage); dispatch(messageClear()) }
    }, [errorMessage, successMessage])

    const responsive = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 768 }, items: 4 },
        mobile: { breakpoint: { max: 768, min: 640 }, items: 3 },
        smallMobile: { breakpoint: { max: 640, min: 0 }, items: 2 }
    };

    const responsives = {
        superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 4 },
        mdtablet: { breakpoint: { max: 991, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 768, min: 0 }, items: 3 },
        smmobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
        xsmobile: { breakpoint: { max: 440, min: 0 }, items: 2 }
    }

    // colors---
    const colors = product_details_colors || ''

    return (
        <div className='px-2 max-md:mt-2 mx-1'>
            <div className={`${colors.bg.white} rounded-md min-h-screen`}>
                <div className='px-3 py-8'>
                    <section className='w-[95%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16 grid'>
                        <div className='grid grid-cols-2 max-lg:grid-cols-1 gap-8'>
                            <div>
                                <div className={`p-4 border ${colors.border.gray}`}>
                                    <img className='md:h-[500px] max-h-[400px] w-full' src={image ? image : product.images?.[0]} alt="image" />
                                </div>
                                <div className='py-5 relative z-40 max-md:px-8 '>
                                    {product?.images?.length > 1 && (
                                        <Carousel autoPlay={false} infinite={true} arrows={arrowShow} responsive={responsive} transitionDuration={500}>
                                            {product?.images?.map((img, i) => (
                                                <div key={i} onClick={() => setImage(img)} className={`flex justify-center border-2 ${colors.border.gray} mx-1`}>
                                                    <img
                                                        className={`h-[100px] w-full cursor-pointer ${img === image ? colors.border.active : ''}`}
                                                        src={img}
                                                        alt={`Product image ${i}`}
                                                    />
                                                </div>
                                            ))}
                                        </Carousel>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-col gap-5'>
                                <div className={`${colors.text.secondary} font-bold`}>
                                    <h1>{product.name}</h1>
                                </div>
                                <div className='flex justify-start items-center gap-4'>
                                    <div className='flex text-xl'>
                                        <Ratings ratings={product.rating} />
                                    </div>
                                    <span className={`${colors.text.success}`}>{totalReview || 0} reviews</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className={`${product.stock ? colors.text.success : colors.text.danger}`}>
                                        {product.stock ? `In Stock(${product.stock})` : 'Out of Stock'}
                                    </span>
                                </div>
                                <div className={`flex gap-2 text-2xl font-bold items-center flex-wrap ${colors.text.danger}`}>
                                    {product && product.discount > 0 ? (
                                        <>
                                            <span className={`${colors.text.oldPrice} line-through`}>${product.price.toFixed(2)}</span>
                                            <span>${(product.price - (product.price * product.discount) / 100).toFixed(2)}</span>
                                            <span className={`${colors.text.discount} text-sm`}>(-{product.discount}%)</span>
                                        </>
                                    ) : (<span>Price: ${product?.price?.toFixed(2)}</span>)}
                                </div>
                                <div className='flex gap-3 pb-10 border-b'>
                                    {product?.stock && <>
                                        <div className='flex bg-slate-200 h-[35px] justify-center items-center text-xl rounded-md'>
                                            <div onClick={dec} className='px-3 cursor-pointer'>-</div>
                                            <div className='px-2'>{quantity}</div>
                                            <div onClick={inc} className='px-3 cursor-pointer'>+</div>
                                        </div>
                                        <div>
                                            <button onClick={() => add_card(product._id, product.delivery_charge)} className={`px-5 py-2 h-[35px] cursor-pointer rounded-md ${colors.bg.primary} ${colors.bg.primaryHover} ${colors.text.white}`}>Add</button>
                                        </div>
                                    </>}
                                    <div className='max-[375px]:'>
                                        <div onClick={() => add_wishlist(product)} className={`h-[35px] w-[50px] 2xs:hidden flex justify-center items-center cursor-pointer ${colors.bg.cyan} ${colors.bg.cyanHover} ${colors.text.white} rounded-md`}>
                                            <AiFillHeart />
                                        </div>
                                    </div>
                                </div>
                                <div className={`${colors.text.primary}`}>
                                    <p>{product?.description?.slice(0, 550)}...</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Reviews and Description */}
                    <section>
                        <div className='w-[95%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16'>
                            <div className='flex flex-wrap'>
                                <div className='w-[99%] md-lg:w-full'>
                                    <div className='pr-4 md-lg:pr-0'>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <button onClick={() => setState('reviews')} className={`py-1 hover:text-white px-4 ${colors.hover.green} mr-2 ${state === 'reviews' ? `${colors.bg.success} ${colors.text.white}` : `${colors.bg.secondary} ${colors.text.secondary}`} rounded-sm`}>Reviews</button>
                                            <button onClick={() => setState('description')} className={`py-1 px-4 hover:text-white ${colors.hover.green} ${state === 'description' ? `${colors.bg.success} ${colors.text.white}` : `${colors.bg.secondary} ${colors.text.secondary}`} rounded-sm`}>Description</button>
                                        </div>
                                        <div>
                                            {state === 'reviews' ? <Reviews product={product} /> : <p className='py-5'>{product.description}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Related Products */}
                    <section className='w-[90%] mx-auto relative z-40'>
                        {relatedProducts?.length > 0 && <h2 className={`${colors.text.secondary} text-2xl py-8`}>Related Products</h2>}
                        <Carousel autoPlay={false} infinite={true} arrows={arrowShow} responsive={responsives} transitionDuration={500}>
                            {relatedProducts?.map((p, i) => (
                                <Link to={`/product/details/${encodeURIComponent(p.slug)}/${p._id}`} key={i}>
                                    <div className={`border-2 ${colors.border.gray} rounded-md mx-1 group`}>
                                        <div className='relative h-[130px] sm:h-[150px] md:h-[170px] lg:h-[180px]'>
                                            <img className='w-full h-full object-fill' src={p.images?.[0]} alt={p.name} />
                                            <div className='absolute top-0 left-0 w-full h-full opacity-20'></div>
                                            {p.discount && <div className={`${colors.bg.danger} ${colors.text.white} absolute top-2 left-2 text-xs px-2 py-1 rounded-full`}>{p.discount}%</div>}
                                        </div>
                                        <div className='p-4'>
                                            <div className='flex items-center gap-3'>
                                                <h2 className={`${colors.text.primary} font-bold`}>${p.price}</h2>
                                            </div>
                                            <div className="flex"><Ratings ratings={p.rating} /></div>
                                            <h2 className={`${colors.text.secondary} text-lg font-semibold truncate`}>{p.name}</h2>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </Carousel>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
