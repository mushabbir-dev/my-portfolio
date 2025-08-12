import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('🚀 CV Upload started');
    
    // STEP 1: Environment Check
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      console.error('❌ CRITICAL: Supabase environment variables missing');
      console.error('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING');
      console.error('SUPABASE_SERVICE_ROLE:', process.env.SUPABASE_SERVICE_ROLE ? 'SET' : 'MISSING');
      return NextResponse.json(
        { 
          error: 'Supabase not configured on server',
          details: 'Environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE are required'
        },
        { status: 503 }
      );
    }
    
    console.log('✅ Environment variables found');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL.substring(0, 30) + '...');
    console.log('SUPABASE_SERVICE_ROLE:', process.env.SUPABASE_SERVICE_ROLE.substring(0, 20) + '...');

    // STEP 2: Form Data Validation
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const language = ((form.get('language') as string) || 'en').toLowerCase();

    if (!file) {
      console.error('❌ No file provided in form data');
      return NextResponse.json({ 
        error: 'No file provided',
        details: 'File field is required in the form data'
      }, { status: 400 });
    }

    if (!['en','ja','jp','japanese','english'].includes(language)) {
      console.error('❌ Invalid language:', language);
      return NextResponse.json({ 
        error: 'Invalid language',
        details: `Language must be one of: en, ja, jp, japanese, english. Got: ${language}`
      }, { status: 400 });
    }

    console.log('✅ Form data validated');
    console.log('File name:', file.name);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.type);
    console.log('Language:', language);

    const lang = language.startsWith('j') ? 'japanese' : 'english';
    const filename = lang === 'english' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const key = `cv/${filename}`;

    console.log('📁 Target storage path:', key);

    // STEP 3: File Processing
    const bytes = Buffer.from(await file.arrayBuffer());
    console.log('✅ File converted to buffer, size:', bytes.length, 'bytes');
    
    // STEP 4: Supabase Client Creation
    console.log('🔧 Creating Supabase client...');
    let supabaseAdmin: any;
    try {
      const { supabaseAdmin: sb } = await import('../../../lib/supabase-server');
      supabaseAdmin = sb;
      console.log('✅ Supabase client imported successfully');
    } catch (importError) {
      console.error('❌ Failed to import Supabase client:', importError);
      return NextResponse.json({ 
        error: 'Failed to initialize Supabase client',
        details: importError instanceof Error ? importError.message : 'Unknown import error'
      }, { status: 500 });
    }

    const sb = supabaseAdmin();
    console.log('✅ Supabase client created');

    // STEP 5: Test Supabase Connection
    console.log('🔍 Testing Supabase connection...');
    try {
      const { data: testData, error: testError } = await sb.from('portfolio').select('id').limit(1);
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError);
        return NextResponse.json({ 
          error: 'Supabase connection failed',
          details: `Database connection test failed: ${testError.message}`
        }, { status: 503 });
      }
      console.log('✅ Supabase connection test passed');
    } catch (connectionError) {
      console.error('❌ Supabase connection test exception:', connectionError);
      return NextResponse.json({ 
        error: 'Supabase connection test failed',
        details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
      }, { status: 503 });
    }

    // STEP 6: Storage Bucket Check
    console.log('🔍 Checking storage bucket...');
    try {
      const { data: buckets, error: bucketError } = await sb.storage.listBuckets();
      if (bucketError) {
        console.error('❌ Failed to list storage buckets:', bucketError);
        return NextResponse.json({ 
          error: 'Storage bucket access failed',
          details: `Cannot access storage: ${bucketError.message}`
        }, { status: 503 });
      }
      
      const assetsBucket = buckets.find((b: any) => b.name === 'assets');
      if (!assetsBucket) {
        console.error('❌ Assets bucket not found. Available buckets:', buckets.map((b: any) => b.name));
        return NextResponse.json({ 
          error: 'Storage bucket not found',
          details: 'Assets bucket does not exist in Supabase storage'
        }, { status: 503 });
      }
      console.log('✅ Assets bucket found:', assetsBucket.name);
    } catch (bucketCheckError) {
      console.error('❌ Storage bucket check failed:', bucketCheckError);
      return NextResponse.json({ 
        error: 'Storage bucket check failed',
        details: bucketCheckError instanceof Error ? bucketCheckError.message : 'Unknown bucket error'
      }, { status: 503 });
    }

    // STEP 7: File Upload to Storage
    console.log('📤 Uploading file to Supabase Storage...');
    let uploadResult;
    try {
      uploadResult = await sb.storage.from('assets')
        .upload(key, bytes, { 
          upsert: true, 
          contentType: file.type || 'application/pdf' 
        });
      
      if (uploadResult.error) {
        console.error('❌ File upload failed:', uploadResult.error);
        return NextResponse.json({ 
          error: 'File upload failed',
          details: `Storage upload error: ${uploadResult.error.message}`
        }, { status: 500 });
      }
      
      console.log('✅ File uploaded successfully to storage');
      console.log('Upload result:', uploadResult);
    } catch (uploadError) {
      console.error('❌ File upload exception:', uploadError);
      return NextResponse.json({ 
        error: 'File upload failed',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown upload error'
      }, { status: 500 });
    }

    // STEP 8: Generate Public URL
    console.log('🔗 Generating public URL...');
    let publicUrl: string;
    try {
      const { data: pub } = sb.storage.from('assets').getPublicUrl(key);
      publicUrl = pub.publicUrl;
      console.log('✅ Public URL generated:', publicUrl);
    } catch (urlError) {
      console.error('❌ Failed to generate public URL:', urlError);
      return NextResponse.json({ 
        error: 'Failed to generate public URL',
        details: urlError instanceof Error ? urlError.message : 'Unknown URL generation error'
      }, { status: 500 });
    }

    // STEP 9: Update Portfolio Data
    console.log('💾 Updating portfolio data...');
    try {
      const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');
      
      console.log('📖 Reading current portfolio data...');
      const current = await getPortfolioData();
      console.log('✅ Current portfolio data read successfully');
      
      const cv = {
        ...current.cv,
        [lang]: { isActive: true, url: publicUrl, filename }
      };
      
      console.log('📝 Updating CV section with:', cv);
      await updateSection('cv', cv);
      console.log('✅ Portfolio data updated successfully');
    } catch (dataError) {
      console.error('❌ Failed to update portfolio data:', dataError);
      // Try to clean up the uploaded file
      try {
        console.log('🧹 Cleaning up uploaded file due to data update failure...');
        await sb.storage.from('assets').remove([key]);
        console.log('✅ Uploaded file cleaned up');
      } catch (cleanupError) {
        console.error('⚠️ Failed to clean up uploaded file:', cleanupError);
      }
      
      return NextResponse.json({ 
        error: 'Failed to update portfolio data',
        details: dataError instanceof Error ? dataError.message : 'Unknown data update error'
      }, { status: 500 });
    }

    // STEP 10: Final Verification
    console.log('🔍 Final verification...');
    try {
      const { data: verifyData, error: verifyError } = await sb.storage.from('assets').list('cv');
      if (verifyError) {
        console.warn('⚠️ Could not verify file in storage:', verifyError);
      } else {
        const uploadedFile = verifyData.find((f: any) => f.name === filename);
        if (uploadedFile) {
          console.log('✅ File verified in storage:', uploadedFile);
        } else {
          console.warn('⚠️ File not found in storage verification');
        }
      }
    } catch (verifyError) {
      console.warn('⚠️ Final verification failed:', verifyError);
    }

    console.log('🎉 CV Upload completed successfully!');
    return NextResponse.json({ 
      success: true, 
      url: publicUrl, 
      filename,
      message: 'CV uploaded and portfolio updated successfully'
    });

  } catch (e: any) {
    console.error('💥 CRITICAL ERROR in CV upload:', e);
    console.error('Error stack:', e.stack);
    return NextResponse.json({ 
      error: 'Unexpected error occurred',
      details: e.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    console.log('🗑️ CV Delete started');
    
    // Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
      console.error('❌ Supabase not configured for delete');
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language');
    
    if (!language) {
      console.error('❌ Language parameter missing for delete');
      return NextResponse.json({ error: 'Language parameter required' }, { status: 400 });
    }

    const lang = language.startsWith('j') ? 'japanese' : 'english';
    const filename = lang === 'english' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
    const key = `cv/${filename}`;

    console.log('🗑️ Deleting CV:', { language, lang, filename, key });

    // Dynamically import to avoid build-time errors
    const { supabaseAdmin } = await import('../../../lib/supabase-server');
    const { getPortfolioData, updateSection } = await import('../../../lib/portfolioService');
    
    const sb = supabaseAdmin();

    // Remove file from storage
    console.log('🗑️ Removing file from storage...');
    const { error: deleteError } = await sb.storage.from('assets').remove([key]);
    if (deleteError) {
      console.warn('⚠️ Failed to delete file from storage:', deleteError);
      // Continue anyway to update portfolio data
    } else {
      console.log('✅ File removed from storage');
    }

    // Update portfolio data
    console.log('💾 Updating portfolio data...');
    const current = await getPortfolioData();
    const cv = {
      ...current.cv,
      [lang]: { isActive: false, url: "", filename: "" }
    };

    await updateSection('cv', cv);
    console.log('✅ Portfolio data updated for CV removal');
    
    return NextResponse.json({ 
      success: true,
      message: 'CV removed successfully'
    });
  } catch (e: any) {
    console.error('💥 Error deleting CV:', e);
    return NextResponse.json({ 
      error: e.message || 'Unknown error occurred during CV deletion'
    }, { status: 500 });
  }
}
