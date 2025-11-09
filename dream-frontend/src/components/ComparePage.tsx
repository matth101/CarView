import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { Check, X } from 'lucide-react';

const ComparePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const vehicles = location.state?.vehicles || [];
	const fromResults = location.state?.fromResults;

	console.log('📊 Vehicles to compare:', vehicles);

	const handleBack = () => {
		if (fromResults) {
			// Go back to results, not filter page
			navigate('/builder', { state: { showResults: true } });
		} else {
			navigate(-1);
		}
	};

	// If no vehicles to compare, show empty state
	if (vehicles.length === 0) {
		return (
			<div className="min-h-screen bg-white">
				<Header />
				<div className="max-w-4xl mx-auto px-8 py-32 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<X className="text-gray-400" size={48} />
						</div>
						<h1 className="text-4xl font-black mb-4">No Vehicles to Compare</h1>
						<p className="text-gray-500 text-lg mb-8">
							Select at least 2 vehicles from your search results to compare
						</p>
						<button
							onClick={() => navigate('/builder')}
							className="bg-toyota-red text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-colors"
						>
							Find Vehicles
						</button>
					</motion.div>
				</div>
			</div>
		);
	}

	const specs = [
		{
			label: 'Starting MSRP',
			key: 'price',
			format: (v: any) => v ? `$${v.toLocaleString()}` : 'Contact Dealer',
			highlight: true
		},
		{
			label: 'Combined MPG',
			key: 'mpg',
			format: (v: any) => v ? `${v} MPG` : 'Not Available'
		},
		{
			label: 'Match Score',
			key: 'matchScore',
			format: (v: any) => v ? `${v}%` : 'N/A'
		},
		{
			label: 'Description',
			key: 'tagline',
			format: (v: any) => v || 'A quality Toyota vehicle',
			multiline: true
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<Header />

			<div className="max-w-7xl mx-auto px-8 py-16">
				{/* Title with accent */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-16"
				>
					<div className="flex items-center gap-4 mb-4">
						<div className="h-1 w-16 bg-toyota-red rounded-full" />
						<h1 className="text-5xl font-black">Compare Vehicles</h1>
					</div>
					<p className="text-gray-500 text-lg ml-20">
						Comparing {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} side by side
					</p>
				</motion.div>

				{/* Vehicle Cards */}
				<div className={`grid grid-cols-1 ${vehicles.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 mb-12`}>
					{vehicles.map((vehicle: any, idx: number) => (
						<motion.div
							key={idx}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.1 }}
							className="relative"
						>
							{/* Winner Badge */}
							{idx === 0 && vehicles.length > 1 && (
								<div className="absolute -top-3 -right-3 bg-toyota-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
									Best Match
								</div>
							)}

							<div className="border-2 border-gray-200 rounded-3xl overflow-hidden hover:border-toyota-red transition-colors">
								<div className="bg-gray-50 p-6">
									<img
										src={vehicle.image || 'https://images.unsplash.com/photo-1623869675241-913c326c3b96?w=400&q=80'}
										alt={vehicle.name}
										className="w-full h-48 object-cover rounded-2xl"
									/>
								</div>
								<div className="p-6 text-center">
									<h2 className="text-2xl font-black mb-2">{vehicle.name}</h2>
									{vehicle.matchScore && (
										<div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
											<Check size={16} />
											{vehicle.matchScore}% Match
										</div>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Specs Comparison Table */}
				<div className="bg-gray-50 rounded-3xl p-8">
					<h3 className="text-2xl font-black mb-8 flex items-center gap-3">
						<div className="w-2 h-8 bg-toyota-red rounded-full" />
						Technical Specifications
					</h3>

					{specs.map((spec, specIdx) => (
						<motion.div
							key={spec.label}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 + specIdx * 0.05 }}
							className={`grid grid-cols-1 ${vehicles.length === 2 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-6 py-6 border-b border-gray-200 last:border-0`}
						>
							{/* Label Column */}
							<div className="font-bold text-sm text-gray-700 uppercase tracking-wide flex items-center">
								{spec.label}
							</div>

							{/* Values for each vehicle */}
							{vehicles.map((vehicle: any, vIdx: number) => (
								<div
									key={vIdx}
									className={`text-center md:text-left ${spec.highlight ? 'text-toyota-red font-black text-2xl' : 'text-gray-900 font-semibold text-lg'}`}
								>
									{spec.format(vehicle[spec.key as keyof typeof vehicle])}
								</div>
							))}
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="mt-12 flex justify-center gap-4"
				>
					<button
						onClick={handleBack}
						className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-bold hover:border-toyota-red hover:text-toyota-red transition-colors"
					>
						← Back to Results
					</button>
					<button
						onClick={() => navigate('/builder')}
						className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
					>
						New Search
					</button>
				</motion.div>
			</div>
		</div>
	);
};

export default ComparePage;