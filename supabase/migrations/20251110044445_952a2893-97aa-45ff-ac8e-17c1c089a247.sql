-- Create categories table
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code_range TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blogs table
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number INTEGER,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER REFERENCES public.categories(id),
  author TEXT NOT NULL,
  author_bio TEXT,
  author_image TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create related_searches table
CREATE TABLE public.related_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  search_text TEXT NOT NULL,
  target_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create analytics table for comprehensive tracking
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'blog_view', 'related_search_click', 'visit_now_click'
  blog_id UUID REFERENCES public.blogs(id) ON DELETE SET NULL,
  related_search_id UUID REFERENCES public.related_searches(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  device TEXT,
  country TEXT,
  source TEXT, -- 'meta', 'linkedin', 'direct', 'ww', etc.
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.related_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view published blogs"
  ON public.blogs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view related searches"
  ON public.related_searches FOR SELECT
  USING (true);

-- Analytics insert policy (anyone can track)
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics FOR INSERT
  WITH CHECK (true);

-- Analytics read policy (anyone can read for now, we'll secure admin later)
CREATE POLICY "Anyone can view analytics"
  ON public.analytics FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_blogs_category ON public.blogs(category_id);
CREATE INDEX idx_blogs_status ON public.blogs(status);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at DESC);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at DESC);
CREATE INDEX idx_analytics_session ON public.analytics(session_id);
CREATE INDEX idx_related_searches_blog ON public.related_searches(blog_id);

-- Insert default categories
INSERT INTO public.categories (name, code_range, slug) VALUES
  ('Lifestyle', '100-200', 'lifestyle'),
  ('Education', '201-300', 'education'),
  ('Wellness', '301-400', 'wellness'),
  ('Deals', '401-500', 'deals'),
  ('Job Seeking', '501-600', 'job-seeking'),
  ('Alternative Learning', '601-700', 'alternative-learning');