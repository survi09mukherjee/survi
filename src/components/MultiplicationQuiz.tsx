import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MultiplicationQuizProps {
  topic: any;
  onComplete: (passed: boolean, score: number) => void;
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function MultiplicationQuiz({
  topic,
  onComplete,
  onBack
}: MultiplicationQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateQuestions();
  }, [topic]);

  const generateQuestions = () => {
    // Generate questions based on topic
    const generatedQuestions: Question[] = [
      {
        id: 1,
        question: `What is the result of multiplying two numbers in ${topic.title}?`,
        options: ['Sum', 'Product', 'Difference', 'Quotient'],
        correct: 1,
        explanation: 'The result of multiplication is called the product.'
      },
      {
        id: 2,
        question: 'If you multiply any number by zero, what is the result?',
        options: ['The number itself', 'Zero', 'One', 'Undefined'],
        correct: 1,
        explanation: 'Any number multiplied by zero equals zero.'
      },
      {
        id: 3,
        question: 'What is 5 × 7?',
        options: ['30', '35', '40', '45'],
        correct: 1,
        explanation: '5 × 7 = 35'
      },
      {
        id: 4,
        question: 'Which property states that a × b = b × a?',
        options: ['Associative', 'Commutative', 'Distributive', 'Identity'],
        correct: 1,
        explanation: 'The commutative property allows us to swap the order of multiplication.'
      },
      {
        id: 5,
        question: 'A farmer has 8 rows of apple trees with 12 trees in each row. How many trees in total?',
        options: ['84', '96', '102', '108'],
        correct: 1,
        explanation: '8 × 12 = 96 trees in total.'
      }
    ];

    setQuestions(generatedQuestions);
  };

  const handleAnswer = () => {
    const currentQ = questions[currentQuestion];
    const answerIndex = parseInt(selectedAnswer);
    const isCorrect = answerIndex === currentQ.correct;

    setAnswers([...answers, isCorrect ? 1 : 0]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Calculate final score
      const newAnswers = [...answers, isCorrect ? 1 : 0];
      const finalScore = Math.round((newAnswers.reduce((a, b) => a + b, 0) / questions.length) * 100);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleSubmit = async () => {
    const passed = score >= 70;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        topic_id: topic.id,
        score: score,
        total_questions: questions.length,
        passed: passed,
        attempt_number: 1
      });
    }

    onComplete(passed, score);
  };

  if (showResult) {
    const passed = score >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="mb-6">
            {passed ? (
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            )}
            <h2 className="text-3xl font-bold mb-2">
              {passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Your Score: {score}%
            </p>
            {passed ? (
              <p className="text-muted-foreground">
                You've earned {topic.xp_reward} XP and unlocked the next topic!
              </p>
            ) : (
              <p className="text-muted-foreground">
                You need at least 70% to pass. Let's clear your doubts and try again!
              </p>
            )}
          </div>

          <Button onClick={handleSubmit} size="lg" className="w-full">
            {passed ? 'Continue' : 'Clear Doubts'}
          </Button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Quiz: {topic.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentQ && (
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">{currentQ.question}</h2>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer p-4 rounded-lg border hover:bg-muted transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button
              onClick={handleAnswer}
              disabled={selectedAnswer === ''}
              className="w-full mt-8"
              size="lg"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
