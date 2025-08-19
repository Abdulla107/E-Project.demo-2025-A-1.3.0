import React from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { dashboard_chart } from '../../color/colors';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const cl = dashboard_chart?.chart_main || ''

const chartOptions = (lineColor, categories) => ({
  chart: {
    background: 'transparent',
    foreColor: `${cl.foreColor}`,
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: [lineColor],
  },
  grid: { borderColor: `${cl.borderColor}` },
  xaxis: {
    categories,
    labels: { style: { colors: `${cl.colors}` } },
  },
  yaxis: {
    labels: { style: { colors: `${cl.colors}` } },
  },
  legend: { show: false },
  colors: [lineColor],
  tooltip: { theme: `${cl.theme}` },
});

const ani = dashboard_chart?.animate_c || ''

const SkeletonCard = () => (

  <motion.div
    initial={{ opacity: 0.2 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
    className={`w-full ${ani?.loding} p-6 rounded-2xl shadow-lg `}
  >
    <div className={`mb-4 h-6 ${ani.d1} rounded w-1/3`}></div>
    <div className={`h-[300px] ${ani.d2} rounded-lg`}></div>
  </motion.div>
);

const DashboardChart = () => {
  const { order_chart, customer_chart } = useSelector((state) => state.auth);

  const isOrderReady = Array.isArray(order_chart) && order_chart.length > 0;
  const isCustomerReady = Array.isArray(customer_chart) && customer_chart.length > 0;

  const order = dashboard_chart?.orders || ''
  const customer = dashboard_chart?.customers || ""

  return (
    <div className="px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 w-full gap-6"
      >
        {/* Orders Chart */}
        {isOrderReady ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`w-full  p-6 rounded-2xl shadow-2xl transition ${order.bg}`}
          >
            <h2 className={`$ text-xl font-bold mb-4 tracking-wide ${dashboard_chart?.text}`}>📦 Monthly Orders</h2>
            <Chart
              options={chartOptions(`${order.chart}`, months.slice(0, order_chart.length))}
              series={[{ name: 'Orders', data: order_chart }]}
              type="area"
              height={320}
            />
          </motion.div>
        ) : (
          <SkeletonCard />
        )}

        {/* Customers Chart */}
        {isCustomerReady ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`w-full ${customer.bg}  p-6 rounded-2xl shadow-2xl transition`}
          >
            <h2 className={`text-xl font-bold mb-4 tracking-wide ${dashboard_chart?.text}`}>🧍 Monthly Customers</h2>
            <Chart
              options={chartOptions(`${customer.chart}`, months.slice(0, customer_chart.length))}
              series={[{ name: 'Customers', data: customer_chart }]}
              type="area"
              height={320}
            />
          </motion.div>
        ) : (
          <SkeletonCard />
        )}
      </motion.div>
    </div>
  );
};

export default DashboardChart;
