import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSucceeded = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 sm:p-12 max-w-md text-center">
        <CheckCircle2 className="text-green-500 mx-auto mb-4 w-16 h-16 animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment was successful!</h2>
        <p className="text-gray-600 mb-6">
          Your order has been successfully received.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200"
          >
           Go to Home
          </Link>
          <Link
            to="/dashboard/orders"
            className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            Vew Order
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-400">
         If you have any questions about your order, please contact our customer care.
        </div>
      </div>
    </div>
  );
};

export default PaymentSucceeded;
