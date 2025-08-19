import React, { useEffect } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { FaEye } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { get_deshboard_orders, payment_create } from '../../store/reducers/orderReducer'
import FadeLoader from 'react-spinners/FadeLoader'
import { dashboardColors } from '../../color/colors'

const Dashboard = () => {

  const dispatch = useDispatch()
  const { new_orders, total_order, pending_order, unpaid_order, loader } = useSelector(state => state.order)
  const { userInfo } = useSelector(state => state.auth)

  const payment = (_id, total_price, customerId) => {
    dispatch(payment_create({ amount: total_price, customerId, orderId: _id }))
  }

  useEffect(() => {
    if (userInfo.id) {
      dispatch(get_deshboard_orders(userInfo.id))
    }
  }, [userInfo.id])

  const getDeliveryStatusClass = (status) => {
    switch (status) {
      case 'Cancelled':
        return dashboardColors.delivery.cancelled
      case 'Failed Delivery':
        return dashboardColors.delivery.failed
      case 'Refunded':
        return dashboardColors.delivery.refunded
      case 'Delivered':
        return dashboardColors.delivery.delivered
      default:
        return dashboardColors.delivery.default
    }
  }

  return (
    <div>
      {loader && (
        <div className={`fixed inset-0 flex justify-center items-center ${dashboardColors.overlay.loaderBg} z-50`}>
          <FadeLoader color="black" />
        </div>
      )}
      <div className="lg:px-2">
        <div className="bg-white rounded-md shadow-md p-4 min-h-screen">
          <div className='lg:pt-3 my-3'>
            <div className='flex flex-col min-h-screen'>
              {/* Summary Cards */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mb-8 lg:mx-5'>
                {/* Card 1 */}
                <div className={`flex justify-between items-center p-4 bg-gradient-to-r ${dashboardColors.card.totalOrder.bgGradient} rounded-xl ${dashboardColors.card.totalOrder.text} shadow-md`}>
                  <div>
                    <h1 className='text-2xl font-bold'>{total_order || 0}</h1>
                    <p className='text-sm opacity-90'>Total Order</p>
                  </div>
                  <div className={`w-12 h-12 ${dashboardColors.card.totalOrder.iconBg} flex items-center justify-center rounded-full`}>
                    <AiOutlineShoppingCart className={`${dashboardColors.card.totalOrder.iconColor} text-xl`} />
                  </div>
                </div>

                {/* Card 2 */}
                <div className={`flex justify-between items-center p-4 bg-gradient-to-r ${dashboardColors.card.pendingOrder.bgGradient} rounded-xl ${dashboardColors.card.pendingOrder.text} shadow-md`}>
                  <div>
                    <h1 className='text-2xl font-bold'>{pending_order || 0}</h1>
                    <p className='text-sm opacity-90'>Pending Order</p>
                  </div>
                  <div className={`w-12 h-12 ${dashboardColors.card.pendingOrder.iconBg} flex items-center justify-center rounded-full`}>
                    <AiOutlineShoppingCart className={`${dashboardColors.card.pendingOrder.iconColor} text-xl`} />
                  </div>
                </div>

                {/* Card 3 */}
                <div className={`flex justify-between items-center p-4 bg-gradient-to-r ${dashboardColors.card.unpaidOrder.bgGradient} rounded-xl ${dashboardColors.card.unpaidOrder.text} shadow-md`}>
                  <div>
                    <h1 className='text-2xl font-bold'>{unpaid_order || 0}</h1>
                    <p className='text-sm opacity-90'>UnPaid Order</p>
                  </div>
                  <div className={`w-12 h-12 ${dashboardColors.card.unpaidOrder.iconBg} flex items-center justify-center rounded-full`}>
                    <AiOutlineShoppingCart className={`${dashboardColors.card.unpaidOrder.iconColor} text-xl`} />
                  </div>
                </div>
              </div>

              {/* Order Table */}
              <div className='px-1'>
                <h1 className='text-xl font-semibold mb-4'>Your New Orders</h1>
                <div className='overflow-x-auto'>
                  <table className={`w-full text-sm text-left ${dashboardColors.table.text}`}>
                    <thead className={`${dashboardColors.table.headerBg} ${dashboardColors.table.headerText} uppercase text-xs`}>
                      <tr>
                        <th className='px-4 py-3 text-nowrap'>No</th>
                        <th className='px-4 py-3 text-nowrap'>Order ID</th>
                        <th className='px-4 py-3 text-nowrap'>Price</th>
                        <th className='px-4 py-3 text-nowrap'>Delivery Status</th>
                        <th className='px-4 py-3 text-nowrap'>Payment Status</th>
                        <th className='px-4 py-3 text-nowrap'>Date - Time</th>
                        <th className='px-4 py-3 text-nowrap'>Payment</th>
                        <th className='px-4 py-3 text-nowrap'>Action</th>
                      </tr>
                    </thead>
                    {new_orders && new_orders.length > 0 ? (
                      <tbody className='bg-white'>
                        {new_orders.map((d, i) => (
                          <tr key={i} className={`${dashboardColors.table.border} ${dashboardColors.table.hoverBg}`}>
                            <td className='px-4 py-3 text-nowrap'>{i + 1}</td>
                            <td className='px-4 py-3 text-nowrap'>{d._id}</td>
                            <td className='px-4 py-3 text-nowrap'>${d.total_price}</td>
                            <td className='px-4 py-3 text-nowrap'>
                              <span className={`inline-block px-3 text-nowrap py-1 text-xs font-medium rounded-full border ${getDeliveryStatusClass(d.delivery_status)}`}>
                                {d.delivery_status}
                              </span>
                            </td>
                            <td className='px-4 py-3 text-nowrap'>
                              <span className={`inline-block px-3 text-nowrap py-1 text-xs font-medium rounded-full border ${d.payment_status !== 'paid' ? dashboardColors.payment.refundedText : `${dashboardColors.payment.paidText} ${dashboardColors.payment.paidBg}`}`}>
                                {d.payment_status}
                              </span>
                            </td>
                            <td className='px-4 py-3 text-nowrap'>{d.date}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {(d.payment_status === 'paid' || d.payment_status === 'Refunded') ? (
                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${d.payment_status === 'paid' ? `${dashboardColors.payment.paidText} ${dashboardColors.payment.paidBg}` : `border ${dashboardColors.payment.refundedText}`}`}>
                                  {d.payment_status}
                                </span>
                              ) : (
                                <span onClick={() => payment(d._id, d.total_price, d.customerId)} className={`inline-block px-3 py-1 text-xs font-medium text-white ${dashboardColors.payment.unpaidBg} ${dashboardColors.payment.unpaidHover} rounded-full cursor-pointer`}>
                                  Pay Now
                                </span>
                              )}
                            </td>
                            <td className='px-4 py-3 text-nowrap'>
                              <Link to={`/dashboard/order-details/${d._id}`} className='inline-flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-md shadow transition'>
                                <FaEye />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <thead>
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            No Orders Found!.
                          </td>
                        </tr>
                      </thead>
                    )}
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
