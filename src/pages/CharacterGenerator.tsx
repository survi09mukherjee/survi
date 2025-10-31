import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Sparkles, Play } from 'lucide-react';
import { toast } from 'sonner';
import { LANGUAGES } from '@/data/languages';

export default function CharacterGenerator() {
  const navigate = useNavigate();
  const [characterType, setCharacterType] = useState<'cartoon' | 'anime' | 'realistic'>('cartoon');
  const [tone, setTone] = useState<'funny' | 'calm' | 'motivational' | 'storyteller'>('calm');
  const [voiceLang, setVoiceLang] = useState('en');
  const [style, setStyle] = useState('default');
  const [generatedCharacter, setGeneratedCharacter] = useState<string | null>(null);

  const characterEmojis = {
    cartoon: ['🧑‍🏫', '👨‍🔬', '👩‍🎨', '🧙‍♂️', '🦸‍♀️', '👨‍🚀'],
    anime: ['🎭', '⚡', '🌸', '🎌', '🗾', '🎏'],
    realistic: ['👨‍💼', '👩‍💻', '👨‍🎓', '👩‍🏫', '🧑‍🔬', '👨‍⚖️']
  };

  const stylePresets = {
    cartoon: ['Friendly Teacher', 'Super Hero', 'Magical Wizard', 'Space Explorer'],
    anime: ['Ninja Master', 'Samurai Sage', 'Kawaii Friend', 'Dragon Tamer'],
    realistic: ['Professor', 'Scientist', 'Mentor', 'Coach']
  };

  const handleGenerate = () => {
    const emojis = characterEmojis[characterType];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setGeneratedCharacter(randomEmoji);
    toast.success('Your AI Tutor has been created!');
  };

  const handleTestVoice = () => {
    const lang = LANGUAGES.find(l => l.code === voiceLang);
    toast.info(`Testing voice in ${lang?.name}...`, {
      description: 'Hello! I\'m your AI Tutor. Let\'s explore and learn together!'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ChevronLeft />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Character Generator</h1>
                <p className="text-sm text-muted-foreground">Create your perfect AI Tutor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Character Type */}
            <Card className="p-6 shadow-card animate-slide-up">
              <Label className="text-base font-semibold mb-4 block">Character Type</Label>
              <RadioGroup value={characterType} onValueChange={(v: any) => setCharacterType(v)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="cartoon" id="cartoon" />
                    <Label htmlFor="cartoon" className="flex-1 cursor-pointer">
                      <div className="font-medium">🎨 Cartoon</div>
                      <div className="text-xs text-muted-foreground">Fun and colorful animated style</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="anime" id="anime" />
                    <Label htmlFor="anime" className="flex-1 cursor-pointer">
                      <div className="font-medium">🎌 Anime</div>
                      <div className="text-xs text-muted-foreground">Japanese animation inspired</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="realistic" id="realistic" />
                    <Label htmlFor="realistic" className="flex-1 cursor-pointer">
                      <div className="font-medium">👨‍🏫 Realistic Mentor</div>
                      <div className="text-xs text-muted-foreground">Professional and relatable</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Teaching Tone */}
            <Card className="p-6 shadow-card">
              <Label className="text-base font-semibold mb-4 block">Teaching Tone</Label>
              <RadioGroup value={tone} onValueChange={(v: any) => setTone(v)}>
                <div className="grid grid-cols-2 gap-3">
                  {['funny', 'calm', 'motivational', 'storyteller'].map((t) => (
                    <div key={t} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem value={t} id={t} />
                      <Label htmlFor={t} className="cursor-pointer capitalize">{t}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            {/* Style Preset */}
            <Card className="p-6 shadow-card">
              <Label className="text-base font-semibold mb-4 block">Style Preset</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Style</SelectItem>
                  {stylePresets[characterType].map(s => (
                    <SelectItem key={s} value={s.toLowerCase().replace(' ', '-')}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Voice Language */}
            <Card className="p-6 shadow-card">
              <Label className="text-base font-semibold mb-4 block">Voice Language & Accent</Label>
              <Select value={voiceLang} onValueChange={setVoiceLang}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={handleTestVoice}>
                <Play className="w-4 h-4 mr-2" />
                Test Voice
              </Button>
            </Card>

            <Button size="lg" variant="hero" className="w-full" onClick={handleGenerate}>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate My AI Tutor
            </Button>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="p-8 shadow-card text-center">
              <Label className="text-base font-semibold mb-6 block">Character Preview</Label>
              <div className="bg-gradient-hero rounded-2xl p-12 mb-6">
                <div className="text-[160px] animate-bounce-subtle">
                  {generatedCharacter || '❓'}
                </div>
              </div>
              {generatedCharacter && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-xl font-bold">Your AI Tutor</h3>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <span className="font-medium capitalize">{characterType}</span>
                    <span>•</span>
                    <span className="capitalize">{tone}</span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {tone === 'funny' && "Hey there, superstar! Ready to have some fun while learning? Let's turn this lesson into an adventure!"}
                    {tone === 'calm' && "Hello! Take a deep breath. Learning is a journey, and I'm here to guide you every step of the way."}
                    {tone === 'motivational' && "You've got this, champion! Together, we're going to achieve amazing things. Let's get started!"}
                    {tone === 'storyteller' && "Gather around, young explorer! Every lesson is a story waiting to unfold. Let me take you on this journey..."}
                  </p>
                  <Button variant="hero" size="lg" onClick={() => navigate('/dashboard')}>
                    Start Learning Together
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gradient-subtle">
              <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                You can create multiple characters and switch between them based on the subject or your mood!
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
