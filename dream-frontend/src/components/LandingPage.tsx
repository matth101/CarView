import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.6, ease: 'easeInOut' }}
			className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
		>
			{/* Background accent */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-20 right-20 w-96 h-96 bg-toyota-red rounded-full blur-3xl" />
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-toyota-red rounded-full blur-3xl" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.8 }}
				className="text-center z-10 px-4"
			>
				<h1 className="text-7xl md:text-9xl font-bold text-white mb-6 tracking-tight">
					TOYOTA
				</h1>
				<p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
					Lead the future of mobility. Find your dream car with personalized
					recommendations tailored to your lifestyle.
				</p>

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => navigate('/builder')}
					className="bg-toyota-red hover:bg-red-700 text-white font-bold text-lg px-12 py-5 rounded-sm transition-all duration-300 shadow-2xl hover:shadow-toyota-red/50"
				>
					BUILD YOUR DREAM TOYOTA
				</motion.button>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 1 }}
					className="mt-16 text-gray-500 text-sm"
				>
					Personalized • Intelligent • Seamless
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default LandingPage;