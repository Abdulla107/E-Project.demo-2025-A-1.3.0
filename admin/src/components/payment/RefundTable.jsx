import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { action_icon, payment_color } from '../../color/colors';

const RefundTable = ({ refundDetails }) => {
  const [visibleIndex, setVisibleIndex] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Refund Transaction ID copied!');
  };

  const thead_color = payment_color?.table_color.thead || '';
  const color = payment_color?.table_color?.tbody || '';
  const text_color = payment_color?.table_color?.text_color || '';


  if (!refundDetails?.length) {
    return <p className={`text-center py-5 ${text_color}`}>No refund details found.</p>;
  }

  return (
    <table className='w-full text-sm text-left'>
      <thead className={`text-sm uppercase border-b ${thead_color}`}>
        <tr>
          <th className='px-4 py-3 text-nowrap'>Order Id</th>
          <th className='px-4 py-3 text-nowrap'>Price</th>
          <th className='px-4 py-3 text-nowrap'>Transaction ID</th>
          <th className='px-4 py-3 text-nowrap'>Refund</th>
          <th className='px-4 py-3 text-nowrap'>Date - Time</th>
          <th className='px-4 py-3 text-nowrap'>Action</th>
        </tr>
      </thead>
      <tbody className={`${color}`}>
        {refundDetails.map((d, i) => (
          <tr key={i} className={`border-b ${color.border}`} >
            <td className='px-4 py-3 text-nowrap'>{d.orderId}</td>
            <td className='px-4 py-3 text-nowrap'>${d.amount}</td>
            <td className='px-4 py-3 text-nowrap'>
              <div className='flex items-center gap-2'>
                <span className='font-mono'>
                  {visibleIndex === i ? d.transactionId : '*****************'}
                </span>
                <button
                  aria-label="Toggle visibility"
                  onClick={() => setVisibleIndex(visibleIndex === i ? null : i)}
                  className={`${color.toggle_btn}`}
                >
                  {visibleIndex === i ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button
                  aria-label="Copy to clipboard"
                  onClick={() => copyToClipboard(d.transactionId)}
                  className={`${color.copy_btn}`}
                >
                  <FaCopy />
                </button>
              </div>
            </td>
            <td className={`px-4 py-3 text-nowrap ${color.refund_tru}`}>{d.refund}</td>
            <td className='px-4 py-3 text-nowrap'>
              {d.date}
            </td>
            <td className='px-4 py-3 text-nowrap'>
              <Link
                to={`/admin/order/details/${d.orderId}`}
                className={`flex justify-center items-center w-[30px] p-[6px] rounded-md mx-3 hover:shadow-lg ${action_icon?.vew}`}
              >
                <FaEye />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RefundTable;
