import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ComparisonBarProps {
  count: number;
}

const ComparisonBar = ({ count }: ComparisonBarProps) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black text-white py-6 px-8 z-50 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">Ready to compare</p>
          <p className="text-2xl font-bold">{count} Vehicles Selected</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/compare'}
          className="bg-toyota-red hover:bg-red-700 px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-colors"
        >
          Compare Now
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ComparisonBar;