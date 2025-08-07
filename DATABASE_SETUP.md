# Database Setup Instructions

## Supabase Configuration

### 1. Environment Variables
Create a `.env.local` file in your project root with:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Tables

#### Portfolio Sections Table
```sql
CREATE TABLE portfolio_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_portfolio_sections_section ON portfolio_sections(section);
```

#### Admin Logs Table
```sql
CREATE TABLE admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'read')),
  section TEXT NOT NULL,
  by TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payload JSONB,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_admin_logs_time ON admin_logs(time DESC);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_section ON admin_logs(section);
```

### 3. Row Level Security (RLS)

Enable RLS on both tables:

```sql
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
```

### 4. Policies

#### Portfolio Sections Policies
```sql
-- Allow read access to all authenticated users
CREATE POLICY "Allow read access" ON portfolio_sections
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow insert/update for authenticated users
CREATE POLICY "Allow insert/update" ON portfolio_sections
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update" ON portfolio_sections
  FOR UPDATE USING (auth.role() = 'authenticated');
```

#### Admin Logs Policies
```sql
-- Allow read access to all authenticated users
CREATE POLICY "Allow read access" ON admin_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow insert for authenticated users
CREATE POLICY "Allow insert" ON admin_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon public key
5. Add them to your `.env.local` file

## Testing the Database Connection

After setting up the database, test the connection by running:

```bash
npm run dev
```

Then visit `/admin` and try adding/removing items to verify the database is working correctly. 