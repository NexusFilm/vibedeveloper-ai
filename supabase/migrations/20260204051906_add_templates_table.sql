-- ============================================
-- TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  prompt_template TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for templates (public read)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read templates
CREATE POLICY "Templates are viewable by everyone" ON templates
  FOR SELECT USING (true);;
