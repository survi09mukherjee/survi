import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChatBubble } from '@/components/ChatBubble';
import { Message } from '@/types';
import { AVATARS, DEMO_USER, TUTOR_RESPONSES } from '@/data/mockData';
import { ChevronLeft, Mic, MicOff, Send } from 'lucide-react';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: TUTOR_RESPONSES.greeting,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const selectedAvatar = AVATARS.find(a => a.id === DEMO_USER.avatarId);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Mock AI response
    setTimeout(() => {
      const randomResponse = TUTOR_RESPONSES.encouragement[
        Math.floor(Math.random() * TUTOR_RESPONSES.encouragement.length)
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse + ' What would you like to learn more about?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop voice recording
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex flex-col">
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
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-2xl">
                {selectedAvatar?.image || '🤖'}
              </div>
              <div>
                <h2 className="font-semibold">{selectedAvatar?.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedAvatar?.tone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isListening && (
                <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Listening...
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              avatarImage={selectedAvatar?.image}
            />
          ))}
        </div>
      </main>

      {/* Input Area */}
      <div className="bg-card/80 backdrop-blur-sm border-t shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant={isListening ? "default" : "secondary"}
              className="rounded-full flex-shrink-0"
              onClick={toggleVoice}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question or use voice..."
              className="flex-1 px-4 py-3 rounded-full bg-muted border-none outline-none text-sm"
            />
            
            <Button
              size="icon"
              variant="hero"
              className="rounded-full flex-shrink-0"
              onClick={handleSend}
              disabled={!inputText.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            Press and hold the mic button to speak
          </p>
        </div>
      </div>
    </div>
  );
}
