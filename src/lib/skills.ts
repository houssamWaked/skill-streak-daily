// src/lib/skills.ts
import { Skill } from './storage';
import { v4 as uuidv4 } from 'uuid';

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

// Helper function to create new skills
const createSkill = (title: string, description: string, category: SkillCategory): Skill => ({
  id: uuidv4(), // unique UUID for each skill
  title,
  description,
  category,
});

// New skills
const newSkills: Skill[] = [
  createSkill(
    'Public Speaking',
    'Practice speaking confidently to groups. Start with 1-minute presentations and focus on clear, engaging delivery.',
    'Communication'
  ),
  createSkill(
    'Mentoring',
    'Guide someone by sharing knowledge and asking thoughtful questions. Focus on their growth, not just giving answers.',
    'Leadership'
  ),
];

// Core skills
const coreSkills: Skill[] = [
  createSkill(
    'Active Listening',
    'Practice giving your full attention when others speak. Focus on understanding before responding, ask clarifying questions, and reflect back what you heard.',
    'Communication'
  ),
  createSkill(
    'Clear Email Writing',
    'Write emails with clear subject lines, concise messaging, and actionable next steps. Use bullet points and avoid jargon.',
    'Communication'
  ),
  createSkill(
    'Constructive Feedback',
    'Learn to give feedback that focuses on specific behaviors, includes positive elements, and offers actionable suggestions for improvement.',
    'Communication'
  ),
  createSkill(
    'Non-Verbal Communication',
    'Be aware of your body language, maintain appropriate eye contact, and use gestures that support your message.',
    'Communication'
  ),
  createSkill(
    'Decision Making',
    'Practice making timely decisions by gathering relevant information, considering alternatives, and taking calculated risks.',
    'Leadership'
  ),
  createSkill(
    'Delegation',
    'Learn to assign tasks effectively by matching tasks to team members\' strengths and providing clear expectations.',
    'Leadership'
  ),
  createSkill(
    'Inspiring Others',
    'Motivate your team by sharing a compelling vision, recognizing achievements, and leading by example.',
    'Leadership'
  ),
  createSkill(
    'Priority Setting',
    'Use the Eisenhower Matrix to categorize tasks by urgency and importance. Focus on important but not urgent tasks.',
    'Time Management'
  ),
  createSkill(
    'Time Blocking',
    'Schedule specific time blocks for different types of work. Protect these blocks and avoid multitasking.',
    'Time Management'
  ),
  createSkill(
    'Energy Management',
    'Identify your peak energy hours and schedule your most important work during these times.',
    'Time Management'
  ),
  createSkill(
    'Self-Awareness',
    'Practice recognizing your emotions as they occur and understanding what triggers them.',
    'Emotional Intelligence'
  ),
  createSkill(
    'Empathy',
    'Try to understand others\' perspectives by asking questions and observing emotional cues.',
    'Emotional Intelligence'
  ),
  createSkill(
    'Emotional Regulation',
    'Practice pausing before reacting to strong emotions. Use breathing techniques or take a brief walk.',
    'Emotional Intelligence'
  ),
  createSkill(
    'Root Cause Analysis',
    'When facing a problem, ask "why" five times to dig deeper and find the underlying cause.',
    'Problem Solving'
  ),
  createSkill(
    'Creative Brainstorming',
    'Generate multiple solutions without judging them initially. Build on others\' ideas and think outside the box.',
    'Problem Solving'
  ),
  createSkill(
    'Collaboration',
    'Actively contribute to team goals, share knowledge freely, and support team members when they need help.',
    'Teamwork'
  ),
  createSkill(
    'Conflict Resolution',
    'Address conflicts early, focus on interests rather than positions, and find win-win solutions.',
    'Teamwork'
  ),
  createSkill(
    'Flexibility',
    'Embrace change by staying curious, asking questions, and looking for opportunities in new situations.',
    'Adaptability'
  ),
  createSkill(
    'Learning Agility',
    'Continuously seek to learn new skills, ask for feedback, and apply lessons from failures.',
    'Adaptability'
  ),
  createSkill(
    'Question Assumptions',
    'Challenge your own and others\' assumptions by asking "What if?" and "How do we know this is true?"',
    'Critical Thinking'
  ),
  createSkill(
    'Evidence Evaluation',
    'Learn to assess the quality and reliability of information sources before making decisions.',
    'Critical Thinking'
  ),
  createSkill(
    'Idea Generation',
    'Set aside time for creative thinking. Use techniques like mind mapping or random word association.',
    'Creativity'
  ),
  createSkill(
    'Innovation',
    'Look for ways to improve existing processes or products. Ask "How might we do this differently?"',
    'Creativity'
  ),
  createSkill(
    'Present Moment Awareness',
    'Practice staying focused on the current task without getting distracted by past or future concerns.',
    'Mindfulness'
  ),
  createSkill(
    'Stress Management',
    'Use breathing exercises, short meditation, or mindful walking to manage stress throughout the day.',
    'Mindfulness'
  ),
];

// Combine core skills with new skills
export const skillsDatabase: Skill[] = [...coreSkills, ...newSkills];

// Get a random skill based on user interests and completed skills
export const getSkillForToday = (interests: string[], completedSkillIds: string[]): Skill => {
  let availableSkills = skillsDatabase.filter(skill => 
    interests.length === 0 || interests.includes(skill.category)
  );

  availableSkills = availableSkills.filter(skill => 
    !completedSkillIds.includes(skill.id)
  );

  if (availableSkills.length === 0) {
    availableSkills = skillsDatabase.filter(skill => 
      interests.length === 0 || interests.includes(skill.category)
    );
  }

  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const skillIndex = dayOfYear % availableSkills.length;

  return availableSkills[skillIndex];
};

// Get skills by category
export const getSkillsByCategory = (category: SkillCategory): Skill[] =>
  skillsDatabase.filter(skill => skill.category === category);
