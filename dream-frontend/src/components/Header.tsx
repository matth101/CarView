import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-100 py-4 px-8 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <img 
          src="/image.png" 
          alt="Toyota" 
          className="h-8"
        />
      </button>
      <nav className="flex gap-8 text-sm font-semibold">
        <button 
          onClick={() => navigate('/builder')}
          className="text-gray-600 hover:text-toyota-red transition-colors"
        >
          VEHICLES
        </button>
        <button 
          onClick={() => navigate('/compare')}
          className="text-gray-600 hover:text-toyota-red transition-colors"
        >
          COMPARE
        </button>
      </nav>
    </header>
  );
};

export default Header;