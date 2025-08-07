-- Database Setup for Portfolio Admin Panel
-- Run this in Supabase SQL Editor

-- Create portfolio_sections table
CREATE TABLE IF NOT EXISTS portfolio_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'read')),
  section TEXT NOT NULL,
  by TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payload JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_section ON portfolio_sections(section);
CREATE INDEX IF NOT EXISTS idx_admin_logs_time ON admin_logs(time DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolio_sections
-- Allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on portfolio_sections" ON portfolio_sections
  FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for admin_logs
-- Allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on admin_logs" ON admin_logs
  FOR ALL USING (true) WITH CHECK (true);

-- Insert some test data to verify the setup
INSERT INTO portfolio_sections (section, data) VALUES 
  ('hero', '{"name": {"english": "Test", "japanese": "テスト"}, "title": {"english": "Test Title", "japanese": "テストタイトル"}}'::jsonb)
ON CONFLICT (section) DO NOTHING;

-- Insert a test admin log
INSERT INTO admin_logs (action, section, by, payload, success) VALUES 
  ('create', 'test', 'admin@example.com', '{"message": "Database setup completed"}'::jsonb, true);

-- Verify the setup
SELECT 'portfolio_sections' as table_name, COUNT(*) as row_count FROM portfolio_sections
UNION ALL
SELECT 'admin_logs' as table_name, COUNT(*) as row_count FROM admin_logs; 