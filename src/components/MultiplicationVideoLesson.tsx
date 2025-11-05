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
  const [videoUrl, setVideoUrl] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<number>();

  // Generate narration on component mount
  useEffect(() => {
    const generateNarration = async (): Promise<string | null> => {
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

        if (data.script) {
          setLessonScript(data.script);
          // Estimate duration based on script length (average reading speed ~150 words per minute)
          const wordCount = data.script.split(' ').length;
          const estimatedDuration = (wordCount / 150) * 60;
          setDuration(estimatedDuration);

          toast({
            title: "Lesson Ready! 🎓",
            description: `${avatar.character_name} is ready to teach!`,
          });
          
          return data.script;
        }
        return null;
      } catch (error) {
        console.error('Error generating narration:', error);
        toast({
          title: "Error",
          description: "Failed to generate lesson narration. Please try again.",
          variant: "destructive",
        });
        setDuration(180);
        return null;
      } finally {
        setIsGenerating(false);
      }
    };

    const generateVideo = async (script: string) => {
      try {
        setIsGeneratingVideo(true);
        toast({
          title: "Generating Lip-Sync Video 🎬",
          description: "Creating video with synchronized character speech...",
        });

        const { data, error } = await supabase.functions.invoke('generate-video', {
          body: {
            imageUrl: avatar.image_url,
            lessonScript: script,
            characterName: avatar.character_name
          }
        });

        if (error) {
          console.error('Video generation error:', error);
          toast({
            title: "Video Generation in Progress",
            description: "This may take a few minutes. Using animated avatar for now.",
          });
        } else if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
          toast({
            title: "Lip-Sync Video Ready! 🎥",
            description: "Your character is now speaking with lip-sync!",
          });
        }
      } catch (error) {
        console.error('Error generating video:', error);
      } finally {
        setIsGeneratingVideo(false);
      }
    };

    generateNarration().then((scriptText) => {
      if (scriptText) {
        generateVideo(scriptText);
      }
    });

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [topic, avatar]);

  // Handle play/pause with Web Speech API
  useEffect(() => {
    if (!lessonScript) return;

    if (isPlaying) {
      // Create speech synthesis
      const utterance = new SpeechSynthesisUtterance(lessonScript);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = isMuted ? 0 : 1;
      
      // Select a friendly voice
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
      if (friendlyVoice) utterance.voice = friendlyVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        setCurrentTime(duration);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // Animate progress
      const startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        setProgress((elapsed / duration) * 100);
        
        if (elapsed < duration && isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animate();
    } else {
      window.speechSynthesis.cancel();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      window.speechSynthesis.cancel();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isMuted, lessonScript, duration]);

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
          <div className="relative bg-gradient-hero aspect-video flex items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Generating lesson narration...</p>
                <p className="text-sm text-muted-foreground">{avatar.character_name} is preparing to teach!</p>
              </div>
            ) : (
              <>
                {/* Video or Animated Avatar */}
                {videoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      loop
                      muted={isMuted}
                      playsInline
                      autoPlay={isPlaying}
                    />
                    {isGeneratingVideo && (
                      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-medium">Generating video...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`transition-all duration-300 ${isPlaying ? 'animate-float' : ''}`}>
                      <img
                        src={avatar.image_url}
                        alt="Tutor Avatar"
                        className={`w-64 h-64 object-contain transition-all duration-500 ${
                          isPlaying ? 'scale-110' : 'scale-100'
                        }`}
                        style={{
                          filter: isPlaying ? 'drop-shadow(0 10px 30px rgba(var(--primary), 0.3))' : 'none',
                        }}
                      />
                    </div>
                    {isGeneratingVideo && (
                      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-medium">Generating video...</span>
                      </div>
                    )}
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
                    
                    {/* Animated sparkles around avatar when playing */}
                    {isPlaying && (
                      <>
                        <div className="absolute top-10 left-10 text-3xl animate-bounce" style={{ animationDelay: '0s' }}>✨</div>
                        <div className="absolute top-20 right-10 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>⭐</div>
                        <div className="absolute bottom-20 left-5 text-2xl animate-bounce" style={{ animationDelay: '0.6s' }}>🌟</div>
                        <div className="absolute bottom-10 right-5 text-3xl animate-bounce" style={{ animationDelay: '0.9s' }}>💫</div>
                      </>
                    )}
                  </div>
                )}

                {/* Play/Pause Overlay */}
                {!isPlaying && progress === 0 && !isGenerating && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
                    <Button
                      size="lg"
                      className="rounded-full w-20 h-20 shadow-2xl hover:scale-110 transition-transform"
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
                  {`${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`}
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
                  disabled={progress >= 100 || isGenerating || !lessonScript}
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
