import React, { useEffect, useState } from 'react'
import { BsImage } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { RiCloseLargeLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast';
import { FadeLoader } from "react-spinners";
import { addCategory, messageClear, getCategory, delete_category } from './../store/reducers/categoryReducer';
import ConfirmModal from '../components/ConfirmModal'
import { action_icon, category, marbel_btn, page_color } from '../color/colors'


const Category = () => {

  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [imageShow, setImageShow] = useState('')

  const [state, setState] = useState({ name: '', image: '' })

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ id: null, image: [] });


  const { userInfo } = useSelector(state => state.auth)
  const { loader, successMessage, errorMessage, categorys } = useSelector(state => state.category);


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
      state.name &&
      imageShow.length > 0
    );
  };

  const add = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append('image', state.image);

    dispatch(addCategory(formData));
  };

  function getPublicId(url) {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileName}`;
  }


  const deleteHandler = (imageUrl, _id) => {
    const public_id = getPublicId(imageUrl);

    dispatch(delete_category({ public_id, _id }));
  };


  useEffect(() => {
    dispatch(getCategory())
  }, [userInfo.id])


  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    };
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear())
      dispatch(getCategory())
      setState({ name: '', image: '' });
      setImageShow('')
    };
  }, [successMessage, errorMessage]);

  const border = page_color?.border || '';
  const panel = category?.panel || '';
  const img = panel?.img || '';


  return (
    <div>
      {
        loader && <div className={`w-screen h-screen flex justify-center items-center fixed left-0 top-0 ${page_color?.loader} z-[999]`}>
          <FadeLoader />
        </div>
      }
      <div className='px-2 my-2 mx-1'>
        <div className={`flex justify-between items-center mb-3 p-4 rounded-md ${page_color?.bg}`}>
          <h1 className='text-lg font-semibold'>Categorys</h1>
          <button onClick={() => setShow(true)} className={` rounded-md cursor-pointer ${category?.btn}`}>Add Category</button>
        </div>
        <div className='flex flex-wrap w-full'>
          <div className='w-full'>
            <div className={`w-full p-4 rounded-md ${page_color?.bg}`}>
              <div className=' relative overflow-x-auto'>
                <table className='w-full text-sm '>
                  <thead className={`border-b uppercase ${border.thead}`}>
                    <tr>
                      <th scope='col' className='px-4 py-3 text-nowrap'>NO</th>
                      <th scope='col' className='px-4 py-3 text-nowrap'>Image</th>
                      <th scope='col' className='px-4 py-3 text-nowrap'>Name</th>
                      <th scope='col' className='px-4 py-3 text-nowrap'>Action</th>
                    </tr>
                  </thead>
                  {categorys && categorys.length > 0 ? (
                    <tbody>
                      {categorys?.map((d, i) => (
                        <tr key={i} className={`border-b text-center ${border.tbody}`}>
                          <td scope='row' className='px-4 py-2 font-medium text-nowrap'>{i + 1}</td>
                          <td scope='row' className='px-4 py-2 font-semibold text-nowrap flex justify-center items-center'>
                            <img className='h-[45px] w-[45px] ' src={d?.image} alt="category" />
                          </td>
                          <td scope='row' className='px-4 py-2 font-semibold text-nowrap'>{d?.name}</td>
                          <td scope='row' className='px-4 py-2 font-semibold text-nowrap'>
                            <div className='flex gap-4 justify-center'>
                              <span
                                onClick={() => {
                                  setDeleteData({ image: d?.image, id: d?._id });
                                  setIsModalOpen(true);
                                }}
                                className={`p-[6px] rounded-md cursor-pointer ${action_icon?.delete}`}><FaTrash /></span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>) : (<tbody>
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No Categorys Found!.
                        </td>
                      </tr>
                    </tbody>
                  )
                  }
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Add Category Panel  */}
        <div className={`fixed top-0 right-0 w-[320px] ${panel.bg} transition-all duration-500 x-[9999] ${show ? 'translate-x-0 mt-17 ' : 'translate-x-full'}`}>
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h1 className='text-xl font-semibold'>Add Category</h1>
              <button onClick={() => setShow(false)} className={`cursor-pointer  px-2 py-1 ${panel.btn} rounded-sm hover:shadow-lg hover:shadow-red-600/40 `}><RiCloseLargeLine /></button>
            </div>
            <form onSubmit={add}>

              <div>
                <label className={`flex justify-center items-center flex-col w-full h-[238px] border border-dashed ${img.hover} cursor-pointer ${imageShow ? `${img.imgShow}` : `${img.imgNot}`} `} htmlFor="image">
                  {imageShow ? (
                    <img className='w-full h-full' src={imageShow} />
                  ) : (
                    <>
                      <span><BsImage /></span>
                      <span>Select Image</span>
                    </>
                  )}
                </label>
              </div>
              <input onChange={imageHandler} className='hidden' type="file" name="image" id="image" required />
              <div className='flex flex-col gap-2 mt-5'>
                <label htmlFor="name">Category name</label>
                <input
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                  className={`px-4 py-2 rounded-md outline-none ${img.img_name}`} type="text" name="category_name" id="name" placeholder='Category name' required />
              </div>
              <button
                disabled={!isFormValid() || loader}
                className={`w-full my-7 px-4 py-1 rounded-md ${!isFormValid() ? `${img.btn_disabled} cursor-not-allowed` : `border ${marbel_btn} transition-all focus:outline-none focus:ring-offset-2 cursor-pointer`}`}>
                Add Category
              </button>
            </form>
          </div>
        </div>

        {isModalOpen &&
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              deleteHandler(deleteData.image, deleteData.id);
              setIsModalOpen(false);
            }}
          />
        }
      </div>
    </div>
  )
}

export default Category
