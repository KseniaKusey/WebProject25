import React, { useState } from 'react';
import { FlashcardGroup } from '../../types';
import Input from '../UI/Input';
import TextArea from '../UI/TextArea';
import Button from '../UI/Button';
import { useFlashcardStore } from '../../stores/useFlashcardStore';

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

const colorOptions = [
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Purple', value: 'purple' },
  { label: 'Pink', value: 'pink' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Orange', value: 'orange' },
];

interface GroupFormProps {
  editGroup?: FlashcardGroup;
  onComplete: () => void;
  onCancel: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ 
  editGroup, 
  onComplete,
  onCancel 
}) => {
  const { addGroup, updateGroup } = useFlashcardStore();
  
  const [name, setName] = useState(editGroup?.name || '');
  const [description, setDescription] = useState(editGroup?.description || '');
  const [color, setColor] = useState(editGroup?.color || 'blue');
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Group name is required';
    } else if (name.length > MAX_NAME_LENGTH) {
      newErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editGroup) {
      updateGroup(editGroup.id, {
        name: name.trim(),
        description: description.trim(),
        color,
      });
    } else {
      addGroup({
        name: name.trim(),
        description: description.trim(),
        color,
      });
    }
    
    onComplete();
  };
  
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
        placeholder="e.g. Spanish Vocabulary"
        error={errors.name}
        helperText={`${name.length}/${MAX_NAME_LENGTH} characters`}
        fullWidth
        required
      />
      
      <TextArea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
        placeholder="What are you studying with these cards?"
        helperText={`${description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
        fullWidth
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                color === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              onClick={() => setColor(option.value)}
              aria-label={option.label}
            >
              <span className={`w-6 h-6 rounded-full ${getColorClass(option.value)}`}></span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editGroup ? 'Update Group' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;