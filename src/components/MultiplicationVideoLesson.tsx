import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MultiplicationVideoLessonProps {
  topic: any;
  avatar: any;
  onComplete: () => void;
  onBack: () => void;
}

export default function MultiplicationVideoLesson({
  topic,
  avatar,
  onComplete,
  onBack
}: MultiplicationVideoLessonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration] = useState(300); // 5 minutes default

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / duration);
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, duration]);

  const handleComplete = () => {
    if (progress >= 80) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{topic.title}</h1>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          {/* Video Display Area */}
          <div className="relative bg-gradient-hero aspect-video flex items-center justify-center">
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatar.image_url}
                alt="Tutor Avatar"
                className="w-64 h-64 object-contain animate-bounce-subtle"
              />
              {isPlaying && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card px-4 py-2 rounded-full shadow-lg">
                  <p className="text-sm font-medium">Teaching {topic.title}...</p>
                </div>
              )}
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && progress === 0 && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full w-20 h-20"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="w-8 h-8" />
                </Button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{Math.floor((progress / 100) * duration)}s</span>
                <span>{duration}s</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={progress >= 100}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              <Button
                onClick={handleComplete}
                disabled={progress < 80}
                size="lg"
              >
                {progress >= 100 ? 'Continue to Quiz' : `Watch ${Math.floor(80 - progress)}% more to continue`}
              </Button>
            </div>
          </div>
        </Card>

        {/* Lesson Notes */}
        <Card className="mt-6 p-6">
          <h3 className="font-semibold mb-3">Lesson Overview</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📝 {topic.description}</p>
            <p>🎯 Difficulty: {topic.level}</p>
            <p>⭐ Earn {topic.xp_reward} XP upon completion</p>
            <p>🏆 Unlock badge: {topic.badge_icon}</p>
          </div>
        </Card>
      </main>
    </div>
  );
}
