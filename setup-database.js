const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Default portfolio data
const defaultPortfolioData = {
  "hero": {
    "name": {
      "english": "Mushabbir Ahmed",
      "japanese": "ムシャビル・アフメド"
    },
    "title": {
      "english": "Software Engineer & AI Researcher",
      "japanese": "ソフトウェアエンジニア・AI研究者"
    },
    "subtitle": {
      "english": "Passionate about creating innovative solutions",
      "japanese": "革新的なソリューションの創造に情熱を注ぐ"
    },
    "profilePicture": "/avatar.png"
  },
  "about": {
    "english": "I am a software engineer and AI researcher with expertise in machine learning, web development, and data science. I enjoy solving complex problems and creating innovative solutions.",
    "japanese": "機械学習、Web開発、データサイエンスに精通したソフトウェアエンジニア・AI研究者です。複雑な問題の解決と革新的なソリューションの創造を楽しんでいます。"
  },
  "contact": {
    "email": "mushabbir.ahmed@example.com",
    "phone": "+81-90-1234-5678",
    "location": {
      "english": "Tokyo, Japan",
      "japanese": "東京都"
    },
    "social": {
      "github": "https://github.com/mushabbir-ahmed",
      "linkedin": "https://linkedin.com/in/mushabbir-ahmed",
      "whatsapp": "https://wa.me/+8190XXXXXXX",
      "facebook": "https://facebook.com/mushabbir",
      "indeed": "https://indeed.com/profile/mushabbir"
    }
  },
  "cv": {
    "english": {
      "url": "",
      "filename": "mushabbir-en.pdf",
      "isActive": false
    },
    "japanese": {
      "url": "",
      "filename": "mushabbir-ja.pdf",
      "isActive": false
    }
  },
  "skills": {
    "languages": [
      { "name": "Python", "icon": "🐍" },
      { "name": "JavaScript", "icon": "💛" },
      { "name": "SQL", "icon": "🗄️" },
      { "name": "C++", "icon": "⚡" },
      { "name": "HTML", "icon": "🌐" },
      { "name": "CSS", "icon": "🎨" }
    ],
    "frameworks": [
      { "name": "React", "icon": "⚛️" },
      { "name": "Flask", "icon": "🔥" },
      { "name": "Spring Boot", "icon": "🍃" },
      { "name": "NumPy", "icon": "📊" },
      { "name": "Bootstrap", "icon": "🎨" }
    ],
    "databases": [
      { "name": "MongoDB", "icon": "🍃" },
      { "name": "MongoDB Atlas", "icon": "☁️" },
      { "name": "MySQL", "icon": "🐬" }
    ],
    "tools": [
      { "name": "Git", "icon": "📝" },
      { "name": "VS Code", "icon": "💻" },
      { "name": "Postman", "icon": "📮" },
      { "name": "MATLAB", "icon": "🔬" },
      { "name": "IBM Watson", "icon": "🤖" },
      { "name": "Excel", "icon": "📈" },
      { "name": "NetBeans", "icon": "☕" }
    ]
  }
};

async function setupDatabase() {
  try {
    console.log('🚀 Setting up portfolio database...');

    // Check if portfolio table exists and has data
    const { data: existingData, error: checkError } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', 1)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking portfolio table:', checkError);
      return;
    }

    if (existingData && Object.keys(existingData.data || {}).length > 0) {
      console.log('✅ Portfolio data already exists, skipping initialization');
      return;
    }

    // Initialize portfolio data
    const { error: insertError } = await supabase
      .from('portfolio')
      .upsert({
        id: 1,
        data: defaultPortfolioData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (insertError) {
      console.error('❌ Error inserting portfolio data:', insertError);
      return;
    }

    console.log('✅ Portfolio database initialized successfully!');
    console.log('📊 Default data structure created');
    console.log('🔐 Ready for admin operations');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupDatabase(); 