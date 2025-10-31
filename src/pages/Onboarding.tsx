import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Globe, Shield, Sparkles } from 'lucide-react';
import onboardingHero from '@/assets/onboarding-hero.jpg';

const slides = [
  {
    icon: Sparkles,
    title: 'Welcome to AI Tutor!',
    description: 'Your personal AI learning companion that adapts to your pace and style',
    image: onboardingHero,
  },
  {
    icon: Globe,
    title: 'Learn in Your Language',
    description: 'Switch between English and Bengali anytime, with voice and text support',
    image: onboardingHero,
  },
  {
    icon: Shield,
    title: 'Safe & Secure Learning',
    description: 'Parent-approved content with built-in safety controls and progress monitoring',
    image: onboardingHero,
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/signup');
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8 animate-fade-in">
          <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-float">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero shadow-float animate-bounce-subtle">
              <Icon className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h1 className="text-4xl font-bold">{slide.title}</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {slide.description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            size="lg"
            variant="hero"
            className="w-full"
            onClick={handleNext}
          >
            {currentSlide < slides.length - 1 ? (
              <>
                Next <ChevronRight className="ml-2" />
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
