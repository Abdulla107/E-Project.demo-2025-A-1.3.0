import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get_product } from '../store/reducers/productReducers'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Ratings from '../components/Ratings'
import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import Reviews from '../components/reviews/Reviews'
import { page_color, product_deatils } from '../color/colors'

const ProductDetails = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const [state, setState] = useState('reviews')

  const [image, setImage] = useState()

  const { product, totalReview } = useSelector(state => state.product)

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 768, min: 640 },
      items: 3
    },
    smallMobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1
    }
  };


  useEffect(() => {
    dispatch(get_product(productId))
  }, [productId])

  return (
    <div className='px-2 max-md:mt-2 mx-1'>
      <div className={`w-full ${page_color?.bg} rounded-md min-h-screen`}>
        <div className='px-3 py-8'>
          <section className='w-[95%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16 grid '>
            <div className='grid grid-cols-2 max-lg:grid-cols-1 gap-8'>
              <div>
                <div className='p-4 border'>
                  <img className='md:h-[500px] max-h-[400px] w-full' src={image ? image : product.images?.[0]} alt="image" />
                </div>
                <div className='py-5 relative z-40 max-md:px-8 '>
                  {product?.images?.length > 1 && (
                    <Carousel
                      autoPlay={false}
                      infinite={true}
                      responsive={responsive}
                      transitionDuration={500}
                    >
                      {product?.images?.map((img, i) => (
                        <div key={i} onClick={() => setImage(img)} className={`flex justify-center border-2 ${product_deatils?.setImage_border}  mx-1`}>
                          <img
                            className={`h-[120px] w-full cursor-pointer ${img === image ? `border-3 ${product_deatils?.img_border}` : ''}`}
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
              <div className={` font-bold ${product_deatils?.p_name}`}>
                  <h1>{product.name}</h1>
                </div>
                <div className='flex justify-start items-center gap-4'>
                  <div className='flex text-xl'>
                    <Ratings ratings={product.rating} />
                  </div>
                  <span className={`${product_deatils?.text_g}`}>{totalReview || 0} reviews</span>
                </div>
                <div className='flex flex-col'>
                  <span className={`${product.stock ? `${product_deatils?.text_g}` : `${product_deatils?.text_r}`}`}>
                    {product.stock ? `In Stock(${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <div className={`flex gap-2 text-2xl ${product_deatils?.text_r} font-bold items-center flex-wrap`}>
                  {product && product.discount > 0 ? (
                    <>
                      <span className={`line-through ${product_deatils?.text_gr}`}>
                        ${product.price.toFixed(2)}
                      </span>
                      <span>
                        ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                      </span>
                      <span className={`text-sm ${product_deatils?.text_g}`}>
                        (-{product.discount}%)
                      </span>
                    </>
                  ) : (
                    <span>Price: ${product?.price?.toFixed(2)}</span>
                  )}
                </div>
                <div className={`${product_deatils?.text_gr}`}>
                  <p>{product?.description?.slice(0, 400)}...</p>
                </div>

              </div>
            </div>
          </section>
          {/* product Reviews */}
          <section>
            <div className='w-[95%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto pb-16'>
              <div className='flex flex-wrap'>
                <div className='w-[99%] md-lg:w-full'>
                  <div className='pr-4 md-lg:pr-0'>
                    <div className='grid grid-cols-2 gap-3'>
                      <button onClick={() => setState('reviews')} className={`py-1 ${product_deatils?.btn} mr-2 ${state === 'reviews' ? `${product_deatils?.btn_tr}` : `${product_deatils?.btn_fal}`} rounded-sm`}>Reviews</button>
                      <button onClick={() => setState('description')} className={`py-1 px-4 ${product_deatils?.btn} ${state === 'description' ? `${product_deatils?.btn_tr}` : `${product_deatils?.btn_fal}`} rounded-sm`}>Description</button>
                    </div>
                    <div>
                      {
                        state === 'reviews' ? <Reviews product={product} /> : <p className={`py-5 ${product_deatils?.text_gr}`}>{product.description}</p>
                      }
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default ProductDetails
