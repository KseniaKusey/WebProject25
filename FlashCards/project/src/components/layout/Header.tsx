import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, BarChart2, ArrowLeft, Trophy } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [showBackButton, setShowBackButton] = useState(false);
  const [title, setTitle] = useState('FlashFlow');

  useEffect(() => {
    // Determine if we need to show back button based on route
    const path = location.pathname;
    setShowBackButton(path !== '/' && path !== '/dashboard');
    
    // Set title based on route
    if (path === '/') {
      setTitle('FlashFlow');
    } else if (path === '/dashboard') {
      setTitle('Dashboard');
    } else if (path.startsWith('/groups/')) {
      setTitle('Group Details');
    } else if (path.startsWith('/study/')) {
      setTitle('Study Mode');
    } else if (path === '/stats') {
      setTitle('Statistics');
    } else if (path === '/profile') {
      setTitle('Profile');
    } else if (path === '/leaderboard') {
      setTitle('Leaderboard');
    }
  }, [location]);

  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-screen-lg mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={handleNavigateBack}
                className="mr-3 text-gray-500 hover:text-gray-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
          
          <nav>
            <ul className="flex space-x-1">
              <li>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`p-2 rounded-full ${
                    location.pathname === '/dashboard'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Home"
                >
                  <Home className="h-5 w-5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/stats')}
                  className={`p-2 rounded-full ${
                    location.pathname === '/stats'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Statistics"
                >
                  <BarChart2 className="h-5 w-5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className={`p-2 rounded-full ${
                    location.pathname === '/leaderboard'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Leaderboard"
                >
                  <Trophy className="h-5 w-5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/profile')}
                  className={`p-2 rounded-full ${
                    location.pathname === '/profile'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header