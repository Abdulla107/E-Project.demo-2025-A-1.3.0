import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { get_deshboard_orders } from '../../store/reducers/orderReducer';
import { summaryCardColors } from '../../color/colors';

const Summary_Cards = () => {
  const dispatch = useDispatch();
  const { total_order, pending_order } = useSelector(state => state.order);
  const { wishlist_count } = useSelector(state => state.card);
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if (userInfo.id) {
      dispatch(get_deshboard_orders(userInfo.id));
    }
  }, [userInfo.id, dispatch]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Total Orders", count: total_order },
          { title: "Wishlist Items", count: wishlist_count },
          { title: "Pending Orders", count: pending_order },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 + i * 0.2 }}
            className={`p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${summaryCardColors.cardBg}`}
          >
            <h3 className={`text-lg font-semibold ${summaryCardColors.titleText}`}>{item.title}</h3>
            <p className={`text-3xl font-bold mt-2 ${summaryCardColors.countText}`}>{item.count || 0}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Summary_Cards;
