import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Navigation } from '@/components/Navigation';
import { 
  getUserPreferences, 
  saveUserPreferences, 
  resetStreak,
  getCompletedSkills 
} from '@/lib/storage';
import { skillCategories } from '@/lib/skills';
import { AlertTriangle, RotateCcw, Target, Trash2 } from 'lucide-react';
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
  const [interests, setInterests] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalSkills, setTotalSkills] = useState(0);

  useEffect(() => {
    const preferences = getUserPreferences();
    const completedSkills = getCompletedSkills();
    
    setInterests(preferences.interests);
    setStreak(preferences.streak);
    setTotalSkills(completedSkills.length);
  }, []);

  const handleInterestChange = (category: string, checked: boolean) => {
    const newInterests = checked 
      ? [...interests, category]
      : interests.filter(interest => interest !== category);
    
    setInterests(newInterests);
    
    const preferences = getUserPreferences();
    preferences.interests = newInterests;
    saveUserPreferences(preferences);
    
    toast.success('Interests updated!');
  };

  const handleResetStreak = () => {
    resetStreak();
    setStreak(0);
    toast.success('Streak reset successfully');
  };

  const handleClearAllData = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Reset state
    setInterests([]);
    setStreak(0);
    setTotalSkills(0);
    
    toast.success('All data cleared');
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

        <div className="max-w-md mx-auto space-y-6">
          {/* Progress Stats */}
          <Card className="bg-gradient-card shadow-soft">
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
                <span className="font-semibold text-foreground">{totalSkills}</span>
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
          <Card className="bg-gradient-card shadow-soft">
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
          <Card className="bg-gradient-card shadow-soft">
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
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Settings;