Create videos table and storage

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `filename` (text, not null)
      - `video_url` (text, not null)
      - `thumbnail_url` (text, not null)
      - `upload_date` (timestamptz, default now())
      - `duration` (text, default '00:00')
      - `user_id` (uuid, references auth.users)
  2. Security
    - Enable RLS on `videos` table
    - Add policy for authenticated users to read their own videos
    - Add policy for authenticated users to insert their own videos
    - Add policy for authenticated users to update their own videos
    - Add policy for authenticated users to delete their own videos


CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  filename text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  upload_date timestamptz DEFAULT now(),
  duration text DEFAULT '00:00',
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Users can read their own videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);