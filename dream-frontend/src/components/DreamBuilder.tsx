import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Header from './Header';
import FilterPanel from './FilterPanel';
import ChatSection from './ChatSection';
import BudgetDialog from './BudgetDialog';
import ResultsSection from './Results';
import ComparisonBar from './ComparisonBar';

const DreamBuilder = () => {
	const [filters, setFilters] = useState({
		vehicleTypes: new Set<string>(),
		priceRange: [15000, 90000] as [number, number],
		mpgRange: [15, 60] as [number, number],
		seating: new Set<number>(),
	});
	const [userPreferences, setUserPreferences] = useState('');
	const [hasBudget, setHasBudget] = useState(false);
	const [showBudgetDialog, setShowBudgetDialog] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [compareList, setCompareList] = useState<Set<number>>(new Set());

	const hasFiltersSelected =
		filters.vehicleTypes.size > 0 ||
		filters.seating.size > 0 ||
		userPreferences.length > 10;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-white"
		>
			<Header />

			<AnimatePresence mode="wait">
				{!showResults ? (
					<motion.div
						key="input"
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="flex h-[calc(100vh-5rem)]"
					>
						{/* Main Filter Area - 2/3 width */}
						<div className="w-2/3 p-8 overflow-y-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<h1 className="text-5xl font-black mb-2 text-gray-900">
									Let's build your dream Toyota.
								</h1>
								<p className="text-lg text-gray-500 mb-12">
									Use the filters below and describe what you're looking for
								</p>

								<FilterPanel
									filters={filters}
									onFiltersChange={setFilters}
									hasBudget={hasBudget}
									onOpenBudget={() => setShowBudgetDialog(true)}
								/>

								{/* User Preferences Text Box */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									className="mt-8"
								>
									<label className="block text-sm font-bold mb-3 text-gray-700">
										Anything else we should know?
									</label>
									<textarea
										value={userPreferences}
										onChange={(e) => setUserPreferences(e.target.value)}
										placeholder="E.g., 'I need good cargo space for camping trips' or 'Looking for something sporty and fun'"
										className="w-full h-32 border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toyota-red transition-colors resize-none"
									/>
								</motion.div>

								{/* Show Matches Button */}
								{hasFiltersSelected && (
									<motion.button
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setShowResults(true)}
										className="w-full mt-8 bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors"
									>
										Show My Matches →
									</motion.button>
								)}
							</motion.div>
						</div>

						{/* Chat Section - 1/3 width */}
						<ChatSection />
					</motion.div>
				) : (
					<motion.div
						key="results"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="p-8"
					>
						<ResultsSection
							compareList={compareList}
							onToggleCompare={(id) => {
								const newList = new Set(compareList);
								if (newList.has(id)) {
									newList.delete(id);
								} else {
									newList.add(id);
								}
								setCompareList(newList);
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<BudgetDialog
				isOpen={showBudgetDialog}
				onClose={() => setShowBudgetDialog(false)}
				onSave={() => {
					setHasBudget(true);
					setShowBudgetDialog(false);
				}}
			/>

			{compareList.size >= 2 && (
				<ComparisonBar count={compareList.size} />
			)}
		</motion.div>
	);
};

export default DreamBuilder;