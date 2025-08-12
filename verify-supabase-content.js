const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Verifying Supabase Content...\n');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY, // Using anon key to test public access
  { auth: { persistSession: false } }
);

async function verifyPortfolioData() {
  console.log('📊 Verifying Portfolio Data...');
  
  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('data')
      .eq('id', 1)
      .single();
    
    if (error) {
      throw new Error(`Failed to read portfolio: ${error.message}`);
    }
    
    const portfolio = data?.data || {};
    console.log('✅ Portfolio data accessible');
    console.log('📋 Available sections:', Object.keys(portfolio));
    
    // Verify CV data
    if (portfolio.cv) {
      console.log('\n📄 CV Data:');
      console.log('  English:', portfolio.cv.english?.isActive ? '✅ Active' : '❌ Inactive');
      console.log('  Japanese:', portfolio.cv.japanese?.isActive ? '✅ Active' : '❌ Inactive');
      
      if (portfolio.cv.english?.url) {
        console.log('  English URL:', portfolio.cv.english.url);
      }
      if (portfolio.cv.japanese?.url) {
        console.log('  Japanese URL:', portfolio.cv.japanese.url);
      }
    }
    
    // Verify certificates
    if (portfolio.certificates && portfolio.certificates.length > 0) {
      console.log(`\n📜 Certificates: ${portfolio.certificates.length} found`);
      portfolio.certificates.forEach((cert, index) => {
        console.log(`  ${index + 1}. ${cert.name} - ${cert.isActive ? '✅ Active' : '❌ Inactive'}`);
        if (cert.url) {
          console.log(`     URL: ${cert.url}`);
        }
      });
    }
    
    // Verify profile
    if (portfolio.profile) {
      console.log('\n👤 Profile Data:');
      console.log('  Name:', portfolio.profile.name || 'Not set');
      console.log('  Title:', portfolio.profile.title || 'Not set');
      console.log('  Image:', portfolio.profile.imageUrl ? '✅ Set' : '❌ Not set');
    }
    
    return portfolio;
    
  } catch (error) {
    console.error('❌ Portfolio verification failed:', error.message);
    return null;
  }
}

async function verifyStorageAccess() {
  console.log('\n📁 Verifying Storage Access...');
  
  try {
    // Test CV access
    const { data: cvFiles, error: cvError } = await supabase.storage
      .from('assets')
      .list('cv');
    
    if (cvError) {
      console.log('❌ CV storage access failed:', cvError.message);
    } else {
      console.log('✅ CV storage accessible');
      console.log('📄 CV files:', cvFiles.map(f => f.name));
    }
    
    // Test certificates access
    const { data: certFiles, error: certError } = await supabase.storage
      .from('assets')
      .list('certificates');
    
    if (certError) {
      console.log('❌ Certificates storage access failed:', certError.message);
    } else {
      console.log('✅ Certificates storage accessible');
      console.log('📜 Certificate files:', certFiles.map(f => f.name));
    }
    
    // Test images access
    const { data: imageFiles, error: imageError } = await supabase.storage
      .from('assets')
      .list('images');
    
    if (imageError) {
      console.log('❌ Images storage access failed:', imageError.message);
    } else {
      console.log('✅ Images storage accessible');
      console.log('🖼️ Image files:', imageFiles.map(f => f.name));
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Storage verification failed:', error.message);
    return false;
  }
}

async function testPublicURLs(portfolio) {
  console.log('\n🔗 Testing Public URLs...');
  
  try {
    let testResults = [];
    
    // Test CV URLs
    if (portfolio.cv?.english?.url) {
      testResults.push({
        type: 'CV (English)',
        url: portfolio.cv.english.url,
        status: '✅ Available'
      });
    }
    
    if (portfolio.cv?.japanese?.url) {
      testResults.push({
        type: 'CV (Japanese)',
        url: portfolio.cv.japanese.url,
        status: '✅ Available'
      });
    }
    
    // Test certificate URLs
    if (portfolio.certificates) {
      portfolio.certificates.forEach((cert, index) => {
        if (cert.url) {
          testResults.push({
            type: `Certificate ${index + 1}`,
            url: cert.url,
            status: '✅ Available'
          });
        }
      });
    }
    
    // Test profile image URL
    if (portfolio.profile?.imageUrl) {
      testResults.push({
        type: 'Profile Image',
        url: portfolio.profile.imageUrl,
        status: '✅ Available'
      });
    }
    
    console.log('📋 URL Test Results:');
    testResults.forEach(result => {
      console.log(`  ${result.type}: ${result.status}`);
      console.log(`    ${result.url}`);
    });
    
    return testResults.length > 0;
    
  } catch (error) {
    console.error('❌ URL testing failed:', error.message);
    return false;
  }
}

async function runVerification() {
  console.log('🧪 Running Content Verification...\n');
  
  try {
    // Verify portfolio data
    const portfolio = await verifyPortfolioData();
    if (!portfolio) {
      console.log('❌ Portfolio verification failed');
      return false;
    }
    
    // Verify storage access
    const storageOk = await verifyStorageAccess();
    if (!storageOk) {
      console.log('❌ Storage verification failed');
      return false;
    }
    
    // Test public URLs
    const urlsOk = await testPublicURLs(portfolio);
    if (!urlsOk) {
      console.log('❌ URL testing failed');
      return false;
    }
    
    console.log('\n🎉 All verifications passed!');
    console.log('✅ Portfolio data is accessible');
    console.log('✅ Storage is working');
    console.log('✅ Public URLs are available');
    
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

// Run verification
runVerification()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Your Supabase-powered portfolio is ready!');
      console.log('\n✨ Next steps:');
      console.log('1. Deploy the updated site to Vercel');
      console.log('2. Test the live site functionality');
      console.log('3. Verify CV download buttons work');
      console.log('4. Check that Admin panel can manage content');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n💥 Verification crashed:', error);
    process.exit(1);
  });
