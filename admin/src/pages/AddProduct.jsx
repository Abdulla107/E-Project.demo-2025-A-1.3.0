import React, { useEffect, useState } from 'react'
import { BsImage } from 'react-icons/bs'
import { IoCloseSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, messageClear } from '../store/reducers/productReducers';
import { PropagateLoader, PulseLoader } from 'react-spinners';
import { overrideStyle } from '../utils/utils';
import toast from 'react-hot-toast';
import { getCategory } from '../store/reducers/categoryReducer';
import { add_product, marbel_btn, page_color } from '../color/colors';

const AddProduct = () => {

  const dispatch = useDispatch()

  const [images, setImages] = useState([])
  const [imageShow, setImageShow] = useState([])
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [cateShow, setCateShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { categorys } = useSelector((state) => state.category);
  const { loader, successMessage, errorMessage } = useSelector(state => state.product)


  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  // image
  const inmageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      setImages([...images, ...files]);
      let imageUrl = [];

      for (let i = 0; i < length; i++) {
        imageUrl.push({ url: URL.createObjectURL(files[i]) });
      }
      setImageShow([...imageShow, ...imageUrl]);
    }
  };
  // image
  const changeImage = (img, index) => {
    if (img) {
      let tempUrl = imageShow;
      let tempImages = images;

      tempImages[index] = img;
      tempUrl[index] = { url: URL.createObjectURL(img) };
      setImageShow([...tempUrl]);
      setImages([...tempImages]);
    }
  };
  // image
  const removeImage = (i) => {
    const filterImage = images.filter((img, index) => index !== i);
    const filterImageUrl = imageShow.filter((img, index) => index !== i);
    setImages(filterImage);
    setImageShow(filterImageUrl);
  };


  const [state, setState] = useState({
    name: '',
    brand: '',
    category: '',
    stock: '',
    price: '',
    discount: '',
    delivery_charge: '',
    description: ''
  })

  const inputHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  useEffect((e) => {
    dispatch(getCategory())
  }, [])

  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', state.name);
    formData.append('brand', state.brand);
    formData.append('category',category);
    formData.append('stock', state.stock);
    formData.append('price', state.price);
    formData.append('discount', state.discount);
    formData.append('delivery_charge', state.delivery_charge);
    formData.append('description', state.description);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    dispatch(addProduct(formData))

  };

  // Form validation check
  const isFormValid = () => {
    return (
      state.name &&
      state.description &&
      state.price &&
      state.stock &&
      category &&
      state.discount !== "" &&
      state.delivery_charge !== "" &&
      state.brand &&
      images.length > 0
    );
  };


  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: '',
        brand: '',
        category: '',
        stock: '',
        price: '',
        discount: '',
        delivery_charge: '',
        description: ''
      });
      setImageShow([]);
      setImages([]);
      setCategory("");
    }
  }, [successMessage, errorMessage]);


  const search = add_product?.search || '';

  return (
    <div>
      <div className='px-2 my-2 mx-1'>
        <div className={`w-full p-4 rounded-md ${page_color?.bg} `}>
          <div className='flex justify-between items-center py-5'>
            <h1 className='text-xl font-semibold'>Add Product</h1>
            <Link to={'/admin/products'} className={`border px-4 py-1 rounded-full ${marbel_btn} hover:border-transparent focus:outline-none ocus:ring-offset-2`} >product</Link>
          </div>
          <form onSubmit={add}>

            <div className='grid grid-cols-1 max-[450px]:grid-cols-1 max-[640px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-4 gap-3 sm:gap-4 md:gap-4 w-full p-4' >
              {imageShow?.map((img, i) => (
                <div key={i} className='h-[180px] relative'>
                  <label htmlFor={i}>
                    <img className='w-full h-full rounded-md' src={img.url} />
                  </label>
                  <input onChange={(e) => changeImage(e.target.files[0], i)} className='hidden' type="file" id={i} />
                  <span onClick={() => removeImage(i)} className={`p-2 z-10 cursor-pointer ${add_product?.img?.remove_btn} absolute top-1 right-1 rounded-full`}><IoCloseSharp /></span>
                </div>
              ))}
              <label className={`flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed  w-full ${add_product?.img?.select_btn}`} htmlFor="image"  >
                <span><BsImage /></span>
                <span>select image</span>
              </label>
              <input className='hidden' onChange={inmageHandle} multiple type="file" id="image" />
            </div>

            <div className='flex flex-col md:flex-row w-full mb-3 gap-5'>
              <div className='flex flex-col w-full gap-2'>
                <label htmlFor='name'>Product name</label>
                <input
                  onChange={inputHandler}
                  value={state.name} 
                  type="text" name="name" id="name"
                  placeholder='Enter product name'
                  className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`} />
              </div>
              <div className='flex flex-col w-full gap-2'>
                <label htmlFor="brand">Product brand</label>
                <input
                  onChange={inputHandler}
                  value={state.brand} 
                  type="text" name="brand" id="brand"
                  placeholder='Enter product brand'
                  className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
                />
              </div>
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full ">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                 className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
                  onChange={inputHandler}
                  value={category}
                  type="text"
                  placeholder="category select"
                  id="category"
                />
                <div className={`border border-t-0 absolute top-[101%] ${search.bg} w-full transition-all ${cateShow ? "scale-100" : "scale-0"}`} >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      value={searchValue}
                      onChange={categorySearch}
                      className={`px-3 py-2 w-full outline-none ${add_product?.inp} bg-transparent border rounded-md  overflow-hidden`}
                      type="text"
                      placeholder="search"
                    />
                  </div>
                  <div className="pt-14 "></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                    {allCategory?.map((c, i) => (
                      <span key={i} className={`px-4 py-[6px] ${search.hover} hover:shadow-lg w-full cursor-pointer ${category === c.name && `${search.active_n}` }`}
                        onClick={() => {
                          setCateShow(false);
                          setCategory(c.name);
                          setSearchValue("");
                          setAllCategory(categorys);
                        }}>
                        {c.name}
                      </span>
                    ))}

                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Stock</label>
                <input
                  className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
                  onChange={inputHandler}
                  value={state.stock}
                  type="number"
                  min="0"
                  placeholder="product stock"
                  name="stock"
                  id="stock"
                />
              </div>
            </div>
            <div className='flex flex-col md:flex-row w-full mb-3 gap-5'>
              <div className='flex flex-col w-full gap-2'>
                <label htmlFor="price">Price $</label>
                <input
                  onChange={inputHandler}
                  value={state.price} 
                  type="number" name="price" id='price' min={0}
                  placeholder='Enter procut price $'
                  className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
                />
              </div>
              <div className='flex flex-col w-full gap-2'>
                <label htmlFor="discount">Discount % </label>
                <input
                  onChange={inputHandler}
                  value={state.discount} 
                  type="number" name="discount" id="discount" min={0}
                  placeholder='Enter product discount %'
                  className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
                />
              </div>
            </div>
            <div className='flex flex-col md:flex-row w-full mb-3 gap-5'>
              <div className='flex flex-col w-full gap-2'>
                <label htmlFor="delivery_charge">Delivery charge</label>
                <input
                  onChange={inputHandler}
                  value={state.delivery_charge} 
                  type="number" name="delivery_charge" id="delivery_charge" min={0}
                  placeholder='Enter product delivery charge $'
                  className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
                />
              </div>
              <div className='flex flex-col w-full gap-2 '></div>
            </div>
            <div className='flex flex-col md:flex-row w-full mb-3 gap-5'>
              <div className='flex flex-col w-full gap-2'>
                <label htmlFor="description">description</label>
                <textarea
                  onChange={inputHandler}
                  value={state.description} 
                  rows={4} name="description" id="description" placeholder='Enter product description'
                  className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
                />
              </div>
            </div>
            <button
              disabled={!isFormValid() || loader}
              className={`w-[130px] my-7 px-4 py-1 rounded-md ${!isFormValid() ? `${add_product?.disabled_btn} cursor-not-allowed` : `border ${marbel_btn} transition-all focus:outline-none focus:ring-offset-2 cursor-pointer`}`}>
              {loader ? (
                <PulseLoader color={add_product.loding} cssOverride={overrideStyle} />
              ) : (
                "Add Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
