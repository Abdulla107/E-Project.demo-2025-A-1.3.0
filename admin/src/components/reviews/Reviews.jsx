import React, { useState } from 'react';
import Ratings from '../../components/Ratings';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import RatingSection from './RatingSection';
import { get_reviews } from '../../store/reducers/productReducers';
import { product_deatils } from '../../color/colors';

const Reviews = ({ product }) => {

    const dispatch = useDispatch();
    const [pageNumber, setPageNumber] = useState(1)

    const { totalReview } = useSelector(state => state.product)


    useEffect(() => {
        if (product._id) {
            dispatch(get_reviews({
                productId: product._id,
                pageNumber
            }))
        }
    }, [pageNumber, product])


    return (
        <div className='mt-8'>
            <div className='flex gap-10 md:flex-col'>
                <div className='flex flex-col gap-2 justify-start items-start py-4'>
                    <div>
                        <span className='text-6xl font-semibold'>{product?.rating || 0}</span>
                        <span className={`text-3xl font-semibold ${product_deatils?.reviews_text}`}>/5</span>
                    </div>
                    <div className='flex text-4xl'>
                        <Ratings ratings={product?.rating} />
                    </div>
                    <p className={`text-sm ${product_deatils?.reviews_text}`}>{totalReview} Reviews</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 py-4">
                <RatingSection pageNumber={pageNumber} setPageNumber={setPageNumber} />
            </div>
        </div>
    )
}

export default Reviews;
