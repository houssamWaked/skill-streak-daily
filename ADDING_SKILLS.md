# 🚀 How to Add New Skills - Super Easy!

## Quick Start

To add new skills to SkillSpark, just edit `src/lib/skills.ts` and add them to the `newSkills` array:

```typescript
const newSkills: Skill[] = [
  createSkill('unique-id', 'Skill Title', 'Clear description', 'Category'),
  createSkill('public-1', 'Public Speaking', 'Practice speaking confidently in front of groups', 'Communication'),
  createSkill('negot-1', 'Negotiation', 'Learn to find win-win solutions in discussions', 'Communication'),
];
```

## Available Categories

- 'Communication'
- 'Leadership' 
- 'Time Management'
- 'Emotional Intelligence'
- 'Problem Solving'
- 'Teamwork'
- 'Adaptability'
- 'Critical Thinking'
- 'Creativity'
- 'Mindfulness'

## Tips for Good Skills

- **ID**: Make it unique (e.g., 'comm-5', 'lead-4', 'custom-1')
- **Title**: Keep it short and clear (2-4 words)
- **Description**: Be specific about what to practice, include actionable steps
- **Category**: Choose from the available categories above

## Examples

```typescript
// ✅ Good examples
createSkill('comm-5', 'Difficult Conversations', 'Practice addressing sensitive topics with empathy and clarity', 'Communication'),
createSkill('lead-4', 'Mentoring', 'Guide others by sharing knowledge and providing constructive support', 'Leadership'),
createSkill('time-4', 'Digital Detox', 'Set boundaries with technology to improve focus and presence', 'Time Management'),

// ❌ Avoid these
createSkill('bad', 'Some Skill', 'Vague description', 'Wrong Category'), // Bad ID, vague description, invalid category
```

## That's it! 

Just add your skills to the `newSkills` array and they'll automatically be included in the app. The system will handle everything else - task selection, user preferences, completion tracking, etc.