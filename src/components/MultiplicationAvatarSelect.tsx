import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Mic, Loader2 } from 'lucide-react';

interface MultiplicationAvatarSelectProps {
  onComplete: (avatar: any) => void;
}

const CHARACTER_EXAMPLES = [
  'Doraemon', 'Chhota Bheem', 'Nobita', 'Shinchan', 
  'Naruto', 'Goku', 'Harry Potter', 'Batman'
];

export default function MultiplicationAvatarSelect({ onComplete }: MultiplicationAvatarSelectProps) {
  const { toast } = useToast();
  const [characterName, setCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive"
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCharacterName(transcript);
    };
    recognition.start();
  };

  const handleGenerate = async () => {
    if (!characterName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a character name",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase.functions.invoke('generate-character', {
        body: {
          characterName: characterName,
          characterType: 'cartoon',
          tone: 'motivational',
          style: 'friendly teacher',
          pose: 'wave'
        }
      });

      if (error) throw error;

      // Prepare avatar data
      const avatarData = {
        character_name: characterName,
        character_type: 'cartoon',
        tone: 'motivational',
        image_url: data.imageUrl,
        is_active: true
      };

      // Save avatar to database only if authenticated
      if (user) {
        const { data: savedAvatar, error: avatarError } = await supabase
          .from('user_avatars')
          .insert({
            user_id: user.id,
            ...avatarData
          })
          .select()
          .single();

        if (!avatarError && savedAvatar) {
          onComplete(savedAvatar);
        } else {
          onComplete(avatarData);
        }
      } else {
        onComplete(avatarData);
      }

      toast({
        title: "Success! 🎉",
        description: `${characterName} is ready to teach!`
      });
    } catch (error) {
      console.error('Error generating avatar:', error);
      toast({
        title: "Error",
        description: "Failed to generate avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Learning Avatar</h1>
          <p className="text-muted-foreground">
            Choose your favorite character to be your multiplication tutor!
          </p>
        </div>

        {/* Character Input */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Type character name (e.g., Doraemon, Naruto)"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="flex-1"
              disabled={isGenerating}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isGenerating || isListening}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
            </Button>
          </div>

          {/* Example Characters */}
          <div className="flex flex-wrap gap-2">
            {CHARACTER_EXAMPLES.map((char) => (
              <Button
                key={char}
                variant="outline"
                size="sm"
                onClick={() => setCharacterName(char)}
                disabled={isGenerating}
              >
                {char}
              </Button>
            ))}
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6 text-sm text-muted-foreground">
          <p className="mb-2">
            ℹ️ <strong>Important:</strong> The generated avatar will be a 3D representation 
            inspired by your chosen character for educational purposes.
          </p>
          <p>
            For copyrighted characters, we create similar-styled avatars while respecting 
            intellectual property rights.
          </p>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !characterName.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Your Tutor...
            </>
          ) : (
            'Generate My Tutor'
          )}
        </Button>
      </Card>
    </div>
  );
}
