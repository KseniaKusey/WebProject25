import React from 'react';
import { Flashcard } from '../../types';
import FlashcardItem from './FlashcardItem';
import { Plus } from 'lucide-react';
import Button from '../UI/Button';
import { useFlashcardStore } from '../../stores/useFlashcardStore';

interface FlashcardListProps {
  groupId: string;
  onAddNewCard: () => void;
  onEditCard: (card: Flashcard) => void;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ 
  groupId, 
  onAddNewCard,
  onEditCard
}) => {
  const { getGroupCards, deleteFlashcard } = useFlashcardStore();
  const cards = getGroupCards(groupId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {cards.length} {cards.length === 1 ? 'Card' : 'Cards'}
        </h2>
        <Button 
          variant="primary" 
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={onAddNewCard}
        >
          Add Card
        </Button>
      </div>

      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No cards yet! Start by adding your first flashcard.</p>
            <Button 
              variant="primary"
              onClick={onAddNewCard}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create First Card
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cards.map((card) => (
              <FlashcardItem
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={deleteFlashcard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardList;