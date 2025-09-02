-- Remove foreign key constraint that's causing task completion to fail
-- The user_task_completions table should allow completing both built-in skills and custom tasks
ALTER TABLE public.user_task_completions 
DROP CONSTRAINT IF EXISTS task_completions_custom_task_id_fkey;

-- Add a general task_name field to track what was completed
ALTER TABLE public.user_task_completions 
ADD COLUMN IF NOT EXISTS task_name TEXT,
ADD COLUMN IF NOT EXISTS task_category TEXT;