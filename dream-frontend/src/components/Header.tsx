import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white border-b border-gray-100 py-4 px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-white/90"
    >
      <div className="flex items-center gap-3">
        {/* Toyota Logo SVG */}
        <svg width="50" height="32" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="25" cy="16" rx="24" ry="15" stroke="#EB0A1E" strokeWidth="2" fill="none"/>
          <ellipse cx="25" cy="16" rx="14" ry="9" stroke="#EB0A1E" strokeWidth="2" fill="none"/>
          <path d="M 11 16 L 39 16" stroke="#EB0A1E" strokeWidth="2"/>
        </svg>
        <div className="text-2xl font-black tracking-tight text-gray-900">TOYOTA</div>
      </div>
      <nav className="flex gap-8 text-sm font-semibold">
        <a href="#" className="text-gray-600 hover:text-toyota-red transition-colors">
          VEHICLES
        </a>
        <a href="/compare" className="text-gray-600 hover:text-toyota-red transition-colors">
          COMPARE
        </a>
      </nav>
    </motion.header>
  );
};

export default Header;