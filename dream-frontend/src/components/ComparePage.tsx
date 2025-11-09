import { motion } from 'framer-motion';
import Header from './Header';

const ComparePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-black mb-8">Compare Vehicles</h1>
        <p className="text-gray-500">Comparison feature coming soon...</p>
      </div>
    </div>
  );
};

export default ComparePage;