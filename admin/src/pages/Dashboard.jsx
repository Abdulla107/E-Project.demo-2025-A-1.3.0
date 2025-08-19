import React, { useEffect } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsCurrencyDollar } from 'react-icons/bs';
import { HiUsers } from 'react-icons/hi';
import { MdOutlineMoreTime } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_dashboardDetails } from '../store/reducers/authReducer';
import DashboardChart from '../components/dashboard/DashboardChart';
import { action_icon, dashboard_card, page_color } from '../color/colors';

const cards = [
  {
    label: 'Total Sales',
    icon: <BsCurrencyDollar className={`${dashboard_card?.sales?.icon_tex}`} />,
    bg: `${dashboard_card?.sales?.bg}`,
    key: 'sales_count',
  },
  {
    label: 'Total Customer',
    icon: <HiUsers className={`${dashboard_card?.customer?.icon_tex}`} />,
    bg: `${dashboard_card?.customer?.bg}`,
    key: 'customer_count',
  },
  {
    label: 'Total Orders',
    icon: <AiOutlineShoppingCart className={`${dashboard_card?.orders?.icon_tex}`} />,
    bg: `${dashboard_card?.orders?.bg}`,
    key: 'order_count',
  },
  {
    label: 'New Orders',
    icon: <MdOutlineMoreTime className={`${dashboard_card?.new_orders?.icon_tex}`} />,
    bg: `${dashboard_card?.new_orders?.bg}`,
    key: 'new_order_count',
  }
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { order_count, sales_count, customer_count, new_order_count, new_orders } = useSelector((state) => state.auth);

  const state = { order_count, sales_count, customer_count, new_order_count };

  useEffect(() => {
    dispatch(get_dashboardDetails());
  }, []);


  const table = dashboard_card?.orders_table || ''


  return (
    <div className='lg:px-2 my-2 mx-1'>
      <div className={`p-5 rounded-xl shadow-lg flex flex-col min-h-screen ${page_color?.bg}`}>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8 px-3'>
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`flex justify-between items-center p-5 rounded-xl bg-gradient-to-br ${card.bg} shadow-md hover:scale-[1.01] transition-transform duration-300 ease-in-out`}
            >
              <div className={`${page_color?.text_w}`}>
                <h1 className='text-3xl font-bold'>{state[card.key] || 0}</h1>
                <p className='font-semibold text-sm opacity-90'>{card.label}</p>
              </div>
              <div className={`w-[46px] h-[46px] ${dashboard_card.card_icon_bg} rounded-full flex items-center justify-center shadow-md`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <DashboardChart />

        {/* Orders Table */}
        <div className='px-4 py-3'>
          <h1 className='text-xl font-semibold mb-4'>Your new orders</h1>
          <div className='relative overflow-x-auto rounded-lg shadow'>
            <table className={`w-full text-sm text-left border ${table.table_border} overflow-x-auto`}>
              <thead className={`uppercase  border-b ${table.border}`}>
                <tr>
                  <th className='px-4 py-3 text-nowrap'>No</th>
                  <th className='px-4 py-3 text-nowrap'>Order Id</th>
                  <th className='px-4 py-3 text-nowrap'>Price</th>
                  <th className='px-4 py-3 text-nowrap'>Delivery Status</th>
                  <th className='px-4 py-3 text-nowrap'>Date & Time</th>
                  <th className='px-4 py-3 text-nowrap text-center'>Action</th>
                </tr>
              </thead>
              <tbody className={`${page_color}`}>
                {new_orders?.map((order, i) => (
                  <tr key={order._id} className={`border-b ${table.body_border}  transition`}>
                    <td className='px-4 py-3 text-nowrap'>{i + 1}</td>
                    <td className='px-4 py-3 text-nowrap'>{order._id}</td>
                    <td className='px-4 py-3 text-nowrap'>${order.total_price}</td>
                    <td className='px-4 py-3 text-nowrap'>
                      <span className={` text-xs px-3 py-1 rounded-full ${table.order_status}`}>
                        {order.delivery_status}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-nowrap'>{order.date}</td>
                    <td className='px-4 py-3 text-nowrap text-center'>
                      <Link
                        to={`/admin/order/details/${order._id}`}
                        className={`inline-flex items-center justify-center p-2 rounded-md hover:shadow-lg transition ${action_icon?.vew}`}
                      >
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
  );
};

export default Dashboard;
