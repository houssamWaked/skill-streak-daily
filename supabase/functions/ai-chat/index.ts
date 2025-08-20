import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, taskTitle, taskDescription, customPrompt } = await req.json();

    const systemPrompt = `You are SkillSpark AI, a friendly and focused soft skills coach.

CORE BEHAVIOR:
- You can respond to greetings like "hi" and "hello" warmly
- You ONLY help with the current skill/task: "${taskTitle}"
- For any off-topic questions, politely redirect to the current task
- Keep responses under 6 sentences unless asked for detail
- Always offer 1 practical exercise and 1 reflection question

TODAY'S FOCUS: ${taskTitle}
CONTEXT: ${taskDescription}

${customPrompt ? `SPECIAL INSTRUCTIONS: ${customPrompt}` : ''}

RESPONSE GUIDELINES:
- Be encouraging and supportive
- Provide actionable, specific advice
- Use examples when helpful
- If asked about other topics, say: "I'm here to help with ${taskTitle} today. Let's focus on that!"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_completion_tokens: 500,
        stream: true
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process chat request' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});