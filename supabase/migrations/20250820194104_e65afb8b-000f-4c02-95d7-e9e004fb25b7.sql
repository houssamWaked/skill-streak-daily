-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_user_daily_task(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  image_url TEXT,
  ai_prompt TEXT,
  is_custom BOOLEAN
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_interests TEXT[];
  completed_task_ids UUID[];
  completed_custom_task_ids UUID[];
BEGIN
  -- Get user interests
  SELECT interests INTO user_interests 
  FROM public.profiles 
  WHERE user_id = user_uuid;
  
  -- Get completed regular task IDs
  SELECT ARRAY_AGG(task_id) INTO completed_task_ids
  FROM public.user_task_completions 
  WHERE user_id = user_uuid AND task_id IS NOT NULL;
  
  -- Get completed custom task IDs
  SELECT ARRAY_AGG(custom_task_id) INTO completed_custom_task_ids
  FROM public.user_task_completions 
  WHERE user_id = user_uuid AND custom_task_id IS NOT NULL;
  
  -- First try to return a custom task
  RETURN QUERY
  SELECT 
    ct.id,
    ct.title,
    ct.description,
    ct.category,
    ct.image_url,
    ct.ai_prompt,
    true as is_custom
  FROM public.custom_tasks ct
  WHERE ct.user_id = user_uuid 
    AND ct.is_active = true
    AND (completed_custom_task_ids IS NULL OR ct.id != ALL(completed_custom_task_ids))
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- If no custom tasks available, would need to integrate with built-in skills
  -- This function can be extended to include built-in skills logic
END;
$$;

-- Fix update_updated_at_column function search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column() 
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;