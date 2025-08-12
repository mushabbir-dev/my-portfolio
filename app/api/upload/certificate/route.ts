import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const certificateName = form.get('certificateName') as string;
    const certificateType = form.get('certificateType') as string; // 'image' or 'pdf'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (!certificateName) {
      return NextResponse.json({ error: 'Certificate name required' }, { status: 400 });
    }

    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');

    const sb = supabaseAdmin();
    
    // Generate a safe filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const safeName = certificateName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const key = `certificates/${safeName}-${timestamp}.${fileExtension}`;
    
    // Upload file to Supabase Storage
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await sb.storage
      .from('assets')
      .upload(key, bytes, { 
        upsert: true, 
        contentType: file.type || (fileExtension === 'pdf' ? 'application/pdf' : 'image/jpeg')
      });
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: publicUrl } = sb.storage.from('assets').getPublicUrl(key);
    const url = publicUrl.publicUrl;
    
    // Update portfolio data with new certificate
    const current = await getPortfolioData();
    const existingCertificates = current.certificates || [];
    
    const newCertificate = {
      id: `${safeName}-${timestamp}`,
      name: certificateName,
      type: certificateType || (fileExtension === 'pdf' ? 'pdf' : 'image'),
      url: url,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
      isActive: true
    };
    
    // Add new certificate to the list
    const updatedCertificates = [...existingCertificates, newCertificate];
    
    await updateSection('certificates', updatedCertificates);
    
    return NextResponse.json({ 
      success: true, 
      url,
      certificate: newCertificate 
    });
    
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const certificateId = searchParams.get('id');
    
    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID required' }, { status: 400 });
    }

    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');

    const sb = supabaseAdmin();
    
    // Get current certificates
    const current = await getPortfolioData();
    const existingCertificates = current.certificates || [];
    
    // Find the certificate to delete
    const certificateToDelete = existingCertificates.find((cert: any) => cert.id === certificateId);
    if (!certificateToDelete) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }
    
    // Delete from Supabase Storage
    const key = certificateToDelete.url.split('/').pop(); // Extract filename from URL
    if (key) {
      const { error: deleteError } = await sb.storage
        .from('assets')
        .remove([`certificates/${key}`]);
      
      if (deleteError) {
        console.warn('Failed to delete file from storage:', deleteError);
        // Continue with database update even if file deletion fails
      }
    }
    
    // Remove from portfolio data
    const updatedCertificates = existingCertificates.filter((cert: any) => cert.id !== certificateId);
    await updateSection('certificates', updatedCertificates);
    
    return NextResponse.json({ success: true });
    
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
