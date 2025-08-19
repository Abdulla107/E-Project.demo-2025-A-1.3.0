import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_orders, payment_create } from '../../store/reducers/orderReducer';
import FadeLoader from 'react-spinners/FadeLoader';
import { ordersColors } from '../../color/colors';

const Orders = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { orders, loader } = useSelector((state) => state.order);
  const [orderStatus, setOrderStatus] = useState('All');

  const payment = (_id, total_price, customerId) => {
    dispatch(payment_create({ amount: total_price, customerId, orderId: _id }));
  }

  const orderStatusHandler = (e) => setOrderStatus(e.target.value);

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_orders({ userId: userInfo.id, status: orderStatus }));
    }
  }, [dispatch, userInfo?.id, orderStatus]);

  const getDeliveryStatusClass = (status) => {
    switch (status) {
      case 'Cancelled':
        return ordersColors.delivery.cancelled;
      case 'Failed Delivery':
        return ordersColors.delivery.failed;
      case 'Refunded':
        return ordersColors.delivery.refunded;
      case 'Delivered':
        return ordersColors.delivery.delivered;
      default:
        return ordersColors.delivery.default;
    }
  };

  return (
    <div>
      {loader && (
        <div className={`fixed inset-0 flex justify-center items-center ${ordersColors.overlay.loaderBg} z-50`}>
          <FadeLoader color="black" />
        </div>
      )}
      <div className="lg:px-2">
        <div className="bg-white rounded-md shadow-md p-4 min-h-screen">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-xl font-bold text-gray-800">Your Orders</h1>
            <select onChange={orderStatusHandler} value={orderStatus} className="border px-2 py-2 rounded-md border-gray-300 focus:border-indigo-500 outline-none cursor-pointer">
              <option value="All">All</option>
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
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="overflow-auto max-h-[85vh] rounded-md">
            <table className={`w-full text-sm text-left ${ordersColors.table.text}`}>
              <thead className={`${ordersColors.table.headerBg} ${ordersColors.table.headerText} uppercase text-xs sticky top-0`}>
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Order ID</th>
                  <th className="px-4 py-3 whitespace-nowrap">Price</th>
                  <th className="px-4 py-3 whitespace-nowrap">Delivery Status</th>
                  <th className="px-4 py-3 whitespace-nowrap">Payment Status</th>
                  <th className="px-4 py-3 whitespace-nowrap">Date - Time</th>
                  <th className="px-4 py-3 whitespace-nowrap">Payment</th>
                  <th className="px-4 py-3 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders?.length > 0 ? (
                  orders.map((d, i) => (
                    <tr key={i} className={`${ordersColors.table.border} ${ordersColors.table.hoverBg}`}>
                      <td className="px-4 py-3 whitespace-nowrap">{d._id}</td>
                      <td className="px-4 py-3 whitespace-nowrap">${d.total_price}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getDeliveryStatusClass(d.delivery_status)}`}>
                          {d.delivery_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${d.payment_status !== 'paid' ? ordersColors.payment.refundedText : `${ordersColors.payment.paidText} ${ordersColors.payment.paidBg}`}`}>
                          {d.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{d.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(d.payment_status === 'paid' || d.payment_status === 'Refunded') ? (
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${d.payment_status === 'paid' ? `${ordersColors.payment.paidText} ${ordersColors.payment.paidBg}` : `border ${ordersColors.payment.refundedText}`}`}>
                            {d.payment_status}
                          </span>
                        ) : (
                          <span onClick={() => payment(d._id, d.total_price, d.customerId)} className={`inline-block px-3 py-1 text-xs font-medium ${ordersColors.payment.unpaidText} ${ordersColors.payment.unpaidBg} ${ordersColors.payment.unpaidHover} rounded-full cursor-pointer`}>
                            Pay Now
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          to={`/dashboard/order-details/${d._id}`}
                          className={`inline-flex items-center justify-center p-2 ${ordersColors.action.viewBg} ${ordersColors.action.viewText} ${ordersColors.action.viewHover} rounded`}
                        >
                          <FaEye />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
