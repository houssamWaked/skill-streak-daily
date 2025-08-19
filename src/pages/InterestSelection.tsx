import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';
import { skillCategories } from '@/lib/skills';
import { ArrowRight, Brain, Users, Clock, Heart, Lightbulb, Target, Zap, Eye, Puzzle, Leaf } from 'lucide-react';

const categoryIcons = {
  'Communication': Users,
  'Leadership': Target,
  'Time Management': Clock,
  'Emotional Intelligence': Heart,
  'Problem Solving': Puzzle,
  'Teamwork': Users,
  'Adaptability': Zap,
  'Critical Thinking': Brain,
  'Creativity': Lightbulb,
  'Mindfulness': Leaf,
};

const InterestSelection = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleCheckboxChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests(prev => [...prev, category]);
    } else {
      setSelectedInterests(prev => prev.filter(interest => interest !== category));
    }
  };

  const handleContinue = () => {
    const preferences = getUserPreferences();
    preferences.interests = selectedInterests;
    saveUserPreferences(preferences);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto py-8 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            What interests you?
          </h1>
          <p className="text-muted-foreground">
            Select areas you'd like to improve. You can change these later.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {skillCategories.map((category) => {
            const Icon = categoryIcons[category];
            const isSelected = selectedInterests.includes(category);
            
            return (
              <Card 
                key={category}
                className={`cursor-pointer transition-all duration-200 hover:shadow-soft ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/30'
                }`}
                onClick={() => handleCheckboxChange(category, !isSelected)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {}}
                    className="pointer-events-none"
                  />
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground flex-1">
                    {category}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleContinue}
            disabled={selectedInterests.length === 0}
            size="lg"
            className="w-full bg-gradient-primary hover:opacity-90 font-semibold py-6 rounded-xl shadow-soft"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => handleContinue()}
            className="w-full text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterestSelection;