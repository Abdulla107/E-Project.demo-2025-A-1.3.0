import React, { useEffect } from 'react'
import { get_profile_details } from '../../store/reducers/authReducer'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { PackageSearch, DollarSign, Clock } from "lucide-react";
import { page_color, state_cards_color } from '../../color/colors';

const Stat_cards = ({ fadeUp }) => {
  const dispatch = useDispatch();
  const { userInfo, count_orders, count_earnings, count_pending_orders } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(get_profile_details())
    }
  }, [userInfo])

  const color = state_cards_color || '';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { icon: <DollarSign />, title: "Earnings", value: count_earnings || 0 },
        { icon: <PackageSearch />, title: "Total Orders", value: count_orders || 0 },
        { icon: <Clock />, title: "Painding Orders", value: count_pending_orders || 0 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className={`${page_color?.bg} p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-2xl transition hover:-translate-y-1 group`}
          custom={i + 1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          whileHover={{ scale: 1.03 }}
        >
          <motion.div
            className={`${color.icon_color} p-3 rounded-full`}
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {item.icon}
          </motion.div>
          <div>
            <p className={`text-sm ${color.titel_color}`}>{item.title}</p>
            <h4 className={`text-xl font-bold ${color.value_color}`}>
              {item.value}
            </h4>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Stat_cards
