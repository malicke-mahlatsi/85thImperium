/*
  # Add email notification trigger for contacts

  1. Changes
    - Creates a trigger to send email notifications when new contacts are added
    
  2. Security
    - Uses secure function invocation through Supabase
*/

-- Create the trigger function
CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- Make request to edge function
  PERFORM
    net.http_post(
      url := CONCAT(
        current_setting('app.settings.edge_function_base_url'),
        '/send-email'
      ),
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'record', json_build_object(
          'name', NEW.name,
          'email', NEW.email,
          'message', NEW.message
        )
      )::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_new_contact_notify ON contacts;
CREATE TRIGGER on_new_contact_notify
  AFTER INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact();