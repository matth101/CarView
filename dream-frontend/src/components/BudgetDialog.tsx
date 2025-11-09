import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const BudgetDialog = ({ isOpen, onClose, onSave }: BudgetDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-toyota-red/10 p-3 rounded-full">
                <DollarSign className="text-toyota-red" size={24} />
              </div>
              <h2 className="text-3xl font-black">Set Your Budget</h2>
            </div>
            
            <p className="text-gray-600 mb-8">
              Help us find the perfect car within your financial comfort zone
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Monthly Income
                </label>
                <input
                  type="number"
                  placeholder="$5,000"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-toyota-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Monthly Expenses
                </label>
                <input
                  type="number"
                  placeholder="$2,000"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-toyota-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Cash Available for Down Payment
                </label>
                <input
                  type="number"
                  placeholder="$10,000"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-toyota-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Credit Score Range
                </label>
                <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-toyota-red transition-colors">
                  <option>Excellent (750+)</option>
                  <option>Good (700-749)</option>
                  <option>Fair (650-699)</option>
                  <option>Poor (&lt;650)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              >
                Skip for Now
              </button>
              <button
                onClick={onSave}
                className="flex-1 bg-toyota-red text-white py-3 rounded-xl hover:bg-red-700 transition-colors font-bold"
              >
                Save Budget
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BudgetDialog;