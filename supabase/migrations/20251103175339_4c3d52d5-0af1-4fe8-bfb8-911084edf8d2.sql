-- Fix security warning: Set search_path for the function
CREATE OR REPLACE FUNCTION public.initialize_user_multiplication_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_multiplication_progress (user_id, topic_id, unlocked)
  SELECT NEW.id, id, (order_index = 1)
  FROM public.multiplication_topics;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;