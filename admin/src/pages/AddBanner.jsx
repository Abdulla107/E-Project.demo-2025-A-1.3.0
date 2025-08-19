import React from 'react'
import { useState } from 'react';
import { BsImage } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { addBanner, delete_banner, getBanner, messageClear } from '../store/reducers/productReducers';
import { overrideStyle } from '../utils/utils';
import { FadeLoader, PulseLoader } from 'react-spinners';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import offimage from '../assets/offimage.png'
import onimage from '../assets/onimage.png'
import { add_banners, marbel_btn, page_color } from '../color/colors';


const AddBanner = () => {

  const { productId } = useParams()
  const dispatch = useDispatch()
  const [imageShow, setImageShow] = useState('')
  const [show, setShow] = useState()

  const [state, setState] = useState({ image: '' })

  const { loader, banner, errorMessage, successMessage } = useSelector(state => state.product)


  useEffect(() => {
    if (banner.length === 0) {
      setShow(true);
    } else {
      setShow(false)
    }
  }, [banner]);


  const imageHandler = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setImageShow(URL.createObjectURL(files[0]));
      setState({
        ...state,
        image: files[0],
      });
    }
  };

  const isFormValid = () => {
    return (
      productId &&
      imageShow.length > 0
    );
  };

  const add = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', state.image);
    formData.append('productId', productId);

    dispatch(addBanner(formData));
  };


  useEffect(() => {
    dispatch(getBanner(productId))
  }, [productId])

  const getPublicId = (url) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileName}`;
  }

  const deleteHendler = (e, _id, img) => {
    e.preventDefault()
    const public_id = getPublicId(img)
    dispatch(delete_banner({ public_id, _id }))
  }


  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setImageShow('');
      dispatch(getBanner(productId))
    }
  }, [successMessage, errorMessage]);


const img = add_banners?.image || '';
const btn = add_banners?.btn || '';

  return (
    <div>
      {
        loader && <div className={`w-screen h-screen flex justify-center items-center fixed left-0 top-0 ${page_color?.loader} z-[999]`}>
          <FadeLoader />
        </div>
      }
      <div className='px-2 lg:pt-5 mt-2 mx-1'>
        <div className={`${page_color?.bg} px-3 pt-7 pb-10 rounded-md`}>
          <div className='m-1 md:mx-4 lg:mx-5'>
            <div className='mb-5 flex justify-between items-center'>
              <div>
                <img onClick={() => setShow(false)} className={`h-[27px] w-[60px] cursor-pointer ${!show ? 'hidden' : ''}`} src={onimage} />
                <img onClick={() => setShow(true)} className={`h-[27px] w-[60px] cursor-pointer ${show ? 'hidden' : ''}`} src={offimage} />
              </div>
              <Link to={'/admin/products'}  className={`border px-4 py-1 rounded-full ${marbel_btn} focus:ring-2 focus:ring-offset-2`} >All Products</Link>
            </div>

            {show &&
              <form onSubmit={add}>
                <label className={`flex justify-center items-center flex-col w-full h-full border border-dashed ${img.hover} cursor-pointer ${imageShow ? `${img.tru}` : `${img.fal}`} `} htmlFor="image">
                  {imageShow ? (
                    <div className=' border transition-all duration-500'>
                      <div className='relative overflow-hidden'>
                        <img className='w-full h-full' src={imageShow} />
                      </div>
                    </div>
                  ) : (
                    <div className='flex justify-center items-center flex-col w-full my-10 h-[100px]'>
                      <span><BsImage /></span>
                      <span>Select Image</span>
                    </div>
                  )}
                </label>
                <input onChange={imageHandler} className='hidden' type="file" name="image" id="image" />
                <button
                  disabled={!isFormValid() || loader}
                  className={`w-[180px] my-7 px-4 py-2 rounded-md ${!isFormValid() ? `${btn.disabled} cursor-not-allowed` : `border ${btn.active} transition-all focus:outline-none focus:ring-offset-2 cursor-pointer`}`}>
                  Add Product Banner
                </button>
              </form>
            }
            <div className=' p-4 mt-5'>
              <h1 className='mb-7 text-xl font-semibold text-gray-700'>Total Banner : {banner.length || 0}</h1>
              {banner?.map((d, i) =>
                <div key={i} className={`border group transition-all duration-500 hover:shadow-md mb-5 ${page_color?.bg}`}>
                  <div className='relative overflow-hidden'>
                    <img className='w-full h-full' src={d.image} alt="banner" />
                    <span onClick={(e) => deleteHendler(e, d._id, d.image)} className={`p-2 z-10 cursor-pointer ${btn.delete} hover:shadow-lg hover:rotate-[720deg] transition-all absolute top-3 right-3 rounded-full`}><FaTrash /></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBanner
