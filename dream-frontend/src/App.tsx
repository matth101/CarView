import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import DreamBuilder from './components/DreamBuilder';

function App() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {!showBuilder ? (
          <LandingPage key="landing" onStart={() => setShowBuilder(true)} />
        ) : (
          <DreamBuilder key="builder" />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;