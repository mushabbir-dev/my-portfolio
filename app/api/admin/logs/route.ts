import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE;

export async function GET(request: Request) {
  try {
    // If environment variables are not available, return empty logs
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // For now, return an empty array since we don't have a logs table
    // In the future, you can implement actual logging to Supabase
    const logs: any[] = [];
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin logs' },
      { status: 500 }
    );
  }
} 