const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://teqnfolvsxicemfojpol.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcW5mb2x2c3hpY2VtZm9qcG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDQ4ODgsImV4cCI6MjA3MDEyMDg4OH0.0XUIJGKfeB3WWrj5M_MNmrb4UU-9rpMjcgQv3qiW3bs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');

    // Create portfolio_sections table
    const createPortfolioSectionsTable = `
      CREATE TABLE IF NOT EXISTS portfolio_sections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        section TEXT UNIQUE NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create admin_logs table
    const createAdminLogsTable = `
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
    `;

    // Enable Row Level Security
    const enableRLS = `
      ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;
      ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
    `;

    // Create RLS policies for portfolio_sections
    const portfolioPolicies = `
      -- Allow all operations for now (you can restrict this later)
      CREATE POLICY "Allow all operations on portfolio_sections" ON portfolio_sections
        FOR ALL USING (true) WITH CHECK (true);
    `;

    // Create RLS policies for admin_logs
    const adminLogsPolicies = `
      -- Allow all operations for now (you can restrict this later)
      CREATE POLICY "Allow all operations on admin_logs" ON admin_logs
        FOR ALL USING (true) WITH CHECK (true);
    `;

    // Execute the SQL commands
    console.log('Creating portfolio_sections table...');
    await supabase.rpc('exec_sql', { sql: createPortfolioSectionsTable });

    console.log('Creating admin_logs table...');
    await supabase.rpc('exec_sql', { sql: createAdminLogsTable });

    console.log('Enabling Row Level Security...');
    await supabase.rpc('exec_sql', { sql: enableRLS });

    console.log('Creating RLS policies...');
    await supabase.rpc('exec_sql', { sql: portfolioPolicies });
    await supabase.rpc('exec_sql', { sql: adminLogsPolicies });

    console.log('Database setup completed successfully!');
    
    // Test the connection by inserting a test record
    console.log('Testing database connection...');
    const { data, error } = await supabase
      .from('portfolio_sections')
      .insert({
        section: 'test',
        data: { message: 'Database connection successful' }
      });

    if (error) {
      console.error('Error testing connection:', error);
    } else {
      console.log('Database connection test successful!');
      
      // Clean up test record
      await supabase
        .from('portfolio_sections')
        .delete()
        .eq('section', 'test');
    }

  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase(); 