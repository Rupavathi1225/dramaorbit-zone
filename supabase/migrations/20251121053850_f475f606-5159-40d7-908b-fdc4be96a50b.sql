-- Create table for prelanding email submissions
CREATE TABLE public.prelanding_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  related_search_id UUID REFERENCES public.related_searches(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prelanding_emails ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert prelanding emails"
ON public.prelanding_emails
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view prelanding emails"
ON public.prelanding_emails
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_prelanding_emails_related_search_id ON public.prelanding_emails(related_search_id);
CREATE INDEX idx_prelanding_emails_created_at ON public.prelanding_emails(created_at DESC);