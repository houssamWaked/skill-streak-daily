import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationSettings {
  enabled: boolean;
  time: string;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    time: '09:00'
  });

  useEffect(() => {
    // Check current permission
    setPermission(Notification.permission);
    
    // Load user notification settings
    loadSettings();
    
    // Set up daily notification scheduler
    setupDailyNotification();
  }, []);

  const loadSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('notification_enabled, notification_time')
        .eq('user_id', user.id)
        .single();
      
      if (profile) {
        setSettings({
          enabled: profile.notification_enabled ?? true,
          time: profile.notification_time ? 
            profile.notification_time.substring(0, 5) : '09:00'
        });
      }
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (permission === 'granted') return true;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      toast.success('Notifications enabled! You\'ll get daily reminders.');
      return true;
    } else {
      toast.error('Notifications blocked. Enable them in your browser settings.');
      return false;
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          notification_enabled: newSettings.enabled,
          notification_time: newSettings.time + ':00'
        }, {
          onConflict: 'user_id'
        });
    }
    
    // Reschedule notifications
    setupDailyNotification();
    toast.success('Notification settings updated!');
  };

  const setupDailyNotification = () => {
    if (!settings.enabled || permission !== 'granted') return;
    
    // Clear existing timeouts
    const existingTimeout = localStorage.getItem('notificationTimeout');
    if (existingTimeout) {
      clearTimeout(Number(existingTimeout));
    }
    
    const scheduleNextNotification = () => {
      const now = new Date();
      const [hours, minutes] = settings.time.split(':').map(Number);
      
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const msUntilNotification = scheduledTime.getTime() - now.getTime();
      
      const timeoutId = setTimeout(() => {
        showDailyReminder();
        scheduleNextNotification(); // Schedule next day
      }, msUntilNotification);
      
      localStorage.setItem('notificationTimeout', timeoutId.toString());
    };
    
    scheduleNextNotification();
  };

  const showDailyReminder = () => {
    if (permission === 'granted') {
      new Notification('SkillSpark Daily Reminder', {
        body: 'Time to practice your daily skill! 🌟',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'daily-reminder'
      });
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      showDailyReminder();
      toast.success('Test notification sent!');
    } else {
      toast.error('Please enable notifications first.');
    }
  };

  return {
    permission,
    settings,
    requestPermission,
    updateSettings,
    testNotification
  };
}