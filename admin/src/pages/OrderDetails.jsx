import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { get_order, messageClear, update_order_status, update_refund_status } from '../store/reducers/orderReducer';
import { FaEye } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { socket } from '../utils/utils';
import FadeLoader from 'react-spinners/FadeLoader';
import { action_icon, order_details, page_color, select_color } from '../color/colors';

const OrderDetails = () => {

  const { orderId } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');
  const [refundValue, setRefundValue] = useState('select status')
  const { order, successMessage, errorMessage, loader } = useSelector(state => state.order);

  const status_updateHandler = (e) => {
    const newStatus = e.target.value;
    dispatch(update_order_status({ delivery_status: newStatus, orderId }))
    socket.emit('update_delivery_status', { status: newStatus, orderId })
  }

  const refundHandler = (e) => {
    const refund_status = e.target.value
    dispatch(update_refund_status({ refund_status, orderId: order._id }))
    setRefundValue(refund_status)
  }

  useEffect(() => {
    if (order?.refund === 'Cancelled') {
      setRefundValue(order.refund)
    }
  }, [order])


  useEffect(() => {
    dispatch(get_order(orderId))
  }, [orderId])

  useEffect(() => {
    if (order) {
      setStatus(order.delivery_status)
    }
  }, [order])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear());
      dispatch(get_order(orderId));

    } else if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear());
    }
  })

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

  const p_in_color = order_details?.payment_info_color || '';
  const delivery_color = order_details?.delivery_info_color || '';
  const product_color = order_details?.product_info_color || '';

  return (
    <div>
      {
        loader && <div className={`w-screen h-screen flex justify-center items-center fixed left-0 top-0 ${page_color?.loader} z-[999]`}>
          <FadeLoader color={`${page_color?.loader_icon_color}`} />
        </div>
      }
      <div className='p-2 my-2'>
        <div className={`p-6 mx-auto ${page_color?.bg} shadow-xl rounded-2xl space-y-6 min-h-screen`}>
          {/* Order Info */}
          {order?.payment_status === 'paid' &&
            <div className="flex justify-end items-center">
              <select
                value={status}
                onChange={status_updateHandler}
                className={`border px-4 py-2 rounded-md outline-none cursor-pointer ${select_color}`}>
                <option value="Pending">Pending</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Awaiting Supplier">Awaiting Supplier</option>
                <option value="Processing">Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Failed Delivery">Failed Delivery</option>
              </select>
            </div>
          }
          <div>
            <h2 className="text-xl font-semibold">Order #{order?._id}</h2>
            <p className={`${order_details?.order_date}`}>Placed on {order?.date}</p>
            <Link to={`/admin/chat_customer/${order?.customerId}`} className={`${order_details?.link_text}`}>Chat with customer</Link>
            <h1 className='mt-5'>
              <span className='font-semibold'>Delivery Status : </span>
              <span className={`border px-4 py-[1px] rounded-full ${getDeliveryStatusClass(order?.delivery_status)}`}> {order?.delivery_status}</span>
            </h1>
          </div>
          {order?.refund &&
            <div className='flex gap-4 items-center'>
              <h1>Refund : <span className={`${order_details?.text_r}`}>{order?.refund}</span> </h1>
              {order.payment_status === 'paid' &&
                <select
                  value={refundValue}
                  onChange={refundHandler}
                  className={`border px-2 py-1 rounded-md outline-none cursor-pointer ${select_color}`}>
                  <option value="select status" disabled >-- Select Status --</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Accepted">Refund Accepted</option>
                </select>
              }
            </div>
          }

          {/* Customer & Payment Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-4 ${delivery_color.header}`}>
              <h3 className={`text-lg font-semibold mb-2 border-b ${delivery_color.border}`}>Delivery Info</h3>
              <p><span className="font-medium">Name:</span> {order?.shippingInfo?.fullName}</p>
              <p><span className="font-medium">Email:</span> {order?.shippingInfo?.email}</p>
              <p><span className="font-medium">Phone:</span> {order?.shippingInfo?.phone}</p>
              <p><span className="font-medium">Address:</span> {order?.shippingInfo?.address}</p>
              <p><span className="font-medium">City:</span> {order?.shippingInfo?.city}</p>
              <p><span className="font-medium">District:</span> {order?.shippingInfo?.district}</p>
              <p><span className="font-medium">PostalCode:</span> {order?.shippingInfo?.postalCode}</p>
              <p><span className="font-medium">Country:</span> {order?.shippingInfo?.country}</p>
              <p><span className="font-medium">ShippingMethod:</span> {order?.shippingInfo?.shippingMethod}</p>
            </div>
            <div className={`p-4 rounded-lg border ${p_in_color.header}`}>
              <h3 className={`text-lg font-semibold mb-2 border-b ${p_in_color.border}`}>Payment</h3>
              <p className="font-medium">Status :
                <span className={`ml-2 px-4 py-1 rounded-full text-sm ${order?.payment_status === 'paid' ? `${p_in_color.p_tru}` : `${p_in_color.p_fal}`}`}>
                  {order?.payment_status}
                </span>
              </p>
              <p><span className="font-medium">Total Amount :</span> ${order?.total_price}</p>
            </div>
          </div>

          {/* Product List */}
          <div className="w-full overflow-x-auto">
            <table className={`w-full text-left text-sm border rounded ${product_color.thead.border}`}>
              <thead className={`${product_color.thead.thead}`}>
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">No</th>
                  <th className="py-3 px-4 whitespace-nowrap">Image</th>
                  <th className="py-3 px-4 whitespace-nowrap">Name</th>
                  <th className="py-3 px-4 whitespace-nowrap">Category</th>
                  <th className="py-3 px-4 whitespace-nowrap">Brand</th>
                  <th className="py-3 px-4 whitespace-nowrap">Quantity</th>
                  <th className="py-3 px-4 whitespace-nowrap">Price</th>
                  <th className="py-3 px-4 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {order?.products?.map((d, i) => (
                  <tr key={i} className={`border-t ${product_color.tbody.border}`}>
                    <td className="py-2 px-4">{i + 1}</td>
                    <td className="py-2 px-4">
                      {d?.productInfo?.images?.[0] ? (
                        <img
                          src={d.productInfo.images[0]}
                          alt="Product"
                          className="w-[45px] h-[45px] object-cover rounded"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="py-2 px-4">{d?.productInfo?.name?.slice(0, 16)}...</td>
                    <td className="py-2 px-4">{d?.productInfo?.category || "N/A"}</td>
                    <td className="py-2 px-4">{d?.productInfo?.brand || "N/A"}</td>
                    <td className="py-2 px-4">{d?.quantity || "N/A"}</td>

                    <td className="py-2 px-4">${
                      d?.productInfo?.discount ?
                        (d?.productInfo?.price - (d?.productInfo?.price * d?.productInfo?.discount) / 100).toFixed(2) : d?.productInfo?.price || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/admin/product/details/${d.productInfo._id}`}
                        className={`flex justify-center items-center w-[30px] p-[6px] rounded-md mx-3 ${action_icon?.vew} hover:shadow-lg hover:shadow-green-500/50`}                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
