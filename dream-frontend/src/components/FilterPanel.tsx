import { motion } from 'framer-motion';
import { Car, Truck, Boxes, Zap, Baby } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Filters {
  vehicleTypes: Set<string>;
  priceRange: [number, number];
  mpgRange: [number, number];
  seating: Set<number>;
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  hasBudget: boolean;
  onOpenBudget: () => void;
}

const vehicleTypes = [
	{ id: 'Car', label: 'Car', icon: Car },
	{ id: 'SUV', label: 'SUV', icon: Car },
	{ id: 'Crossover', label: 'Crossover', icon: Boxes },
	{ id: 'Truck', label: 'Truck', icon: Truck },
	{ id: 'Minivan', label: 'Minivan', icon: Baby },
	{ id: 'EV', label: 'EV', icon: Zap },
  ];

const seatingOptions = [4, 5, 6, 7, 8];

const FilterPanel = ({ filters, onFiltersChange, hasBudget, onOpenBudget }: FilterPanelProps) => {
  const toggleVehicleType = (type: string) => {
    const newTypes = new Set(filters.vehicleTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    onFiltersChange({ ...filters, vehicleTypes: newTypes });
  };

  const toggleSeating = (seats: number) => {
    const newSeating = new Set(filters.seating);
    if (newSeating.has(seats)) {
      newSeating.delete(seats);
    } else {
      newSeating.add(seats);
    }
    onFiltersChange({ ...filters, seating: newSeating });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-12"
    >
      {/* Row 1: Vehicle Type + Seating */}
      <div className="grid grid-cols-2 gap-8">
        {/* Vehicle Types */}
        <div>
          <h3 className="text-xs font-bold mb-3 text-gray-700 uppercase tracking-wide">
            Vehicle Type
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {vehicleTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = filters.vehicleTypes.has(type.id);
              
              return (
                <button
                  key={type.id}
                  onClick={() => toggleVehicleType(type.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-toyota-red bg-red-50 text-toyota-red'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-semibold text-xs">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seating */}
        <div>
          <h3 className="text-xs font-bold mb-3 text-gray-700 uppercase tracking-wide">
            Available Seating
          </h3>
          <div className="flex gap-2 flex-wrap">
            {seatingOptions.map((seats) => {
              const isSelected = filters.seating.has(seats);
              
              return (
                <button
                  key={seats}
                  onClick={() => toggleSeating(seats)}
                  className={`px-5 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                    isSelected
                      ? 'border-toyota-red bg-red-50 text-toyota-red'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {seats}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Price + MPG Sliders */}
      <div className="grid grid-cols-2 gap-8">
        {/* Price Range */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Starting MSRP
            </h3>
            <button
              onClick={onOpenBudget}
              className={`text-sm font-bold px-6 py-3 rounded-full transition-all shadow-md ${
                hasBudget
                  ? 'bg-green-50 text-green-700 border-2 border-green-200'
                  : 'bg-toyota-red text-white hover:bg-red-700 hover:shadow-lg'
              }`}
            >
              {hasBudget ? '✓ Budget Set' : 'Set Budget'}
            </button>
          </div>
          
          {/* Slider */}
          <div className="mb-6 px-2">
            <Slider
              range
              min={15000}
              max={90000}
              step={1000}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onChange={(value) => {
                const [min, max] = value as [number, number];
                onFiltersChange({
                  ...filters,
                  priceRange: [min, max],
                });
              }}
              trackStyle={[{ backgroundColor: '#EB0A1E' }]}
              handleStyle={[
                { borderColor: '#EB0A1E', backgroundColor: 'white', opacity: 1 },
                { borderColor: '#EB0A1E', backgroundColor: 'white', opacity: 1 }
              ]}
              railStyle={{ backgroundColor: '#e5e7eb' }}
            />
          </div>

          {/* Min/Max Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1 font-semibold">Min</label>
              <input
                type="text"
                value={`$${filters.priceRange[0].toLocaleString()}`}
                readOnly
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-center bg-white"
              />
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1 font-semibold">Max</label>
              <input
                type="text"
                value={`$${filters.priceRange[1].toLocaleString()}`}
                readOnly
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-center bg-white"
              />
            </div>
          </div>
        </div>

        {/* MPG Range */}
        <div>
          <h3 className="text-sm font-bold mb-6 text-gray-700 uppercase tracking-wide">
            Combined EPA Est. MPG
          </h3>
          
          {/* Slider */}
          <div className="mb-6 px-2">
            <Slider
              range
              min={15}
              max={60}
              step={1}
              value={[filters.mpgRange[0], filters.mpgRange[1]]}
              onChange={(value) => {
                const [min, max] = value as [number, number];
                onFiltersChange({
                  ...filters,
                  mpgRange: [min, max],
                });
              }}
              trackStyle={[{ backgroundColor: '#EB0A1E' }]}
              handleStyle={[
                { borderColor: '#EB0A1E', backgroundColor: 'white', opacity: 1 },
                { borderColor: '#EB0A1E', backgroundColor: 'white', opacity: 1 }
              ]}
              railStyle={{ backgroundColor: '#e5e7eb' }}
            />
          </div>

          {/* Min/Max Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1 font-semibold">Min</label>
              <input
                type="text"
                value={`${filters.mpgRange[0]} MPG`}
                readOnly
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-center bg-white"
              />
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1 font-semibold">Max</label>
              <input
                type="text"
                value={`${filters.mpgRange[1]} MPG`}
                readOnly
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-center bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;