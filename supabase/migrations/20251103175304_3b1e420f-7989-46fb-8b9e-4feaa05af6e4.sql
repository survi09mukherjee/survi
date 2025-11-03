-- Create multiplication topics table
CREATE TABLE public.multiplication_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  order_index INTEGER NOT NULL,
  video_duration INTEGER DEFAULT 300,
  xp_reward INTEGER DEFAULT 100,
  badge_icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_multiplication_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES public.multiplication_topics(id) ON DELETE CASCADE,
  video_completed BOOLEAN DEFAULT false,
  quiz_completed BOOLEAN DEFAULT false,
  quiz_score INTEGER DEFAULT 0,
  revision_completed BOOLEAN DEFAULT false,
  unlocked BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create quiz attempts table
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES public.multiplication_topics(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN DEFAULT false,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doubt sessions table
CREATE TABLE public.doubt_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES public.multiplication_topics(id) ON DELETE CASCADE,
  doubt_text TEXT,
  resolution_type TEXT CHECK (resolution_type IN ('voice', 'text', 'video')),
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user avatars table
CREATE TABLE public.user_avatars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  character_name TEXT NOT NULL,
  character_type TEXT NOT NULL,
  tone TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.multiplication_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_multiplication_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;

-- RLS Policies for multiplication_topics (public read)
CREATE POLICY "Topics are viewable by everyone" 
ON public.multiplication_topics 
FOR SELECT 
USING (true);

-- RLS Policies for user_multiplication_progress
CREATE POLICY "Users can view their own progress" 
ON public.user_multiplication_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_multiplication_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_multiplication_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view their own quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for doubt_sessions
CREATE POLICY "Users can view their own doubt sessions" 
ON public.doubt_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own doubt sessions" 
ON public.doubt_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doubt sessions" 
ON public.doubt_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for user_avatars
CREATE POLICY "Users can view their own avatars" 
ON public.user_avatars 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatars" 
ON public.user_avatars 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own avatars" 
ON public.user_avatars 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert sample multiplication topics
INSERT INTO public.multiplication_topics (title, description, level, order_index, xp_reward, badge_icon) VALUES
('Introduction to Multiplication', 'Learn what multiplication means and how it relates to addition', 'beginner', 1, 50, '🌟'),
('Multiplication Tables 1-5', 'Master the basic multiplication tables from 1 to 5', 'beginner', 2, 75, '📊'),
('Multiplication Tables 6-10', 'Learn multiplication tables from 6 to 10', 'beginner', 3, 100, '📈'),
('Multiplying by 10, 100, 1000', 'Understand patterns when multiplying by powers of 10', 'intermediate', 4, 125, '🎯'),
('Two-Digit Multiplication', 'Learn to multiply two-digit numbers', 'intermediate', 5, 150, '🔢'),
('Three-Digit Multiplication', 'Master multiplication with three-digit numbers', 'intermediate', 6, 175, '💯'),
('Multiplication Properties', 'Learn commutative, associative, and distributive properties', 'advanced', 7, 200, '🧮'),
('Mental Multiplication Tricks', 'Quick mental math techniques for multiplication', 'advanced', 8, 225, '🧠'),
('Algebraic Multiplication', 'Multiply algebraic expressions and polynomials', 'advanced', 9, 250, '🎓'),
('Advanced Problem Solving', 'Complex real-world multiplication problems', 'expert', 10, 300, '🏆');

-- Function to unlock first topic for new users
CREATE OR REPLACE FUNCTION public.initialize_user_multiplication_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_multiplication_progress (user_id, topic_id, unlocked)
  SELECT NEW.id, id, (order_index = 1)
  FROM public.multiplication_topics;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;