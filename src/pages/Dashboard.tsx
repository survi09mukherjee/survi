import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressCard } from '@/components/ProgressCard';
import { Badge } from '@/components/ui/badge';
import { DEMO_USER, AVATARS, BADGES } from '@/data/mockData';
import { Settings, BookOpen, MessageSquare, User } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = DEMO_USER;
  const selectedAvatar = AVATARS.find(a => a.id === currentUser.avatarId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-2xl shadow-soft">
              {selectedAvatar?.image || '🤖'}
            </div>
            <div>
              <h2 className="font-semibold">Hi, {currentUser.name}! 👋</h2>
              <p className="text-sm text-muted-foreground">Grade {currentUser.grade.replace('class-', '').toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <Card className="p-8 bg-gradient-hero text-primary-foreground shadow-float animate-slide-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Ready to Learn Today?</h1>
              <p className="text-primary-foreground/90 mb-4">
                You're on a {currentUser.streak}-day streak! Keep it going! 🔥
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/lesson')}
                className="shadow-soft"
              >
                <BookOpen className="mr-2" />
                Start Today's Lesson
              </Button>
            </div>
            <div className="text-7xl animate-bounce-subtle">
              {selectedAvatar?.image || '🤖'}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            className="p-6 cursor-pointer hover:shadow-float transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/multiplication')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                ✖️
              </div>
              <div>
                <h3 className="font-semibold mb-1">Multiplication Mastery</h3>
                <p className="text-sm text-muted-foreground">
                  Learn multiplication step-by-step
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-float transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/chat')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Chat with Tutor</h3>
                <p className="text-sm text-muted-foreground">
                  Ask questions anytime
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-float transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/character-generator')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-2xl">
                ✨
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create Character</h3>
                <p className="text-sm text-muted-foreground">
                  Design your AI tutor avatar
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-float transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/lesson-library')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                📚
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lesson Library</h3>
                <p className="text-sm text-muted-foreground">
                  Browse all lessons
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <ProgressCard
            streak={currentUser.streak}
            accuracy={currentUser.accuracy}
            lessonsCompleted={currentUser.lessonsCompleted}
            timeSpentThisWeek={12}
          />
        </div>

        {/* Badges Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
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
      </main>
    </div>
  );
}
