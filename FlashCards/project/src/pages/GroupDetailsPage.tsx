import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import FlashcardList from '../components/flashcards/FlashcardList';
import FlashcardForm from '../components/flashcards/FlashcardForm';
import { useFlashcardStore } from '../stores/useFlashcardStore';
import { Flashcard } from '../types';

const GroupDetailsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups } = useFlashcardStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | undefined>(undefined);
  
  if (!groupId) {
    return <Navigate to="/dashboard" />;
  }
  
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    return <Navigate to="/dashboard" />;
  }
  
  const handleAddNewCard = () => {
    setIsCreating(true);
    setEditingCard(undefined);
  };
  
  const handleEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setIsCreating(true);
  };
  
  const resetForm = () => {
    setIsCreating(false);
    setEditingCard(undefined);
  };
  
  // Get color class based on group color
  const getColorClass = (colorName: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-500' },
      green: { bg: 'bg-green-500', text: 'text-green-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-500' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-500' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-500' },
    };
    
    return colorMap[colorName] || { bg: 'bg-blue-500', text: 'text-blue-500' };
  };
  
  const colorClass = getColorClass(group.color);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg ${colorClass.bg} flex items-center justify-center text-white`}>
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            {group.description && (
              <p className="text-sm text-gray-600">{group.description}</p>
            )}
          </div>
        </div>
        
        {isCreating ? (
          <Card>
            <CardHeader className="border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCard ? 'Edit Flashcard' : 'Create Flashcard'}
              </h2>
            </CardHeader>
            <CardContent>
              <FlashcardForm
                groupId={groupId}
                editCard={editingCard}
                onComplete={resetForm}
                onCancel={resetForm}
              />
            </CardContent>
          </Card>
        ) : (
          <FlashcardList 
            groupId={groupId} 
            onAddNewCard={handleAddNewCard}
            onEditCard={handleEditCard}
          />
        )}
      </div>
    </Layout>
  );
};

export default GroupDetailsPage;