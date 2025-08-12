const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('🚀 Starting Content Migration to Supabase...\n');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

// Define content structure and file mappings
const contentStructure = {
  cv: {
    localPath: 'public/cv/',
    storagePath: 'cv/',
    files: [
      { name: 'mushabbir-en.pdf', language: 'english' },
      { name: 'mushabbir-ja.pdf', language: 'japanese' }
    ]
  },
  certificates: {
    localPath: 'public/certifications/',
    storagePath: 'certificates/',
    files: [
      'AI Foundations for Everyone.pdf',
      'Building AI Powered Chatbots Without Programming.pdf',
      'Generative AI Introduction and Applications.pdf',
      'Generative AI Prompt Engineering Basics.pdf',
      'Introduction to Artificial Intelligence (AI).pdf'
    ]
  },
  profile: {
    localPath: 'public/',
    storagePath: 'images/',
    files: ['avatar.png']
  },
  papers: {
    localPath: 'public/papers/',
    storagePath: 'papers/',
    files: [] // Will be populated dynamically
  }
};

async function uploadFileToSupabase(localPath, storagePath, filename) {
  try {
    const fullLocalPath = path.join(localPath, filename);
    
    // Check if file exists
    if (!fs.existsSync(fullLocalPath)) {
      console.log(`⚠️ File not found: ${fullLocalPath}`);
      return null;
    }
    
    // Read file
    const fileBuffer = fs.readFileSync(fullLocalPath);
    const storageKey = `${storagePath}${filename}`;
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    
    console.log(`📤 Uploading: ${filename} to ${storageKey}`);
    
    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(storageKey, fileBuffer, {
        contentType,
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('assets')
      .getPublicUrl(storageKey);
    
    console.log(`✅ Uploaded: ${filename}`);
    console.log(`🔗 URL: ${publicUrl.publicUrl}`);
    
    return {
      filename,
      url: publicUrl.publicUrl,
      storageKey,
      contentType
    };
    
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function migrateCVFiles() {
  console.log('\n📄 Migrating CV Files...');
  
  const cvData = {
    english: { isActive: false, url: '', filename: '' },
    japanese: { isActive: false, url: '', filename: '' }
  };
  
  for (const file of contentStructure.cv.files) {
    const result = await uploadFileToSupabase(
      contentStructure.cv.localPath,
      contentStructure.cv.storagePath,
      file.name
    );
    
    if (result) {
      cvData[file.language] = {
        isActive: true,
        url: result.url,
        filename: result.filename
      };
    }
  }
  
  return cvData;
}

async function migrateCertificates() {
  console.log('\n📜 Migrating Certificates...');
  
  const certificates = [];
  
  for (const filename of contentStructure.certificates.files) {
    const result = await uploadFileToSupabase(
      contentStructure.certificates.localPath,
      contentStructure.certificates.storagePath,
      filename
    );
    
    if (result) {
      // Extract certificate info from filename
      const name = filename.replace('.pdf', '');
      const displayName = name.replace(/([A-Z])/g, ' $1').trim();
      
      certificates.push({
        name: displayName,
        filename: result.filename,
        url: result.url,
        type: 'pdf',
        isActive: true,
        uploadedAt: new Date().toISOString()
      });
    }
  }
  
  return certificates;
}

async function migrateProfileImage() {
  console.log('\n🖼️ Migrating Profile Image...');
  
  const result = await uploadFileToSupabase(
    contentStructure.profile.localPath,
    contentStructure.profile.storagePath,
    'avatar.png'
  );
  
  return result ? result.url : '';
}

async function migratePapers() {
  console.log('\n📚 Migrating Papers...');
  
  const papersPath = contentStructure.papers.localPath;
  let papers = [];
  
  try {
    if (fs.existsSync(papersPath)) {
      const files = fs.readdirSync(papersPath);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
      
      for (const filename of pdfFiles) {
        const result = await uploadFileToSupabase(
          papersPath,
          contentStructure.papers.storagePath,
          filename
        );
        
        if (result) {
          const name = filename.replace('.pdf', '');
          papers.push({
            name: name,
            filename: result.filename,
            url: result.url,
            type: 'pdf',
            isActive: true,
            uploadedAt: new Date().toISOString()
          });
        }
      }
    }
  } catch (error) {
    console.log('⚠️ Papers directory not found or empty');
  }
  
  return papers;
}

async function updatePortfolioData(cvData, certificates, profileImageUrl, papers) {
  console.log('\n💾 Updating Portfolio Data...');
  
  try {
    // Get current portfolio data
    const { data: current, error: readError } = await supabase
      .from('portfolio')
      .select('data')
      .eq('id', 1)
      .single();
    
    if (readError) {
      throw new Error(`Failed to read current data: ${readError.message}`);
    }
    
    const currentData = current?.data || {};
    
    // Update with migrated content
    const updatedData = {
      ...currentData,
      cv: cvData,
      certificates: certificates,
      papers: papers,
      profile: {
        ...currentData.profile,
        imageUrl: profileImageUrl || currentData.profile?.imageUrl || ''
      }
    };
    
    // Update portfolio
    const { error: updateError } = await supabase
      .from('portfolio')
      .update({ 
        data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);
    
    if (updateError) {
      throw new Error(`Failed to update portfolio: ${updateError.message}`);
    }
    
    console.log('✅ Portfolio data updated successfully');
    return updatedData;
    
  } catch (error) {
    console.error('❌ Failed to update portfolio data:', error.message);
    return null;
  }
}

async function runMigration() {
  console.log('🔄 Starting Content Migration...\n');
  
  try {
    // Migrate all content types
    const cvData = await migrateCVFiles();
    const certificates = await migrateCertificates();
    const profileImageUrl = await migrateProfileImage();
    const papers = await migratePapers();
    
    // Update portfolio data
    const updatedData = await updatePortfolioData(
      cvData,
      certificates,
      profileImageUrl,
      papers
    );
    
    if (updatedData) {
      console.log('\n🎉 Migration Completed Successfully!');
      console.log('\n📊 Migration Summary:');
      console.log(`📄 CV Files: ${Object.values(cvData).filter(cv => cv.isActive).length} uploaded`);
      console.log(`📜 Certificates: ${certificates.length} uploaded`);
      console.log(`🖼️ Profile Image: ${profileImageUrl ? 'Uploaded' : 'Not found'}`);
      console.log(`📚 Papers: ${papers.length} uploaded`);
      
      console.log('\n✨ Next Steps:');
      console.log('1. Visit your live site to verify all content is displayed');
      console.log('2. Test CV download buttons');
      console.log('3. Verify certificates are accessible');
      console.log('4. Check that Admin panel can edit all sections');
      
    } else {
      console.log('\n❌ Migration failed to update portfolio data');
    }
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n🏁 Migration process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration crashed:', error);
    process.exit(1);
  });
