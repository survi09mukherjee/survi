import { Avatar, Lesson, User } from '@/types';
import { Character } from '@/types/video';

export const AVATARS: Avatar[] = [
  {
    id: 'mentor',
    name: 'Dr. Wisdom',
    tone: 'Calm & Patient',
    description: 'A wise mentor who explains concepts thoroughly',
    unlocked: true,
    image: '👨‍🏫',
  },
  {
    id: 'energetic',
    name: 'Spark',
    tone: 'Energetic & Fun',
    description: 'An enthusiastic tutor who makes learning exciting',
    unlocked: true,
    image: '⚡',
  },
  {
    id: 'gentle',
    name: 'Luna',
    tone: 'Gentle & Encouraging',
    description: 'A supportive teacher who builds your confidence',
    unlocked: true,
    image: '🌙',
  },
  {
    id: 'playful',
    name: 'Buddy',
    tone: 'Playful & Creative',
    description: 'A fun educator who uses games and stories',
    unlocked: false,
    image: '🎨',
  },
];

export const CHARACTERS: Character[] = [
  {
    id: 'riya-raincloud',
    name: 'Riya Raincloud',
    type: 'cartoon',
    tone: 'storyteller',
    style: 'Friendly weather teacher with a cloud theme',
    image: '☁️',
    unlocked: true,
  },
  {
    id: 'math-ninja',
    name: 'Math Ninja',
    type: 'anime',
    tone: 'motivational',
    style: 'Energetic number warrior who conquers math problems',
    image: '⚡',
    unlocked: true,
  },
  {
    id: 'professor-curious',
    name: 'Professor Curious',
    type: 'realistic',
    tone: 'calm',
    style: 'Patient scientist who loves experiments',
    image: '🔬',
    unlocked: true,
  },
  {
    id: 'story-wizard',
    name: 'Story Wizard',
    type: 'cartoon',
    tone: 'funny',
    style: 'Magical storyteller who teaches through tales',
    image: '🧙‍♂️',
    unlocked: false,
  },
];

export const SAMPLE_LESSON: Lesson = {
  id: 'fractions-1',
  subject: 'Mathematics',
  topic: 'Adding Fractions with Different Denominators',
  difficulty: 'medium',
  content: `Let's learn how to add fractions with different denominators!

When we want to add 1/2 + 1/3, we need to find a common denominator first.

Both 2 and 3 can fit into 6, so:
- 1/2 = 3/6 (multiply top and bottom by 3)
- 1/3 = 2/6 (multiply top and bottom by 2)

Now we can add them:
3/6 + 2/6 = 5/6

Great work! 🎉`,
  quiz: {
    question: 'What is 2/5 + 1/3?',
    options: ['7/15', '3/8', '5/8', '7/10'],
    correctAnswer: 0,
    feedback: 'Excellent! You found the common denominator (15) and added correctly: 6/15 + 5/15 = 11/15, which simplifies to 7/15.',
  },
};

export const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Alex',
  age: 11,
  grade: 'class-6',
  avatarId: 'mentor',
  language: 'en',
  accuracy: 87,
  streak: 7,
  lessonsCompleted: 24,
  badges: ['first-lesson', 'week-streak', 'quiz-master'],
  preferredLearningMode: 'mixed',
};

export const TUTOR_RESPONSES = {
  greeting: "Hi there! I'm so excited to learn with you today! What would you like to explore?",
  encouragement: [
    "You're doing amazing! Keep going!",
    "Great thinking! You're on the right track!",
    "Wonderful job! I'm proud of you!",
    "That's excellent progress!",
  ],
  hint: "Let me give you a hint: Try breaking this down into smaller steps.",
  example: "Here's another example to help: If we had 1/4 + 1/4, we'd get 2/4, which simplifies to 1/2.",
  repeat: "No problem! Let me explain that again in a different way...",
};

export const BADGES = [
  { id: 'first-lesson', name: 'First Steps', icon: '🌟', description: 'Completed your first lesson' },
  { id: 'week-streak', name: 'Week Warrior', icon: '🔥', description: '7-day learning streak' },
  { id: 'quiz-master', name: 'Quiz Master', icon: '🏆', description: '10 quizzes with 100% accuracy' },
  { id: 'fast-learner', name: 'Fast Learner', icon: '⚡', description: 'Completed 5 lessons in one day' },
  { id: 'helper', name: 'Helpful Friend', icon: '🤝', description: 'Shared learning tips' },
];
