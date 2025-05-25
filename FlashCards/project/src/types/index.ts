export interface User {
  id: string;
  name: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReviewDate?: Date;
  group_id: string;
}

export interface FlashcardGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  cardCount: number;
}

export interface StudySession {
  id: string;
  groupId: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  cardsCorrect: number;
}

export interface StudyStats {
  totalCards: number;
  masteredCards: number;
  cardsToReview: number;
  studyStreak: number;
  lastStudyDate?: Date;
}