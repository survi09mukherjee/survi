import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizCard } from '@/components/QuizCard';
import { ChatBubble } from '@/components/ChatBubble';
import { SAMPLE_LESSON, AVATARS, DEMO_USER, TUTOR_RESPONSES } from '@/data/mockData';
import { Message } from '@/types';
import { ChevronLeft, Lightbulb, Repeat, BookText, MessageCircle, Mic } from 'lucide-react';
import { toast } from 'sonner';
import lessonImage from '@/assets/lesson-fractions.jpg';

export default function Lesson() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(33);
  const [showQuiz, setShowQuiz] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: TUTOR_RESPONSES.greeting,
      timestamp: new Date(),
    },
  ]);

  const selectedAvatar = AVATARS.find(a => a.id === DEMO_USER.avatarId);

  const handleHint = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: TUTOR_RESPONSES.hint,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    toast.info('Hint added to chat');
  };

  const handleRepeat = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: TUTOR_RESPONSES.repeat,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const handleExample = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: TUTOR_RESPONSES.example,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    toast.success('Example added!');
  };

  const handleQuizComplete = (correct: boolean) => {
    if (correct) {
      toast.success('Excellent work! 🎉');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      toast.error('Try again! You can do it! 💪');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="mr-2" />
              Back
            </Button>
            <div className="text-sm font-medium">{progress}% Complete</div>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-lg">{SAMPLE_LESSON.topic}</h1>
            <p className="text-sm text-muted-foreground">{SAMPLE_LESSON.subject}</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Lesson Content */}
        {!showQuiz && (
          <>
            <Card className="p-6 shadow-card animate-slide-up">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-2xl flex-shrink-0">
                  {selectedAvatar?.image || '🤖'}
                </div>
                <div>
                  <h2 className="font-semibold mb-2">{selectedAvatar?.name} is teaching:</h2>
                  <div className="prose prose-sm max-w-none">
                    <img
                      src={lessonImage}
                      alt="Fractions illustration"
                      className="w-full rounded-lg mb-4"
                    />
                    <p className="whitespace-pre-wrap">{SAMPLE_LESSON.content}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" onClick={handleHint} className="justify-start">
                <Lightbulb className="mr-2" />
                Give me a hint
              </Button>
              <Button variant="outline" onClick={handleRepeat} className="justify-start">
                <Repeat className="mr-2" />
                Explain again
              </Button>
              <Button variant="outline" onClick={handleExample} className="justify-start">
                <BookText className="mr-2" />
                Show example
              </Button>
            </div>

            {/* Chat Messages */}
            {messages.length > 1 && (
              <Card className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    avatarImage={selectedAvatar?.image}
                  />
                ))}
              </Card>
            )}

            {/* Continue Button */}
            <Button
              size="lg"
              variant="hero"
              className="w-full"
              onClick={() => {
                setShowQuiz(true);
                setProgress(66);
              }}
            >
              I'm ready for the quiz!
            </Button>
          </>
        )}

        {/* Quiz Section */}
        {showQuiz && (
          <QuizCard
            quiz={SAMPLE_LESSON.quiz}
            onComplete={handleQuizComplete}
          />
        )}

        {/* Voice Input (Mock) */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="secondary" className="rounded-full">
              <Mic className="w-5 h-5" />
            </Button>
            <input
              type="text"
              placeholder="Type your question or press mic to speak..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  const userMessage: Message = {
                    id: Date.now().toString(),
                    role: 'user',
                    content: e.currentTarget.value,
                    timestamp: new Date(),
                  };
                  setMessages([...messages, userMessage]);
                  
                  // Mock AI response
                  setTimeout(() => {
                    const aiMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      role: 'assistant',
                      content: TUTOR_RESPONSES.encouragement[Math.floor(Math.random() * TUTOR_RESPONSES.encouragement.length)],
                      timestamp: new Date(),
                    };
                    setMessages(prev => [...prev, aiMessage]);
                  }, 1000);
                  
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button size="icon" variant="ghost">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
