import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for Vercel compatibility
// In production, you'd use a database like MongoDB, PostgreSQL, or Redis
let portfolioData: any = null;

// Default portfolio data
const defaultPortfolioData = {
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
      english: "I'm a results-driven AI Specialist and Software Engineer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan.",
      japanese: "現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程に在籍しているAIスペシャリスト・ソフトウェアエンジニアです。"
    },
    profilePicture: null,
    tools: [
      { name: 'Git', icon: '📝' },
      { name: 'VS Code', icon: '💻' },
      { name: 'Postman', icon: '📮' },
      { name: 'MATLAB', icon: '🔬' },
      { name: 'IBM Watson', icon: '🤖' },
      { name: 'Excel', icon: '📈' },
      { name: 'NetBeans', icon: '☕' }
    ]
  },
  about: {
    english: "I'm Mushabbir Ahmed, a results-driven AI Specialist and Software Engineer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan (Graduating March 2026). With a strong foundation in Software Engineering from Qingdao University, China, I specialize in developing secure, scalable systems using React, Flask, MongoDB, and advanced encryption methods like AES‑256 and RSA‑2048. My hands-on projects include a secure medical data simulation system and a movie recommendation engine. I'm also serving as an International Student Tutor and was appointed as a Saga City International Tourism Ambassador in July 2025. I'm passionate about delivering data-driven, AI-powered solutions that create real-world impact.",
    japanese: "私はムサビル・アハメドと申します。現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程（2026年3月修了予定）に在籍しています。中国の青島大学でソフトウェア工学を学び、Python・JavaScript・React・Flask・MongoDBを活用したソフトウェア開発および、AES-256・RSA-2048などの高度な暗号技術を用いたセキュアなシステム構築を得意としています。医療データ暗号化シミュレーションや映画レコメンデーションシステムの開発経験があり、現在は佐賀大学の技術サポートチューターとしても活動中です。2025年7月には佐賀市国際観光アンバサダーにも任命され、地域貢献にも力を入れています。",
    location: "",
    status: "Actively looking for full-time opportunities in Japan",
    education: "Master's Student at Saga University"
  },
  cv: {
    english: {
      url: "/cv/mushabbir-en.pdf",
      filename: "mushabbir-en.pdf",
      isActive: true
    },
    japanese: {
      url: "/cv/mushabbir-ja.pdf",
      filename: "mushabbir-ja.pdf",
      isActive: false
    }
  },
  education: [
    {
      id: "1",
      institution: {
        english: "Saga University, Japan",
        japanese: "佐賀大学、日本"
      },
      degree: {
        english: "Master of Engineering in Intelligent Information Engineering",
        japanese: "理工学専攻 知能情報工学コース 修士課程"
      },
      period: {
        english: "April 2024 – March 2026 (Expected)",
        japanese: "2024年4月 – 2026年3月（予定）"
      },
      description: {
        english: "Currently pursuing Master's degree in Intelligent Information Engineering with focus on AI, machine learning, and intelligent systems development.",
        japanese: "現在、AI、機械学習、知能システム開発に焦点を当てた知能情報工学の修士課程を履修中です。"
      },
      achievements: {
        english: ["International Student Tutor", "Saga City International Tourism Ambassador (July 2025)"],
        japanese: ["国際学生チューター", "佐賀市国際観光アンバサダー（2025年7月）"]
      }
    },
    {
      id: "2",
      institution: {
        english: "Qingdao University, China",
        japanese: "青島大学、中国"
      },
      degree: {
        english: "Bachelor of Engineering in Software Engineering",
        japanese: "ソフトウェア工学 学士課程"
      },
      period: {
        english: "September 2018 – July 2022",
        japanese: "2018年9月 – 2022年7月"
      },
      description: {
        english: "Completed Bachelor's degree in Software Engineering with strong foundation in programming, algorithms, software development principles, and system design.",
        japanese: "プログラミング、アルゴリズム、ソフトウェア開発原理、システム設計の強固な基盤を持つソフトウェア工学の学士課程を修了しました。"
      },
      achievements: {
        english: [],
        japanese: []
      }
    }
  ],
  skills: {
    languages: [
      { name: 'Python', icon: '🐍' },
      { name: 'JavaScript', icon: '💛' },
      { name: 'SQL', icon: '🗄️' },
      { name: 'C++', icon: '⚡' },
      { name: 'HTML', icon: '🌐' },
      { name: 'CSS', icon: '🎨' }
    ],
    frameworks: [
      { name: 'React', icon: '⚛️' },
      { name: 'Flask', icon: '🔥' },
      { name: 'Spring Boot', icon: '🍃' },
      { name: 'NumPy', icon: '📊' },
      { name: 'Bootstrap', icon: '🎨' }
    ],
    databases: [
      { name: 'MongoDB', icon: '🍃' },
      { name: 'MongoDB Atlas', icon: '☁️' },
      { name: 'MySQL', icon: '🐬' }
    ],
    tools: [
      { name: 'Git', icon: '📝' },
      { name: 'VS Code', icon: '💻' },
      { name: 'Postman', icon: '📮' },
      { name: 'MATLAB', icon: '🔬' },
      { name: 'IBM Watson', icon: '🤖' },
      { name: 'Excel', icon: '📈' },
      { name: 'NetBeans', icon: '☕' }
    ]
  },
  certifications: [
    {
      id: "1",
      title: "AI Foundations for Everyone",
      issuer: "IBM",
      date: "2024",
      image: "/certifications/AI Foundations for Everyone.jpg",
      pdf: "/certifications/AI Foundations for Everyone.pdf"
    },
    {
      id: "2",
      title: "Building AI Powered Chatbots Without Programming",
      issuer: "IBM",
      date: "2024",
      image: "/certifications/Building AI Powered Chatbots Without Programming.jpg",
      pdf: "/certifications/Building AI Powered Chatbots Without Programming.pdf"
    },
    {
      id: "3",
      title: "Generative AI Introduction and Applications",
      issuer: "IBM",
      date: "2024",
      image: "/certifications/Generative AI Introduction and Applications.jpg",
      pdf: "/certifications/Generative AI Introduction and Applications.pdf"
    },
    {
      id: "4",
      title: "Generative AI Prompt Engineering Basics",
      issuer: "IBM",
      date: "2024",
      image: "/certifications/Generative AI Prompt Engineering Basics.jpg",
      pdf: "/certifications/Generative AI Prompt Engineering Basics.pdf"
    },
    {
      id: "5",
      title: "Introduction to Artificial Intelligence (AI)",
      issuer: "IBM",
      date: "2024",
      image: "/certifications/Introduction to Artificial Intelligence (AI).jpg",
      pdf: "/certifications/Introduction to Artificial Intelligence (AI).pdf"
    }
  ],
  papers: [
    {
      id: "1",
      title: "AI in Healthcare",
      type: "oral",
      date: "2024",
      conference: "IEEE International Conference on Artificial Intelligence",
      paperPdf: "",
      paperFilename: "",
      presentationPdf: "",
      presentationFilename: ""
    },
    {
      id: "2",
      title: "Deep Learning for Computer Vision",
      type: "poster",
      date: "2024",
      conference: "Computer Vision Conference",
      paperPdf: "",
      paperFilename: "",
      posterPdf: "",
      posterFilename: ""
    }
  ],
  projects: [
    {
      id: "1",
      title: {
        english: "Secure Medical Data System",
        japanese: "セキュアな医療データシステム"
      },
      description: {
        english: "A comprehensive medical data encryption and management system using AES-256 encryption.",
        japanese: "AES-256暗号化を使用した包括的な医療データ暗号化および管理システム。"
      },
      technologies: ["React", "Flask", "MongoDB", "Python"],
      github: "https://github.com/mushabbir/medical-data-system",
      live: "https://medical-data-system.vercel.app",
      showImage: true,
      showLiveDemo: true,
      images: []
    },
    {
      id: "2",
      title: {
        english: "Movie Recommendation Engine",
        japanese: "映画レコメンデーションシステム"
      },
      description: {
        english: "AI-powered movie recommendation system using machine learning algorithms.",
        japanese: "機械学習アルゴリズムを使用したAIによる映画レコメンデーションシステム。"
      },
      technologies: ["Python", "NumPy", "Pandas", "Scikit-learn"],
      github: "https://github.com/mushabbir/movie-recommender",
      live: "https://movie-recommender.vercel.app",
      showImage: true,
      showLiveDemo: true,
      images: []
    }
  ],
  contact: {
    email: "mushabbir@example.com",
    phone: "+81 90-XXXX-XXXX",
    location: "",
    social: {
      github: "https://github.com/mushabbir",
      linkedin: "https://linkedin.com/in/mushabbir",
      whatsapp: "https://wa.me/+8190XXXXXXX",
      facebook: "https://facebook.com/mushabbir",
      indeed: "https://indeed.com/profile/mushabbir"
    }
  }
};

