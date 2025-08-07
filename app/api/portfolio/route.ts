import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '../../lib/portfolioService';

// Default portfolio data for initialization
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
    "linkedin": "https://linkedin.com/in/mushabbir-ahmed",
    "github": "https://github.com/mushabbir-ahmed",
    "twitter": "https://twitter.com/mushabbir_ahmed"
  },
  "education": [
    {
      "id": "edu-1",
      "degree": {
        "english": "Master of Science in Computer Science",
        "japanese": "コンピュータサイエンス修士"
      },
      "institution": {
        "english": "University of Tokyo",
        "japanese": "東京大学"
      },
      "period": {
        "english": "2020 - 2022",
        "japanese": "2020年 - 2022年"
      },
      "description": {
        "english": "Specialized in Artificial Intelligence and Machine Learning",
        "japanese": "人工知能と機械学習を専攻"
      }
    },
    {
      "id": "edu-2",
      "degree": {
        "english": "Bachelor of Engineering in Computer Science",
        "japanese": "コンピュータサイエンス工学学士"
      },
      "institution": {
        "english": "Dhaka University",
        "japanese": "ダッカ大学"
      },
      "period": {
        "english": "2016 - 2020",
        "japanese": "2016年 - 2020年"
      },
      "description": {
        "english": "Focused on Software Engineering and Database Systems",
        "japanese": "ソフトウェアエンジニアリングとデータベースシステムに焦点"
      }
    }
  ],
  "experience": [
    {
      "id": "exp-1",
      "position": {
        "english": "Senior Software Engineer",
        "japanese": "シニアソフトウェアエンジニア"
      },
      "company": {
        "english": "TechCorp Japan",
        "japanese": "テックコープ・ジャパン"
      },
      "period": {
        "english": "2022 - Present",
        "japanese": "2022年 - 現在"
      },
      "description": {
        "english": "Leading development of AI-powered applications and mentoring junior developers",
        "japanese": "AI駆動アプリケーションの開発をリードし、ジュニア開発者のメンタリング"
      }
    },
    {
      "id": "exp-2",
      "position": {
        "english": "Software Engineer",
        "japanese": "ソフトウェアエンジニア"
      },
      "company": {
        "english": "StartupXYZ",
        "japanese": "スタートアップXYZ"
      },
      "period": {
        "english": "2020 - 2022",
        "japanese": "2020年 - 2022年"
      },
      "description": {
        "english": "Developed full-stack web applications and implemented machine learning models",
        "japanese": "フルスタックWebアプリケーションの開発と機械学習モデルの実装"
      }
    }
  ],
           "skills": {
           "languages": [
             {
               "id": "lang-1",
               "name": "Python",
               "icon": "🐍"
             },
             {
               "id": "lang-2",
               "name": "JavaScript",
               "icon": "⚡"
             },
             {
               "id": "lang-3",
               "name": "TypeScript",
               "icon": "📘"
             },
             {
               "id": "lang-4",
               "name": "Java",
               "icon": "☕"
             },
             {
               "id": "lang-5",
               "name": "C++",
               "icon": "⚙️"
             },
             {
               "id": "lang-6",
               "name": "SQL",
               "icon": "🗄️"
             }
           ],
           "frameworks": [
             {
               "id": "fw-1",
               "name": "React",
               "icon": "⚛️"
             },
             {
               "id": "fw-2",
               "name": "Next.js",
               "icon": "▲"
             },
             {
               "id": "fw-3",
               "name": "Node.js",
               "icon": "🟢"
             },
             {
               "id": "fw-4",
               "name": "Django",
               "icon": "🐍"
             },
             {
               "id": "fw-5",
               "name": "Flask",
               "icon": "🍶"
             },
             {
               "id": "fw-6",
               "name": "TensorFlow",
               "icon": "🧠"
             },
             {
               "id": "fw-7",
               "name": "PyTorch",
               "icon": "🔥"
             }
           ],
           "databases": [
             {
               "id": "db-1",
               "name": "MongoDB",
               "icon": "🍃"
             },
             {
               "id": "db-2",
               "name": "PostgreSQL",
               "icon": "🐘"
             },
             {
               "id": "db-3",
               "name": "Redis",
               "icon": "🔴"
             }
           ],
           "tools": [
             {
               "id": "tool-1",
               "name": "Git",
               "icon": "📚"
             },
             {
               "id": "tool-2",
               "name": "Docker",
               "icon": "🐳"
             },
             {
               "id": "tool-3",
               "name": "AWS",
               "icon": "☁️"
             },
             {
               "id": "tool-4",
               "name": "Azure",
               "icon": "🔵"
             }
           ]
         },
  "projects": [
    {
      "id": "proj-1",
      "title": {
        "english": "AI-Powered Portfolio Manager",
        "japanese": "AI駆動ポートフォリオマネージャー"
      },
      "description": {
        "english": "A machine learning application that analyzes market trends and provides investment recommendations",
        "japanese": "市場動向を分析し投資推奨を提供する機械学習アプリケーション"
      },
      "technologies": ["Python", "TensorFlow", "React", "Node.js"],
      "github": "https://github.com/mushabbir-ahmed/portfolio-manager",
      "demo": "https://portfolio-manager-demo.com",
      "image": "/uploads/projects/project-1-1753969354257.jpg"
    },
    {
      "id": "proj-2",
      "title": {
        "english": "Real-time Chat Application",
        "japanese": "リアルタイムチャットアプリケーション"
      },
      "description": {
        "english": "A real-time messaging application with end-to-end encryption and file sharing capabilities",
        "japanese": "エンドツーエンド暗号化とファイル共有機能を備えたリアルタイムメッセージングアプリケーション"
      },
      "technologies": ["React", "Socket.io", "Node.js", "MongoDB"],
      "github": "https://github.com/mushabbir-ahmed/chat-app",
      "demo": "https://chat-app-demo.com",
      "image": "/uploads/projects/project-2-1753969362029.jpg"
    }
  ],
  "papers": [
    {
      "id": "paper-1",
      "title": {
        "english": "Deep Learning Approaches for Natural Language Processing",
        "japanese": "自然言語処理のためのディープラーニングアプローチ"
      },
      "authors": ["Mushabbir Ahmed", "Dr. Tanaka"],
      "journal": "International Journal of Computer Science",
      "year": "2022",
      "abstract": {
        "english": "This paper explores various deep learning techniques for improving natural language processing tasks.",
        "japanese": "この論文は自然言語処理タスクを改善するための様々なディープラーニング技術を探求します。"
      },
      "doi": "10.1000/example.2022.001",
      "pdf": "/papers/1753892244652_paper_1753892252549_JSC-Certificate.pdf"
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": {
        "english": "AI Foundations for Everyone",
        "japanese": "AI基礎（全員向け）"
      },
      "issuer": "IBM",
      "date": "2023",
      "image": "/certifications/AI Foundations for Everyone.jpg",
      "pdf": "/certifications/AI Foundations for Everyone.pdf"
    },
    {
      "id": "cert-2",
      "name": {
        "english": "Building AI Powered Chatbots Without Programming",
        "japanese": "プログラミングなしでAI駆動チャットボットを構築"
      },
      "issuer": "IBM",
      "date": "2023",
      "image": "/certifications/Building AI Powered Chatbots Without Programming.jpg",
      "pdf": "/certifications/Building AI Powered Chatbots Without Programming.pdf"
    },
    {
      "id": "cert-3",
      "name": {
        "english": "Generative AI Introduction and Applications",
        "japanese": "生成AI入門と応用"
      },
      "issuer": "IBM",
      "date": "2023",
      "image": "/certifications/Generative AI Introduction and Applications.jpg",
      "pdf": "/certifications/Generative AI Introduction and Applications.pdf"
    },
    {
      "id": "cert-4",
      "name": {
        "english": "Generative AI Prompt Engineering Basics",
        "japanese": "生成AIプロンプトエンジニアリング基礎"
      },
      "issuer": "IBM",
      "date": "2023",
      "image": "/certifications/Generative AI Prompt Engineering Basics.jpg",
      "pdf": "/certifications/Generative AI Prompt Engineering Basics.pdf"
    },
    {
      "id": "cert-5",
      "name": {
        "english": "Introduction to Artificial Intelligence (AI)",
        "japanese": "人工知能（AI）入門"
      },
      "issuer": "IBM",
      "date": "2023",
      "image": "/certifications/Introduction to Artificial Intelligence (AI).jpg",
      "pdf": "/certifications/Introduction to Artificial Intelligence (AI).pdf"
    }
  ],
  "cv": {
    "english": {
      "url": "/cv/mushabbir-en.pdf",
      "filename": "mushabbir-en.pdf",
      "isActive": true
    },
    "japanese": {
      "url": "/cv/mushabbir-ja.pdf",
      "filename": "mushabbir-ja.pdf",
      "isActive": true
    }
  }
};

