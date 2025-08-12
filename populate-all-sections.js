const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🚀 Populating All Portfolio Sections with Comprehensive Content...\n');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

async function populateAllSections() {
  try {
    console.log('📚 Creating comprehensive portfolio content...');
    
    // Define comprehensive content for all sections
    const comprehensiveContent = {
      // Hero Section
      hero: {
        name: {
          english: "Mushabbir Ahmed",
          japanese: "ムサビル・アハメド"
        },
        title: {
          english: "AI Specialist & Software Engineer",
          japanese: "AIスペシャリスト・ソフトウェアエンジニア"
        },
        subtitle: {
          english: "Passionate about creating innovative solutions",
          japanese: "革新的なソリューションの創造に情熱を注ぐ"
        },
        description: {
          english: "I'm a results-driven AI Specialist and Software Engineer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan. I specialize in developing cutting-edge AI applications and full-stack solutions.",
          japanese: "現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程に在籍しているAIスペシャリスト・ソフトウェアエンジニアです。最先端のAIアプリケーションとフルスタックソリューションの開発を専門としています。"
        },
        profilePicture: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/images/avatar.png",
        tools: ["AI/ML", "React", "Next.js", "Python", "Node.js", "PostgreSQL"]
      },

      // About Section
      about: {
        english: "I am a passionate AI Specialist and Software Engineer with expertise in machine learning, deep learning, and full-stack development. I love solving complex problems and creating innovative solutions that make a difference.",
        japanese: "機械学習、ディープラーニング、フルスタック開発に精通した情熱的なAIスペシャリスト・ソフトウェアエンジニアです。複雑な問題を解決し、違いを生む革新的なソリューションを作成することが大好きです。",
        location: {
          english: "Saga, Japan",
          japanese: "佐賀県、日本"
        },
        status: {
          english: "Available for opportunities",
          japanese: "機会を待っています"
        },
        education: {
          english: "Master's in Intelligent Information Engineering",
          japanese: "知能情報工学修士課程"
        }
      },

      // Contact Section
      contact: {
        email: "mushabbir@example.com",
        phone: "+81-90-XXXX-XXXX",
        location: {
          english: "Saga, Japan",
          japanese: "佐賀県、日本"
        },
        social: {
          github: "https://github.com/mushabbir",
          linkedin: "https://linkedin.com/in/mushabbir",
          whatsapp: "https://wa.me/+8190XXXXXXX",
          facebook: "https://facebook.com/mushabbir",
          indeed: "https://indeed.com/profile/mushabbir",
          twitter: "https://twitter.com/mushabbir"
        }
      },

      // Education Section
      education: [
        {
          degree: {
            english: "Master of Engineering in Intelligent Information Engineering",
            japanese: "知能情報工学修士課程"
          },
          institution: {
            english: "Saga University",
            japanese: "佐賀大学"
          },
          year: {
            english: "2024 - Present",
            japanese: "2024年 - 現在"
          },
          description: {
            english: "Specialized in AI, Machine Learning, and Intelligent Systems",
            japanese: "AI、機械学習、知能システムを専門とする"
          },
          achievements: {
            english: ["Research in Computer Vision", "AI Ethics", "Machine Learning Applications"],
            japanese: ["コンピュータビジョンの研究", "AI倫理", "機械学習の応用"]
          }
        },
        {
          degree: {
            english: "Bachelor of Computer Science",
            japanese: "コンピュータサイエンス学士"
          },
          institution: {
            english: "University of Dhaka",
            japanese: "ダッカ大学"
          },
          year: {
            english: "2019 - 2023",
            japanese: "2019年 - 2023年"
          },
          description: {
            english: "Computer Science and Engineering with focus on Software Development",
            japanese: "ソフトウェア開発に焦点を当てたコンピュータサイエンス・エンジニアリング"
          },
          achievements: {
            english: ["Dean's List", "Software Engineering Project", "Database Design"],
            japanese: ["学部長表彰", "ソフトウェアエンジニアリングプロジェクト", "データベース設計"]
          }
        }
      ],

      // Experience Section
      experience: [
        {
          title: {
            english: "AI Research Assistant",
            japanese: "AI研究アシスタント"
          },
          company: {
            english: "Saga University AI Lab",
            japanese: "佐賀大学AI研究室"
          },
          period: {
            english: "2024 - Present",
            japanese: "2024年 - 現在"
          },
          description: {
            english: "Conducting research in computer vision and machine learning applications",
            japanese: "コンピュータビジョンと機械学習アプリケーションの研究を実施"
          },
          technologies: ["Python", "TensorFlow", "OpenCV", "PyTorch"]
        },
        {
          title: {
            english: "Full Stack Developer",
            japanese: "フルスタック開発者"
          },
          company: {
            english: "Tech Solutions Inc.",
            japanese: "テックソリューションズ株式会社"
          },
          period: {
            english: "2023 - 2024",
            japanese: "2023年 - 2024年"
          },
          description: {
            english: "Developed modern web applications using React, Node.js, and cloud technologies",
            japanese: "React、Node.js、クラウド技術を使用してモダンなWebアプリケーションを開発"
          },
          technologies: ["React", "Node.js", "MongoDB", "AWS", "Docker"]
        }
      ],

      // Projects Section
      projects: [
        {
          title: {
            english: "AI-Powered Portfolio Website",
            japanese: "AI駆動ポートフォリオウェブサイト"
          },
          description: {
            english: "Modern portfolio built with Next.js, Supabase, and AI integration features",
            japanese: "Next.js、Supabase、AI統合機能を備えたモダンなポートフォリオ"
          },
          technologies: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS", "AI/ML"],
          imageUrl: "",
          githubUrl: "https://github.com/mushabbir/portfolio",
          liveUrl: "https://mushabbir-portfolio.vercel.app",
          features: {
            english: ["AI-powered content suggestions", "Real-time updates", "Responsive design"],
            japanese: ["AI駆動コンテンツ提案", "リアルタイム更新", "レスポンシブデザイン"]
          }
        },
        {
          title: {
            english: "Computer Vision Application",
            japanese: "コンピュータビジョンアプリケーション"
          },
          description: {
            english: "Real-time object detection and recognition system using deep learning",
            japanese: "ディープラーニングを使用したリアルタイム物体検出・認識システム"
          },
          technologies: ["Python", "OpenCV", "TensorFlow", "YOLO", "Flask"],
          imageUrl: "",
          githubUrl: "https://github.com/mushabbir/cv-app",
          liveUrl: "",
          features: {
            english: ["Real-time detection", "Multiple object classes", "High accuracy"],
            japanese: ["リアルタイム検出", "複数物体クラス", "高精度"]
          }
        }
      ],

      // Skills Section
      skills: {
        languages: ["English", "Japanese", "Bengali"],
        frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS", "JavaScript"],
        backend: ["Node.js", "Express", "Python", "PostgreSQL", "Supabase", "MongoDB"],
        ai_ml: ["TensorFlow", "PyTorch", "OpenCV", "Scikit-learn", "Computer Vision", "NLP"],
        tools: ["Git", "Docker", "AWS", "Vercel", "Figma", "Jupyter Notebook"],
        databases: ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
        cloud: ["AWS", "Vercel", "Netlify", "Heroku", "Google Cloud"]
      },

      // CV Section (already populated)
      cv: {
        english: {
          isActive: true,
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/cv/mushabbir-en.pdf",
          filename: "mushabbir-en.pdf"
        },
        japanese: {
          isActive: true,
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/cv/mushabbir-ja.pdf",
          filename: "mushabbir-ja.pdf"
        }
      },

      // Certificates Section (already populated)
      certificates: [
        {
          name: "AI Foundations for Everyone",
          filename: "AI Foundations for Everyone.pdf",
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/certificates/AI%20Foundations%20for%20Everyone.pdf",
          type: "pdf",
          isActive: true,
          issuer: "IBM",
          date: "2024",
          uploadedAt: new Date().toISOString()
        },
        {
          name: "Building AI Powered Chatbots Without Programming",
          filename: "Building AI Powered Chatbots Without Programming.pdf",
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/certificates/Building%20AI%20Powered%20Chatbots%20Without%20Programming.pdf",
          type: "pdf",
          isActive: true,
          issuer: "IBM",
          date: "2024",
          uploadedAt: new Date().toISOString()
        },
        {
          name: "Generative AI Introduction and Applications",
          filename: "Generative AI Introduction and Applications.pdf",
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/certificates/Generative%20AI%20Introduction%20and%20Applications.pdf",
          type: "pdf",
          isActive: true,
          issuer: "IBM",
          date: "2024",
          uploadedAt: new Date().toISOString()
        },
        {
          name: "Generative AI Prompt Engineering Basics",
          filename: "Generative AI Prompt Engineering Basics.pdf",
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/certificates/Generative%20AI%20Prompt%20Engineering%20Basics.pdf",
          type: "pdf",
          isActive: true,
          issuer: "IBM",
          date: "2024",
          uploadedAt: new Date().toISOString()
        },
        {
          name: "Introduction to Artificial Intelligence (AI)",
          filename: "Introduction to Artificial Intelligence (AI).pdf",
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/certificates/Introduction%20to%20Artificial%20Intelligence%20(AI).pdf",
          type: "pdf",
          isActive: true,
          issuer: "IBM",
          date: "2024",
          uploadedAt: new Date().toISOString()
        }
      ],

      // Papers Section (already populated)
      papers: [
        {
          name: "JSC Certificate Research",
          filename: "1753892244652_paper_1753892252549_JSC-Certificate.pdf",
          url: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/papers/1753892244652_paper_1753892252549_JSC-Certificate.pdf",
          type: "pdf",
          isActive: true,
          title: {
            english: "JSC Certificate Research Paper",
            japanese: "JSC証明書研究論文"
          },
          conference: {
            english: "International Conference on Computer Science",
            japanese: "国際コンピュータサイエンス会議"
          },
          date: {
            english: "2024",
            japanese: "2024年"
          },
          uploadedAt: new Date().toISOString()
        }
      ],

      // Profile Section
      profile: {
        name: "Mushabbir",
        title: "Full Stack Developer",
        email: "mushabbir@example.com",
        phone: "+81-90-XXXX-XXXX",
        location: "Saga, Japan",
        bio: "Passionate developer with expertise in modern web technologies and AI",
        imageUrl: "https://teqnfolvsxicemfojpol.supabase.co/storage/v1/object/public/assets/images/avatar.png"
      }
    };

    console.log('💾 Updating portfolio with comprehensive content...');
    
    // Update portfolio with comprehensive content
    const { error: updateError } = await supabase
      .from('portfolio')
      .update({ 
        data: comprehensiveContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);
    
    if (updateError) {
      throw new Error(`Failed to update portfolio: ${updateError.message}`);
    }
    
    console.log('✅ Portfolio updated successfully with comprehensive content!');
    console.log('\n📊 Content Summary:');
    console.log(`👤 Hero Section: ✅ Complete`);
    console.log(`ℹ️ About Section: ✅ Complete`);
    console.log(`📞 Contact Section: ✅ Complete`);
    console.log(`🎓 Education: ${comprehensiveContent.education.length} entries`);
    console.log(`💼 Experience: ${comprehensiveContent.experience.length} entries`);
    console.log(`🚀 Projects: ${comprehensiveContent.projects.length} entries`);
    console.log(`🛠️ Skills: ${Object.keys(comprehensiveContent.skills).length} categories`);
    console.log(`📄 CV Files: ${Object.values(comprehensiveContent.cv).filter(cv => cv.isActive).length} active`);
    console.log(`📜 Certificates: ${comprehensiveContent.certificates.length} entries`);
    console.log(`📚 Papers: ${comprehensiveContent.papers.length} entries`);
    
    return comprehensiveContent;
    
  } catch (error) {
    console.error('❌ Failed to populate sections:', error.message);
    return null;
  }
}

// Run the population
populateAllSections()
  .then((content) => {
    if (content) {
      console.log('\n🎉 All sections populated successfully!');
      console.log('\n✨ Next steps:');
      console.log('1. Test the Admin panel to edit all sections');
      console.log('2. Verify the main site displays all content from Supabase');
      console.log('3. Test editing contact info, social media links, etc.');
      console.log('4. Ensure all changes persist in Supabase');
    }
    process.exit(content ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n💥 Population failed:', error);
    process.exit(1);
  });
