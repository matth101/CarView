import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DreamBuilder from './components/DreamBuilder';
import ComparePage from './components/ComparePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<DreamBuilder />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;