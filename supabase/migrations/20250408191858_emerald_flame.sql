/*
  # Update contact form policies and trigger

  1. Changes
    - Add policy for authenticated users to insert contacts
    - Update trigger function to handle errors gracefully
    - Ensure proper authorization for edge function calls

  2. Security
    - Enable RLS
    - Add policies for both anonymous and authenticated users
    - Secure edge function calls with proper authentication
*/

-- Update policies to allow both anonymous and authenticated users to insert
DROP POLICY IF EXISTS "Allow anonymous contact submissions" ON contacts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON contacts;

CREATE POLICY "Allow contact submissions"
ON contacts
FOR INSERT
TO anon, authenticated
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

-- Update the trigger function to handle errors more gracefully
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT := 'https://ttqpvlatdasmqdmmqflw.supabase.co/functions/v1/send-email';
  anon_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0cXB2bGF0ZGFzbXFkbW1xZmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzM1NzIsImV4cCI6MjA1OTcwOTU3Mn0.xxWpgqa_nwyQHtA_tSMhyxhqL2d8_7ymzVIQl6v74AQ';
BEGIN
  -- Ensure all required fields are present
  IF NEW.name IS NULL OR NEW.email IS NULL OR NEW.message IS NULL THEN
    RAISE WARNING 'Missing required fields in contact submission';
    RETURN NEW;
  END IF;

  -- Make the HTTP request to the edge function
  PERFORM
    net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', concat('Bearer ', anon_key)
      ),
      body := jsonb_build_object(
        'record', jsonb_build_object(
          'name', NEW.name,
          'email', NEW.email,
          'message', NEW.message
        )
      )::text
    );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent the insert
    RAISE WARNING 'Error in notify_new_contact: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;