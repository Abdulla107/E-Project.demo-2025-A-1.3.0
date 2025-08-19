import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_payment_details } from '../store/reducers/paymentReducer';
import TransactionTable from '../components/payment/TransactionTable';
import RefundTable from '../components/payment/RefundTable';
import { page_color, payment_color } from '../color/colors';

const Payments = () => {
  const dispatch = useDispatch();
  const [click, setClick] = useState(true);
  const { transactions, refund_details } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(get_payment_details());
  }, [dispatch]);

  const btn = payment_color?.btn || '';

  const buttonClass = (active) =>
    `border px-4 py-1 rounded-full text-sm ${btn.color} ${active
      ? `outline-none ring-2 ${btn.tru} ring-offset-2`
      : `${btn.fal}`
    }`;

  return (
    <div className='px-2 my-2 mx-1'>
      <div className={`${page_color?.bg} px-4 py-5 rounded-md min-h-screen`}>
        <div className='flex justify-center items-center pt-3 gap-4'>
          <button onClick={() => setClick(true)} className={buttonClass(click)}>Transactions</button>
          <button onClick={() => setClick(false)} className={buttonClass(!click)}>Refund Details</button>
        </div>

        <h1 className='text-xl font-semibold px-2 py-3 mt-5'>
          {click ? `Your all transactions - ${transactions?.length || 0}` : `Refund details - ${refund_details?.length || 0}`}</h1>

        <div className='relative overflow-x-auto'>
          {click ? <TransactionTable transactions={transactions} refund_details={refund_details} /> : <RefundTable refundDetails={refund_details} />}
        </div>
      </div>
    </div>
  );
};

export default Payments;
