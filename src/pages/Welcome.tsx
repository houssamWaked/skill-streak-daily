import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';
import { Sparkles, Target, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Welcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    const preferences = getUserPreferences();
    preferences.isNewUser = false;
    saveUserPreferences(preferences);
    navigate('/interests');
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Image */}
        <div className="text-center mb-8">
          <img 
            src={heroImage} 
            alt="People learning and growing together"
            className="w-full h-48 object-cover rounded-2xl shadow-card mb-6"
          />
          <h1 className="text-4xl font-bold text-white mb-2">SkillSpark</h1>
          <p className="text-white/90 text-lg">
            Build better soft skills, one day at a time
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
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

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
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

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
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
        <Button 
          onClick={handleContinue}
          size="lg"
          className="w-full bg-white text-primary hover:bg-white/90 font-semibold text-lg py-6 rounded-xl shadow-card"
        >
          Let's Get Started
        </Button>
      </div>
    </div>
  );
};

export default Welcome;