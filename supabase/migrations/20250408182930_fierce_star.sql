/*
  # Fix email notifications

  1. Changes
    - Enable required extensions
    - Update trigger function to use correct HTTP client
    - Recreate trigger with proper configuration
    
  2. Security
    - Maintains existing security policies
    - Uses SECURITY DEFINER to ensure proper execution permissions
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

-- Update the trigger function
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT := 'https://ttqpvlatdasmqdmmqflw.supabase.co/functions/v1/send-email';
BEGIN
  -- Make request to edge function using pg_net
  PERFORM
    net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', current_setting('supabase.auth.anon_key')
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