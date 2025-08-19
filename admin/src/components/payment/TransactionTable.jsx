import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCopy } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { action_icon, payment_color } from '../../color/colors';

const TransactionTable = ({ transactions, refund_details = [] }) => {
    const [visibleIndex, setVisibleIndex] = useState(null);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Transaction ID copied!');
    };

    const thead_color = payment_color?.table_color?.thead || '';
    const colors = payment_color?.table_color?.tbody || '';
    const text_color = payment_color?.table_color?.text_color || '';

    if (!transactions?.length) {
        return (
            <p className={`text-center py-5 ${text_color}`}>
                No transactions found.
            </p>
        );
    }


    return (
        <div className="overflow-x-auto">
            <table className='w-full text-sm text-left border-collapse'>
                <thead className={`text-sm uppercase border-b ${thead_color}`}>
                    <tr>
                        <th className='px-4 py-3 text-nowrap'>Order Id</th>
                        <th className='px-4 py-3 text-nowrap'>Price</th>
                        <th className='px-4 py-3 text-nowrap'>Transaction ID</th>
                        <th className='px-4 py-3 text-nowrap'>Date - Time</th>
                        <th className='px-4 py-3 text-nowrap'>Action</th>
                    </tr>
                </thead>
                <tbody className={`${colors.bg}`}>
                    {transactions.map((d, i) => {
                        const isRefunded = refund_details.some(refund => refund.orderId === d.orderId);

                        return (
                            <tr key={i} className={`border-b  ${colors.border}`}>
                                <td className='px-4 py-3 text-nowrap'>
                                    <span className={isRefunded ? `font-semibold ${colors.refund_tru}` : ''}>
                                        {d.orderId}
                                    </span>
                                </td>
                                <td className='px-4 py-3 text-nowrap'>${d.amount}</td>
                                <td className='px-4 py-3 text-nowrap'>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-mono'>
                                            {visibleIndex === i ? d.transactionId : '*****************'}
                                        </span>
                                        <button
                                            aria-label="Toggle visibility"
                                            onClick={() => setVisibleIndex(visibleIndex === i ? null : i)}
                                            className={`${colors.toggle_btn}`}
                                        >
                                            {visibleIndex === i ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                        <button
                                            aria-label="Copy to clipboard"
                                            onClick={() => copyToClipboard(d.transactionId)}
                                            className={`${colors.copy_btn}`}
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                </td>
                                <td className='px-4 py-3 text-nowrap'>{d.date}</td>
                                <td className='px-4 py-3 text-nowrap'>
                                    <Link
                                        to={`/admin/order/details/${d.orderId}`}
                                        aria-label="View order details"
                                        className={`flex justify-center items-center w-[30px] p-[6px] rounded-md mx-3 hover:shadow-lg ${action_icon?.vew}`}
                                    >
                                        <FaEye />
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
