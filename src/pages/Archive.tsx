import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCompletedSkills, CompletedSkill } from '@/lib/storage';
import { Calendar, Trophy, BookOpen } from 'lucide-react';

const Archive = () => {
  const [completedSkills, setCompletedSkills] = useState<CompletedSkill[]>([]);

  useEffect(() => {
    const skills = getCompletedSkills();
    // Sort by completion date, newest first
    const sortedSkills = skills.sort((a, b) => 
      new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
    );
    setCompletedSkills(sortedSkills);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pb-24">
        {/* Header */}
        <div className="text-center mb-6 pt-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your Progress
          </h1>
          <p className="text-muted-foreground">
            {completedSkills.length > 0 
              ? `${completedSkills.length} skills completed`
              : 'No skills completed yet'
            }
          </p>
        </div>

        {/* Stats */}
        {completedSkills.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
            <Card className="bg-gradient-success">
              <CardContent className="p-4 text-center">
                <Trophy className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{completedSkills.length}</div>
                <div className="text-white/90 text-sm">Skills</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-primary">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {new Set(completedSkills.map(skill => skill.category)).size}
                </div>
                <div className="text-white/90 text-sm">Categories</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skills List */}
        <div className="max-w-md mx-auto space-y-4">
          {completedSkills.length === 0 ? (
            <Card className="bg-muted/30">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No skills yet</h3>
                <p className="text-muted-foreground text-sm">
                  Complete your first daily skill to see it here!
                </p>
              </CardContent>
            </Card>
          ) : (
            completedSkills.map((skill) => (
              <Card key={`${skill.id}-${skill.completedDate}`} className="bg-gradient-card shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-foreground leading-tight">
                      {skill.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      Day {skill.dayNumber}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    {skill.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(skill.completedDate)}</span>
                    </div>
                    <span>{getDaysAgo(skill.completedDate)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Archive;