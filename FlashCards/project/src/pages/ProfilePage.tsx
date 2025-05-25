import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardContent, CardFooter } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAuthStore } from '../stores/useAuthStore';
import { UserCircle, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-lg mx-auto">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <UserCircle className="h-24 w-24 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600 text-sm">
                {user.telegramId ? 'Telegram User' : 'Guest User'}
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-200 bg-gray-50 flex justify-center">
            <Button
              onClick={handleLogout}
              variant="outline"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Logout
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">About FlashFlow</h2>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-3">
              FlashFlow is a modern flashcard application designed to help you learn and memorize information effectively.
            </p>
            <p className="text-gray-600">
              Create customized flashcards, organize them into groups, and track your progress over time.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;