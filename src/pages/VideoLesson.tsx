import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ChevronLeft, MessageCircle, BookOpen } from 'lucide-react';
import { SubtitleTrack } from '@/types/video';

export default function VideoLesson() {
  const navigate = useNavigate();
  const [showTranscript, setShowTranscript] = useState(false);

  // Mock lesson data
  const lesson = {
    title: 'The Water Cycle',
    subject: 'Science',
    grade: 'Class 4',
    language: 'Tamil',
    characterName: 'Riya Raincloud',
    characterImage: '☁️',
    videoUrl: '/mock-video.mp4',
    description: 'Learn how water moves through our environment in an endless cycle.',
  };

  const subtitles: SubtitleTrack[] = [
    {
      language: 'tamil',
      lines: [
        { start: 0, end: 5, text: 'நாம் மழை எப்படி உருவாகிறது என்று பார்க்கலாம்!' },
        { start: 5, end: 10, text: 'நீர் ஆவியாகி மேகங்களாகி, பிறகு மழையாக விழுகிறது.' },
        { start: 10, end: 15, text: 'இது நீர் சுழற்சி என்று அழைக்கப்படுகிறது.' },
      ]
    },
    {
      language: 'english',
      lines: [
        { start: 0, end: 5, text: "Let's see how rain is formed!" },
        { start: 5, end: 10, text: 'Water evaporates into clouds and falls back as rain.' },
        { start: 10, end: 15, text: 'This is called the water cycle.' },
      ]
    }
  ];

  const transcript = `
நாம் மழை எப்படி உருவாகிறது என்று பார்க்கலாம்! நீர் ஆவியாகி மேகங்களாகி, பிறகு மழையாக விழுகிறது.

Let's see how rain is formed! Water evaporates into clouds and falls back as rain.

இது நீர் சுழற்சி என்று அழைக்கப்படுகிறது. சூரியன் நீரை சூடாக்குகிறது...

This is called the water cycle. The sun heats up the water...
  `.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/lesson-library')}>
                <ChevronLeft />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">{lesson.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {lesson.subject} • {lesson.grade} • Taught in {lesson.language}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/chat')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Switch to Voice Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player - Main */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              videoUrl={lesson.videoUrl}
              subtitles={subtitles}
              characterImage={lesson.characterImage}
              characterName={lesson.characterName}
              onAskQuestion={() => navigate('/chat')}
            />

            {/* Lesson Description */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-2">About This Lesson</h3>
              <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/lesson-library')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  More Lessons
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowTranscript(!showTranscript)}>
                  📝 {showTranscript ? 'Hide' : 'Show'} Transcript
                </Button>
              </div>
            </Card>

            {/* Bilingual Transcript */}
            {showTranscript && (
              <Card className="p-6 shadow-card animate-slide-up">
                <h3 className="font-semibold mb-4">Bilingual Transcript</h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {transcript}
                  </pre>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Button variant="hero" className="w-full justify-start">
                  📝 Take Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/chat')}>
                  💬 Ask Questions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🔄 Watch Again
                </Button>
              </div>
            </Card>

            {/* Related Topics */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold mb-4">Related Topics</h3>
              <div className="space-y-2">
                {[
                  { title: 'States of Water', emoji: '💧' },
                  { title: 'Weather Patterns', emoji: '🌦️' },
                  { title: 'Climate Zones', emoji: '🌍' }
                ].map((topic) => (
                  <button
                    key={topic.title}
                    className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                  >
                    <span className="text-2xl">{topic.emoji}</span>
                    <span className="text-sm font-medium">{topic.title}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Progress Indicator */}
            <Card className="p-6 bg-gradient-hero text-primary-foreground">
              <h3 className="font-semibold mb-2">🎉 Great Progress!</h3>
              <p className="text-sm mb-3 text-primary-foreground/90">
                You've completed 3 Science lessons this week!
              </p>
              <Button variant="secondary" size="sm">
                View All Progress
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
