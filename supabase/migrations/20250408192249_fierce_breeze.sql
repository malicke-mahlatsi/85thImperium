/*
  # Update contact trigger and policies

  1. Changes
    - Update trigger to use proper authentication
    - Ensure edge function URL is correct
    - Add better error handling

  2. Security
    - Maintain RLS policies
    - Use secure authentication for edge function calls
*/

-- Update the trigger function with proper authentication and error handling
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

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_new_contact_notify ON contacts;
CREATE TRIGGER on_new_contact_notify
  AFTER INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact();