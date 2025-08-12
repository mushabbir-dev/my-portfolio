-- Database setup for portfolio persistence
-- Run this in Supabase SQL Editor

-- Create the main portfolio table (single row with JSON data)
CREATE TABLE IF NOT EXISTS public.portfolio (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial row if it doesn't exist
INSERT INTO public.portfolio (id, data) 
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create admin logs table for tracking changes
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  section TEXT NOT NULL,
  by TEXT NOT NULL,
  time TIMESTAMPTZ DEFAULT NOW(),
  payload JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read portfolio data
CREATE POLICY read_portfolio_anon ON public.portfolio
  FOR SELECT USING (true);

-- Allow authenticated users to read admin logs
CREATE POLICY read_admin_logs_auth ON public.admin_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to perform all operations
CREATE POLICY service_role_portfolio ON public.portfolio
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY service_role_admin_logs ON public.admin_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for assets bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Service Role Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'service_role');
CREATE POLICY "Service Role Update" ON storage.objects FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'service_role');
CREATE POLICY "Service Role Delete" ON storage.objects FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_updated_at ON public.portfolio(updated_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_time ON public.admin_logs(time);
CREATE INDEX IF NOT EXISTS idx_admin_logs_section ON public.admin_logs(section);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs(action);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.portfolio TO anon, authenticated;
GRANT ALL ON public.admin_logs TO authenticated;
GRANT ALL ON public.portfolio TO service_role;
GRANT ALL ON public.admin_logs TO service_role; 