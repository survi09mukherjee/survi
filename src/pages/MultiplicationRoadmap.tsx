import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Play, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import MultiplicationVideoLesson from '@/components/MultiplicationVideoLesson';
import MultiplicationQuiz from '@/components/MultiplicationQuiz';
import MultiplicationDoubtClearance from '@/components/MultiplicationDoubtClearance';

interface Topic {
  id: string;
  title: string;
  description: string;
  level: string;
  order_index: number;
  xp_reward: number;
  badge_icon: string;
}

interface UserProgress {
  topic_id: string;
  video_completed: boolean;
  quiz_completed: boolean;
  quiz_score: number;
  revision_completed: boolean;
  unlocked: boolean;
}

export default function MultiplicationRoadmap() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'roadmap' | 'video' | 'quiz' | 'doubt'>('roadmap');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create a temporary user ID if not authenticated (for demo purposes)
      const userId = user?.id || 'demo-user-' + Math.random().toString(36).substr(2, 9);

      // Load topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('multiplication_topics')
        .select('*')
        .order('order_index');

      if (topicsError) throw topicsError;
      setTopics(topicsData || []);

      // Load user progress (only if authenticated)
      let progressData = null;
      let progressError = null;
      
      if (user) {
        const result = await supabase
          .from('user_multiplication_progress')
          .select('*')
          .eq('user_id', user.id);
        progressData = result.data;
        progressError = result.error;
      }

      if (progressError) throw progressError;

      // Initialize progress if empty
      if (!progressData || progressData.length === 0) {
        // Create initial progress map locally (don't save to DB if not authenticated)
        const progressMap: Record<string, UserProgress> = {};
        topicsData?.forEach((topic, index) => {
          progressMap[topic.id] = {
            topic_id: topic.id,
            video_completed: false,
            quiz_completed: false,
            quiz_score: 0,
            revision_completed: false,
            unlocked: index === 0
          };
        });
        setUserProgress(progressMap);
        
        // Save to DB only if authenticated
        if (user) {
          const initialProgress = topicsData?.map((topic, index) => ({
            user_id: user.id,
            topic_id: topic.id,
            unlocked: index === 0
          })) || [];

          await supabase
            .from('user_multiplication_progress')
            .insert(initialProgress);
        }
      } else {
        const progressMap: Record<string, UserProgress> = {};
        progressData.forEach(p => {
          progressMap[p.topic_id] = p as UserProgress;
        });
        setUserProgress(progressMap);
      }

      // Calculate total XP
      const xp = progressData?.reduce((sum, p) => {
        return sum + (p.quiz_completed ? topicsData?.find(t => t.id === p.topic_id)?.xp_reward || 0 : 0);
      }, 0) || 0;
      setTotalXP(xp);

      // Check if user has avatar - redirect to character generator if not
      if (user) {
        const { data: avatarData } = await supabase
          .from('user_avatars')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (avatarData) {
          setSelectedAvatar(avatarData);
        } else {
          // No avatar found, redirect to character generator
          toast({
            title: "Create Your Avatar First",
            description: "Let's create your learning avatar to start multiplication lessons",
          });
          navigate('/character-generator');
          return;
        }
      } else {
        // Not authenticated, redirect to character generator
        toast({
          title: "Create Your Avatar",
          description: "Let's create your learning avatar to continue",
        });
        navigate('/character-generator');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load multiplication data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    const progress = userProgress[topic.id];
    if (!progress?.unlocked) {
      toast({
        title: "Locked",
        description: "Complete previous topics to unlock this one",
        variant: "destructive"
      });
      return;
    }

    setCurrentTopic(topic);
    setStep('video');
  };

  const handleVideoComplete = () => {
    setStep('quiz');
  };

  const handleQuizComplete = async (passed: boolean, score: number) => {
    if (passed) {
      // Update progress locally
      const updatedProgress = { ...userProgress };
      if (currentTopic) {
        updatedProgress[currentTopic.id] = {
          ...updatedProgress[currentTopic.id],
          video_completed: true,
          quiz_completed: true,
          quiz_score: score,
          revision_completed: true
        };
        
        // Unlock next topic
        const currentIndex = topics.findIndex(t => t.id === currentTopic?.id);
        if (currentIndex < topics.length - 1) {
          const nextTopic = topics[currentIndex + 1];
          updatedProgress[nextTopic.id] = {
            ...updatedProgress[nextTopic.id],
            unlocked: true
          };
        }
        
        setUserProgress(updatedProgress);
      }
      
      // Update in database if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user && currentTopic) {
        await supabase
          .from('user_multiplication_progress')
          .update({ 
            video_completed: true,
            quiz_completed: true,
            quiz_score: score,
            revision_completed: true
          })
          .eq('user_id', user.id)
          .eq('topic_id', currentTopic.id);

        // Unlock next topic in DB
        const currentIndex = topics.findIndex(t => t.id === currentTopic?.id);
        if (currentIndex < topics.length - 1) {
          const nextTopic = topics[currentIndex + 1];
          await supabase
            .from('user_multiplication_progress')
            .update({ unlocked: true })
            .eq('user_id', user.id)
            .eq('topic_id', nextTopic.id);
        }
      }

      toast({
        title: "Congratulations! 🎉",
        description: `You earned ${currentTopic?.xp_reward} XP!`,
      });

      loadData();
      setStep('roadmap');
    } else {
      setStep('doubt');
    }
  };

  const handleDoubtResolved = () => {
    setStep('quiz');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'intermediate': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'advanced': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'expert': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading multiplication roadmap...</p>
        </div>
      </div>
    );
  }

  if (step === 'video' && currentTopic) {
    return (
      <MultiplicationVideoLesson
        topic={currentTopic}
        avatar={selectedAvatar}
        onComplete={handleVideoComplete}
        onBack={() => setStep('roadmap')}
      />
    );
  }

  if (step === 'quiz' && currentTopic) {
    return (
      <MultiplicationQuiz
        topic={currentTopic}
        onComplete={handleQuizComplete}
        onBack={() => setStep('video')}
      />
    );
  }

  if (step === 'doubt' && currentTopic) {
    return (
      <MultiplicationDoubtClearance
        topic={currentTopic}
        avatar={selectedAvatar}
        onResolved={handleDoubtResolved}
        onBack={() => setStep('roadmap')}
      />
    );
  }

  const completedTopics = Object.values(userProgress).filter(p => p.quiz_completed).length;
  const progressPercentage = (completedTopics / topics.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Multiplication Mastery</h1>
                <p className="text-sm text-muted-foreground">Your learning journey</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold text-primary">{totalXP}</p>
              </div>
              {selectedAvatar && (
                <img 
                  src={selectedAvatar.image_url} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="p-6 mb-8 bg-gradient-hero text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
              <p className="text-primary-foreground/90">
                {completedTopics} of {topics.length} topics completed
              </p>
            </div>
            <div className="text-5xl">
              {completedTopics === topics.length ? '🏆' : '📚'}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </Card>

        {/* Learning Roadmap */}
        <div className="space-y-4">
          {topics.map((topic, index) => {
            const progress = userProgress[topic.id];
            const isLocked = !progress?.unlocked;
            const isCompleted = progress?.quiz_completed;

            return (
              <Card
                key={topic.id}
                className={`p-6 transition-all duration-200 ${
                  isLocked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-float hover:scale-[1.02]'
                }`}
                onClick={() => !isLocked && handleTopicClick(topic)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                    isCompleted ? 'bg-green-500/20' : 'bg-primary/10'
                  }`}>
                    {isLocked ? <Lock className="w-8 h-8" /> : 
                     isCompleted ? <CheckCircle className="w-8 h-8 text-green-500" /> :
                     topic.badge_icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{topic.title}</h3>
                          <Badge className={getLevelColor(topic.level)}>
                            {topic.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">{topic.xp_reward} XP</span>
                      </div>
                    </div>

                    {/* Progress indicators */}
                    {!isLocked && (
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          {progress?.video_completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span>Video</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {progress?.quiz_completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                          )}
                          <span>Quiz</span>
                        </div>
                        {progress?.quiz_score > 0 && (
                          <Badge variant="secondary">
                            Score: {progress.quiz_score}%
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
