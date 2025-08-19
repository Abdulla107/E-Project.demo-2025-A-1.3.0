import React from 'react';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 sm:p-12 max-w-md text-center">
        <XCircle className="text-red-500 mx-auto mb-4 w-16 h-16 animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed!</h2>
        <p className="text-gray-600 mb-6">
          Unfortunately, we couldn't process your payment. Please go to order page and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard/orders"
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200"
          >
            Go To Order Page
          </Link>
         
        </div>

        <div className="mt-6 text-sm text-gray-400">
          If the problem persists, please reach out to our support team for help.
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
