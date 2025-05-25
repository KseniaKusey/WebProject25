import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Flashcard, FlashcardGroup } from '../types';
import { useAuthStore } from './useAuthStore';

interface FlashcardState {
  flashcards: Flashcard[];
  groups: FlashcardGroup[];
  isLoading: boolean;
  error: string | null;
  
  // Flashcards CRUD
  addFlashcard: (flashcard: Omit<Flashcard, 'id'>) => Promise<Flashcard>;
  updateFlashcard: (id: string, data: Partial<Omit<Flashcard, 'id'>>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  
  // Group CRUD  
  addGroup: (group: Omit<FlashcardGroup, 'id' | 'createdAt' | 'updatedAt' | 'cardCount'>) => Promise<FlashcardGroup>;
  updateGroup: (id: string, data: Partial<Omit<FlashcardGroup, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  
  // Study functions
  markCardReviewed: (id: string, correct: boolean) => Promise<void>;
  getGroupCards: (groupId: string) => Flashcard[];
  getCardsForReview: (groupId?: string) => Promise<Flashcard[]>;
  
  // Data loading
  loadUserData: () => Promise<void>;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  flashcards: [],
  groups: [],
  isLoading: false,
  error: null,
  
  loadUserData: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      // Load groups with card count
      const { data: groups, error: groupsError } = await supabase
        .from('flashcard_groups')
        .select(`
          *,
          flashcards (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (groupsError) throw groupsError;
      
      // Load flashcards
      const { data: flashcards, error: flashcardsError } = await supabase
        .from('flashcards')
        .select(`
          *,
          flashcard_groups!inner (
            user_id
          )
        `)
        .eq('flashcard_groups.user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (flashcardsError) throw flashcardsError;
      
      // Transform groups to include card count
      const transformedGroups = groups?.map(group => ({
        ...group,
        cardCount: group.flashcards?.[0]?.count || 0
      })) || [];
      
      set({ 
        groups: transformedGroups, 
        flashcards: flashcards || [],
        error: null 
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addFlashcard: async (flashcard) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      // First verify the group belongs to the user
      const { data: groupData, error: groupError } = await supabase
        .from('flashcard_groups')
        .select('id')
        .eq('id', flashcard.group_id)
        .eq('user_id', user.id)
        .single();

      if (groupError || !groupData) {
        throw new Error('Group not found or access denied');
      }

      const { data, error } = await supabase
        .from('flashcards')
        .insert([{
          front: flashcard.front,
          back: flashcard.back,
          difficulty: flashcard.difficulty,
          group_id: flashcard.group_id
        }])
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create flashcard');
      
      // Reload data to get updated counts
      await get().loadUserData();
      
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  updateFlashcard: async (id, data) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('flashcards')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
      
      // Reload data to get updated state
      await get().loadUserData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  deleteFlashcard: async (id) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Reload data to get updated counts
      await get().loadUserData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  addGroup: async (group) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('flashcard_groups')
        .insert([{
          ...group,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create group');
      
      // Reload data to get updated state
      await get().loadUserData();
      
      return data;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  updateGroup: async (id, data) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('flashcard_groups')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Reload data to get updated state
      await get().loadUserData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  deleteGroup: async (id) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('flashcard_groups')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Reload data to get updated state
      await get().loadUserData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  markCardReviewed: async (id, correct) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    const now = new Date();
    const nextReview = new Date();
    nextReview.setDate(now.getDate() + (correct ? 3 : 1));
    
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
          last_reviewed: now.toISOString(),
          next_review_date: nextReview.toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Reload data to get updated state
      await get().loadUserData();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
  
  getGroupCards: (groupId) => {
    const { flashcards } = get();
    return flashcards.filter(card => card.group_id === groupId);
  },
  
  getCardsForReview: async (groupId) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    try {
      let query = supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (groupId) {
        query = query.eq('group_id', groupId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      set({ error: error.message });
      return [];
    }
  }
}));