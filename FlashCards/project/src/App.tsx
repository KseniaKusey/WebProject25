import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { useFlashcardStore } from './stores/useFlashcardStore';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import StudyPage from './pages/StudyPage';
import StatisticsPage from './pages/StatisticsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  const { initAuth } = useAuthStore();
  const { loadUserData } = useFlashcardStore();
  
  useEffect(() => {
    const init = async () => {
      await initAuth();
      await loadUserData();
    };
    
    init();
  }, [initAuth, loadUserData]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/groups/:groupId" 
          element={
            <ProtectedRoute>
              <GroupDetailsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/study" 
          element={
            <ProtectedRoute>
              <StudyPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/study/:groupId" 
          element={
            <ProtectedRoute>
              <StudyPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/stats" 
          element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;