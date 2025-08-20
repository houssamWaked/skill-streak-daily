import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Target, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { Link } from 'react-router-dom';

const Welcome = () => {

  return (
    <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Image */}
        <div className="text-center mb-8 animate-slide-up">
          <img 
            src={heroImage} 
            alt="People learning and growing together"
            className="w-full h-48 object-cover rounded-2xl shadow-glow mb-6"
          />
          <h1 className="text-4xl font-bold text-white mb-2">SkillSpark</h1>
          <p className="text-white/90 text-lg">
            Build better soft skills, one day at a time
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Card className="bg-gradient-glass backdrop-blur-md border-white/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Daily Focus</h3>
                <p className="text-white/80 text-sm">One skill per day, achievable goals</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-glass backdrop-blur-md border-white/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Track Progress</h3>
                <p className="text-white/80 text-sm">Build streaks and see improvement</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-glass backdrop-blur-md border-white/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Personalized</h3>
                <p className="text-white/80 text-sm">Skills tailored to your interests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
          <Button asChild size="lg" className="w-full bg-white text-primary hover:bg-white/90 font-semibold text-lg py-6 rounded-xl shadow-glow hover:shadow-streak transition-spring">
            <Link to="/auth">Let's Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;