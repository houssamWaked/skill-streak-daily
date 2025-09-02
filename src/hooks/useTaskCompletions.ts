import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getTaskCompletion, 
  addTaskCompletion, 
  getTodaysCompletions,
  calculateStreak,
  TaskCompletion 
} from '@/services/supabaseService';
import { Skill } from '@/lib/storage';

export const useTaskCompletions = () => {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [todaysCompletion, setTodaysCompletion] = useState<TaskCompletion | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompletions = async () => {
      if (!user) {
        setCompletions([]);
        setTodaysCompletion(null);
        setStreak(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [allCompletions, todayCompletionArray] = await Promise.all([
          getTaskCompletion(user.id),
          getTodaysCompletions(user.id)
        ]);

        setCompletions(allCompletions);
        setTodaysCompletion(todayCompletionArray[0] || null); // Pick first completion of today
        setStreak(calculateStreak(allCompletions));
      } catch (error) {
        console.error('Error loading completions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompletions();
  }, [user]);

  const completeTask = async (skill: Skill, rating?: number, notes?: string) => {
    if (!user) return;

    try {
      const completion: Omit<TaskCompletion, 'id'> = {
        user_id: user.id,
        custom_task_id: skill.id,
        completed_at: new Date().toISOString(),
        satisfaction_level: rating,
        notes
      };

      await addTaskCompletion(completion);

      // Reload completions
      const [allCompletions, todayCompletionArray] = await Promise.all([
        getTaskCompletion(user.id),
        getTodaysCompletions(user.id)
      ]);

      setCompletions(allCompletions);
      setTodaysCompletion(todayCompletionArray[0] || null);
      setStreak(calculateStreak(allCompletions));
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const isCompletedToday = !!todaysCompletion;
  const completedSkillIds = completions.map(c => c.custom_task_id).filter(Boolean) as string[];

  return {
    completions,
    todaysCompletion,
    streak,
    loading,
    completeTask,
    isCompletedToday,
    completedSkillIds
  };
};
