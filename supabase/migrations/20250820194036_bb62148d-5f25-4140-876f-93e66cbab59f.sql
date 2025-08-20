-- Create profiles table for user settings
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  notification_time TIME DEFAULT '09:00:00',
  notification_enabled BOOLEAN DEFAULT true,
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom_tasks table for user-created tasks
CREATE TABLE public.custom_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  ai_prompt TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_time_minutes INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_task_completions table to track progress
CREATE TABLE public.user_task_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID,
  custom_task_id UUID,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  streak_day INTEGER NOT NULL,
  notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_task_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for custom_tasks
CREATE POLICY "Users can view their own custom tasks" 
ON public.custom_tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom tasks" 
ON public.custom_tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom tasks" 
ON public.custom_tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom tasks" 
ON public.custom_tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_task_completions
CREATE POLICY "Users can view their own completions" 
ON public.user_task_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions" 
ON public.user_task_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_tasks_updated_at
BEFORE UPDATE ON public.custom_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get today's task based on user preferences
CREATE OR REPLACE FUNCTION public.get_user_daily_task(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  image_url TEXT,
  ai_prompt TEXT,
  is_custom BOOLEAN
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;