// Helper function to get portfolio data
function getPortfolioData() {
  if (!portfolioData) {
    portfolioData = { ...defaultPortfolioData };
  }
  return portfolioData;
}

// Helper function to save portfolio data
function savePortfolioData(data: any) {
  try {
    // Ensure all required sections exist with proper structure
    const sanitizedData = {
      ...defaultPortfolioData,
      ...data,
      hero: {
        ...defaultPortfolioData.hero,
        ...data.hero,
        name: data.hero?.name || defaultPortfolioData.hero.name,
        title: data.hero?.title || defaultPortfolioData.hero.title,
        subtitle: data.hero?.subtitle || defaultPortfolioData.hero.subtitle,
        description: data.hero?.description || defaultPortfolioData.hero.description,
        profilePicture: data.hero?.profilePicture || null,
        tools: Array.isArray(data.hero?.tools) ? data.hero.tools : defaultPortfolioData.hero.tools
      },
      about: {
        ...defaultPortfolioData.about,
        ...data.about
      },
      cv: {
        ...defaultPortfolioData.cv,
        ...data.cv
      },
      education: Array.isArray(data.education) ? data.education : defaultPortfolioData.education,
      skills: {
        ...defaultPortfolioData.skills,
        ...data.skills,
        languages: Array.isArray(data.skills?.languages) ? data.skills.languages : defaultPortfolioData.skills.languages,
        frameworks: Array.isArray(data.skills?.frameworks) ? data.skills.frameworks : defaultPortfolioData.skills.frameworks,
        databases: Array.isArray(data.skills?.databases) ? data.skills.databases : defaultPortfolioData.skills.databases,
        tools: Array.isArray(data.skills?.tools) ? data.skills.tools : defaultPortfolioData.skills.tools
      },
      certifications: Array.isArray(data.certifications) ? data.certifications : defaultPortfolioData.certifications,
      papers: Array.isArray(data.papers) ? data.papers : defaultPortfolioData.papers,
      projects: Array.isArray(data.projects) ? data.projects : defaultPortfolioData.projects,
      contact: {
        ...defaultPortfolioData.contact,
        ...data.contact,
        social: {
          ...defaultPortfolioData.contact.social,
          ...data.contact?.social
        }
      }
    };
    
    portfolioData = sanitizedData;
    console.log('Portfolio data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return false;
  }
}

export async function GET() {
  try {
    console.log('GET /api/portfolio - Loading portfolio data');
    const data = getPortfolioData();
    console.log('Portfolio data loaded successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/portfolio - Updating portfolio data');
    
    // Check content length with increased limit
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) { // 50MB limit
      console.log('Payload too large:', contentLength);
      return NextResponse.json(
        { error: 'Payload too large. Maximum size is 50MB.' },
        { status: 413 }
      );
    }

    const body = await request.json();
    console.log('Received portfolio data:', Object.keys(body));
    
    // Validate the data structure
    if (!body || typeof body !== 'object') {
      console.log('Invalid data format received');
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Save to memory
    const success = savePortfolioData(body);
    
    if (success) {
      console.log('Portfolio data updated successfully');
      return NextResponse.json({ 
        message: 'Portfolio data updated successfully',
        data: body 
      });
    } else {
      console.log('Failed to save portfolio data');
      return NextResponse.json(
        { error: 'Failed to save portfolio data' },
        { status: 500 }
      );
    }
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
    console.log('POST /api/portfolio - Creating portfolio data');
    
    // Check content length with increased limit
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) { // 50MB limit
      console.log('Payload too large:', contentLength);
      return NextResponse.json(
        { error: 'Payload too large. Maximum size is 50MB.' },
        { status: 413 }
      );
    }

    const body = await request.json();
    console.log('Received portfolio data:', Object.keys(body));
    
    // Validate the data structure
    if (!body || typeof body !== 'object') {
      console.log('Invalid data format received');
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Save to memory
    const success = savePortfolioData(body);
    
    if (success) {
      console.log('Portfolio data created successfully');
      return NextResponse.json({ 
        message: 'Portfolio data created successfully',
        data: body 
      });
    } else {
      console.log('Failed to create portfolio data');
      return NextResponse.json(
        { error: 'Failed to create portfolio data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating portfolio data:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio data' },
      { status: 500 }
    );
  }
} 