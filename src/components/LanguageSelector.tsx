import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LANGUAGES } from '@/data/languages';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  selected: string;
  onSelect: (code: string) => void;
  compact?: boolean;
}

export function LanguageSelector({ selected, onSelect, compact = false }: LanguageSelectorProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={selected === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(lang.code)}
            className="gap-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {selected === lang.code && <Check className="w-3 h-3" />}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {LANGUAGES.map((lang) => (
        <Card
          key={lang.code}
          className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
            selected === lang.code ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => onSelect(lang.code)}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{lang.flag}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">{lang.name}</div>
              <div className="text-xs text-muted-foreground">{lang.nativeName}</div>
            </div>
            {selected === lang.code && (
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
