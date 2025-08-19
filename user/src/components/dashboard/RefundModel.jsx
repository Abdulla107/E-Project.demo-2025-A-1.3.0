import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RefundModel = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0f0c18] bg-opacity-40"
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 text-center mx-3"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h2>
                        <p className="text-gray-600 mb-6">
                            Do you really want to request a refund for this order? This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                            >
                                Refund
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

            )}
        </AnimatePresence>
    );
};

export default RefundModel;
