import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, Globe, Volume2, Shield, Bell, Moon } from 'lucide-react';
import { DEMO_USER } from '@/data/mockData';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'bn'>(DEMO_USER.language);
  const [voiceSpeed, setVoiceSpeed] = useState([1]);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [parentalControls, setParentalControls] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
    navigate('/dashboard');
  };

  const handleLanguageChange = (value: string) => {
    if (value === 'en' || value === 'bn') {
      setLanguage(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ChevronLeft />
              </Button>
              <h1 className="text-xl font-semibold">Settings</h1>
            </div>
            <Button variant="hero" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Language Settings */}
        <Card className="p-6 shadow-card animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Language & Translation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred learning language
                </p>
              </div>
              <div className="space-y-2">
                <Label>Interface Language</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Voice Settings */}
        <Card className="p-6 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Voice Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust how the AI tutor speaks
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Voice Speed</Label>
                    <span className="text-sm text-muted-foreground">{voiceSpeed[0]}x</span>
                  </div>
                  <Slider
                    value={voiceSpeed}
                    onValueChange={setVoiceSpeed}
                    min={0.5}
                    max={2}
                    step={0.25}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Test Voice
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Parental Controls */}
        <Card className="p-6 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Safety & Parental Controls</h3>
                <p className="text-sm text-muted-foreground">
                  Manage safety features and monitoring
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Content Filtering</Label>
                    <p className="text-xs text-muted-foreground">Filter age-inappropriate content</p>
                  </div>
                  <Switch checked={parentalControls} onCheckedChange={setParentalControls} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chat Logging</Label>
                    <p className="text-xs text-muted-foreground">Save conversations for review</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Button variant="outline" size="sm">
                  Export Chat History
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get reminders for daily lessons
                  </p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce eye strain in low light
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </div>
        </Card>

        {/* Premium Placeholder */}
        <Card className="p-6 shadow-card bg-gradient-hero text-primary-foreground">
          <h3 className="font-semibold mb-2">Unlock Premium Features 🌟</h3>
          <p className="text-sm text-primary-foreground/90 mb-4">
            Get access to more avatars, advanced subjects, and personalized learning paths
          </p>
          <Button variant="secondary" size="sm">
            Learn More
          </Button>
        </Card>
      </main>
    </div>
  );
}
