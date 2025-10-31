export interface Character {
  id: string;
  name: string;
  type: 'cartoon' | 'anime' | 'realistic';
  tone: 'funny' | 'calm' | 'motivational' | 'storyteller';
  style: string;
  image: string;
  voiceId?: string;
  unlocked: boolean;
}

export interface VideoLesson {
  id: string;
  title: string;
  subject: string;
  grade: string;
  language: string;
  duration: number; // in seconds
  characterId: string;
  thumbnail: string;
  videoUrl: string;
  subtitles: SubtitleTrack[];
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SubtitleTrack {
  language: string;
  lines: SubtitleLine[];
}

export interface SubtitleLine {
  start: number;
  end: number;
  text: string;
}

export interface LessonContent {
  type: 'video' | 'voice' | 'mixed';
  characterId: string;
  language: string;
  content: string;
}
