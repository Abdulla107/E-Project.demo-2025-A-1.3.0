import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { get_refund_details } from '../store/reducers/paymentReducer';
import { action_icon, page_color, refund_request_color } from '../color/colors';

const RefundRequest = () => {

  const dispatch = useDispatch();
  const [click, setClick] = useState(true)
  const [showRefund, setShowRefund] = useState();
  const { refund_request, refund_cancelled } = useSelector(state => state.payment)

  useEffect(() => {
    dispatch(get_refund_details())
  }, [])

  useEffect(() => {
    if (click) {
      setShowRefund(refund_request)
    } else {
      setShowRefund(refund_cancelled)
    }
  }, [refund_request, refund_cancelled, click])

  const btn = refund_request_color?.btn || '';
  const color = refund_request_color?.list || '';

  return (
    <div className='px-2 my-2 mx-1'>
      <div className={`${page_color?.bg} px-4 py-5 rounded-md min-h-screen`}>
        <div className='flex justify-center items-center pt-3 gap-4'>
          <button onClick={() => setClick(true)} className={`border px-4 py-1 rounded-full text-sm ${btn.color} ${click ? `outline-none ring-2 ${btn.tru} ring-offset-2` : `${btn.fal}`}`}>Request</button>
          <button onClick={() => setClick(false)} className={`border px-4 py-1 rounded-full text-sm ${btn.color} ${!click ? `outline-none ring-2 ${btn.tru} ring-offset-2` : `${btn.fal}`}`}>Cancelled</button>
        </div>
        <h1 className={`text-xl font-semibold px-2 py-3 mt-5 ${click ? '' : 'hidden'}`}>Refund Request</h1>
        <h1 className={`text-xl font-semibold px-2 py-3 mt-5 ${!click ? '' : 'hidden'}`}>Refund Cancelled</h1>
        <div className=' relative overflow-x-auto '>
          <table className='w-full text-sm text-left'>
            <thead className={`text-sm uppercase border-b ${color.thead}`}>
              <tr>
                <th scope='col' className='px-4 py-3 text-nowrap'>Order Id </th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Amount</th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Refund</th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Date - Time</th>
                <th scope='col' className='px-4 py-3 text-nowrap'>Action </th>
              </tr>
            </thead>
            {showRefund && showRefund.length > 0 ? (
              <tbody className={`${color.tbody}`}>
                {showRefund?.map((d, i) => <tr key={i}>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>{d.orderId}</td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>${d.amount}</td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>
                    <span className={`border px-3 rounded-full ${d.refund === 'Cancelled' ?  `${color.cancel_tru}` : `${color.cancel_fal}`}`}>{d.refund}</span>
                  </td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>{d.date}</td>
                  <td scope='row' className='px-4 py-3 font-medium text-nowrap'>
                    <Link to={`/admin/order/details/${d.orderId}`} className={`flex justify-center items-center w-[30px] p-[6px] rounded-md mx-3 ${action_icon?.vew} hover:shadow-lg hover:shadow-green-500/50`}><FaEye /></Link>
                  </td>
                </tr>)}
              </tbody>) : (
              <tbody>
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No Data Found!.
                  </td>
                </tr>
              </tbody>
            )
            }
          </table>
        </div>
      </div>
    </div>
  )
}

export default RefundRequest
