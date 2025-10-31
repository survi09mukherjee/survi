import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, Trophy, Clock } from 'lucide-react';

interface ProgressCardProps {
  streak: number;
  accuracy: number;
  lessonsCompleted: number;
  timeSpentThisWeek: number;
}

export function ProgressCard({ streak, accuracy, lessonsCompleted, timeSpentThisWeek }: ProgressCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-float transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Learning Streak</p>
            <p className="text-2xl font-bold text-secondary">{streak} days</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Keep it going! 🔥</p>
      </Card>

      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-float transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Quiz Accuracy</p>
            <p className="text-2xl font-bold text-success">{accuracy}%</p>
          </div>
        </div>
        <Progress value={accuracy} className="h-2" />
      </Card>

      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-float transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lessons Done</p>
            <p className="text-2xl font-bold text-primary">{lessonsCompleted}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Amazing progress! 🌟</p>
      </Card>

      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-float transition-all duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">{timeSpentThisWeek}h</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Time well spent! ⏰</p>
      </Card>
    </div>
  );
}
