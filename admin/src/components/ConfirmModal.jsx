import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmModel, page_color } from '../color/colors';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {

  const model = confirmModel
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
           onClick={onClose}
          className={`fixed inset-0 z-50 flex items-center justify-center ${model.ani_bg}`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`w-full max-w-md rounded-2xl shadow-lg p-6 text-center ${page_color?.bg}`}
          >
            <h2 className={`text-xl font-bold mb-2 ${model.header_text} `}>
             Are you sure?
            </h2>
            <p className={`mb-6 ${model.text}`}>
             If you delete, it can no longer be restored.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className={`px-4 py-2 ${model.cancel_btn} transition cursor-pointer`}
              >
               Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 ${model.delete_btn} rounded transition cursor-pointer`}
              >
              Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
