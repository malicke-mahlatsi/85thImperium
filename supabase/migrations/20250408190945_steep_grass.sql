/*
  # Fix contacts table RLS policy

  1. Changes
    - Update the RLS policy for anonymous contact submissions to properly validate the data
    - Keep existing policies but adjust the WITH CHECK clause to match the form data structure

  2. Security
    - Maintains RLS enabled
    - Updates policy to properly validate contact submissions
    - Keeps read access policy unchanged
*/

DROP POLICY IF EXISTS "Allow anonymous contact submissions" ON contacts;

CREATE POLICY "Allow anonymous contact submissions"
ON contacts
FOR INSERT
TO anon
WITH CHECK (
  -- Ensure required fields are present and valid
  name IS NOT NULL AND
  email IS NOT NULL AND 
  message IS NOT NULL AND
  -- Basic email format validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  -- Prevent empty strings and ensure reasonable lengths
  length(name) BETWEEN 1 AND 100 AND
  length(email) BETWEEN 5 AND 255 AND
  length(message) BETWEEN 1 AND 1000
);