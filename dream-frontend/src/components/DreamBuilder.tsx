import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Header from './Header';
import FilterPanel from './FilterPanel';
import ChatSection from './ChatSection';
import BudgetDialog from './BudgetDialog';
import ResultsSection from './Results';
import ComparisonBar from './ComparisonBar';

const API_BASE_URL = 'http://127.0.0.1:8000';

const DreamBuilder = () => {
	const defaultFilters = {
		vehicleTypes: new Set<string>(),
		priceRange: [15000, 90000] as [number, number],
		mpgRange: [15, 60] as [number, number],
		seating: new Set<number>(),
	};

	const [filters, setFilters] = useState(defaultFilters);
	const [userPreferences, setUserPreferences] = useState('');
	const [hasBudget, setHasBudget] = useState(false);
	const [showBudgetDialog, setShowBudgetDialog] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [compareList, setCompareList] = useState<Set<number>>(new Set());
	const [recommendations, setRecommendations] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const [budgetData, setBudgetData] = useState({
		income: '',
		expenses: '',
		cash: '',
		creditScore: 'Excellent (750+)'
	});

	// Show button if ANY change from default
	const hasAnyChange =
		filters.vehicleTypes.size > 0 ||
		filters.seating.size > 0 ||
		filters.priceRange[0] !== 15000 ||
		filters.priceRange[1] !== 90000 ||
		filters.mpgRange[0] !== 15 ||
		filters.mpgRange[1] !== 60 ||
		userPreferences.length > 0;

	const handleBuildPreferences = async (conversation: [number, string][]) => {
		console.log('🔄 Building preferences from conversation:', conversation);

		try {
			const response = await fetch(`${API_BASE_URL}/recommend_filters`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ conversation })
			});

			const data = await response.json();
			console.log('✅ Received filters from backend:', data);

			// Map backend response to frontend filter format
			const newFilters = {
				vehicleTypes: new Set<string>(data.vehicle_types || []),
				priceRange: data.price_range as [number, number],
				mpgRange: data.mpg_range as [number, number],
				seating: new Set<number>(data.seating_options || []),
			};

			console.log('🎯 Applying filters to UI:', newFilters);

			// Update preferences text
			if (data.preferences_text) {
				setUserPreferences(data.preferences_text);
			}

			// Smoothly animate the filter changes
			setFilters(newFilters);

			// Add a visual feedback
			const filterPanel = document.querySelector('[data-filter-panel]');
			if (filterPanel) {
				filterPanel.classList.add('animate-pulse');
				setTimeout(() => filterPanel.classList.remove('animate-pulse'), 1000);
			}
		} catch (error) {
			console.error('❌ Error building preferences:', error);
			alert('Failed to build preferences. Make sure the backend is running on port 8000.');
		}
	};

	const handleShowMatches = async () => {
		setIsLoading(true);

		try {
			// Map frontend filter format to backend format - ensure tuples
			const filterRequest = {
				vehicle_types: Array.from(filters.vehicleTypes),
				price_range: [filters.priceRange[0], filters.priceRange[1]], // Tuple as array
				mpg_range: [filters.mpgRange[0], filters.mpgRange[1]], // Tuple as array
				seating_options: Array.from(filters.seating),
				preferences_text: userPreferences
			};

			console.log('🚗 Requesting recommendations with filters:', filterRequest);

			const response = await fetch(`${API_BASE_URL}/recommend_cars?top_n=5`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(filterRequest)
			});

			const data = await response.json();
			console.log('✅ Received recommendations:', data);

			setRecommendations(data.recommendations || []);
			setShowResults(true);
		} catch (error) {
			console.error('❌ Error fetching recommendations:', error);
			alert('Failed to fetch recommendations. Make sure the backend is running on port 8000.');
		} finally {
			setIsLoading(false);
		}
	};

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
						<div className="w-2/3 p-8 overflow-y-auto pb-32">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<h1 className="text-5xl font-black mb-2 text-gray-900">
									Let's build your dream Toyota.
								</h1>
								<p className="text-lg text-gray-500 mb-12">
									Use the filters below or chat with our AI assistant
								</p>

								<div data-filter-panel className="transition-all duration-500">
									<FilterPanel
										filters={filters}
										onFiltersChange={setFilters}
										hasBudget={hasBudget}
										onOpenBudget={() => setShowBudgetDialog(true)}
									/>
								</div>

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
								<AnimatePresence>
									{hasAnyChange && (
										<motion.button
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={handleShowMatches}
											disabled={isLoading}
											className="w-full mt-8 bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
										>
											{isLoading ? 'Finding Your Matches...' : 'Show My Matches →'}
										</motion.button>
									)}
								</AnimatePresence>
							</motion.div>
						</div>

						{/* Chat Section - 1/3 width */}
						<ChatSection onBuildPreferences={handleBuildPreferences} />
					</motion.div>
				) : (
					<motion.div
						key="results"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="p-8 pb-32"
					>
						<ResultsSection
							recommendations={recommendations}
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
				budgetData={budgetData}  // Pass current values
				onSave={(data) => {
					setBudgetData(data);  // Store the values
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