/*
  # Update contacts table RLS policies

  1. Changes
    - Drop existing INSERT policy that only allows authenticated users
    - Add new INSERT policy to allow anonymous users to submit contact forms
    
  2. Security
    - Maintains existing SELECT policy for reading contacts
    - Allows anonymous users to submit contact forms
    - Adds basic validation to prevent empty submissions
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON contacts;

-- Create new INSERT policy for anonymous submissions
CREATE POLICY "Allow anonymous contact submissions"
ON contacts
FOR INSERT
TO anon
WITH CHECK (
  -- Basic validation to ensure required fields are not empty
  length(name) > 0 AND
  length(email) > 0 AND
  length(message) > 0
);