export async function GET() {
  try {

    
    const data = await PortfolioService.getPortfolioData();
    
    // If no data exists, initialize with default data
    if (!data || Object.keys(data).length === 0) {
      
      try {
        await PortfolioService.initializePortfolioData(defaultPortfolioData);
        return NextResponse.json(defaultPortfolioData);
      } catch (initError) {
        console.error('Error initializing portfolio data:', initError);
        // Return default data even if initialization fails
        return NextResponse.json(defaultPortfolioData);
      }
    }
    
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    
    // Check if it's a database connection issue
    if (error instanceof Error && error.message.includes('relation') || 
        error instanceof Error && error.message.includes('table')) {

      return NextResponse.json(
        { 
          error: 'Database not configured. Please run the database setup first.',
          details: 'The portfolio_sections table does not exist. Run database-setup.sql in Supabase.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {

    
    // Check content length - Vercel has a 4.5MB limit for serverless functions
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 4 * 1024 * 1024) {
      
      return NextResponse.json(
        { error: 'Payload too large. Maximum size is 4MB. Please update sections individually.' },
        { status: 413 }
      );
    }

    const body = await request.json();
    
    
    // Validate the data structure
    if (!body || typeof body !== 'object') {
      
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Handle section-specific updates
    if (body.section && body.data !== undefined) {
      const result = await PortfolioService.updateSection(body.section, body.data);
      
      if (!result || result.success === false) {
        return NextResponse.json(
          { error: 'Failed to update section' },
          { status: 500 }
        );
      }

      
      return NextResponse.json({ 
        message: `Section ${body.section} updated successfully`,
        success: true
      });
    }

    // Handle full portfolio update - split into sections to avoid size limits
    const sections = Object.keys(body);
    const results = [];

    for (const section of sections) {
      try {
        // Skip sections that might be too large
        if (section === 'projects' && body[section] && Array.isArray(body[section])) {
          // For projects, only update metadata, not full project data
          const projectMetadata = body[section].map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            image: project.image,
            github: project.github,
            live: project.live
          }));
          const result = await PortfolioService.updateSection(section, projectMetadata);
          results.push({ section, success: result && result.success !== false });
        } else {
          const result = await PortfolioService.updateSection(section, body[section]);
          results.push({ section, success: result && result.success !== false });
        }
      } catch (error) {
        console.error(`Error updating section ${section}:`, error);
        results.push({ section, success: false, error: error instanceof Error ? error.message : String(error) });
      }
    }

    const failedSections = results.filter(r => !r.success);
    
    if (failedSections.length > 0) {
      console.error('Some sections failed to update:', failedSections);
      return NextResponse.json(
        { 
          error: 'Some sections failed to update',
          failedSections 
        },
        { status: 500 }
      );
    }
    
    
    return NextResponse.json({ 
      message: 'Portfolio data updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Error updating portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {

    
    const body = await request.json();
    
    
    // Validate the data structure
    if (!body || typeof body !== 'object') {
      
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Initialize portfolio data
    await PortfolioService.initializePortfolioData(body);
    
    
    return NextResponse.json({ 
      message: 'Portfolio data created successfully'
    });
  } catch (error) {
    console.error('Error creating portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {

    
    const { section, key } = await request.json();
    

    await PortfolioService.deleteItem(section, key);
    
    
    return NextResponse.json({ 
      message: "Deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
} 