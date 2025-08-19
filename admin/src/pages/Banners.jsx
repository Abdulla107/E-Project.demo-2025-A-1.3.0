import React, { useEffect } from 'react'
import { FaEye } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { get_banners } from '../store/reducers/productReducers'
import { banners_color, page_color } from '../color/colors'

const Banners = () => {

  const dispatch = useDispatch()
  const { banners } = useSelector(state => state.product)


  useEffect(() => {
    dispatch(get_banners())
  }, [])

  return (
    <div className='px-2 my-2 mx-1'>
      <div className={`${page_color?.bg} min-h-screen px-3 pt-7 rounded-md`}>
        <div className='m-1 md:mx-4 lg:mx-5'>
          {banners && banners.length > 0 ? <>
            <h1 className={`mb-7 text-xl font-semibold ${banners_color?.text}`}>Total Banner : {banners.length || 0}</h1>
            {banners?.map((d, i) =>
              <div key={i} className={`border ${banners_color?.border} group transition-all duration-500 hover:shadow-md mb-5`}>
                <div className='relative overflow-hidden'>
                  <img className='w-full h-full' src={d.image} alt="banner" />
                  <Link to={`/admin/product/details/${d.productId}`} className={`p-2 z-10 cursor-pointer ${banners_color?.faEye_color} hover:shadow-lg hover:rotate-[720deg] transition-all absolute top-3 right-3 rounded-full`}><FaEye /></Link>
                </div>
              </div>
            )}
          </> : <> <h1 className={`text-xl text-center mt-[5%] ${banners_color?.banner_fal_text}`}>There is no banner, please add a banner as soon as possible.</h1> </>
          }
        </div>
      </div>
    </div>
  )
}

export default Banners
