// Simple test script to verify admin functionality
// Run this in the browser console on the admin page

async function testAdminFunctions() {
  console.log('Testing admin functions...');
  
  // Test 1: Load portfolio data
  try {
    const response = await fetch('/api/portfolio');
    const data = await response.json();
    console.log('✅ Portfolio data loaded successfully:', data);
  } catch (error) {
    console.error('❌ Failed to load portfolio data:', error);
  }
  
  // Test 2: Save portfolio data
  try {
    const testData = {
      hero: {
        name: { english: "Test Name", japanese: "テスト名前" },
        title: { english: "Test Title", japanese: "テストタイトル" },
        subtitle: { english: "Test Subtitle", japanese: "テストサブタイトル" },
        description: { english: "Test Description", japanese: "テスト説明" },
        profilePicture: null,
        tools: []
      },
      about: {
        english: "Test about",
        japanese: "テストについて",
        location: "Test Location",
        status: "Test Status",
        education: "Test Education"
      },
      cv: {
        english: { url: "", filename: "", isActive: false },
        japanese: { url: "", filename: "", isActive: false }
      },
      education: [],
      skills: {
        languages: [],
        frameworks: [],
        databases: [],
        tools: []
      },
      certifications: [],
      papers: [],
      projects: [],
      contact: {
        email: "test@example.com",
        phone: "123-456-7890",
        location: "Test Location",
        social: {
          github: "",
          linkedin: "",
          whatsapp: "",
          facebook: "",
          indeed: ""
        }
      }
    };
    
    const saveResponse = await fetch('/api/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (saveResponse.ok) {
      console.log('✅ Portfolio data saved successfully');
    } else {
      console.error('❌ Failed to save portfolio data');
    }
  } catch (error) {
    console.error('❌ Error saving portfolio data:', error);
  }
  
  // Test 3: Test file upload endpoints
  try {
    // Test CV upload endpoint
    const cvFormData = new FormData();
    const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    cvFormData.append('file', testFile);
    cvFormData.append('language', 'en');
    
    const cvResponse = await fetch('/api/cv-upload', {
      method: 'POST',
      body: cvFormData
    });
    
    if (cvResponse.ok) {
      console.log('✅ CV upload endpoint working');
    } else {
      console.error('❌ CV upload endpoint failed');
    }
  } catch (error) {
    console.error('❌ Error testing CV upload:', error);
  }
  
  console.log('Admin function tests completed!');
}

// Run the test
testAdminFunctions(); 