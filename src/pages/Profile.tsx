import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressCard } from '@/components/ProgressCard';
import { DEMO_USER, AVATARS, BADGES } from '@/data/mockData';
import { ChevronLeft, Edit } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const currentUser = DEMO_USER;
  const selectedAvatar = AVATARS.find(a => a.id === currentUser.avatarId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="mr-2" />
              Back
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="p-8 text-center shadow-card animate-slide-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-hero shadow-float mb-4 text-5xl">
            {selectedAvatar?.image || '👤'}
          </div>
          <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
          <p className="text-muted-foreground mb-4">Grade {currentUser.grade} Student</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div>
              <span className="font-semibold text-2xl text-primary">{currentUser.streak}</span>
              <p className="text-muted-foreground">Day Streak 🔥</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <span className="font-semibold text-2xl text-success">{currentUser.accuracy}%</span>
              <p className="text-muted-foreground">Accuracy ✨</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <span className="font-semibold text-2xl text-secondary">{currentUser.lessonsCompleted}</span>
              <p className="text-muted-foreground">Lessons Done 📚</p>
            </div>
          </div>
        </Card>

        {/* Current Tutor */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your AI Tutor</h2>
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-4xl">
                {selectedAvatar?.image || '🤖'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{selectedAvatar?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedAvatar?.tone}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedAvatar?.description}</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/avatar-select')}>
                Change
              </Button>
            </div>
          </Card>
        </div>

        {/* Progress Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Learning Stats</h2>
          <ProgressCard
            streak={currentUser.streak}
            accuracy={currentUser.accuracy}
            lessonsCompleted={currentUser.lessonsCompleted}
            timeSpentThisWeek={12}
          />
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Achievements ({currentUser.badges.length}/{BADGES.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {BADGES.map((badge) => {
              const earned = currentUser.badges.includes(badge.id);
              return (
                <Card
                  key={badge.id}
                  className={`p-4 text-center transition-all duration-200 ${
                    earned ? 'shadow-soft hover:shadow-float' : 'opacity-40'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Learning Preferences */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Preferences</h2>
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Language</h3>
                <p className="text-sm text-muted-foreground">
                  {currentUser.language === 'en' ? 'English' : 'বাংলা (Bengali)'}
                </p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Voice Speed</h3>
                <p className="text-sm text-muted-foreground">Normal</p>
              </div>
              <Button variant="outline" size="sm">Adjust</Button>
            </div>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Parental Controls</h3>
                <p className="text-sm text-muted-foreground">Enabled</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
