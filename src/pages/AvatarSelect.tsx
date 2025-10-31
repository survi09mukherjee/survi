import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AvatarCard } from '@/components/AvatarCard';
import { AVATARS, DEMO_USER } from '@/data/mockData';
import { ChevronLeft } from 'lucide-react';

export default function AvatarSelect() {
  const navigate = useNavigate();
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(DEMO_USER.avatarId);

  const handleContinue = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    localStorage.setItem('currentUser', JSON.stringify({
      ...currentUser,
      avatarId: selectedAvatarId,
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="mr-2" />
          Back
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Choose Your AI Tutor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each tutor has a unique teaching style. Pick the one that feels right for you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {AVATARS.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              selected={selectedAvatarId === avatar.id}
              onClick={() => avatar.unlocked && setSelectedAvatarId(avatar.id)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            variant="hero"
            onClick={handleContinue}
            className="w-full max-w-md"
          >
            Start Learning with {AVATARS.find(a => a.id === selectedAvatarId)?.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
