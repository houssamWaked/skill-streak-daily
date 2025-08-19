// Skills database for SkillSpark app
import { Skill } from './storage';

export const skillCategories = [
  'Communication',
  'Leadership',
  'Time Management',
  'Emotional Intelligence',
  'Problem Solving',
  'Teamwork',
  'Adaptability',
  'Critical Thinking',
  'Creativity',
  'Mindfulness',
] as const;

export type SkillCategory = typeof skillCategories[number];

// Comprehensive skills database
export const skillsDatabase: Skill[] = [
  // Communication
  {
    id: 'comm-1',
    title: 'Active Listening',
    description: 'Practice giving your full attention when others speak. Focus on understanding before responding, ask clarifying questions, and reflect back what you heard.',
    category: 'Communication',
  },
  {
    id: 'comm-2',
    title: 'Clear Email Writing',
    description: 'Write emails with clear subject lines, concise messaging, and actionable next steps. Use bullet points and avoid jargon.',
    category: 'Communication',
  },
  {
    id: 'comm-3',
    title: 'Constructive Feedback',
    description: 'Learn to give feedback that focuses on specific behaviors, includes positive elements, and offers actionable suggestions for improvement.',
    category: 'Communication',
  },
  {
    id: 'comm-4',
    title: 'Non-Verbal Communication',
    description: 'Be aware of your body language, maintain appropriate eye contact, and use gestures that support your message.',
    category: 'Communication',
  },
  
  // Leadership
  {
    id: 'lead-1',
    title: 'Decision Making',
    description: 'Practice making timely decisions by gathering relevant information, considering alternatives, and taking calculated risks.',
    category: 'Leadership',
  },
  {
    id: 'lead-2',
    title: 'Delegation',
    description: 'Learn to assign tasks effectively by matching tasks to team members\' strengths and providing clear expectations.',
    category: 'Leadership',
  },
  {
    id: 'lead-3',
    title: 'Inspiring Others',
    description: 'Motivate your team by sharing a compelling vision, recognizing achievements, and leading by example.',
    category: 'Leadership',
  },
  
  // Time Management
  {
    id: 'time-1',
    title: 'Priority Setting',
    description: 'Use the Eisenhower Matrix to categorize tasks by urgency and importance. Focus on important but not urgent tasks.',
    category: 'Time Management',
  },
  {
    id: 'time-2',
    title: 'Time Blocking',
    description: 'Schedule specific time blocks for different types of work. Protect these blocks and avoid multitasking.',
    category: 'Time Management',
  },
  {
    id: 'time-3',
    title: 'Energy Management',
    description: 'Identify your peak energy hours and schedule your most important work during these times.',
    category: 'Time Management',
  },
  
  // Emotional Intelligence
  {
    id: 'eq-1',
    title: 'Self-Awareness',
    description: 'Practice recognizing your emotions as they occur and understanding what triggers them.',
    category: 'Emotional Intelligence',
  },
  {
    id: 'eq-2',
    title: 'Empathy',
    description: 'Try to understand others\' perspectives by asking questions and observing emotional cues.',
    category: 'Emotional Intelligence',
  },
  {
    id: 'eq-3',
    title: 'Emotional Regulation',
    description: 'Practice pausing before reacting to strong emotions. Use breathing techniques or take a brief walk.',
    category: 'Emotional Intelligence',
  },
  
  // Problem Solving
  {
    id: 'prob-1',
    title: 'Root Cause Analysis',
    description: 'When facing a problem, ask "why" five times to dig deeper and find the underlying cause.',
    category: 'Problem Solving',
  },
  {
    id: 'prob-2',
    title: 'Creative Brainstorming',
    description: 'Generate multiple solutions without judging them initially. Build on others\' ideas and think outside the box.',
    category: 'Problem Solving',
  },
  
  // Teamwork
  {
    id: 'team-1',
    title: 'Collaboration',
    description: 'Actively contribute to team goals, share knowledge freely, and support team members when they need help.',
    category: 'Teamwork',
  },
  {
    id: 'team-2',
    title: 'Conflict Resolution',
    description: 'Address conflicts early, focus on interests rather than positions, and find win-win solutions.',
    category: 'Teamwork',
  },
  
  // Adaptability
  {
    id: 'adapt-1',
    title: 'Flexibility',
    description: 'Embrace change by staying curious, asking questions, and looking for opportunities in new situations.',
    category: 'Adaptability',
  },
  {
    id: 'adapt-2',
    title: 'Learning Agility',
    description: 'Continuously seek to learn new skills, ask for feedback, and apply lessons from failures.',
    category: 'Adaptability',
  },
  
  // Critical Thinking
  {
    id: 'crit-1',
    title: 'Question Assumptions',
    description: 'Challenge your own and others\' assumptions by asking "What if?" and "How do we know this is true?"',
    category: 'Critical Thinking',
  },
  {
    id: 'crit-2',
    title: 'Evidence Evaluation',
    description: 'Learn to assess the quality and reliability of information sources before making decisions.',
    category: 'Critical Thinking',
  },
  
  // Creativity
  {
    id: 'creat-1',
    title: 'Idea Generation',
    description: 'Set aside time for creative thinking. Use techniques like mind mapping or random word association.',
    category: 'Creativity',
  },
  {
    id: 'creat-2',
    title: 'Innovation',
    description: 'Look for ways to improve existing processes or products. Ask "How might we do this differently?"',
    category: 'Creativity',
  },
  
  // Mindfulness
  {
    id: 'mind-1',
    title: 'Present Moment Awareness',
    description: 'Practice staying focused on the current task without getting distracted by past or future concerns.',
    category: 'Mindfulness',
  },
  {
    id: 'mind-2',
    title: 'Stress Management',
    description: 'Use breathing exercises, short meditation, or mindful walking to manage stress throughout the day.',
    category: 'Mindfulness',
  },
];

// Get a random skill based on user interests and completed skills
export const getSkillForToday = (interests: string[], completedSkillIds: string[]): Skill => {
  // Filter skills based on interests
  let availableSkills = skillsDatabase.filter(skill => 
    interests.length === 0 || interests.includes(skill.category)
  );
  
  // Remove already completed skills
  availableSkills = availableSkills.filter(skill => 
    !completedSkillIds.includes(skill.id)
  );
  
  // If all skills are completed, reset and use all skills
  if (availableSkills.length === 0) {
    availableSkills = skillsDatabase.filter(skill => 
      interests.length === 0 || interests.includes(skill.category)
    );
  }
  
  // Use a deterministic selection based on the current date
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const skillIndex = dayOfYear % availableSkills.length;
  
  return availableSkills[skillIndex];
};

export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return skillsDatabase.filter(skill => skill.category === category);
};