/*
  # Fix Flashcards RLS Policy

  1. Changes
    - Drop and recreate the INSERT policy for flashcards table to fix the group ownership check
    - Ensure users can create flashcards in groups they own
    
  2. Security
    - Maintains RLS enabled on flashcards table
    - Updates INSERT policy to properly check group ownership
    - Keeps existing SELECT, UPDATE, and DELETE policies unchanged
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert access for users based on group ownership" ON flashcards;

-- Create new INSERT policy with correct group ownership check
CREATE POLICY "Enable insert access for users based on group ownership"
ON flashcards
FOR INSERT
TO public
WITH CHECK (
  auth.uid() = (
    SELECT user_id 
    FROM flashcard_groups 
    WHERE id = group_id
  )
);