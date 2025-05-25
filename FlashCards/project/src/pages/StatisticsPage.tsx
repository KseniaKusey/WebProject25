import React from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { useStatsStore } from '../stores/useStatsStore';
import { useFlashcardStore } from '../stores/useFlashcardStore';
import { Award, TrendingUp, Calendar, Brain } from 'lucide-react';

const StatisticsPage: React.FC = () => {
  const { getStats } = useStatsStore();
  const { flashcards, groups } = useFlashcardStore();
  const stats = getStats();
  
  // Format date to readable string
  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Statistics</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Brain className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Total Cards</p>
                  <p className="text-lg font-semibold">{flashcards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Total Groups</p>
                  <p className="text-lg font-semibold">{groups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Award className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Streak</p>
                  <p className="text-lg font-semibold">{stats.studyStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Last Study</p>
                  <p className="text-lg font-semibold">{formatDate(stats.lastStudyDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Study Progress */}
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Study Progress</h2>
          </CardHeader>
          <CardContent className="p-6">
            {stats.totalCards > 0 ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Mastery Rate
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round((stats.masteredCards / stats.totalCards) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(stats.masteredCards / stats.totalCards) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex text-sm text-gray-500 justify-between">
                    <span>{stats.masteredCards} mastered</span>
                    <span>{stats.cardsToReview} to review</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Study Activity</h3>
                  <p className="text-gray-600 text-sm">
                    {stats.studyStreak > 0 ? (
                      <>You're on a {stats.studyStreak} day study streak. Keep it up!</>
                    ) : (
                      <>Study today to start your streak!</>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No study data available yet. Start studying to see your progress!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Group Statistics
        {groups.length > 0 && (
          <Card>
            <CardHeader className="border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Group Statistics</h2>
            </CardHeader>
            <CardContent className="p-6">
              {/* Implement group-specific statistics here *}
            </CardContent>
          </Card>
        )} */}
      </div>
    </Layout>
  );
};

export default StatisticsPage;