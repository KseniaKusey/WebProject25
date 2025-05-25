import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StudyCard from '../components/study/StudyCard';
import Button from '../components/UI/Button';
import { Card, CardContent } from '../components/UI/Card';
import { useFlashcardStore } from '../stores/useFlashcardStore';
import { useStatsStore } from '../stores/useStatsStore';
import { Flashcard } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId?: string }>();
  const { getCardsForReview, markCardReviewed } = useFlashcardStore();
  const { startSession, endSession } = useStatsStore();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsToStudy, setCardsToStudy] = useState<Flashcard[]>([]);
  const [studyResults, setStudyResults] = useState<Record<string, boolean>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [studyCompleted, setStudyCompleted] = useState(false);
  const [incorrectCards, setIncorrectCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFinishButton, setShowFinishButton] = useState(false);
  
  // Initialize study session
  useEffect(() => {
    const initStudy = async () => {
      try {
        // Get cards for review
        const cards = await getCardsForReview(groupId);
        
        // If no cards, redirect to dashboard
        if (cards.length === 0) {
          navigate('/dashboard');
          return;
        }
        
        // Shuffle the cards using Fisher-Yates algorithm
        const shuffledCards = [...cards];
        for (let i = shuffledCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }
        
        setCardsToStudy(shuffledCards);
        setIncorrectCards([]);
        
        // Start a new study session
        const session = await startSession(groupId || 'all');
        setSessionId(session.id);
        
        // Reset study state
        setActiveIndex(0);
        setStudyResults({});
        setStudyCompleted(false);
        setShowFinishButton(false);
      } catch (error) {
        console.error('Error initializing study session:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    initStudy();
  }, [groupId, navigate, getCardsForReview, startSession]);
  
  const handleResult = async (cardId: string, correct: boolean) => {
    try {
      // Store the result
      setStudyResults(prev => ({
        ...prev,
        [cardId]: correct
      }));
      
      // If incorrect, add to incorrectCards
      if (!correct) {
        const card = cardsToStudy[activeIndex];
        setIncorrectCards(prev => [...prev, card]);
      }
      
      // Mark the card as reviewed in the store
      await markCardReviewed(cardId, correct);
      
      // Check if we should show the finish button
      if (activeIndex === cardsToStudy.length - 1 && !correct) {
        setShowFinishButton(true);
      }
    } catch (error) {
      console.error('Error marking card as reviewed:', error);
    }
  };
  
  const handleNext = () => {
    const currentCard = cardsToStudy[activeIndex];
    if (!currentCard || studyResults[currentCard.id] === undefined) {
      return; // Don't proceed if current card hasn't been answered
    }
    
    if (activeIndex < cardsToStudy.length - 1) {
      setActiveIndex(activeIndex + 1);
      setShowFinishButton(false);
    } else {
      // If we have incorrect cards and not showing finish button, continue reviewing
      if (incorrectCards.length > 0 && !showFinishButton) {
        // Shuffle incorrect cards
        const shuffledIncorrect = [...incorrectCards];
        for (let i = shuffledIncorrect.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledIncorrect[i], shuffledIncorrect[j]] = [shuffledIncorrect[j], shuffledIncorrect[i]];
        }
        
        setCardsToStudy(shuffledIncorrect);
        setIncorrectCards([]); // Reset incorrect cards
        setActiveIndex(0); // Start from beginning
        
        // Clear results for these cards to allow new attempts
        const newResults = { ...studyResults };
        shuffledIncorrect.forEach(card => {
          delete newResults[card.id];
        });
        setStudyResults(newResults);
      } else {
        completeSession();
      }
    }
  };
  
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setShowFinishButton(false);
    }
  };
  
  const completeSession = async () => {
    if (sessionId) {
      try {
        // Count total correct answers
        const totalCards = Object.keys(studyResults).length;
        const correctCards = Object.values(studyResults).filter(Boolean).length;
        
        // End the session
        await endSession(sessionId, totalCards, correctCards);
        
        // Show completion screen
        setStudyCompleted(true);
      } catch (error) {
        console.error('Error completing study session:', error);
      }
    }
  };
  
  const handleFinish = () => {
    navigate('/dashboard');
  };

  const handleExit = async () => {
    if (sessionId) {
      try {
        // Save current progress before exiting
        const totalCards = Object.keys(studyResults).length;
        const correctCards = Object.values(studyResults).filter(Boolean).length;
        await endSession(sessionId, totalCards, correctCards);
      } catch (error) {
        console.error('Error saving study progress:', error);
      }
    }
    navigate('/dashboard');
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  // If study is completed, show results
  if (studyCompleted) {
    const totalCards = Object.keys(studyResults).length;
    const correctCards = Object.values(studyResults).filter(Boolean).length;
    const accuracy = totalCards > 0 ? Math.round((correctCards / totalCards) * 100) : 0;
    
    return (
      <Layout>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Session Complete!</h2>
            <p className="text-gray-600 mb-6">Great job on completing your study session.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
                <p className="text-sm text-gray-500">Cards Studied</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{correctCards}</p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
                <p className="text-sm text-gray-500">Accuracy</p>
              </div>
            </div>
            
            <Button onClick={handleFinish} size="lg" isFullWidth>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }
  
  const currentCard = cardsToStudy[activeIndex];
  const isCardAnswered = currentCard && studyResults[currentCard.id] !== undefined;
  const progress = ((activeIndex + 1) / cardsToStudy.length) * 100;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            onClick={handleExit}
            variant="ghost"
            leftIcon={<XCircle className="h-4 w-4" />}
          >
            Exit Study
          </Button>
          <span className="text-sm font-medium text-gray-600">
            {incorrectCards.length > 0 && `${incorrectCards.length} cards to review`}
          </span>
        </div>

        <div className="relative pt-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-blue-700">
              Card {activeIndex + 1} of {cardsToStudy.length}
            </span>
            <span className="text-xs font-medium text-blue-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-in-out"
            ></div>
          </div>
        </div>
        
        <StudyCard
          key={currentCard.id}
          card={currentCard}
          onResult={handleResult}
        />
        
        <div className="flex justify-between mt-4">
          <Button 
            onClick={handlePrevious} 
            disabled={activeIndex === 0}
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          
          {showFinishButton ? (
            <Button 
              onClick={completeSession}
              variant="primary"
              rightIcon={<CheckCircle className="h-4 w-4" />}
            >
              Finish
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!isCardAnswered} 
              variant="primary"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudyPage;