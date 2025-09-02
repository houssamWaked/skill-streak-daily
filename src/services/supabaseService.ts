import { supabase } from '@/integrations/supabase/client';
import { Skill } from '@/lib/storage';

// User Profile Management
export interface UserProfile {
  user_id: string;
  interests: string[];
  notification_enabled: boolean;
  notification_time: string;
  theme: string;
  display_name?: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        user_id: userId, 
        ...updates 
      }, { 
        onConflict: 'user_id' 
      });

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

// Task Completion Management
export interface TaskCompletion {
  id?: number;
  user_id: string;
  custom_task_id?: string;
  completed_at?: string;
  completed_date?: string;
  duration_minutes?: number;
  satisfaction_level?: number;
  notes?: string;
  task_name?: string;
  task_category?: string;
}

export const getTaskCompletion = async (userId: string): Promise<TaskCompletion[]> => {
  try {
    const { data, error } = await supabase
      .from('user_task_completions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching task completions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTaskCompletions:', error);
    return [];
  }
};

export const addTaskCompletion = async (completion: Omit<TaskCompletion, 'id'>) => {
  try {
    const { error } = await supabase
      .from('user_task_completions')
      .insert(completion);

    if (error) {
      console.error('Error adding task completion:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in addTaskCompletion:', error);
    throw error;
  }
};
export const getTodaysCompletions = async (userId: string): Promise<TaskCompletion[]> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const { data, error } = await supabase
      .from('user_task_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', today.toISOString())
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('Error fetching today\'s completions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTodaysCompletions:', error);
    return [];
  }
};


// Custom Tasks Management
export interface CustomTask {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
  estimated_time_minutes: number;
  is_active: boolean;
  image_url?: string;
  ai_prompt?: string;
}

export const getCustomTasks = async (userId: string): Promise<CustomTask[]> => {
  try {
    const { data, error } = await supabase
      .from('custom_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching custom tasks:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCustomTasks:', error);
    return [];
  }
};

export const addCustomTask = async (task: Omit<CustomTask, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('custom_tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      console.error('Error adding custom task:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addCustomTask:', error);
    throw error;
  }
};

// Streak Calculation
export const calculateStreak = (completions: TaskCompletion[]): number => {
  if (completions.length === 0) return 0;

  // Sort by completion date (most recent first)
  const sortedCompletions = completions
    .filter(c => c.completed_at || c.completed_date)
    .sort((a, b) => {
      const dateA = new Date(a.completed_at || a.completed_date || 0);
      const dateB = new Date(b.completed_at || b.completed_date || 0);
      return dateB.getTime() - dateA.getTime();
    });

  let streak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const completion of sortedCompletions) {
    const completionDate = new Date(completion.completed_at || completion.completed_date || 0);
    completionDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      // Consecutive day
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffDays > streak) {
      // Gap in streak, stop counting
      break;
    }
  }

  return streak;
};

// Migration helper functions
export const migrateLocalStorageData = async (userId: string) => {
  try {
    // Check if already migrated
    const existingProfile = await getUserProfile(userId);
    if (existingProfile && existingProfile.interests.length > 0) {
      console.log('Data already migrated for user:', userId);
      return;
    }

    // Migrate user preferences
    const localPreferences = localStorage.getItem('skillspark_user_preferences');
    if (localPreferences) {
      const prefs = JSON.parse(localPreferences);
      await updateUserProfile(userId, {
        interests: prefs.interests || [],
        notification_enabled: true,
        notification_time: '09:00:00',
        theme: 'dark'
      });
      console.log('Migrated user preferences');
    }

    // Migrate completed skills
    const localCompletions = localStorage.getItem('skillspark_completed_skills');
    if (localCompletions) {
      const completions = JSON.parse(localCompletions);
      for (const completion of completions) {
        await addTaskCompletion({
          user_id: userId,
          custom_task_id: completion.id,
          completed_at: completion.completedDate,
          task_name: completion.title,
          task_category: completion.category,
          notes: `Migrated from localStorage: ${completion.title}`
        });
      }
      console.log('Migrated completed skills');
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('skillspark_user_preferences');
    localStorage.removeItem('skillspark_completed_skills');
    localStorage.removeItem('skillspark_today_skill');
    localStorage.removeItem('skillspark_last_skill_date');
    
    console.log('Local storage data migrated successfully');
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
};