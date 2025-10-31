import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ChevronLeft, ArrowRight, Languages } from 'lucide-react';
import { LANGUAGES, getLanguageByCode } from '@/data/languages';
import { toast } from 'sonner';

export default function LanguageHub() {
  const navigate = useNavigate();
  const [primaryLanguage, setPrimaryLanguage] = useState('en');
  const [secondaryLanguage, setSecondaryLanguage] = useState('hi');
  const [bilingualMode, setBilingualMode] = useState(false);

  const handleSave = () => {
    toast.success('Language preferences saved!');
    navigate('/dashboard');
  };

  const primaryLang = getLanguageByCode(primaryLanguage);
  const secondaryLang = getLanguageByCode(secondaryLanguage);

  const sampleText = {
    en: "The water cycle is the continuous movement of water on, above, and below Earth's surface.",
    hi: "जल चक्र पृथ्वी की सतह पर, ऊपर और नीचे जल की निरंतर गति है।",
    ta: "நீர் சுழற்சி என்பது பூமியின் மேற்பரப்பில், மேலே மற்றும் கீழே நீரின் தொடர்ச்சியான இயக்கமாகும்.",
    te: "నీటి చక్రం భూమి యొక్క ఉపరితలంపై, పైన మరియు క్రింద నీటి నిరంతర కదలిక.",
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
                <h1 className="text-xl font-bold">Language Hub</h1>
                <p className="text-sm text-muted-foreground">
                  Learn in any Indian language, switch anytime
                </p>
              </div>
            </div>
            <Button variant="hero" onClick={handleSave}>
              Save Preferences
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Primary Language Selection */}
        <Card className="p-6 shadow-card animate-slide-up">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Languages className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Primary Learning Language</h2>
              <p className="text-sm text-muted-foreground">
                This will be your main language for lessons, subtitles, and voice
              </p>
            </div>
          </div>
          <LanguageSelector selected={primaryLanguage} onSelect={setPrimaryLanguage} />
        </Card>

        {/* Bilingual Mode */}
        <Card className="p-6 shadow-card">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">Bilingual Learning Mode</h2>
                <p className="text-sm text-muted-foreground">
                  Enable to see lessons in two languages side-by-side
                </p>
              </div>
            </div>
            <Switch checked={bilingualMode} onCheckedChange={setBilingualMode} />
          </div>

          {bilingualMode && (
            <div className="animate-slide-up space-y-4">
              <Label>Secondary Language</Label>
              <LanguageSelector
                selected={secondaryLanguage}
                onSelect={setSecondaryLanguage}
                compact
              />
            </div>
          )}
        </Card>

        {/* Live Preview */}
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Live Preview</h3>
          <div className="space-y-4">
            {/* Primary Language Sample */}
            <div className="p-4 rounded-lg bg-primary/5 border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{primaryLang?.flag}</span>
                <span className="font-medium">{primaryLang?.name}</span>
              </div>
              <p className="text-sm">
                {sampleText[primaryLanguage as keyof typeof sampleText] || sampleText.en}
              </p>
            </div>

            {/* Bilingual Mode Sample */}
            {bilingualMode && (
              <>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="p-4 rounded-lg bg-secondary/10 border-2 border-secondary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{secondaryLang?.flag}</span>
                    <span className="font-medium">{secondaryLang?.name}</span>
                  </div>
                  <p className="text-sm">
                    {sampleText[secondaryLanguage as keyof typeof sampleText] || sampleText.hi}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="font-semibold mb-2">Video Lessons</h3>
            <p className="text-xs text-muted-foreground">
              Watch animated lessons with subtitles in your language
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
            <div className="text-4xl mb-3">🎙️</div>
            <h3 className="font-semibold mb-2">Voice Chat</h3>
            <p className="text-xs text-muted-foreground">
              Talk to AI Tutor in your preferred language
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-all cursor-pointer">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-semibold mb-2">Translate Lessons</h3>
            <p className="text-xs text-muted-foreground">
              Instantly switch any lesson to another language
            </p>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="p-6 bg-gradient-hero text-primary-foreground">
          <h3 className="font-bold text-lg mb-2">🌟 Unlock All Languages</h3>
          <p className="text-sm text-primary-foreground/90 mb-4">
            Access premium features to learn in all 22 Indian languages with advanced voice recognition
          </p>
          <Button variant="secondary" size="sm">
            Upgrade to Premium
          </Button>
        </Card>
      </main>
    </div>
  );
}
