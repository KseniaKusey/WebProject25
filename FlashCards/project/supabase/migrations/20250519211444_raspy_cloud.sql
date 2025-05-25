/*
  # Fix Flashcards RLS Policies

  1. Changes
    - Drop existing RLS policy that was too restrictive
    - Add separate policies for SELECT, INSERT, UPDATE, and DELETE operations
    - Ensure users can create flashcards in groups they own
    - Maintain security while allowing proper flashcard management

  2. Security
    - Users can only manage flashcards in groups they own
    - Separate policies for different operations for better control
    - Maintains data isolation between users
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can manage flashcards in their groups" ON flashcards;

-- Create separate policies for different operations
CREATE POLICY "Users can view flashcards in their groups"
ON flashcards
FOR SELECT
TO public
USING (
  group_id IN (
    SELECT id 
    FROM flashcard_groups 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create flashcards in their groups"
ON flashcards
FOR INSERT
TO public
WITH CHECK (
  group_id IN (
    SELECT id 
    FROM flashcard_groups 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update flashcards in their groups"
ON flashcards
FOR UPDATE
TO public
USING (
  group_id IN (
    SELECT id 
    FROM flashcard_groups 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  group_id IN (
    SELECT id 
    FROM flashcard_groups 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete flashcards in their groups"
ON flashcards
FOR DELETE
TO public
USING (
  group_id IN (
    SELECT id 
    FROM flashcard_groups 
    WHERE user_id = auth.uid()
  )
);