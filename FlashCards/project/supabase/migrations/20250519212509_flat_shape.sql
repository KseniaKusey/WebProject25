-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  telegram_id bigint UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flashcard groups table
CREATE TABLE IF NOT EXISTS flashcard_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  color text NOT NULL DEFAULT 'blue',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES flashcard_groups(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  last_reviewed timestamptz,
  next_review_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id uuid REFERENCES flashcard_groups(id) ON DELETE SET NULL,
  cards_studied integer NOT NULL DEFAULT 0,
  cards_correct integer NOT NULL DEFAULT 0,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own data"
  ON users
  USING (id = auth.uid());

CREATE POLICY "Users can manage their own groups"
  ON flashcard_groups
  USING (user_id = auth.uid());

CREATE POLICY "Enable read access for users based on group ownership"
  ON flashcards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_groups
      WHERE 
        flashcard_groups.id = flashcards.group_id
        AND flashcard_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Enable insert access for users based on group ownership"
  ON flashcards
  FOR INSERT
  WITH CHECK (
    auth.uid() = (
      SELECT user_id 
      FROM flashcard_groups 
      WHERE id = group_id
    )
  );

CREATE POLICY "Enable update access for users based on group ownership"
  ON flashcards
  FOR UPDATE
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
  ON flashcards
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_groups
      WHERE 
        flashcard_groups.id = flashcards.group_id
        AND flashcard_groups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own study sessions"
  ON study_sessions
  USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_flashcard_groups_updated_at
  BEFORE UPDATE ON flashcard_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();