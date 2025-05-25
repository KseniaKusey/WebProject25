/*
  # Fix Flashcards RLS Policy

  1. Changes
    - Drop and recreate the INSERT policy for flashcards to properly check group ownership
    - Policy ensures users can only create flashcards in groups they own
    - Uses a subquery to verify group ownership through the user_id field

  2. Security
    - Maintains RLS enabled on flashcards table
    - Only allows creation of flashcards in user-owned groups
    - Preserves existing SELECT, UPDATE, and DELETE policies
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create flashcards in their groups" ON public.flashcards;

-- Create new INSERT policy with proper group ownership check
CREATE POLICY "Users can create flashcards in their groups"
ON public.flashcards
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM flashcard_groups
    WHERE 
      flashcard_groups.id = group_id
      AND flashcard_groups.user_id = auth.uid()
  )
);