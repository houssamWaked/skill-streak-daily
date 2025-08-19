// Local storage utilities for SkillSpark app
export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface CompletedSkill extends Skill {
  completedDate: string;
  dayNumber: number;
}

export interface UserPreferences {
  interests: string[];
  isNewUser: boolean;
  streak: number;
  lastCompletedDate: string | null;
  joinDate: string;
}

// Storage keys
const STORAGE_KEYS = {
  USER_PREFERENCES: 'skillspark_user_preferences',
  COMPLETED_SKILLS: 'skillspark_completed_skills',
  TODAY_SKILL: 'skillspark_today_skill',
  LAST_SKILL_DATE: 'skillspark_last_skill_date',
} as const;

// User preferences management
export const getUserPreferences = (): UserPreferences => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default preferences for new users
  const defaults: UserPreferences = {
    interests: [],
    isNewUser: true,
    streak: 0,
    lastCompletedDate: null,
    joinDate: new Date().toISOString(),
  };
  
  saveUserPreferences(defaults);
  return defaults;
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
};

// Today's skill management
export const getTodaySkill = (): Skill | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.TODAY_SKILL);
  const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_SKILL_DATE);
  const today = new Date().toDateString();
  
  // If it's a new day, clear the stored skill
  if (lastDate !== today) {
    localStorage.removeItem(STORAGE_KEYS.TODAY_SKILL);
    return null;
  }
  
  return stored ? JSON.parse(stored) : null;
};

export const saveTodaySkill = (skill: Skill): void => {
  const today = new Date().toDateString();
  localStorage.setItem(STORAGE_KEYS.TODAY_SKILL, JSON.stringify(skill));
  localStorage.setItem(STORAGE_KEYS.LAST_SKILL_DATE, today);
};

// Completed skills management
export const getCompletedSkills = (): CompletedSkill[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_SKILLS);
  return stored ? JSON.parse(stored) : [];
};

export const saveCompletedSkill = (skill: Skill): void => {
  const completedSkills = getCompletedSkills();
  const today = new Date().toISOString();
  
  const completedSkill: CompletedSkill = {
    ...skill,
    completedDate: today,
    dayNumber: completedSkills.length + 1,
  };
  
  completedSkills.push(completedSkill);
  localStorage.setItem(STORAGE_KEYS.COMPLETED_SKILLS, JSON.stringify(completedSkills));
  
  // Update streak
  updateStreak();
};

// Streak management
export const updateStreak = (): void => {
  const preferences = getUserPreferences();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  if (preferences.lastCompletedDate === today) {
    // Already completed today, no change
    return;
  }
  
  if (preferences.lastCompletedDate === yesterday) {
    // Completed yesterday, increment streak
    preferences.streak += 1;
  } else if (preferences.lastCompletedDate !== null) {
    // Missed a day, reset streak
    preferences.streak = 1;
  } else {
    // First completion
    preferences.streak = 1;
  }
  
  preferences.lastCompletedDate = today;
  saveUserPreferences(preferences);
};

export const resetStreak = (): void => {
  const preferences = getUserPreferences();
  preferences.streak = 0;
  preferences.lastCompletedDate = null;
  saveUserPreferences(preferences);
};

// Check if user completed today's skill
export const isSkillCompletedToday = (): boolean => {
  const preferences = getUserPreferences();
  const today = new Date().toDateString();
  return preferences.lastCompletedDate === today;
};