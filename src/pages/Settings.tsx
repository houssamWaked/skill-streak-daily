import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Navigation } from '@/components/Navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTaskCompletions } from '@/hooks/useTaskCompletions';
import { useNotifications } from '@/hooks/useNotifications';
import { skillCategories } from '@/lib/skills';
import { AlertTriangle, RotateCcw, Target, Trash2, Moon, Sun, Bell, Plus, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { completions, streak } = useTaskCompletions();
  const { permission, settings, requestPermission, updateSettings, testNotification } = useNotifications();
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setInterests(profile.interests);
    }
  }, [profile]);

  const handleInterestChange = async (category: string, checked: boolean) => {
    const newInterests = checked 
      ? [...interests, category]
      : interests.filter(i => i !== category);
    
    setInterests(newInterests);
    
    try {
      await updateProfile({ interests: newInterests });
      toast.success('Interests updated!');
    } catch (error) {
      toast.error('Failed to update interests');
    }
  };

  const handleResetStreak = async () => {
    // Reset streak would need to be implemented in Supabase
    toast.success('Streak reset functionality coming soon!');
  };

  const handleClearAllData = async () => {
    // This would need to clear all Supabase data for the user
    toast.success('Clear all data functionality coming soon!');
  };

  const handleNotificationTimeChange = (time: string) => {
    updateSettings({ ...settings, time });
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }
    updateSettings({ ...settings, enabled });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="text-center mb-6 pt-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your SkillSpark experience
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          {/* Theme Settings */}
          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="theme-toggle">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bell className="w-5 h-5 text-primary" />
                Daily Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications-toggle">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get daily reminders to practice your skills
                  </p>
                </div>
                <Switch
                  id="notifications-toggle"
                  checked={settings.enabled}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
              
              {settings.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="notification-time">Reminder Time</Label>
                    <Input
                      id="notification-time"
                      type="time"
                      value={settings.time}
                      onChange={(e) => handleNotificationTimeChange(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    onClick={testNotification}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Test Notification
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Custom Tasks */}
          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Plus className="w-5 h-5 text-primary" />
                Custom Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Create your own custom skills and tasks to practice
                </p>
                <Button
                  onClick={() => navigate('/create-task')}
                  variant="modern"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Task
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Stats */}
          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Streak</span>
                <span className="font-semibold text-foreground">{streak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skills Completed</span>
                <span className="font-semibold text-foreground">{completions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories</span>
                <span className="font-semibold text-foreground">
                  {interests.length > 0 ? interests.length : 'All'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Interest Categories */}
          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose which skill categories you want to focus on
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {skillCategories.map((category) => {
                const isSelected = interests.includes(category);
                
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleInterestChange(category, checked as boolean)
                      }
                    />
                    <span className="text-foreground">{category}</span>
                  </div>
                );
              })}
              
              {interests.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No categories selected - you'll see skills from all categories
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-destructive" />
                Reset Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/5"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Streak
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Reset Streak?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset your current {streak}-day streak to 0. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetStreak}>
                      Reset Streak
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/5"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Clear All Data?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your progress, completed skills, and preferences. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllData}>
                      Clear All Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button 
                onClick={signOut}
                variant="outline"
                className="w-full justify-start text-muted-foreground border-border/20 hover:bg-muted/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Settings;