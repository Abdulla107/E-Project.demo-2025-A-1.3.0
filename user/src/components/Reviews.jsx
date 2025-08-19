import React, { useState } from 'react';
import Ratings from './Ratings';
import { useDispatch, useSelector } from 'react-redux';
import RatingReact from 'react-rating';
import { CiStar } from 'react-icons/ci';
import { AiFillStar } from 'react-icons/ai';
import { add_customer_review, get_reviews, messageClear, review_authorise } from '../store/reducers/homeReducer';
import { useEffect } from 'react';
import toast from 'react-hot-toast'
import PulseLoader from 'react-spinners/PulseLoader';
import { Link } from 'react-router-dom';
import RatingSection from './RatingSection';

const Reviews = ({ product }) => {

  const dispatch = useDispatch();
  const [rat, setRat] = useState('');
  const [rev, setRev] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const { userInfo } = useSelector(state => state.auth)
  const { successMessage, errorMessage, loader, totalReview, order_review } = useSelector(state => state.home)


  const reviewHandler = (e) => {
    e.preventDefault()
    const info = {
      name: userInfo.name,
      review: rev,
      rating: rat,
      productId: product._id
    }
    dispatch(add_customer_review(info))
  }

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(get_reviews({
        productId: product._id,
        pageNumber
      }))

      setRat('')
      setRev('')
      dispatch(messageClear())

    } else if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }

  }, [successMessage, errorMessage])

  useEffect(() => {
    if (product._id) {
      dispatch(get_reviews({
        productId: product._id,
        pageNumber
      }))
    }
  }, [pageNumber, product])

  useEffect(() => {
    if (userInfo.id && product._id) {
      dispatch(review_authorise({ productId: product._id, customerId: userInfo.id }))
    }
  }, [product, userInfo])

  return (
    <div className='mt-8'>
      <div className='flex gap-10 md:flex-col'>
        <div className='flex flex-col gap-2 justify-start items-start py-4'>
          <div>
            <span className='text-6xl font-semibold'>{product?.rating || 0}</span>
            <span className='text-3xl font-semibold text-slate-600'>/5</span>
          </div>
          <div className='flex text-4xl'>
            <Ratings ratings={product?.rating} />
          </div>
          <p className='text-sm text-slate-600'>{totalReview} Reviews</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <RatingSection pageNumber={pageNumber} setPageNumber={setPageNumber} />
      </div>

      {
        userInfo ?
          <div className={`${order_review ? 'flex flex-col gap-3' : 'hidden'} `}>
            <div className='flex gap-1'>
              <RatingReact
                onChange={(e) => setRat(e)}
                initialRating={rat}
                emptySymbol={<span className='text-slate-600 text-4xl'><CiStar /></span>}
                fullSymbol={<span className='text-[#EDBB0E] text-4xl'><AiFillStar /></span>}
              />
            </div>
            <form onSubmit={reviewHandler}>
              <textarea
                name="" id="" cols="30" rows="5" maxLength={'500'} value={rev}
                onChange={(e) => setRev(e.target.value)}
                className='border outline-none border-slate-400 focus:border-slate-700 p-3 w-full resize-none'
              ></textarea>
              <div>
                <button
                  disabled={!rev || loader}
                  className={`w-[100px] my-7 px-4 py-1 rounded-md ${!rev || loader ? 'bg-gray-400 cursor-not-allowed' : 'border border-purple-600 transition-all bg-indigo-50 text-purple-600 hover:bg-purple-300 focus:outline-none focus:bg-purple-600 focus:text-white focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 cursor-pointer'}`}>
                  {loader ? (
                    <PulseLoader size={12} color="#9810fa" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div> : <div className='flex gap-4'>
            <Link className='py-1 px-5 bg-indigo-500 text-white rounded-sm' to='/login'>Login</Link>
            <Link className='py-1 px-5 bg-indigo-500 text-white rounded-sm' to='/register'>Register</Link>
          </div>
      }
    </div>
  )
}

export default Reviews;
