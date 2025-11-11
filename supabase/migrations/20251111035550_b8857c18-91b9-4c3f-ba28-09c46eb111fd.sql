-- Create prelanding_pages table
CREATE TABLE public.prelanding_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  related_search_id UUID NOT NULL UNIQUE,
  logo_url TEXT,
  logo_position TEXT DEFAULT 'top-center',
  logo_size INTEGER DEFAULT 100,
  main_image_url TEXT,
  image_ratio TEXT DEFAULT '16:9',
  headline TEXT DEFAULT 'Welcome',
  description TEXT DEFAULT 'Check out this amazing resource',
  headline_font_size INTEGER DEFAULT 32,
  headline_color TEXT DEFAULT '#000000',
  description_font_size INTEGER DEFAULT 16,
  description_color TEXT DEFAULT '#666666',
  text_alignment TEXT DEFAULT 'center',
  email_box_color TEXT DEFAULT '#ffffff',
  email_box_border_color TEXT DEFAULT '#cccccc',
  button_text TEXT DEFAULT 'Continue',
  button_color TEXT DEFAULT '#1a2942',
  button_text_color TEXT DEFAULT '#ffffff',
  background_color TEXT DEFAULT '#ffffff',
  background_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prelanding_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view prelanding pages" 
ON public.prelanding_pages 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert prelanding pages" 
ON public.prelanding_pages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update prelanding pages" 
ON public.prelanding_pages 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete prelanding pages" 
ON public.prelanding_pages 
FOR DELETE 
USING (true);