-- Add INSERT, UPDATE, DELETE policies for blogs table
CREATE POLICY "Anyone can insert blogs"
  ON public.blogs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update blogs"
  ON public.blogs FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete blogs"
  ON public.blogs FOR DELETE
  USING (true);

-- Add INSERT, UPDATE, DELETE policies for related_searches table
CREATE POLICY "Anyone can insert related searches"
  ON public.related_searches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update related searches"
  ON public.related_searches FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete related searches"
  ON public.related_searches FOR DELETE
  USING (true);

-- Add INSERT, UPDATE, DELETE policies for categories table (for future admin use)
CREATE POLICY "Anyone can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON public.categories FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete categories"
  ON public.categories FOR DELETE
  USING (true);