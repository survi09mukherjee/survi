export interface User {
  id: string;
  name: string;
  grade: number;
  avatarId: string;
  language: 'en' | 'bn';
  accuracy: number;
  streak: number;
  lessonsCompleted: number;
  badges: string[];
}

export interface Avatar {
  id: string;
  name: string;
  tone: string;
  description: string;
  unlocked: boolean;
  image: string;
}

export interface Lesson {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  quiz: Quiz;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  feedback: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface Progress {
  userId: string;
  accuracy: number;
  streak: number;
  lessonsCompleted: number;
  timeSpentThisWeek: number;
  badges: string[];
}
