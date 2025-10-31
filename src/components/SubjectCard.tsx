import { Card } from '@/components/ui/card';
import { Subject } from '@/data/subjects';
import { ArrowRight } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  lessonsCount: number;
  onClick: () => void;
}

export function SubjectCard({ subject, lessonsCount, onClick }: SubjectCardProps) {
  return (
    <Card
      className="p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-xl group"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center text-3xl flex-shrink-0`}>
          {subject.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{subject.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{subject.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-primary">{lessonsCount} lessons</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Card>
  );
}
