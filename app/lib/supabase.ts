import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Only create client if environment variables are set
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Portfolio data interface for database operations
export interface PortfolioSection {
  id: string;
  section: string;
  data: any;
  updated_at: string;
}

// Admin log interface
export interface AdminLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'read';
  section: string;
  by: string;
  time: string;
  payload: any;
  success: boolean;
  error_message?: string;
} 