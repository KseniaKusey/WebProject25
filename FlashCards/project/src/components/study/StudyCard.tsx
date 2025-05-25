import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import { Card } from '../UI/Card';
import Button from '../UI/Button';
import { CheckCircle, XCircle } from 'lucide-react';

interface StudyCardProps {
  card: Flashcard;
  onResult: (cardId: string, correct: boolean) => void;
}

const StudyCard: React.FC<StudyCardProps> = ({ card, onResult }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false);
    setAnswered(false);
  }, [card]);

  const handleFlip = () => {
    if (!answered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    onResult(card.id, correct);
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
    <div className="perspective max-w-lg mx-auto">
      <div
        className={`relative min-h-[250px] transition-all duration-500 transform ${
          isFlipped ? 'rotate-y-180' : ''
        } preserve-3d ${!answered ? 'cursor-pointer' : ''}`}
        onClick={!answered ? handleFlip : undefined}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full backface-hidden p-6 flex flex-col">
          <div className="flex-1">
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)} mb-4`}
            >
              {card.difficulty}
            </span>
            <p className="text-xl font-medium text-center line-clamp-6">{card.front}</p>
          </div>
          <div className="text-center mt-4">
            {!answered && (
              <p className="text-sm text-gray-500">Tap to flip</p>
            )}
          </div>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 p-6 flex flex-col">
          <div className="flex-1">
            <p className="text-xl font-medium text-center line-clamp-6">{card.back}</p>
          </div>
          {!answered && (
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                variant="outline"
                leftIcon={<XCircle className="h-5 w-5 text-red-500" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(false);
                }}
                className="flex-1"
              >
                Incorrect
              </Button>
              <Button
                variant="outline"
                leftIcon={<CheckCircle className="h-5 w-5 text-green-500" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(true);
                }}
                className="flex-1"
              >
                Correct
              </Button>
            </div>
          )}
        </Card>
      </div>

      {answered && (
        <div className="mt-4 flex justify-center">
          <p className="text-sm text-gray-500">Card answered</p>
        </div>
      )}
    </div>
  );
};

export default StudyCard;