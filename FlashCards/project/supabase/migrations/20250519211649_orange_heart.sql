/*
  # Fix Flashcards RLS Policies

  1. Changes
    - Drop existing RLS policies for flashcards table
    - Create new, more precise RLS policies that properly handle group ownership
  
  2. Security
    - Ensures users can only access flashcards in groups they own
    - Maintains data isolation between users
    - Preserves existing CRUD operations with proper authorization
*/

-- Drop existing policies to recreate them with better conditions
DROP POLICY IF EXISTS "Users can create flashcards in their groups" ON flashcards;
DROP POLICY IF EXISTS "Users can delete flashcards in their groups" ON flashcards;
DROP POLICY IF EXISTS "Users can update flashcards in their groups" ON flashcards;
DROP POLICY IF EXISTS "Users can view flashcards in their groups" ON flashcards;

-- Create new policies with improved security checks
CREATE POLICY "Enable read access for users based on group ownership"
ON public.flashcards
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM flashcard_groups
    WHERE 
      flashcard_groups.id = flashcards.group_id
      AND flashcard_groups.user_id = auth.uid()
  )
);

CREATE POLICY "Enable insert access for users based on group ownership"
ON public.flashcards
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM flashcard_groups
    WHERE 
      flashcard_groups.id = group_id
      AND flashcard_groups.user_id = auth.uid()
  )
);

CREATE POLICY "Enable update access for users based on group ownership"
ON public.flashcards
FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM flashcard_groups
    WHERE 
      flashcard_groups.id = flashcards.group_id
      AND flashcard_groups.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM flashcard_groups
    WHERE 
      flashcard_groups.id = group_id
      AND flashcard_groups.user_id = auth.uid()
  )
);

CREATE POLICY "Enable delete access for users based on group ownership"
ON public.flashcards
FOR DELETE
TO public
USING (
  EXISTS (
    SELECT 1 FROM flashcard_groups
    WHERE 
      flashcard_groups.id = flashcards.group_id
      AND flashcard_groups.user_id = auth.uid()
  )
);