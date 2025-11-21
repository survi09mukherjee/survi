import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import onboardingHero from '@/assets/onboarding-hero.jpg';
import { LanguageSelector } from '@/components/LanguageSelector';
import { GRADES, BOARDS } from '@/data/subjects';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const slides = [
    { title: 'Learn Anything, In Anytime In Any Language', description: 'AI Tutor teaches you through fun videos and conversations', icon: '🎓', image: onboardingHero },
    { title: 'Choose Your Learning Style', description: 'Learn with animated video tutors or chat with voice AI', icon: '🎬', image: null },
    { title: 'Safe & Parent-Approved', description: 'Kid-safe content with parental controls', icon: '🛡️', image: null },
  ];

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentSlide === 2) {
      setCurrentSlide(3); // Grade selection
    } else if (currentSlide === 3 && selectedGrade) {
      setCurrentSlide(4); // Board selection
    } else if (currentSlide === 4 && selectedBoard) {
      setCurrentSlide(5); // Language selection
    } else if (currentSlide === 5) {
      navigate('/signup');
    }
  };

  // Filter grades to Class 4-10
  const filteredGrades = GRADES.filter(grade => 
    ['class-4', 'class-5', 'class-6', 'class-7', 'class-8', 'class-9', 'class-10'].includes(grade.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 md:p-12 shadow-2xl">
        {currentSlide < 3 && (
          <div className="text-center space-y-6">
            <div className="text-7xl mb-4">{slides[currentSlide].icon}</div>
            <h1 className="text-4xl font-bold">{slides[currentSlide].title}</h1>
            <p className="text-lg text-muted-foreground">{slides[currentSlide].description}</p>
            {slides[currentSlide].image && (
              <img src={slides[currentSlide].image} alt="AI Tutor" className="w-full max-w-2xl mx-auto rounded-2xl" />
            )}
          </div>
        )}

        {currentSlide === 3 && (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-center mb-6">Select Your Grade</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
              {filteredGrades.map((grade) => (
                <Card
                  key={grade.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${selectedGrade === grade.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedGrade(grade.id)}
                >
                  <div className="text-center">
                    <div className="font-bold">{grade.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentSlide === 4 && (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-center mb-6">Select Your Board</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {BOARDS.map((board) => (
                <Card
                  key={board.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${selectedBoard === board.id ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedBoard(board.id)}
                >
                  <div className="text-center">
                    <div className="font-bold">{board.abbreviation}</div>
                    <div className="text-xs text-muted-foreground mt-1">{board.name}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentSlide === 5 && (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-center mb-6">Choose Your Language</h1>
            <LanguageSelector selected={selectedLanguage} onSelect={setSelectedLanguage} />
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentSlide > 0 && (
            <Button variant="outline" onClick={() => setCurrentSlide(currentSlide - 1)}>Back</Button>
          )}
          <Button
            variant="hero"
            onClick={handleNext}
            className="ml-auto"
            disabled={(currentSlide === 3 && !selectedGrade) || (currentSlide === 4 && !selectedBoard)}
          >
            {currentSlide === 5 ? 'Get Started' : 'Next'} <ArrowRight className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
