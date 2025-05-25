import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcardStore } from '../stores/useFlashcardStore';
import { useStatsStore } from '../stores/useStatsStore';
import { FlashcardGroup } from '../types';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '../components/UI/Card';
import Button from '../components/UI/Button';
import GroupItem from '../components/flashcards/GroupItem';
import GroupForm from '../components/flashcards/GroupForm';
import { Plus, BookOpen, Award } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { groups, deleteGroup } = useFlashcardStore();
  const { getStats } = useStatsStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FlashcardGroup | undefined>(undefined);
  
  const stats = getStats();
  
  const sortedGroups = [...groups].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const handleEditGroup = (group: FlashcardGroup) => {
    setEditingGroup(group);
  };
  
  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group? All cards in this group will be deleted as well.')) {
      deleteGroup(groupId);
    }
  };
  
  const resetForm = () => {
    setIsCreating(false);
    setEditingGroup(undefined);
  };
  
  // Check if there are any cards due for review across all groups
  const cardsForReview = stats.cardsToReview || 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats summary */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
                <p className="text-blue-100">
                  {cardsForReview > 0 
                    ? `You have ${cardsForReview} cards waiting for review.` 
                    : 'All caught up! No cards waiting for review.'}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-xs mt-1">
                  {stats.studyStreak} day{stats.studyStreak !== 1 ? 's' : ''} streak
                </span>
              </div>
            </div>
            
            {cardsForReview > 0 && (
              <div className="mt-4">
                <Button
                  onClick={() => navigate('/study')}
                  leftIcon={<BookOpen className="h-4 w-4" />}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Start Reviewing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Group management */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Your Study Groups</h2>
            {!isCreating && !editingGroup && (
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsCreating(true)}
              >
                New Group
              </Button>
            )}
          </div>
          
          {isCreating || editingGroup ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  {editingGroup ? 'Edit Group' : 'Create New Group'}
                </h3>
                <GroupForm
                  editGroup={editingGroup}
                  onComplete={resetForm}
                  onCancel={resetForm}
                />
              </CardContent>
            </Card>
          ) : null}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedGroups.length === 0 && !isCreating ? (
              <Card className="col-span-full p-6 text-center">
                <p className="text-gray-500 mb-4">You don't have any study groups yet.</p>
                <Button
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsCreating(true)}
                >
                  Create Your First Group
                </Button>
              </Card>
            ) : (
              sortedGroups.map((group) => (
                <GroupItem
                  key={group.id}
                  group={group}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;