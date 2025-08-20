import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { getCompletedSkills, getTodaySkill, getUserPreferences, saveTodaySkill } from '@/lib/storage';
import { getSkillForToday } from '@/lib/skills';
import { toast } from 'sonner';
import { Lock, Send, ShieldQuestion, KeyRound, MessageSquare, Sparkles } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const OPENAI_KEY_STORAGE = 'skillspark_openai_api_key';

const Chat = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [todaySkillTitle, setTodaySkillTitle] = useState('');
  const [todaySkillDescription, setTodaySkillDescription] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Ensure we have today's skill context
  useEffect(() => {
    const preferences = getUserPreferences();
    const completed = getCompletedSkills();
    const completedIds = completed.map((s) => s.id);

    let skill = getTodaySkill();
    if (!skill) {
      skill = getSkillForToday(preferences.interests, completedIds);
      saveTodaySkill(skill);
    }

    setTodaySkillTitle(skill.title);
    setTodaySkillDescription(skill.description);

    // initial assistant message
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I'm your SkillSpark coach. Today we're focusing on “${skill.title}”. Ask me anything or say "give me a quick 5‑minute exercise" to get started.`,
      },
    ]);
  }, []);

  // Load existing key
  useEffect(() => {
    const existing = localStorage.getItem(OPENAI_KEY_STORAGE);
    if (existing) {
      setApiKey(existing);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const systemPrompt = useMemo(() => {
    return `You are SkillSpark, a friendly, concise soft skills coach.
- Teach with brief, actionable steps.
- Keep answers under 6 sentences unless asked for more.
- Offer 1 short exercise and a reflection question.
- Tie everything to today's skill: ${todaySkillTitle}.
- Context about today's skill: ${todaySkillDescription}`;
  }, [todaySkillTitle, todaySkillDescription]);

  const handleSaveKey = () => {
    if (!keyInput || keyInput.length < 20) {
      toast.error('Please paste a valid OpenAI API key.');
      return;
    }
    localStorage.setItem(OPENAI_KEY_STORAGE, keyInput);
    setApiKey(keyInput);
    setKeyInput('');
    toast.success('API key saved locally.');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://mbtkjvgruhvzzdeyobwc.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          taskTitle: todaySkillTitle,
          taskDescription: todaySkillDescription,
          customPrompt: null // Will be populated from custom tasks later
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI coach');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let assistantMessage = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices?.[0]?.delta?.content) {
                assistantMessage += data.choices[0].delta.content;
                setMessages(prev => 
                  prev.map((msg, idx) => 
                    idx === prev.length - 1 
                      ? { ...msg, content: assistantMessage }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Error chatting with coach. Please try again.');
      setMessages(prev => prev.slice(0, -1)); // Remove empty assistant message
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Restarted. Today’s focus: “${todaySkillTitle}”. Ask for an exercise, examples, or feedback practice.`,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pb-24 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-4 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium mb-2">
            <MessageSquare className="w-4 h-4" /> SkillSpark Coach
          </div>
          <h1 className="text-2xl font-bold text-foreground">Ask about today’s skill</h1>
          <p className="text-sm text-muted-foreground">{todaySkillTitle}</p>
        </div>

        {/* Chat Interface */}
        <>
            {/* Context */}
            <div className="mb-3">
              <Card className="bg-gradient-glass backdrop-blur-md border-border/20">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/15 text-primary border border-primary/20">Today</Badge>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      Reset
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{todaySkillTitle}</span>: {todaySkillDescription}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Messages */}
            <Card className="bg-gradient-card shadow-soft border-border/20">
              <CardContent className="p-0">
                <ScrollArea className="h-[52vh] p-4">
                  <div className="space-y-3">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={
                          m.role === 'user'
                            ? 'flex justify-end'
                            : 'flex justify-start'
                        }
                      >
                        <div
                          className={
                            m.role === 'user'
                              ? 'max-w-[85%] rounded-2xl px-4 py-3 bg-gradient-primary text-primary-foreground shadow-soft animate-scale-in'
                              : 'max-w-[85%] rounded-2xl px-4 py-3 bg-gradient-glass backdrop-blur-md border border-border/20 text-foreground animate-fade-in'
                          }
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        Coach is thinking...
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Composer */}
            <div className="mt-3 flex items-end gap-2">
              <Textarea
                placeholder="Ask for an exercise, examples, or feedback practice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[52px] max-h-36"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} size="lg" className="h-[52px] px-5" variant="modern">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
      </div>

      <Navigation />
    </div>
  );
};

export default Chat;