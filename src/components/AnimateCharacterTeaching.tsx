import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Video, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnimateCharacterTeachingProps {
  characterImage: string;
  characterName: string;
}

export default function AnimateCharacterTeaching({
  characterImage,
  characterName
}: AnimateCharacterTeachingProps) {
  const [topic, setTopic] = useState('');
  const [lessonScript, setLessonScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic to teach');
      return;
    }

    setIsGeneratingScript(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-narration', {
        body: {
          topicTitle: topic,
          topicDescription: `A lesson about ${topic}`,
          characterName: characterName
        }
      });

      if (error) throw error;

      if (data.script) {
        // Clean the script for display
        const cleanedScript = data.script
          .replace(/\*/g, '')
          .replace(/#{1,6}\s/g, '')
          .replace(/\[|\]/g, '')
          .trim();
        setLessonScript(cleanedScript);
        
        toast.success('Lesson script generated!', {
          description: 'Review and edit if needed',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error generating script:', error);
      toast.error('Failed to generate lesson script');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!lessonScript.trim()) {
      toast.error('Please generate a lesson script first', {
        position: 'top-center',
      });
      return;
    }

    setIsGeneratingVideo(true);
    setIsVideoReady(false);
    setVideoUrl('');
    
    toast.loading('Creating character animation...', {
      id: 'video-generation',
      position: 'top-center',
      description: 'Processing image and preparing animation',
    });

    try {
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: {
          imageUrl: characterImage,
          lessonScript: lessonScript,
          characterName: characterName
        }
      });

      if (error) throw error;

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setIsVideoReady(false); // Video URL received but not ready to play yet
        toast.dismiss('video-generation');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast.dismiss('video-generation');
      toast.error('Failed to generate video', {
        description: 'Please try again',
        position: 'top-center',
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Show success message when video is ready to play
  useEffect(() => {
    if (videoUrl && !isGeneratingVideo && !isVideoReady) {
      const timer = setTimeout(() => {
        setIsVideoReady(true);
        setShowSuccessToast(true);
        
        toast.success('🎬 Animated video ready!', {
          description: 'Lip-sync and expressions activated',
          position: 'top-center',
          className: 'bg-green-500 text-white border-green-600',
          duration: 4000,
        });

        setTimeout(() => setShowSuccessToast(false), 4000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [videoUrl, isGeneratingVideo, isVideoReady]);

  return (
    <Card className="p-6 mt-6 border-2 border-primary/20">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Animate My Character to Teach</h3>
          </div>
          <p className="text-muted-foreground">
            Transform your character into a fully animated teacher with voice and lip-sync
          </p>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <Label htmlFor="topic">What should {characterName} teach?</Label>
          <div className="flex gap-2">
            <Input
              id="topic"
              placeholder="e.g., Multiplication Tables, Solar System, Grammar..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGeneratingScript || isGeneratingVideo}
            />
            <Button
              onClick={handleGenerateScript}
              disabled={!topic.trim() || isGeneratingScript || isGeneratingVideo}
            >
              {isGeneratingScript ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Script'
              )}
            </Button>
          </div>
        </div>

        {/* Script Display/Edit */}
        {lessonScript && (
          <div className="space-y-2">
            <Label htmlFor="script">Lesson Script (Edit if needed)</Label>
            <Textarea
              id="script"
              value={lessonScript}
              onChange={(e) => {
                // Clean input as user types
                const cleaned = e.target.value.replace(/\*/g, '');
                setLessonScript(cleaned);
              }}
              rows={8}
              disabled={isGeneratingVideo}
              className="font-mono text-sm"
              placeholder="Plain text only - no special characters"
            />
            <p className="text-xs text-muted-foreground">
              Note: Special characters like * will be automatically removed
            </p>
          </div>
        )}

        {/* Generate Video Button */}
        {lessonScript && (
          <Button
            onClick={handleGenerateVideo}
            disabled={isGeneratingVideo}
            size="lg"
            className="w-full"
          >
            {isGeneratingVideo ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Animated Teaching Video...
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Generate Animated Teaching Video
              </>
            )}
          </Button>
        )}

        {/* Video Preview */}
        {videoUrl && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                {isVideoReady && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                Your Animated Teaching Video
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(videoUrl, '_blank')}
                disabled={!isVideoReady}
              >
                Open in New Tab
              </Button>
            </div>
            
            {!isVideoReady ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center space-y-3 animate-pulse">
                  <Loader2 className="w-12 h-12 mx-auto text-white animate-spin" />
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  preload="auto"
                  onLoadedData={() => setIsVideoReady(true)}
                />
              </div>
            )}
            
            {isVideoReady && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  ✅ Character animated with Indian English voice, lip-sync, expressions, and movements
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        {!videoUrl && (
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="mb-2">
              🎬 <strong>This will create:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Full character animation with mouth movements (lip-sync)</li>
              <li>Natural expressions and slight body movements</li>
              <li>Indian English AI voice matching your character</li>
              <li>Professional teaching video ready to watch</li>
            </ul>
            <p className="mt-3 text-xs">
              ⏱️ Generation takes 2-5 minutes. All warnings will appear in the center with fade effects.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
