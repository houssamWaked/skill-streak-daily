import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { skillCategories } from '@/lib/skills';

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    aiPrompt: '',
    difficultyLevel: 1,
    estimatedTime: 15
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to create tasks');
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('custom_tasks')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: formData.imageUrl || null,
          ai_prompt: formData.aiPrompt || null,
          difficulty_level: formData.difficultyLevel,
          estimated_time_minutes: formData.estimatedTime
        });

      if (error) throw error;

      toast.success('Task created successfully!');
      navigate('/settings');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pb-24 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create New Task</h1>
            <p className="text-sm text-muted-foreground">Add a custom skill to practice</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Plus className="w-5 h-5 text-primary" />
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Active Listening Practice"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this task involves and its benefits..."
                  className="min-h-[80px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty (1-5)</Label>
                  <Select
                    value={formData.difficultyLevel.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficultyLevel: Number(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          {level} {level === 1 ? '(Easy)' : level === 5 ? '(Expert)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time (minutes)</Label>
                  <Input
                    id="time"
                    type="number"
                    min="5"
                    max="120"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Coach Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="aiPrompt">Custom AI Prompt (optional)</Label>
                <Textarea
                  id="aiPrompt"
                  value={formData.aiPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, aiPrompt: e.target.value }))}
                  placeholder="Give the AI coach special instructions for this task..."
                  className="min-h-[60px]"
                />
                <p className="text-xs text-muted-foreground">
                  This helps the AI provide more targeted guidance for your specific task.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={loading || !formData.title || !formData.description || !formData.category}
            className="w-full"
            variant="modern"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </form>
      </div>

      <Navigation />
    </div>
  );
};

export default CreateTask;