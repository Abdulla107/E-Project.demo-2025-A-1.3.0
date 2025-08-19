import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import { FadeLoader } from 'react-spinners';
import { page_color } from '../color/colors';


const MainLayout = () => {
  const [searchValue, setSearchValue] = useState('')
  const { loader } = useSelector((state) => state.auth);



  return (
    <div>
      {loader && (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.53)] bg-opacity-40 z-50">
          <FadeLoader color="#dedddd" />
        </div>
      )}
      <div className={`${page_color?.outlet_bg} min-h-screen`}>
        <Header setSearchValue={setSearchValue} />
        <div className='p-1 md:p-5'>
          <Outlet context={{ searchValue }} />
        </div>
        <div className='mt-5'>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
