import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Video, Sparkles } from 'lucide-react';
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
        setLessonScript(data.script);
        toast.success('Lesson script generated! 📝');
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
      toast.error('Please generate a lesson script first');
      return;
    }

    setIsGeneratingVideo(true);
    toast('Generating animated teaching video... 🎬', {
      description: 'This may take a few minutes',
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
        toast.success('Teaching video ready! 🎥');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video. Please try again.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

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
              onChange={(e) => setLessonScript(e.target.value)}
              rows={8}
              disabled={isGeneratingVideo}
              className="font-mono text-sm"
            />
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
              <Label>Your Animated Teaching Video</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(videoUrl, '_blank')}
              >
                Open in New Tab
              </Button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={videoUrl}
                controls
                className="w-full h-full"
                autoPlay
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              ✅ Character animated with lip-sync, expressions, and movements
            </p>
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
              <li>AI voice matching your character's personality</li>
              <li>Professional teaching video ready to watch</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
