import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { StudySession, StudyStats } from '../types';
import { useAuthStore } from './useAuthStore';

interface LeaderboardEntry {
  userId: string;
  name: string;
  studyStreak: number;
  masteredCards: number;
  accuracy: number;
}

interface StatsState {
  studySessions: StudySession[];
  isLoading: boolean;
  error: string | null;
  
  startSession: (groupId: string) => Promise<StudySession>;
  endSession: (sessionId: string, cardsStudied: number, cardsCorrect: number) => Promise<void>;
  getStats: () => StudyStats;
  getGroupStats: (groupId: string) => StudyStats;
  loadUserStats: () => Promise<void>;
  getLeaderboard: () => LeaderboardEntry[];
}

export const useStatsStore = create<StatsState>((set, get) => ({
  studySessions: [],
  isLoading: false,
  error: null,
  
  loadUserStats: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        studySessions: data || [],
        error: null 
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  startSession: async (groupId) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newSession = {
        user_id: user.id,
        group_id: groupId,
        cards_studied: 0,
        cards_correct: 0,
        start_time: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([newSession])
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create study session');
      
      set(state => ({
        studySessions: [data, ...state.studySessions]
      }));
      
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  endSession: async (sessionId, cardsStudied, cardsCorrect) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .update({
          cards_studied: cardsStudied,
          cards_correct: cardsCorrect,
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      set(state => ({
        studySessions: state.studySessions.map(session =>
          session.id === sessionId
            ? {
                ...session,
                cardsStudied,
                cardsCorrect,
                endTime: new Date()
              }
            : session
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  getStats: () => {
    const { studySessions } = get();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get most recent session
    const sortedSessions = [...studySessions].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    const lastStudyDate = sortedSessions.length > 0 
      ? new Date(sortedSessions[0].startTime)
      : undefined;
    
    // Calculate study streak
    let streak = 0;
    if (lastStudyDate) {
      const lastStudyDay = new Date(
        lastStudyDate.getFullYear(),
        lastStudyDate.getMonth(),
        lastStudyDate.getDate()
      );
      
      const isStudiedToday = lastStudyDay.getTime() === today.getTime();
      
      if (isStudiedToday) {
        streak = 1;
        let checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (true) {
          const sessionsOnDate = studySessions.some(session => {
            const sessionDate = new Date(session.startTime);
            return (
              sessionDate.getFullYear() === checkDate.getFullYear() &&
              sessionDate.getMonth() === checkDate.getMonth() &&
              sessionDate.getDate() === checkDate.getDate()
            );
          });
          
          if (sessionsOnDate) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }
    
    // Count total cards studied
    const totalStudied = studySessions.reduce((sum, session) => sum + session.cardsStudied, 0);
    const totalCorrect = studySessions.reduce((sum, session) => sum + session.cardsCorrect, 0);
    
    return {
      totalCards: totalStudied,
      masteredCards: totalCorrect,
      cardsToReview: totalStudied - totalCorrect,
      studyStreak: streak,
      lastStudyDate,
    };
  },
  
  getGroupStats: (groupId) => {
    const { studySessions } = get();
    const groupSessions = studySessions.filter((session) => session.groupId === groupId);
    
    // Get most recent session
    const sortedSessions = [...groupSessions].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    const lastStudyDate = sortedSessions.length > 0 
      ? new Date(sortedSessions[0].startTime)
      : undefined;
      
    // Count total cards studied in this group
    const totalStudied = groupSessions.reduce((sum, session) => sum + session.cardsStudied, 0);
    const totalCorrect = groupSessions.reduce((sum, session) => sum + session.cardsCorrect, 0);
    
    return {
      totalCards: totalStudied,
      masteredCards: totalCorrect,
      cardsToReview: totalStudied - totalCorrect,
      studyStreak: 0, // Streak doesn't apply to specific groups
      lastStudyDate,
    };
  },

  getLeaderboard: () => {
    const { studySessions } = get();
    
    // Group sessions by user
    const userSessions = studySessions.reduce((acc, session) => {
      if (!acc[session.user_id]) {
        acc[session.user_id] = [];
      }
      acc[session.user_id].push(session);
      return acc;
    }, {} as Record<string, StudySession[]>);
    
    // Calculate stats for each user
    const leaderboardEntries = Object.entries(userSessions).map(([userId, sessions]) => {
      const totalStudied = sessions.reduce((sum, session) => sum + session.cardsStudied, 0);
      const totalCorrect = sessions.reduce((sum, session) => sum + session.cardsCorrect, 0);
      const accuracy = totalStudied > 0 ? totalCorrect / totalStudied : 0;
      
      // Calculate streak for user
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sortedSessions = [...sessions].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      
      let streak = 0;
      if (sortedSessions.length > 0) {
        const lastStudyDate = new Date(sortedSessions[0].startTime);
        const lastStudyDay = new Date(
          lastStudyDate.getFullYear(),
          lastStudyDate.getMonth(),
          lastStudyDate.getDate()
        );
        
        const isStudiedToday = lastStudyDay.getTime() === today.getTime();
        
        if (isStudiedToday) {
          streak = 1;
          let checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - 1);
          
          while (true) {
            const sessionsOnDate = sessions.some(session => {
              const sessionDate = new Date(session.startTime);
              return (
                sessionDate.getFullYear() === checkDate.getFullYear() &&
                sessionDate.getMonth() === checkDate.getMonth() &&
                sessionDate.getDate() === checkDate.getDate()
              );
            });
            
            if (sessionsOnDate) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
      }

      return {
        userId,
        name: sessions[0].user_name || 'Anonymous User', // Fallback name if not available
        studyStreak: streak,
        masteredCards: totalCorrect,
        accuracy
      };
    });
    
    // Sort by mastered cards (descending) and then by accuracy
    return leaderboardEntries.sort((a, b) => {
      if (b.masteredCards !== a.masteredCards) {
        return b.masteredCards - a.masteredCards;
      }
      return b.accuracy - a.accuracy;
    });
  }
}));