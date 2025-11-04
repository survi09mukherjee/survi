import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [lessonScript, setLessonScript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);

  // Generate narration on component mount
  useEffect(() => {
    const generateNarration = async () => {
      try {
        setIsGenerating(true);
        const { data, error } = await supabase.functions.invoke('generate-lesson-narration', {
          body: {
            topicTitle: topic.title,
            topicDescription: topic.description,
            characterName: avatar.character_name
          }
        });

        if (error) throw error;

        if (data.audioContent) {
          // Convert base64 to blob and create URL
          const byteCharacters = atob(data.audioContent);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'audio/mpeg' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setLessonScript(data.script);

          // Create audio element
          const audio = new Audio(url);
          audioRef.current = audio;

          // Set duration when metadata loads
          audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
          });

          // Update progress during playback
          audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
              setProgress((audio.currentTime / audio.duration) * 100);
            }
          });

          // Handle end of playback
          audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setProgress(100);
          });

          toast({
            title: "Lesson Ready! 🎓",
            description: `${avatar.character_name} is ready to teach!`,
          });
        }
      } catch (error) {
        console.error('Error generating narration:', error);
        toast({
          title: "Error",
          description: "Failed to generate lesson narration. Using demo mode.",
          variant: "destructive",
        });
        // Fallback to timer-based demo
        setDuration(180);
      } finally {
        setIsGenerating(false);
      }
    };

    generateNarration();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [topic, avatar]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      audioRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted]);

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
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Generating lesson narration...</p>
                <p className="text-sm text-muted-foreground">{avatar.character_name} is preparing to teach!</p>
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={avatar.image_url}
                    alt="Tutor Avatar"
                    className={`w-64 h-64 object-contain transition-transform ${
                      isPlaying ? 'animate-bounce-subtle scale-105' : ''
                    }`}
                  />
                  {isPlaying && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card px-4 py-2 rounded-full shadow-lg animate-pulse">
                      <p className="text-sm font-medium">🎙️ Teaching {topic.title}...</p>
                    </div>
                  )}
                  {!isPlaying && progress > 0 && progress < 100 && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card px-4 py-2 rounded-full shadow-lg">
                      <p className="text-sm font-medium">⏸️ Paused</p>
                    </div>
                  )}
                </div>

                {/* Play/Pause Overlay */}
                {!isPlaying && progress === 0 && !isGenerating && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
                    <Button
                      size="lg"
                      className="rounded-full w-20 h-20 shadow-2xl"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {audioRef.current ? 
                    `${Math.floor(audioRef.current.currentTime / 60)}:${String(Math.floor(audioRef.current.currentTime % 60)).padStart(2, '0')}` 
                    : '0:00'}
                </span>
                <span>
                  {duration ? 
                    `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}` 
                    : '--:--'}
                </span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={progress >= 100 || isGenerating || !audioUrl}
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

        {/* Lesson Script */}
        {lessonScript && (
          <Card className="mt-6 p-6">
            <h3 className="font-semibold mb-3">📜 Lesson Transcript</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {lessonScript}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
