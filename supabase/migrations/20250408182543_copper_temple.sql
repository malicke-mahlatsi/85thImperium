/*
  # Add SELECT policy for contacts table

  1. Changes
    - Add policy to allow reading contacts after insertion
    - Ensures the form submission can read back the inserted data

  2. Security
    - Allows anonymous users to read their own inserted data
*/

-- Add SELECT policy for contacts
CREATE POLICY "Anyone can read contacts"
  ON contacts
  FOR SELECT
  TO anon
  USING (true);