import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Wand2, Sparkles, Volume2, Mic, Upload, RotateCw, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AnimateCharacterTeaching from '@/components/AnimateCharacterTeaching';

type Step = 'input' | 'processing' | 'preview' | 'upload' | 'confirm';
type ProcessingStage = 'searching' | 'removing' | 'rendering' | 'complete';

export default function CharacterGenerator() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('input');
  const [characterName, setCharacterName] = useState('');
  const [characterType, setCharacterType] = useState<'cartoon' | 'anime' | 'realistic'>('cartoon');
  const [tone, setTone] = useState<'funny' | 'calm' | 'motivational' | 'storyteller'>('funny');
  const [voiceLanguage, setVoiceLanguage] = useState('en');
  const [pose, setPose] = useState('wave');
  const [outfit, setOutfit] = useState('default');
  const [generatedCharacter, setGeneratedCharacter] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('searching');
  const [isListening, setIsListening] = useState(false);
  const [isCopyrighted, setIsCopyrighted] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [hasImageRights, setHasImageRights] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exampleCharacters = [
    'Doraemon', 'Chhota Bheem', 'Naruto', 'Harry Potter', 'Batman', 'Shinchan'
  ];

  const handleGenerate = async () => {
    if (!characterName.trim()) {
      toast.error('Please enter a character name');
      return;
    }

    const lowerName = characterName.toLowerCase();
    const copyrightedNames = ['doraemon', 'naruto', 'harry potter', 'batman', 'shinchan', 'chhota bheem', 'pokemon', 'mickey mouse', 'spider-man', 'iron man', 'thor', 'hulk', 'nobita', 'sinchan', 'gojo satoru', 'goku', 'luffy', 'pikachu'];
    
    if (copyrightedNames.some(name => lowerName.includes(name))) {
      setIsCopyrighted(true);
      setShowLegalModal(true);
    }

    setStep('processing');
    setIsGenerating(true);
    setGeneratedCharacter(null);

    try {
      // Simulate processing stages
      setProcessingStage('searching');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStage('removing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProcessingStage('rendering');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { data, error } = await supabase.functions.invoke('generate-character', {
        body: {
          characterName: characterName.trim(),
          characterType,
          tone,
          style: outfit,
          pose,
        },
      });

      if (error) {
        console.error('Error generating character:', error);
        toast.error('Failed to generate character. Please try again.');
        setStep('input');
        return;
      }

      if (data?.imageUrl) {
        setGeneratedCharacter(data.imageUrl);
        setProcessingStage('complete');
        setStep('preview');
        toast.success(data.message || 'Character generated successfully!');
      } else {
        toast.error('No character image was generated');
        setStep('input');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      setStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
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

  const handleTestVoice = () => {
    toast.info(`Testing ${voiceLanguage} voice for ${characterName || 'character'}`);
    // Mock voice preview
  };

  const handleRegenerate = () => {
    setStep('input');
    setGeneratedCharacter(null);
  };

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setStep('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = async () => {
    if (!hasImageRights) {
      toast.error('Please confirm you have rights to use this image');
      return;
    }
    
    setStep('processing');
    setIsGenerating(true);
    
    // Simulate processing
    setProcessingStage('removing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessingStage('rendering');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGeneratedCharacter(uploadedImage);
    setIsCopyrighted(false);
    setStep('preview');
    setIsGenerating(false);
  };

  const handleUseTutor = () => {
    toast.success('Tutor assigned to your profile!');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create My Tutor
          </h1>
          <p className="text-muted-foreground">
            Design your perfect AI learning companion
          </p>
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
          <Card className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="characterName" className="text-lg">Type character name</Label>
                <div className="flex gap-2">
                  <Input
                    id="characterName"
                    placeholder="e.g., Doraemon, Harry Potter, Batman..."
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleVoiceInput}
                    className={isListening ? 'animate-pulse bg-primary/20' : ''}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Popular characters</Label>
                <div className="flex flex-wrap gap-2">
                  {exampleCharacters.map((char) => (
                    <Button
                      key={char}
                      variant="outline"
                      size="sm"
                      onClick={() => setCharacterName(char)}
                    >
                      {char}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Character Type</Label>
                  <Select value={characterType} onValueChange={(value: any) => setCharacterType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="realistic">Realistic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Teaching Tone</Label>
                  <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funny">Funny & Playful</SelectItem>
                      <SelectItem value="calm">Calm & Patient</SelectItem>
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="storyteller">Storyteller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!characterName.trim()}
                className="w-full"
                size="lg"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Find/Create Tutor
              </Button>

              <p className="text-xs text-center text-muted-foreground border-t pt-4">
                <strong>Note:</strong> If you choose a copyrighted character, the app will simulate a learning avatar. 
                For real use, upload an image you own or ensure licensing.
              </p>
            </div>
          </Card>
        )}

        {/* Step 2: Processing */}
        {step === 'processing' && (
          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Creating Your Tutor</h3>
                <p className="text-muted-foreground">
                  {processingStage === 'searching' && 'Searching web references...'}
                  {processingStage === 'removing' && 'Removing background...'}
                  {processingStage === 'rendering' && 'Rendering 3D preview...'}
                </p>
              </div>

              <div className="flex justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${processingStage === 'searching' ? 'bg-primary animate-bounce' : 'bg-muted'}`} />
                <div className={`w-2 h-2 rounded-full ${processingStage === 'removing' ? 'bg-primary animate-bounce' : 'bg-muted'}`} style={{ animationDelay: '0.1s' }} />
                <div className={`w-2 h-2 rounded-full ${processingStage === 'rendering' ? 'bg-primary animate-bounce' : 'bg-muted'}`} style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && generatedCharacter && (
          <Card className="p-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('input')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="space-y-6">
              {isCopyrighted && (
                <Badge variant="outline" className="w-full justify-center py-2">
                  Simulated avatar — not the original IP
                </Badge>
              )}

              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={generatedCharacter} 
                  alt="Generated character" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Pose</Label>
                  <Select value={pose} onValueChange={setPose}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="nod">Nod</SelectItem>
                      <SelectItem value="point">Point</SelectItem>
                      <SelectItem value="thumbs-up">Thumbs Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Outfit</Label>
                  <Select value={outfit} onValueChange={setOutfit}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="sporty">Sporty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Language</Label>
                  <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleTestVoice}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Preview Voice
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload My Image
                </Button>
              </div>

              <Button
                onClick={handleUseTutor}
                size="lg"
                className="w-full"
              >
                Use as My Tutor
              </Button>

              {/* Animate Character to Teach Section */}
              <AnimateCharacterTeaching
                characterImage={generatedCharacter}
                characterName={characterName}
              />
            </div>
          </Card>
        )}

        {/* Step 4: Upload */}
        {step === 'upload' && (
          <Card className="p-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('preview')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Upload Your Image</h3>
                <p className="text-sm text-muted-foreground">
                  Upload an image you own or have licensing rights to use
                </p>
              </div>

              {uploadedImage && (
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox 
                  id="rights" 
                  checked={hasImageRights}
                  onCheckedChange={(checked) => setHasImageRights(checked as boolean)}
                />
                <Label htmlFor="rights" className="text-sm leading-relaxed cursor-pointer">
                  I confirm I have the legal rights to use this image for creating an AI tutor avatar
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Different Image
                </Button>
                <Button
                  onClick={handleConfirmUpload}
                  disabled={!hasImageRights}
                  className="flex-1"
                >
                  Process Image
                </Button>
              </div>
            </div>
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleUploadImage}
          className="hidden"
        />

        {/* Legal Modal */}
        <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Copyright Notice</DialogTitle>
              <DialogDescription className="space-y-3 pt-2">
                <p>
                  The character you've requested may be protected by copyright. 
                  This app will create a simulated learning avatar inspired by the character's style.
                </p>
                <p>
                  For commercial use or exact character likeness, please:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Upload your own image</li>
                  <li>Ensure you have proper licensing</li>
                  <li>Use generic character designs</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowLegalModal(false)}>
              I Understand
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
