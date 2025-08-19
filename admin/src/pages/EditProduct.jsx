import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PulseLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import { overrideStyle } from '../utils/utils'
import { getCategory } from '../store/reducers/categoryReducer'
import { messageClear, get_product, update_product } from '../store/reducers/productReducers'
import { add_product } from '../color/colors'

const EditProduct = () => {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [imageShow, setImageShow] = useState([])
  const [category, setCategory] = useState("")
  const [allCategory, setAllCategory] = useState([])
  const [cateShow, setCateShow] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const { categorys } = useSelector(state => state.category)
  const { product, loader, successMessage, errorMessage } = useSelector(state => state.product)


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
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const isFormValid = () => {
    return (
      state.name &&
      state.description &&
      state.price &&
      state.stock &&
      category &&
      state.discount !== "" &&
      state.delivery_charge !== "" &&
      state.brand
    )
  }

  const categorySearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    if (value) {
      const srcValue = categorys.filter(c =>
        c.name.toLowerCase().includes(value.toLowerCase())
      )
      setAllCategory(srcValue)
    } else {
      setAllCategory(categorys)
    }
  }

  const update = (e) => {
    e.preventDefault()
    const data = {
      name: state.name,
      description: state.description,
      discount: state.discount,
      delivery_charge: state.delivery_charge,
      price: state.price,
      brand: state.brand,
      stock: state.stock,
      category: category,
      productId
    }
    dispatch(update_product(data))
  }

  useEffect(() => {
    dispatch(getCategory())
  }, [])

  useEffect(() => {
    dispatch(get_product(productId))
  }, [productId])

  useEffect(() => {
    setAllCategory(categorys)
  }, [categorys])

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      setState({
        name: product.name || '',
        description: product.description || '',
        discount: product.discount || '',
        delivery_charge: product.delivery_charge || '',
        price: product.price || '',
        brand: product.brand || '',
        stock: product.stock || '',
        category: product.category || ''
      })
      setCategory(product.category || '')
      setImageShow(product.images || [])
    }
  }, [product])

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
      navigate('/admin/products')
    }
  }, [successMessage, errorMessage, dispatch])

   const search = add_product?.search || '';

  return (
    <div className='px-2 lg:pt-5 mt-2 mx-1'>
      <div className='w-full p-4 bg-white rounded-md'>
        <div className='flex justify-between items-center py-5'>
          <h1 className='text-xl font-semibold'>Edit Product</h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full p-4'>
          {imageShow?.map((img, i) => (
            <div key={i}>
              <img className="w-full h-[180px] rounded-md" src={img} alt="product" />
            </div>
          ))}
        </div>
        <form onSubmit={update}>
          <div className='flex flex-col md:flex-row w-full mb-3 gap-5'>
            <div className='flex flex-col w-full gap-2'>
              <label htmlFor='name'>Product name</label>
              <input
                onChange={inputHandler}
                value={state.name}
                name="name"
                id="name"
                type="text"
                placeholder='Enter product name'
                className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`} />
            </div>
            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="brand">Product brand</label>
              <input
                onChange={inputHandler}
                value={state.brand}
                name="brand"
                id="brand"
                type="text"
                placeholder='Enter product brand'
                className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
              />
            </div>
          </div>

          <div className="flex flex-col mb-3 md:flex-row gap-4 w-full">
            <div className="flex flex-col w-full gap-1 relative">
              <label htmlFor="category">Category</label>
              <input
                readOnly
                onClick={() => setCateShow(!cateShow)}
                value={category}
                type="text"
                placeholder="Select category"
                className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
              />
              <div className={`absolute top-[101%] bg-[#f2f2f2] w-full border border-t-0 border-slate-400 transition-all z-10 ${cateShow ? "scale-100" : "scale-0"}`}>
                <div className="px-4 py-2">
                  <input
                    value={searchValue}
                    onChange={categorySearch}
                    type="text"
                    placeholder="Search category"
                    className={`px-3 py-2 w-full outline-none ${add_product?.inp} bg-transparent border rounded-md  overflow-hidden`}
                  />
                </div>
                <div className="h-[200px] overflow-y-auto">
                  {allCategory?.map((c, i) => (
                    <span
                      key={i}
                      onClick={() => {
                        setCateShow(false)
                        setCategory(c.name)
                        setSearchValue("")
                        setAllCategory(categorys)
                      }}
                      className={`px-4 py-[6px] block ${search.hover} hover:shadow-lg w-full cursor-pointer ${category === c.name && `${search.active_n}`}`}                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="stock">Stock</label>
              <input
                onChange={inputHandler}
                value={state.stock}
                name="stock"
                id="stock"
                type="number"
                min="0"
                placeholder="Product stock"
                className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row w-full mb-3 gap-5'>
            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="price">Price ($)</label>
              <input
                onChange={inputHandler}
                value={state.price}
                name="price"
                id="price"
                type="number"
                min="0"
                placeholder='Enter product price'
                className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
              />
            </div>
            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="discount">Discount (%)</label>
              <input
                onChange={inputHandler}
                value={state.discount}
                name="discount"
                id="discount"
                type="number"
                min="0"
                placeholder='Enter product discount'
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
                name="delivery_charge"
                id="delivery_charge"
                type="number"
                min="0"
                placeholder='Enter delivery charge'
                className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
              />
            </div>
            <div className='flex flex-col w-full gap-2'></div>
          </div>

          <div className='flex flex-col w-full mb-3'>
            <label htmlFor="description">Description</label>
            <textarea
              onChange={inputHandler}
              value={state.description}
              name="description"
              id="description"
              rows={4}
              placeholder='Enter product description'
              className={`px-4 py-2 outline-none border rounded-sm ${add_product?.inp}`}
            />
          </div>

          <button
            disabled={!isFormValid() || loader}
            className={`w-[150px] my-7 px-4 py-2 rounded-md font-medium ${!isFormValid() ? 'bg-gray-400 cursor-not-allowed' : 'border cursor-pointer border-purple-600 transition-all bg-indigo-50 text-purple-600 hover:bg-purple-300 focus:outline-none focus:bg-purple-600 focus:text-white focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'}`}>
            {loader ? (
              <PulseLoader color={add_product.loding} cssOverride={overrideStyle} />
            ) : (
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
