import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character } from '@/types/video';
import { Lock, Check } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  selected?: boolean;
  onSelect?: () => void;
}

export function CharacterCard({ character, selected = false, onSelect }: CharacterCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:scale-105 ${
        selected ? 'ring-2 ring-primary shadow-lg' : ''
      } ${!character.unlocked ? 'opacity-60' : ''}`}
      onClick={character.unlocked ? onSelect : undefined}
    >
      <div className="relative">
        <div className="w-full aspect-square rounded-lg bg-gradient-hero flex items-center justify-center text-6xl mb-3">
          {character.image}
        </div>
        {!character.unlocked && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
        {selected && character.unlocked && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
      <h3 className="font-semibold mb-1">{character.name}</h3>
      <div className="flex gap-2 mb-2">
        <Badge variant="secondary" className="text-xs">
          {character.type}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {character.tone}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{character.style}</p>
    </Card>
  );
}
