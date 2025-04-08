/*
  # Update contact form notification trigger
  
  1. Changes
    - Replace net.http_post with http.post from pg_net extension
    - Add proper error handling
    - Ensure proper function execution permissions
  
  2. Security
    - Function runs with SECURITY DEFINER to ensure proper permissions
    - Trigger executes for each row
*/

-- Enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- Create the trigger function
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- Make request to edge function
  PERFORM
    http.post(
      url := current_setting('app.settings.edge_function_base_url') || '/send-email',
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