-- Update the handle_new_user function to generate usernames in the format: maya-{first3letters}-{4digits}
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_name TEXT;
    v_first_three TEXT;
    v_random_digits TEXT;
    v_generated_username TEXT;
    v_attempt INTEGER := 0;
    v_max_attempts INTEGER := 10;
BEGIN
    -- Get the user's name from metadata
    v_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        NEW.email
    );
    
    -- Extract first 3 letters of the name (lowercase, alphanumeric only)
    v_first_three := LOWER(REGEXP_REPLACE(SUBSTRING(v_name, 1, 3), '[^a-z0-9]', '', 'g'));
    
    -- If we couldn't get 3 letters, use 'usr'
    IF LENGTH(v_first_three) < 3 THEN
        v_first_three := LPAD(v_first_three, 3, 'x');
    END IF;
    
    -- Try to generate a unique username
    LOOP
        -- Generate 4 random digits
        v_random_digits := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        -- Create the username
        v_generated_username := 'maya-' || v_first_three || '-' || v_random_digits;
        
        -- Check if this username already exists
        IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE username = v_generated_username) THEN
            EXIT; -- Username is unique, exit loop
        END IF;
        
        v_attempt := v_attempt + 1;
        IF v_attempt >= v_max_attempts THEN
            -- Fallback to UUID-based username if we can't find a unique one
            v_generated_username := 'maya-' || SUBSTRING(NEW.id::TEXT, 1, 8);
            EXIT;
        END IF;
    END LOOP;
    
    -- Insert the user profile with generated username
    INSERT INTO public.user_profiles (
        id,
        username,
        display_name,
        email,
        avatar_url
    )
    VALUES (
        NEW.id,
        v_generated_username,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger already exists, but let's ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
