import React, { useState } from 'react';
import { Flashcard } from '../../types';
import TextArea from '../UI/TextArea';
import Select from '../UI/Select';
import Button from '../UI/Button';
import { useFlashcardStore } from '../../stores/useFlashcardStore';

interface FlashcardFormProps {
  editCard?: Flashcard;
  groupId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const MAX_LENGTH = 50;

const FlashcardForm: React.FC<FlashcardFormProps> = ({ 
  editCard, 
  groupId, 
  onComplete,
  onCancel
}) => {
  const { addFlashcard, updateFlashcard } = useFlashcardStore();
  
  const [front, setFront] = useState(editCard?.front || '');
  const [back, setBack] = useState(editCard?.back || '');
  const [difficulty, setDifficulty] = useState(editCard?.difficulty || 'medium');
  const [errors, setErrors] = useState<{
    front?: string;
    back?: string;
    form?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      front?: string;
      back?: string;
      form?: string;
    } = {};
    
    if (!front.trim()) {
      newErrors.front = 'Front content is required';
    } else if (front.length > MAX_LENGTH) {
      newErrors.front = `Text must be ${MAX_LENGTH} characters or less`;
    }
    
    if (!back.trim()) {
      newErrors.back = 'Back content is required';
    } else if (back.length > MAX_LENGTH) {
      newErrors.back = `Text must be ${MAX_LENGTH} characters or less`;
    }

    if (!groupId) {
      newErrors.form = 'Invalid group ID';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editCard) {
        await updateFlashcard(editCard.id, {
          front: front.trim(),
          back: back.trim(),
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
        });
      } else {
        await addFlashcard({
          front: front.trim(),
          back: back.trim(),
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
          group_id: groupId,
        });
      }
      
      onComplete();
    } catch (error: any) {
      setErrors(prev => ({
        ...prev,
        form: error.message
      }));
    }
  };

  if (!groupId) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="text-red-500 text-sm mb-4">
          {errors.form}
        </div>
      )}
      
      <TextArea
        label="Front of Card"
        value={front}
        onChange={(e) => setFront(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="Question or term"
        error={errors.front}
        helperText={`${front.length}/${MAX_LENGTH} characters`}
        fullWidth
        required
      />
      
      <TextArea
        label="Back of Card"
        value={back}
        onChange={(e) => setBack(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="Answer or definition"
        error={errors.back}
        helperText={`${back.length}/${MAX_LENGTH} characters`}
        fullWidth
        required
      />
      
      <Select
        label="Difficulty"
        value={difficulty}
        onChange={setDifficulty}
        options={[
          { value: 'easy', label: 'Easy' },
          { value: 'medium', label: 'Medium' },
          { value: 'hard', label: 'Hard' },
        ]}
        fullWidth
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editCard ? 'Update Card' : 'Create Card'}
        </Button>
      </div>
    </form>
  );
};

export default FlashcardForm;