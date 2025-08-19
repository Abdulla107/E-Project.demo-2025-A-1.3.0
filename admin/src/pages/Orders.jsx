import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { get_orders } from '../store/reducers/orderReducer';
import { action_icon, orders, page_color, select_color } from '../color/colors';

const Orders = () => {

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { completed_orders, running_orders, cancelled_orders, refunded_orders } = useSelector(state => state.order)

  const [showOrders, setShowOrders] = useState([])
  const [orderType, setOrderType] = useState('Running Orders')


  const orderHandler = (e) => {
    const selected = e.target.value;
    setOrderType(selected);
    if (selected === 'Running Orders') {
      setShowOrders(running_orders);
    } else if (selected === 'Completed Orders') {
      setShowOrders(completed_orders);
    } else if (selected === 'Cancelled Orders') {
      setShowOrders(cancelled_orders);
    } else if (selected === 'Refunded Orders') {
      setShowOrders(refunded_orders);
    }
  };


  useEffect(() => {
    if (orderType === 'Running Orders') {
      setShowOrders(running_orders);
    } else if (orderType === 'Completed Orders') {
      setShowOrders(completed_orders);
    } else if (orderType === 'Cancelled Orders') {
      setShowOrders(cancelled_orders);
    } else if (orderType === 'Refunded Orders') {
      setShowOrders(refunded_orders);
    }
  }, [running_orders, completed_orders, cancelled_orders]);


  useEffect(() => {
    if (userInfo.id) {
      dispatch(get_orders())
    }
  }, [userInfo])


  const getDeliveryStatusClass = (status) => {
    switch (status) {
      case 'Cancelled':
      case 'Failed Delivery':
      case 'Refunded':
        return 'text-red-500';
      case 'Delivered':
        return 'text-green-500';
      case 'Pending':
        return 'text-blue-600';
      default:
        return 'text-yellow-700';
    }
  };


  return (
    <div className='px-2 my-2 mx-1'>
      <div className={`${page_color?.bg} px-4 py-5 rounded-md min-h-screen`}>
        <div className='flex justify-end items-center pt-1 gap-4'>
          <select
            value={orderType}
            onChange={orderHandler}
            className={`border px-4 py-2 rounded-md outline-none cursor-pointer ${select_color}`}>
            <option value="Running Orders">Running</option>
            <option value="Completed Orders">Completed</option>
            <option value="Cancelled Orders">Cancelled</option>
            <option value="Refunded Orders">Refunded</option>
          </select>
        </div>
        <h1 className={`text-xl font-semibold px-2 py-3 mt-3`}>Your {orderType} - {showOrders?.length || 0}</h1>
        <div className=' relative overflow-x-auto '>
          <table className='w-full text-sm text-left'>
            <thead className= {`text-sm uppercase border-b whitespace-nowrap ${orders?.thead_color}`}>
              <tr>
                <th scope='col' className='px-4 py-3 text-nowrap'>NO</th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Order Id </th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Price </th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Delivery status</th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Date - Time</th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Action </th>
              </tr>
            </thead>
            {showOrders && showOrders.length > 0 ? (
              <tbody className={`${orders?.tbody_bg}`}>
                {showOrders?.map((d, i) => <tr key={i} className={`border-b ${orders?.tbody_text} `}>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>{i + 1}</td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>{d._id}</td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>${d.total_price}</td>
                  <td scope='row' className='px-8 py-3 font-medium text-nowrap'>
                    <span className={`border px-3 rounded-full ${getDeliveryStatusClass(d?.delivery_status)}`}>{d.delivery_status}</span>
                  </td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>{d.date}</td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>
                    <Link to={`/admin/order/details/${d._id}`} className={`flex justify-center items-center w-[30px] p-[6px] rounded-md mx-3 ${action_icon?.vew} hover:shadow-lg hover:shadow-green-500/50`}><FaEye /></Link>
                  </td>
                </tr>)}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No Orders Found!.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders
