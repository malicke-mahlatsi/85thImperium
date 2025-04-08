/*
  # Configure email notifications for contacts

  1. Changes
    - Enable HTTP extension
    - Create notification trigger function with hardcoded function URL
    - Create trigger for new contacts

  2. Security
    - Function runs with SECURITY DEFINER
    - Uses HTTP extension for external calls
*/

-- Enable the http extension
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- Create the trigger function
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT := 'https://ttqpvlatdasmqdmmqflw.supabase.co/functions/v1/send-email';
BEGIN
  -- Make request to edge function
  PERFORM
    http.post(
      url := edge_function_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'record', json_build_object(
          'name', NEW.name,
          'email', NEW.email,
          'message', NEW.message
        )
      )::jsonb
    );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent the insert
    RAISE WARNING 'Error in notify_new_contact: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_new_contact_notify ON contacts;

-- Create the trigger
CREATE TRIGGER on_new_contact_notify
  AFTER INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact();