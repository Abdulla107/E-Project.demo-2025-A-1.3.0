import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add_shipping_info, get_shipping_info, get_target_country, messageClear, payment_create, place_order } from '../store/reducers/orderReducer';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';
import {shippingInfo_colors } from '../color/colors';

const ShippingInfo = () => {


  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.auth)
  const { shippingInfo, errorMessage, successMessage, loader, newOrder, target_country } = useSelector(state => state.order)

  const [editMode, setEditMode] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [countryCod, setCountryCod] = useState('')


  const location = useLocation();
  const { card_products, price, buy_product_item, shipping_fee } = location.state || {};


  let expressShippingFee = 0;

  if (shippingInfo?.shippingMethod === 'Express (3-7 Business Days)') {
    const expressPercentage =
      price <= 500 ? 20 : price <= 3000 ? 12 : 8;

    const calculatedFee = (price * expressPercentage) / 100;
    expressShippingFee = Math.max(calculatedFee, 6);
  }

  const final_shipping_fee = shipping_fee + expressShippingFee;
  const total_price = +(price + final_shipping_fee).toFixed(2);



  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    country: '',
    shippingMethod: 'Standard (10-15 Business Days',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedCountry = target_country?.find(c => c.label === formData?.country);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.country) {
      return toast.error('place select your contry')
    }
    if (userInfo) {
      const data = { ...formData, userId: userInfo.id };
      dispatch(add_shipping_info(data));
    }
  };



  const handleCountrySelect = (label) => {
    setFormData(prev => ({ ...prev, country: label }));
    setOpenCountry(false);
  };


  useEffect(() => {
    if (target_country) {
      const matched = target_country?.find((d) => d.label === shippingInfo?.country);
      if (matched) {
        setCountryCod(matched?.code);
      }
    }
  }, [shippingInfo, userInfo, target_country]);


  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_shipping_info(userInfo.id))
      dispatch(get_target_country())
    }
  }, [userInfo?.id])


  useEffect(() => {
    if (shippingInfo) {
      setFormData({
        fullName: shippingInfo.fullName || '',
        email: shippingInfo.email || '',
        phone: shippingInfo.phone || '',
        address: shippingInfo.address || '',
        city: shippingInfo.city || '',
        district: shippingInfo.district || '',
        postalCode: shippingInfo.postalCode || '',
        country: shippingInfo.country || '',
        shippingMethod: shippingInfo.shippingMethod || 'Standard (10-15 Business Days)',
      });
      setEditMode(false)
    } else {
      setEditMode(true)
    }
  }, [shippingInfo]);


  const orderHandler = () => {
    if (!userInfo) return
    dispatch(place_order({
      products: card_products, total_price,
      shippingInfo: formData, customerId: userInfo?.id
    }))

  }

  useEffect(() => {
    if (!userInfo) return;
    if (newOrder) {

      dispatch(payment_create({ amount: total_price, customerId: userInfo?.id, orderId: newOrder?._id }))
    }
  }, [newOrder])

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
      setEditMode(false)
      dispatch(get_shipping_info(userInfo?.id))
    }
  }, [errorMessage, successMessage])

  const colors = shippingInfo_colors || '';


  return (
    <div>
      {loader && (
        <div className={`fixed inset-0 flex justify-center items-center ${colors.loaderBg} z-50`}>
          <FadeLoader color="black" />
        </div>
      )}

      <div className={`max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 py-8 ${colors.bgWhite} shadow-2xl rounded-md`}>
        <h2 className={`text-3xl font-bold text-center ${colors.heading} mb-10`}>Shipping Information</h2>

        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold ${colors.label} mb-2`}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm focus:outline-none ${colors.inputFocus}`}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${colors.label} mb-2`}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm focus:outline-none ${colors.inputFocus}`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Phone & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold ${colors.label} mb-2`}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm focus:outline-none ${colors.inputFocus}`}
                  placeholder="+8801XXXXXXXXX"
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${colors.label} mb-2`}>Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm focus:outline-none ${colors.inputFocus}`}
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            {/* City, District, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`block text-sm font-semibold ${colors.label} mb-2`}>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm focus:outline-none ${colors.inputFocus}`}
                  placeholder="Dhaka" />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${colors.label} mb-2`}>District</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} required
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm focus:outline-none ${colors.inputFocus}`}
                  placeholder="Gazipur" />
              </div>
              <div>
                <label className={`block text-sm font-semibold ${colors.label} mb-2`}>Postal Code</label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm focus:outline-none ${colors.inputFocus}`}
                  placeholder="1200" />
              </div>
            </div>

            {/* Country Select */}
            <div className="mb-4">
              <label className={`block text-sm font-semibold ${colors.label} mb-2`}>Country</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenCountry(!openCountry)}
                  className={`w-full px-4 py-3 ${colors.inputBorder} rounded-xl shadow-sm flex justify-between items-center focus:outline-none`}
                >
                  <div className="flex items-center gap-2">
                    {selectedCountry && (
                      <img src={`https://flagcdn.com/w40/${selectedCountry?.code?.toLowerCase()}.png`} alt=""
                        className="w-5 h-4 object-cover rounded-sm" />
                    )}
                    <span>{formData?.country || "Select a country"}</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openCountry && (
                  <ul className={`absolute z-10 mt-1 w-full ${colors.bgWhite} ${colors.borderGray} rounded-xl max-h-60 overflow-auto shadow-lg`}>
                    {target_country?.map((country) => (
                      <li key={country.code} onClick={() => handleCountrySelect(country?.label)}
                        className={`px-4 py-2 flex items-center gap-2 ${colors.hoverGray} cursor-pointer`}>
                        <img src={`https://flagcdn.com/w40/${country?.code.toLowerCase()}.png`} alt='' className="w-5 h-4 object-cover rounded-sm" />
                        <span>{country?.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <label className={`block text-sm font-semibold ${colors.label} mb-3`}>Shipping Method</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex items-center gap-2 cursor-pointer text-sm ${colors.label}`}>
                  <input type="radio" name="shippingMethod" value="Standard (10-15 Business Days)"
                    checked={formData?.shippingMethod === 'Standard (10-15 Business Days)'}
                    onChange={handleChange} className={colors.radioAccent} />
                  Standard (10-15 Business Days)
                </label>
                <label className={`flex items-center gap-2 cursor-pointer text-sm ${colors.label}`}>
                  <input type="radio" name="shippingMethod" value="Express (3-7 Business Days)"
                    checked={formData?.shippingMethod === 'Express (3-7 Business Days)'}
                    onChange={handleChange} className={colors.radioAccent} />
                  Express (3-7 Business Days)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end items-center mb-5'>
              <button type="submit" disabled={loader}
                className={`${colors.gradientBtn} text-white px-4 py-2 rounded-xl transition duration-300 ease-in-out disabled:opacity-60 cursor-pointer`}>
                {loader ? 'Processing...' : shippingInfo ? 'Update Now' : 'Add Now'}
              </button>
            </div>

          </form>
        ) : (
          <div className={`${colors.bgLight} py-10 px-4`}>
            <div className="max-w mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Shipping Info */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 space-y-4">
                <h3 className={`text-xl font-bold ${colors.textGrayDark} mb-4`}>Your Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p><span className="font-medium">Name:</span> {shippingInfo?.fullName}</p>
                  <p><span className="font-medium">Email:</span> {shippingInfo?.email}</p>
                  <p><span className="font-medium">Phone:</span> {shippingInfo?.phone}</p>
                  <p><span className="font-medium">Address:</span> {shippingInfo?.address}</p>
                  <p><span className="font-medium">City:</span> {shippingInfo?.city}</p>
                  <p><span className="font-medium">District:</span> {shippingInfo?.district}</p>
                  <p><span className="font-medium">Postal Code:</span> {shippingInfo?.postalCode}</p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Country:</span>
                    <img src={`https://flagcdn.com/w40/${countryCod?.toLowerCase()}.png`} alt=""
                      className="w-5 h-4 object-cover rounded-sm" />
                    <span>{shippingInfo?.country}</span>
                  </p>
                  <p><span className="font-medium">Shipping Method:</span> {shippingInfo?.shippingMethod}</p>
                </div>
                <div className="pt-4">
                  <button onClick={() => setEditMode(true)}
                    className={`inline-flex items-center px-5 py-2 text-sm font-semibold ${colors.btnBlue} text-white rounded-xl transition cursor-pointer`}>
                    Edit Shipping Info
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="sticky top-24 bg-white rounded-2xl shadow-md p-6 space-y-5">
                <h3 className={`text-lg font-bold ${colors.textGrayDark} border-b pb-2`}>Order Summary</h3>
                <div className={`flex justify-between text-sm ${colors.textGray}`}>
                  <span>Total Stores</span>
                  <span>{card_products?.length}</span>
                </div>
                <div className={`flex justify-between text-sm ${colors.textGray}`}>
                  <span>{buy_product_item} Item(s)</span>
                  <span>${price}</span>
                </div>
                <div className={`flex justify-between text-sm ${colors.textGray}`}>
                  <span>Shipping Fee</span>
                  <span>${shipping_fee}</span>
                </div>
                <div className={`flex justify-between font-semibold text-lg ${colors.textGrayDark}`}>
                  <span>Total</span>
                  <span className={colors.textOrange}>${total_price}</span>
                </div>
                <button onClick={orderHandler}
                  className={`w-full ${colors.btnOrange} text-white py-2 rounded-xl text-sm font-bold uppercase transition cursor-pointer`}>
                  Proceed to Checkout
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;
