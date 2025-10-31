import { Quiz } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  quiz: Quiz;
  onComplete: (correct: boolean) => void;
}

export function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setSubmitted(true);
    const isCorrect = selectedAnswer === quiz.correctAnswer;
    setTimeout(() => onComplete(isCorrect), 2000);
  };

  const isCorrect = submitted && selectedAnswer === quiz.correctAnswer;
  const isWrong = submitted && selectedAnswer !== quiz.correctAnswer;

  return (
    <Card className="p-6 space-y-6 animate-slide-up">
      <div>
        <h3 className="font-semibold text-lg mb-4">{quiz.question}</h3>
        
        <div className="space-y-3">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              disabled={submitted}
              onClick={() => setSelectedAnswer(index)}
              className={cn(
                'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
                'hover:shadow-card disabled:cursor-not-allowed',
                selectedAnswer === index && !submitted && 'border-primary bg-primary/5',
                submitted && index === quiz.correctAnswer && 'border-success bg-success/10',
                submitted && index === selectedAnswer && index !== quiz.correctAnswer && 'border-destructive bg-destructive/10'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{String.fromCharCode(65 + index)}. {option}</span>
                {submitted && index === quiz.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
                {submitted && index === selectedAnswer && index !== quiz.correctAnswer && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {!submitted && (
        <Button
          size="lg"
          variant="hero"
          className="w-full"
          disabled={selectedAnswer === null}
          onClick={handleSubmit}
        >
          Submit Answer
        </Button>
      )}

      {submitted && (
        <div
          className={cn(
            'p-4 rounded-lg animate-slide-up',
            isCorrect ? 'bg-success/10 border-2 border-success' : 'bg-destructive/10 border-2 border-destructive'
          )}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={cn('font-semibold mb-1', isCorrect ? 'text-success' : 'text-destructive')}>
                {isCorrect ? 'Correct! 🎉' : 'Not quite right!'}
              </p>
              <p className="text-sm text-foreground">{quiz.feedback}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
