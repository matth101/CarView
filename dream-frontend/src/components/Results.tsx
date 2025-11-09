import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import { useState } from 'react';

interface ResultsSectionProps {
  compareList: Set<number>;
  onToggleCompare: (id: number) => void;
}

const curatedCars = [
  {
    id: 1,
    name: 'Camry',
    tagline: 'Legendary reliability meets modern elegance',
    price: 26320,
    mpg: 32,
    matchScore: 95,
    image: 'https://images.unsplash.com/photo-1623869675241-913c326c3b96?w=800&q=80',
  },
  {
    id: 2,
    name: 'RAV4 Hybrid',
    tagline: 'Adventure-ready efficiency',
    price: 31575,
    mpg: 40,
    matchScore: 92,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
  },
  {
    id: 3,
    name: 'Corolla Hybrid',
    tagline: 'Efficiency perfected',
    price: 24500,
    mpg: 50,
    matchScore: 88,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
  },
];

const ResultsSection = ({ compareList, onToggleCompare }: ResultsSectionProps) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-black mb-3">Your Perfect Matches</h2>
        <p className="text-gray-500 text-lg">
          We found {curatedCars.length} vehicles tailored to your preferences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {curatedCars.map((car, index) => {
          const isInCompare = compareList.has(car.id);
          
          return (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              onHoverStart={() => setHoveredCard(car.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group cursor-pointer"
            >
              {/* Match Score Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.08, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {car.matchScore}% Match
              </motion.div>

              {/* Image */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-50 rounded-3xl overflow-hidden mb-6"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <motion.img
                    src={car.image}
                    alt={car.name}
                    animate={{
                      scale: hoveredCard === car.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  onClick={(e) => toggleFavorite(car.id, e)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <Heart
                    size={20}
                    className={
                      favorites.has(car.id)
                        ? 'fill-toyota-red text-toyota-red'
                        : 'text-gray-600'
                    }
                  />
                </button>
              </motion.div>

              {/* Content */}
              <div className="px-2">
                <h3 className="text-3xl font-black mb-2">{car.name}</h3>
                <p className="text-gray-500 mb-6 text-sm">{car.tagline}</p>

                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Starting MSRP
                    </p>
                    <p className="text-xl font-bold">
                      ${car.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Est. MPG
                    </p>
                    <p className="text-xl font-bold">{car.mpg}</p>
                  </div>
                </div>

                {/* Compare Checkbox */}
                <button
                  onClick={() => onToggleCompare(car.id)}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    isInCompare
                      ? 'bg-toyota-red text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isInCompare ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={20} />
                      Added to Compare
                    </span>
                  ) : (
                    'Add to Compare'
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsSection;