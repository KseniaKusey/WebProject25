import React from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { useStatsStore } from '../stores/useStatsStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const { getLeaderboard } = useStatsStore();
  const { user } = useAuthStore();
  const leaderboard = getLeaderboard();
  
  // Find current user's rank
  const userRank = leaderboard.findIndex(entry => entry.userId === user?.id) + 1;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        
        {/* User's Position */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Ranking</h2>
                <p className="text-blue-100">
                  {userRank > 0 
                    ? `You're ranked #${userRank} out of ${leaderboard.length} users` 
                    : 'Start studying to appear on the leaderboard!'}
                </p>
              </div>
              <Trophy className="h-12 w-12 text-yellow-300" />
            </div>
          </CardContent>
        </Card>
        
        {/* Leaderboard List */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Students</h2>
          </CardHeader>
          <CardContent className="divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.userId}
                className={`flex items-center justify-between p-4 ${
                  entry.userId === user?.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {index === 0 ? (
                      <Trophy className="h-6 w-6 text-yellow-400" />
                    ) : index === 1 ? (
                      <Medal className="h-6 w-6 text-gray-400" />
                    ) : index === 2 ? (
                      <Award className="h-6 w-6 text-amber-600" />
                    ) : (
                      <span className="w-6 text-center text-gray-500">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {entry.name}
                      {entry.userId === user?.id && ' (You)'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {entry.studyStreak} day streak
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {entry.masteredCards} cards
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round(entry.accuracy * 100)}% accuracy
                  </p>
                </div>
              </div>
            ))}
            
            {leaderboard.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No study data available yet. Be the first on the leaderboard!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;