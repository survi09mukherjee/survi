import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatBubbleProps {
  message: Message;
  avatarImage?: string;
  onPlayAudio?: () => void;
}

export function ChatBubble({ message, avatarImage, onPlayAudio }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 animate-slide-up', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-2xl">
          {avatarImage || '🤖'}
        </div>
      )}
      
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 shadow-card',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-card rounded-tl-none'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        {!isUser && message.audioUrl && (
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 h-7 text-xs"
            onClick={onPlayAudio}
          >
            <Volume2 className="w-3 h-3 mr-1" />
            Play audio
          </Button>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-2xl">
          👤
        </div>
      )}
    </div>
  );
}
