import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Mic, Loader2, Upload } from 'lucide-react';
import AnimateCharacterTeaching from '@/components/AnimateCharacterTeaching';

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
  const [generatedAvatar, setGeneratedAvatar] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setUploadedImage(imageUrl);
      setCharacterName(file.name.split('.')[0] || 'My Character');
      
      const avatarData = {
        character_name: file.name.split('.')[0] || 'My Character',
        character_type: 'uploaded',
        tone: 'motivational',
        image_url: imageUrl,
        is_active: true
      };
      
      setGeneratedAvatar(avatarData);
      
      toast({
        title: "Success! 🎉",
        description: "Avatar uploaded successfully!"
      });
    };
    reader.readAsDataURL(file);
  };

  const generateWithCharacter = async (charName: string) => {
    setIsGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase.functions.invoke('generate-character', {
        body: {
          characterName: charName,
          characterType: 'cartoon',
          tone: 'motivational',
          style: 'friendly teacher',
          pose: 'wave'
        }
      });

      if (error) throw error;

      // Prepare avatar data
      const avatarData = {
        character_name: charName,
        character_type: 'cartoon',
        tone: 'motivational',
        image_url: data.imageUrl,
        is_active: true
      };

      setGeneratedAvatar(avatarData);

      toast({
        title: "Success! 🎉",
        description: `${charName} is ready to teach!`
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

  const handleGenerate = async () => {
    if (!characterName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a character name",
        variant: "destructive"
      });
      return;
    }
    await generateWithCharacter(characterName);
  };

  const handleContinueWithoutAvatar = async () => {
    const randomChar = CHARACTER_EXAMPLES[Math.floor(Math.random() * CHARACTER_EXAMPLES.length)];
    setCharacterName(randomChar);
    await generateWithCharacter(randomChar);
  };

  const handleCompleteWithAvatar = async () => {
    if (!generatedAvatar) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: savedAvatar, error: avatarError } = await supabase
        .from('user_avatars')
        .insert({
          user_id: user.id,
          ...generatedAvatar
        })
        .select()
        .single();

      if (!avatarError && savedAvatar) {
        onComplete(savedAvatar);
      } else {
        onComplete(generatedAvatar);
      }
    } else {
      onComplete(generatedAvatar);
    }
  };

  // Show animation component if avatar is generated
  if (generatedAvatar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Avatar Preview */}
          <Card className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Your Learning Avatar</h2>
              <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden border-4 border-primary/20">
                <img 
                  src={generatedAvatar.image_url} 
                  alt={generatedAvatar.character_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-lg font-semibold">{generatedAvatar.character_name}</p>
              <Button onClick={handleCompleteWithAvatar} size="lg" className="w-full max-w-md">
                Continue to Lessons
              </Button>
            </div>
          </Card>

          {/* Animate Character Teaching Section */}
          <AnimateCharacterTeaching 
            characterImage={generatedAvatar.image_url}
            characterName={generatedAvatar.character_name}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Learning Avatar</h1>
          <p className="text-muted-foreground">
            Choose your favorite character to be your multiplication tutor!
          </p>
        </div>

        {/* Upload Avatar Option */}
        <div className="mb-8">
          <label htmlFor="avatar-upload">
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all">
              <Upload className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p className="text-lg font-semibold mb-1">Upload Your Avatar</p>
              <p className="text-sm text-muted-foreground">
                Click to upload an image (PNG, JPG, JPEG)
              </p>
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isGenerating}
            />
          </label>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground/20"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or generate AI avatar</span>
          </div>
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

        {/* Generate Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !characterName.trim()}
            className="flex-1"
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
          <Button
            onClick={handleContinueWithoutAvatar}
            disabled={isGenerating}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Continue without avatar
          </Button>
        </div>
      </Card>
    </div>
  );
}
