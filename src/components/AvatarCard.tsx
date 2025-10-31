import { Avatar } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarCardProps {
  avatar: Avatar;
  selected?: boolean;
  onClick?: () => void;
}

export function AvatarCard({ avatar, selected, onClick }: AvatarCardProps) {
  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-200 hover:shadow-float hover:scale-105 p-6',
        selected && 'ring-2 ring-primary shadow-float',
        !avatar.unlocked && 'opacity-60'
      )}
      onClick={onClick}
    >
      {!avatar.unlocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="text-6xl animate-bounce-subtle">
          {avatar.image}
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{avatar.name}</h3>
          <Badge variant="secondary" className="font-normal">
            {avatar.tone}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {avatar.description}
        </p>
      </div>
    </Card>
  );
}
