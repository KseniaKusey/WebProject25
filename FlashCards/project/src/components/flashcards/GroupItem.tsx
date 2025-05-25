import React from 'react';
import { FlashcardGroup } from '../../types';
import { Card } from '../UI/Card';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import Button from '../UI/Button';
import { useNavigate } from 'react-router-dom';

interface GroupItemProps {
  group: FlashcardGroup;
  onEdit: (group: FlashcardGroup) => void;
  onDelete: (id: string) => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const getColorClass = (colorName: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
    };
    
    return colorMap[colorName] || 'bg-blue-500';
  };
  
  const handleOpenGroup = () => {
    navigate(`/groups/${group.id}`);
  };

  const handleStudyGroup = () => {
    navigate(`/study/${group.id}`);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start mb-4">
          <div className={`w-10 h-10 rounded-lg ${getColorClass(group.color)} flex items-center justify-center text-white`}>
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {group.name}
            </h3>
            <p className="text-sm text-gray-500">
              {group.cardCount} {group.cardCount === 1 ? 'card' : 'cards'}
            </p>
          </div>
        </div>
        
        {group.description && (
          <p className="text-sm text-gray-600 mb-4 flex-1">
            {group.description}
          </p>
        )}
        
        <div className="mt-auto flex flex-col space-y-2">
          <Button 
            onClick={handleOpenGroup} 
            variant="outline" 
            isFullWidth
          >
            View Cards
          </Button>
          
          {group.cardCount > 0 && (
            <Button 
              onClick={handleStudyGroup} 
              variant="primary" 
              leftIcon={<BookOpen className="h-4 w-4" />}
              isFullWidth
            >
              Study
            </Button>
          )}
          
          <div className="flex justify-end space-x-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm"
              leftIcon={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(group)}
              aria-label="Edit group"
            />
            <Button 
              variant="ghost" 
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
              onClick={() => onDelete(group.id)}
              aria-label="Delete group"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupItem;