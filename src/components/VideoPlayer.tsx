import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Languages, Repeat } from 'lucide-react';
import { SubtitleTrack } from '@/types/video';

interface VideoPlayerProps {
  videoUrl: string;
  subtitles: SubtitleTrack[];
  characterImage: string;
  characterName: string;
  onAskQuestion?: () => void;
}

export function VideoPlayer({
  videoUrl,
  subtitles,
  characterImage,
  characterName,
  onAskQuestion
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // Mock 5 min duration
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [selectedSubtitleLang, setSelectedSubtitleLang] = useState(subtitles[0]?.language || 'en');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, playbackSpeed]);

  const currentSubtitle = subtitles
    .find(track => track.language === selectedSubtitleLang)
    ?.lines.find(line => currentTime >= line.start && currentTime <= line.end);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const skip = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, currentTime + seconds)));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <Card className="overflow-hidden shadow-xl">
      {/* Video Display Area */}
      <div 
        ref={videoRef}
        className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 aspect-video flex items-center justify-center"
      >
        {/* Mock animated character */}
        <div className="text-9xl animate-bounce-subtle">
          {characterImage}
        </div>
        
        {/* Character name badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
          {characterName} is teaching
        </div>

        {/* Subtitles */}
        {showSubtitles && currentSubtitle && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg max-w-[90%] text-center">
            <p className="text-lg font-medium">{currentSubtitle.text}</p>
          </div>
        )}

        {/* Play/Pause overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <Play className="w-10 h-10 text-primary ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-card space-y-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium min-w-[40px]">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            onValueChange={(value) => setCurrentTime(value[0])}
            max={duration}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground min-w-[40px]">{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={() => skip(-10)}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="default" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => skip(10)}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                const currentIndex = speeds.indexOf(playbackSpeed);
                const nextIndex = (currentIndex + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIndex]);
              }}
            >
              {playbackSpeed}x
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowSubtitles(!showSubtitles)}
            >
              <Languages className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
            <Button size="icon" variant="ghost">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => setCurrentTime(0)}>
            <Repeat className="w-4 h-4 mr-2" />
            Replay
          </Button>
          <Button variant="outline" size="sm" onClick={onAskQuestion}>
            <Languages className="w-4 h-4 mr-2" />
            Translate
          </Button>
          <Button variant="outline" size="sm" onClick={onAskQuestion}>
            💬 Ask AI Tutor
          </Button>
          <Button variant="hero" size="sm">
            📝 Quiz Time
          </Button>
        </div>
      </div>
    </Card>
  );
}
