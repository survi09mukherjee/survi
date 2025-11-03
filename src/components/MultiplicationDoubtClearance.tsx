import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, MessageSquare, Mic, Video, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MultiplicationDoubtClearanceProps {
  topic: any;
  avatar: any;
  onResolved: () => void;
  onBack: () => void;
}

export default function MultiplicationDoubtClearance({
  topic,
  avatar,
  onResolved,
  onBack
}: MultiplicationDoubtClearanceProps) {
  const { toast } = useToast();
  const [doubt, setDoubt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolutionType, setResolutionType] = useState<'text' | 'voice' | 'video'>('text');
  const [response, setResponse] = useState('');

  const handleSubmitDoubt = async () => {
    if (!doubt.trim()) {
      toast({
        title: "Error",
        description: "Please describe your doubt",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Save doubt session
      await supabase.from('doubt_sessions').insert({
        user_id: user.id,
        topic_id: topic.id,
        doubt_text: doubt,
        resolution_type: resolutionType,
        resolved: false
      });

      // Simulate AI response (in production, this would call an edge function)
      setResponse(
        `Great question! Let me explain ${topic.title} in a different way:\n\n` +
        `Understanding ${topic.title} is all about breaking it down into smaller steps. ` +
        `Let's start with the basics and work our way up. ` +
        `Would you like me to show you some practice examples?`
      );

      toast({
        title: "Doubt Received!",
        description: "Your tutor is preparing an explanation..."
      });
    } catch (error) {
      console.error('Error submitting doubt:', error);
      toast({
        title: "Error",
        description: "Failed to submit doubt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolve = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Mark doubts as resolved
      await supabase
        .from('doubt_sessions')
        .update({ resolved: true })
        .eq('user_id', user.id)
        .eq('topic_id', topic.id)
        .eq('resolved', false);
    }

    toast({
      title: "Great!",
      description: "Let's retry the quiz with your new understanding!"
    });

    onResolved();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Doubt Clearance</h1>
              <p className="text-sm text-muted-foreground">{topic.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Avatar */}
        <Card className="p-6 bg-gradient-hero text-primary-foreground text-center">
          <img
            src={avatar.image_url}
            alt="Tutor Avatar"
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
          <p className="text-lg">
            Don't worry! I'm here to help you understand better. 
            Ask me anything about {topic.title}!
          </p>
        </Card>

        {/* Resolution Type Selection */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">How would you like to learn?</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={resolutionType === 'text' ? 'default' : 'outline'}
              onClick={() => setResolutionType('text')}
              className="flex flex-col h-auto py-4"
            >
              <MessageSquare className="w-6 h-6 mb-2" />
              <span className="text-sm">Text Chat</span>
            </Button>
            <Button
              variant={resolutionType === 'voice' ? 'default' : 'outline'}
              onClick={() => setResolutionType('voice')}
              className="flex flex-col h-auto py-4"
            >
              <Mic className="w-6 h-6 mb-2" />
              <span className="text-sm">Voice Chat</span>
            </Button>
            <Button
              variant={resolutionType === 'video' ? 'default' : 'outline'}
              onClick={() => setResolutionType('video')}
              className="flex flex-col h-auto py-4"
            >
              <Video className="w-6 h-6 mb-2" />
              <span className="text-sm">New Video</span>
            </Button>
          </div>
        </Card>

        {/* Doubt Input */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Describe your doubt:</h3>
          <Textarea
            placeholder="What didn't you understand about this topic? Be specific..."
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            rows={5}
            className="mb-4"
          />
          <Button
            onClick={handleSubmitDoubt}
            disabled={isProcessing || !doubt.trim()}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Submit Doubt'}
          </Button>
        </Card>

        {/* Response */}
        {response && (
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <img
                src={avatar.image_url}
                alt="Tutor"
                className="w-8 h-8 rounded-full"
              />
              Your Tutor's Response:
            </h3>
            <p className="text-sm whitespace-pre-wrap">{response}</p>
            
            <div className="mt-6 flex gap-3">
              <Button onClick={handleResolve} className="flex-1">
                I Understand Now - Retry Quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResponse('');
                  setDoubt('');
                }}
              >
                Ask Another Question
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
