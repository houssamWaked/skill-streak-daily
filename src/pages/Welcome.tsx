import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Target, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-slide-up">
          <div className="inline-flex items-center gap-2 text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            <Sparkles className="w-8 h-8 text-primary" />
            SkillSpark
          </div>
          <CardTitle className="text-2xl text-center">
            Build better soft skills, one day at a time
          </CardTitle>
          <CardDescription className="text-center">
            Start your daily skill-building journey
          </CardDescription>
        </div>

        {/* Feature Cards */}
        <Card className="shadow-card border-border/50 bg-gradient-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Daily Focus</h3>
                <p className="text-muted-foreground text-sm">One skill per day, achievable goals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-muted-foreground text-sm">Build streaks and see improvement</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Personalized</h3>
                <p className="text-muted-foreground text-sm">Skills tailored to your interests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button asChild size="lg" className="w-full bg-gradient-primary hover:opacity-90 font-semibold py-6">
            <Link to="/auth">Let's Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;