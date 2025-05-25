import React, { useState } from 'react';
import { Flashcard } from '../../types';
import { Card } from '../UI/Card';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../UI/Button';

interface FlashcardItemProps {
  card: Flashcard;
  onEdit: (card: Flashcard) => void;
  onDelete: (id: string) => void;
  showActions?: boolean;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ 
  card, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="perspective">
      <div
        className={`relative min-h-[200px] transition-all duration-500 transform ${
          isFlipped ? 'rotate-y-180' : ''
        } preserve-3d cursor-pointer`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full backface-hidden">
          <div className="p-6 flex flex-col space-y-4">
            <div className="flex-1">
              <p className="text-base font-medium line-clamp-4">{card.front}</p>
            </div>
            <div className="flex justify-between items-center">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}
              >
                {card.difficulty}
              </span>
              {showActions && (
                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => onEdit(card)}
                    aria-label="Edit flashcard"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={() => onDelete(card.id)}
                    aria-label="Delete flashcard"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="p-6 flex flex-col space-y-4">
            <div className="flex-1">
              <p className="text-base font-medium line-clamp-4">{card.back}</p>
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-gray-500">Tap to flip</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardItem;