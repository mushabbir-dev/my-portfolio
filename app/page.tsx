// app/page.tsx  — SERVER COMPONENT (no 'use client' here)
import HomeClient from './components/HomeClient';
import { getPortfolioData } from './lib/portfolioService';

export const revalidate = 0;            // never cache
export const dynamic = 'force-dynamic'; // always render fresh

export default async function Page() {
  // Fetch directly from Supabase using server-only service role
  const data = await getPortfolioData();

  // Pass raw JSON to your existing client UI
  return <HomeClient initialData={data} />;
} 
