import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Leaf, Zap } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);

  const keywords = [
    {
      id: 'reliable',
      icon: Shield,
      label: 'Reliable',
      description: 'Built to last 200,000+ miles'
    },
    {
      id: 'sustainable',
      icon: Leaf,
      label: 'Sustainable',
      description: 'Industry-leading fuel efficiency'
    },
    {
      id: 'innovative',
      icon: Zap,
      label: 'Innovative',
      description: 'Cutting-edge safety technology'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Enhanced Blur Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/highlander.png)',
            filter: 'blur(2px) brightness(0.7)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          {/* Logo */}
          <motion.img
            src="/image.png"
            alt="Toyota"
            className="h-20 mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />

          {/* Unique Headline */}
          <motion.h1 
            className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Your Next Horizon Awaits.
            <br />
            <span className="text-toyota-red">Built for the Uncharted Road.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            The most reliable road trip of your life starts now.
          </motion.p>

          {/* Enhanced CTA Button with Glow */}
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(235, 10, 30, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/builder')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-toyota-red text-white font-black text-xl px-14 py-5 rounded-full transition-all duration-300 shadow-2xl relative overflow-hidden group"
          >
            <span className="relative z-10">Build Your Journey</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.button>

          {/* Interactive Keywords with Icons */}
          <div className="mt-20 flex items-center justify-center gap-6">
            {keywords.map((keyword, index) => {
              const Icon = keyword.icon;
              const isHovered = hoveredKeyword === keyword.id;
              
              return (
                <motion.div
                  key={keyword.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
                  onMouseEnter={() => setHoveredKeyword(keyword.id)}
                  onMouseLeave={() => setHoveredKeyword(null)}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="flex flex-col items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 cursor-pointer transition-all"
                  >
                    <Icon className="text-toyota-red" size={28} />
                    <span className="text-white font-semibold text-sm">
                      {keyword.label}
                    </span>
                  </motion.div>

                  {/* Hover Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-xl whitespace-nowrap text-sm font-medium"
                    >
                      {keyword.description}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;