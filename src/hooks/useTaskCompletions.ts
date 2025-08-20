import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getTaskCompletions, 
  addTaskCompletion, 
  getTodaysCompletion,
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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [allCompletions, todayCompletion] = await Promise.all([
          getTaskCompletions(user.id),
          getTodaysCompletion(user.id)
        ]);

        setCompletions(allCompletions);
        setTodaysCompletion(todayCompletion);
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
        task_id: skill.id,
        completed_at: new Date().toISOString(),
        streak_day: streak + 1,
        rating,
        notes
      };

      await addTaskCompletion(completion);

      // Reload completions to update state
      const [allCompletions, todayCompletion] = await Promise.all([
        getTaskCompletions(user.id),
        getTodaysCompletion(user.id)
      ]);

      setCompletions(allCompletions);
      setTodaysCompletion(todayCompletion);
      setStreak(calculateStreak(allCompletions));
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const isCompletedToday = !!todaysCompletion;
  const completedSkillIds = completions.map(c => c.task_id).filter(Boolean) as string[];

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