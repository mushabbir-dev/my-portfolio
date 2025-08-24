import { NextResponse } from 'next/server';
import { getPortfolioData, setPortfolioData } from '../../lib/portfolioService';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Migration function to consolidate certifications and certificates into a single schema
const normalizeCertifications = (data: any) => {
  const a = Array.isArray(data?.certifications) ? data.certifications : [];
  const b = Array.isArray(data?.certificates) ? data.certificates : [];

  // Prefer entries with a usable absolute pdf URL
  const mappedA = a.map((c: any, i: number) => ({
    id: c.id || `cert-a-${i}`,
    name: c.name || c.title || { english: '', japanese: '' },
    issuer: c.issuer || { english: '', japanese: '' },
    date: c.date || { english: '', japanese: '' },
    // accept either `pdf` or `url`
    pdf: typeof c.pdf === 'string' && c.pdf.startsWith('http')
      ? c.pdf
      : (typeof c.url === 'string' ? c.url : ''),
    image: c.image || '',
  }));

  const mappedB = b.map((c: any, i: number) => ({
    id: c.id || `cert-b-${i}`,
    name: c.name || { english: '', japanese: '' },
    issuer: c.issuer || { english: '', japanese: '' },
    date: typeof c.date === 'string' ? { english: c.date, japanese: c.date } : (c.date || { english: '', japanese: '' }),
    pdf: typeof c.url === 'string' ? c.url : '',
    image: '',
  }));

  // merge (B first because it tends to have working URLs)
  const merged = [...mappedB, ...mappedA].filter(x => x.pdf);
  return merged;
};

export async function POST() {
  try {
    console.log('🔄 Starting certifications migration...');
    
    // Get current portfolio data
    const data = await getPortfolioData();
    console.log('📊 Current data structure:', Object.keys(data));
    console.log('📋 Current certifications count:', data?.certifications?.length || 0);
    console.log('📋 Current certificates count:', data?.certificates?.length || 0);
    
    // Normalize and consolidate certifications
    const normalized = normalizeCertifications(data);
    console.log('✅ Normalized certifications count:', normalized.length);
    
    // Update the data structure
    const migratedData = {
      ...data,
      certifications: normalized,
      // Remove the old duplicate certificates field
      certificates: undefined
    };
    
    // Save the migrated data
    await setPortfolioData(migratedData);
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Final data structure:', Object.keys(migratedData));
    console.log('📋 Final certifications count:', migratedData.certifications.length);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Certifications migration completed successfully',
      before: {
        certifications: data?.certifications?.length || 0,
        certificates: data?.certificates?.length || 0
      },
      after: {
        certifications: normalized.length,
        certificates: 0
      },
      migratedData: {
        structure: Object.keys(migratedData),
        certificationsCount: normalized.length
      }
    });
    
  } catch (error: any) {
    console.error('💥 Migration failed:', error);
    return NextResponse.json({ 
      error: `Migration failed: ${error.message}`,
      details: error.stack
    }, { status: 500 });
  }
}

// GET endpoint to preview what the migration would do without executing it
export async function GET() {
  try {
    const data = await getPortfolioData();
    const normalized = normalizeCertifications(data);
    
    return NextResponse.json({
      preview: true,
      current: {
        certifications: data?.certifications || [],
        certificates: data?.certificates || []
      },
      wouldBecome: {
        certifications: normalized,
        certificates: [] // would be removed
      },
      summary: {
        before: {
          certifications: data?.certifications?.length || 0,
          certificates: data?.certificates?.length || 0
        },
        after: {
          certifications: normalized.length,
          certificates: 0
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: `Preview failed: ${error.message}` 
    }, { status: 500 });
  }
}
