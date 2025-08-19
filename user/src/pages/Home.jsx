import React, { useEffect } from 'react'
import Banner from '../components/Banner'
import { useDispatch } from 'react-redux'
import { get_banners, get_faeaturl_products } from '../store/reducers/productReducer';
import Categorys from '../components/Categorys';
import FeatucProducts from '../components/products/FeatucProduct';
import { page_color } from '../color/colors';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get_banners())
  })

   useEffect(() => {
    dispatch(get_faeaturl_products())
  }, [])


  return (
    <div className={`${page_color?.bg} min-h-screen rounded-md`}>
      <Banner />
      <Categorys/>
      <FeatucProducts/>
    </div>
  )
}

export default Home
