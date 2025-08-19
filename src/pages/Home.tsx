import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SkillCard } from '@/components/SkillCard';
import { StreakIndicator } from '@/components/StreakIndicator';
import { Navigation } from '@/components/Navigation';
import { 
  getUserPreferences, 
  getTodaySkill, 
  saveTodaySkill, 
  saveCompletedSkill,
  getCompletedSkills,
  isSkillCompletedToday,
  Skill 
} from '@/lib/storage';
import { getSkillForToday } from '@/lib/skills';
import { CheckCircle2, Calendar, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Home = () => {
  const [todaySkill, setTodaySkill] = useState<Skill | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodaySkill = () => {
      const preferences = getUserPreferences();
      const completedSkills = getCompletedSkills();
      const completedSkillIds = completedSkills.map(skill => skill.id);
      
      let skill = getTodaySkill();
      
      // If no skill for today, generate one
      if (!skill) {
        skill = getSkillForToday(preferences.interests, completedSkillIds);
        saveTodaySkill(skill);
      }
      
      setTodaySkill(skill);
      setStreak(preferences.streak);
      setIsCompleted(isSkillCompletedToday());
      setLoading(false);
    };

    loadTodaySkill();
  }, []);

  const handleCompleteSkill = () => {
    if (!todaySkill || isCompleted) return;
    
    saveCompletedSkill(todaySkill);
    setIsCompleted(true);
    
    // Update streak display
    const preferences = getUserPreferences();
    setStreak(preferences.streak);
    
    toast.success('Great job! Skill completed!', {
      description: `You're on a ${preferences.streak}-day streak! 🎉`
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading today's skill...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="text-center mb-6 pt-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Calendar size={16} />
            <span className="text-sm">{formatDate(new Date())}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Today's Skill
          </h1>
          
          {streak > 0 && (
            <div className="flex justify-center mb-4">
              <StreakIndicator streak={streak} />
            </div>
          )}
        </div>

        {/* Today's Skill */}
        {todaySkill && (
          <div className="max-w-md mx-auto space-y-6">
            <SkillCard skill={todaySkill} showCategory />
            
            {/* Action Button */}
            <div className="text-center space-y-3">
              {isCompleted ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-success font-semibold">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Completed!</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Great job! Come back tomorrow for your next skill.
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleCompleteSkill}
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90 font-semibold py-6 rounded-xl shadow-soft"
                >
                  Mark as Complete
                </Button>
              )}

              <Button variant="modern" asChild>
                <Link to="/chat" className="inline-flex items-center gap-2 justify-center w-full">
                  <MessageSquare className="w-4 h-4" /> Ask Coach about this skill
                </Link>
              </Button>
            </div>

            {/* Motivational Text */}
            <div className="text-center space-y-2 bg-muted/30 p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro tip:</strong> Practice this skill throughout your day and notice the difference it makes in your interactions.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Home;