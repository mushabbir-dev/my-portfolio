'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { toast, Toaster } from 'sonner';
import * as si from 'react-icons/si';
import { 
  Save, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Upload,
  Download,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  MessageCircle,
  Facebook,
  X,
  Camera,
  FileText,
  CheckCircle,
  Circle,
  FileImage,
  Presentation,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

import CVUploadModal from '../components/CVUploadModal';
import CertificateManager from '../components/CertificateManager';
import dynamic from 'next/dynamic';
import SkillIconPicker from '../components/admin/SkillIconPicker';

const CertificatesSection = dynamic(() => import('../components/admin/CertificatesSection'), { ssr: false });

interface PortfolioData {
  hero: {
    name: {
      english: string;
      japanese: string;
    };
    title: {
      english: string;
      japanese: string;
    };
    subtitle: {
      english: string;
      japanese: string;
    };
    description: {
      english: string;
      japanese: string;
    };
    profilePicture: string | null;
    tools: Array<{ id: string; name: string; icon: string; iconKey?: string }>;
  };
  about: {
    english: string;
    japanese: string;
    location: {
      english: string;
      japanese: string;
    };
    status: string;
    education: string;
  };
  cv: {
    english: {
      url: string;
      filename: string;
      isActive: boolean;
    };
    japanese: {
      url: string;
      filename: string;
      isActive: boolean;
    };
  };
  education: Array<{
    id: string;
    institution: {
      english: string;
      japanese: string;
    };
    degree: {
      english: string;
      japanese: string;
    };
    period: {
      english: string;
      japanese: string;
    };
    description: {
      english: string;
      japanese: string;
    };
    achievements: {
      english: string[];
      japanese: string[];
    };
  }>;
  experience: Array<{
    id: string;
    title: {
      english: string;
      japanese: string;
    };
    company: {
      english: string;
      japanese: string;
    };
    period: {
      english: string;
      japanese: string;
    };
    description: {
      english: string;
      japanese: string;
    };
    technologies: string[];
  }>;
  skills: {
    languages: Array<{ id: string; name: string; icon: string; iconKey?: string }>;
    frameworks: Array<{ id: string; name: string; icon: string; iconKey?: string }>;
    databases: Array<{ id: string; name: string; icon: string; iconKey?: string }>;
    tools: Array<{ id: string; name: string; icon: string; iconKey?: string }>;
  };
  papers: Array<{
    id: string;
    title: {
      english: string;
      japanese: string;
    };
    type: 'poster' | 'oral';
    date: {
      english: string;
      japanese: string;
    };
    conference: {
      english: string;
      japanese: string;
    };
    description: {
      english: string;
      japanese: string;
    };
    paperPdf: string;
    paperFilename: string;
    posterPdf?: string;
    posterFilename?: string;
    presentationPdf?: string;
    presentationFilename?: string;
    abstract?: {
      english: string;
      japanese: string;
    };
    authors?: {
      english: string[];
      japanese: string[];
    };
  }>;
  projects: Array<{
    id: string;
    title: {
      english: string;
      japanese: string;
    };
    description: {
      english: string;
      japanese: string;
    };
    technologies: string[];
    github: string;
    live: string;
    showImage: boolean;
    showLiveDemo: boolean;
    images: string[];
  }>;
  certifications: Array<{
    id: string;
    name: {
      english: string;
      japanese: string;
    };
    issuer: {
      english: string;
      japanese: string;
    };
    date: {
      english: string;
      japanese: string;
    };
    expiryDate?: {
      english: string;
      japanese: string;
    };
    image: string;
    pdf: string;
  }>;
  contact: {
    email: string;
    phone: string;
    location: {
      english: string;
      japanese: string;
    };
    social: {
      github: string;
      linkedin: string;
      whatsapp: string;
      facebook: string;
      indeed: string;
    };
  };
}

const defaultData: PortfolioData = {
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
      { id: '1', name: 'Git', icon: '📝' },
      { id: '2', name: 'VS Code', icon: '💻' },
      { id: '3', name: 'Postman', icon: '📮' },
      { id: '4', name: 'MATLAB', icon: '🔬' },
      { id: '5', name: 'IBM Watson', icon: '🤖' },
      { id: '6', name: 'Excel', icon: '📈' },
      { id: '7', name: 'NetBeans', icon: '☕' }
    ]
  },
  about: {
    english: "I'm Mushabbir Ahmed, a results-driven AI Specialist and Software Engineer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan (Graduating March 2026). With a strong foundation in Software Engineering from Qingdao University, China, I specialize in developing secure, scalable systems using React, Flask, MongoDB, and advanced encryption methods like AES‑256 and RSA‑2048. My hands-on projects include a secure medical data simulation system and a movie recommendation engine. I'm also serving as an International Student Tutor and was appointed as a Saga City International Tourism Ambassador in July 2025. I'm passionate about delivering data-driven, AI-powered solutions that create real-world impact.",
    japanese: "私はムサビル・アハメドと申します。現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程（2026年3月修了予定）に在籍しています。中国の青島大学でソフトウェア工学を学び、Python・JavaScript・React・Flask・MongoDBを活用したソフトウェア開発および、AES-256・RSA-2048などの高度な暗号技術を用いたセキュアなシステム構築を得意としています。医療データ暗号化シミュレーションや映画レコメンデーションシステムの開発経験があり、現在は佐賀大学の技術サポートチューターとしても活動中です。2025年7月には佐賀市国際観光アンバサダーにも任命され、地域貢献にも力を入れています。",
    location: {
      english: "Saga, Japan",
      japanese: "佐賀県、日本"
    },
    status: "Actively looking for full-time opportunities in Japan",
    education: "Master's Student at Saga University"
  },
  cv: {
    english: {
      url: "",
      filename: "",
      isActive: false
    },
    japanese: {
      url: "",
      filename: "",
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
  experience: [
    {
      id: "1",
      title: {
        english: "Software Engineer",
        japanese: "ソフトウェアエンジニア"
      },
      company: {
        english: "Saga University",
        japanese: "佐賀大学"
      },
      period: {
        english: "April 2024 – Present",
        japanese: "2024年4月 – 現在"
      },
      description: {
        english: "Working as a Software Engineer at Saga University, focusing on developing secure and scalable systems using React, Flask, MongoDB, and advanced encryption methods like AES-256 and RSA-2048.",
        japanese: "佐賀大学でソフトウェアエンジニアとして働いており、React、Flask、MongoDB、そしてAES-256とRSA-2048などの高度な暗号技術を使用したセキュアでスケーラブルなシステムの開発に専念しています。"
      },
      technologies: ["React", "Flask", "MongoDB", "Python", "AES-256", "RSA-2048"]
    }
  ],
  skills: {
    languages: [
      { id: '1', name: 'Python', icon: '🐍' },
      { id: '2', name: 'JavaScript', icon: '💛' },
      { id: '3', name: 'SQL', icon: '🗄️' },
      { id: '4', name: 'C++', icon: '⚡' },
      { id: '5', name: 'HTML', icon: '🌐' },
      { id: '6', name: 'CSS', icon: '🎨' }
    ],
    frameworks: [
      { id: '1', name: 'React', icon: '⚛️' },
      { id: '2', name: 'Flask', icon: '🔥' },
      { id: '3', name: 'Spring Boot', icon: '🍃' },
      { id: '4', name: 'NumPy', icon: '📊' },
      { id: '5', name: 'Bootstrap', icon: '🎨' }
    ],
    databases: [
      { id: '1', name: 'MongoDB', icon: '🍃' },
      { id: '2', name: 'MongoDB Atlas', icon: '☁️' },
      { id: '3', name: 'MySQL', icon: '🐬' }
    ],
    tools: [
      { id: '1', name: 'Git', icon: '📝' },
      { id: '2', name: 'VS Code', icon: '💻' },
      { id: '3', name: 'Postman', icon: '📮' },
      { id: '4', name: 'MATLAB', icon: '🔬' },
      { id: '5', name: 'IBM Watson', icon: '🤖' },
      { id: '6', name: 'Excel', icon: '📈' },
      { id: '7', name: 'NetBeans', icon: '☕' }
    ]
  },

  papers: [
    {
      id: "1",
      title: {
        english: "AI in Healthcare",
        japanese: "医療におけるAI"
      },
      type: 'oral',
      date: {
        english: "2024",
        japanese: "2024年"
      },
      conference: {
        english: "IEEE International Conference on Artificial Intelligence",
        japanese: "IEEE人工知能国際会議"
      },
      description: {
        english: "This paper explores the application of artificial intelligence in healthcare, focusing on diagnostic accuracy and patient care optimization.",
        japanese: "本論文は、医療における人工知能の応用について、診断精度と患者ケアの最適化に焦点を当てて探求します。"
      },
      abstract: {
        english: "This paper explores the application of artificial intelligence in healthcare, focusing on diagnostic accuracy and patient care optimization.",
        japanese: "本論文は、医療における人工知能の応用について、診断精度と患者ケアの最適化に焦点を当てて探求します。"
      },
      authors: {
        english: ["Mushabbir Ahmed", "Dr. Smith", "Prof. Johnson"],
        japanese: ["ムサビル・アハメド", "スミス博士", "ジョンソン教授"]
      },
      paperPdf: "",
      paperFilename: "",
      presentationPdf: "",
      presentationFilename: "",
    },
    {
      id: "2",
      title: {
        english: "Deep Learning for Computer Vision",
        japanese: "コンピュータビジョンのためのディープラーニング"
      },
      type: 'poster',
      date: {
        english: "2024",
        japanese: "2024年"
      },
      conference: {
        english: "Computer Vision Conference",
        japanese: "コンピュータビジョン会議"
      },
      description: {
        english: "A comprehensive study on deep learning approaches for computer vision applications, including object detection and image classification.",
        japanese: "オブジェクト検出と画像分類を含むコンピュータビジョンアプリケーションのためのディープラーニングアプローチに関する包括的な研究。"
      },
      abstract: {
        english: "A comprehensive study on deep learning approaches for computer vision applications, including object detection and image classification.",
        japanese: "オブジェクト検出と画像分類を含むコンピュータビジョンアプリケーションのためのディープラーニングアプローチに関する包括的な研究。"
      },
      authors: {
        english: ["Mushabbir Ahmed", "Dr. Brown", "Prof. Wilson"],
        japanese: ["ムサビル・アハメド", "ブラウン博士", "ウィルソン教授"]
      },
      paperPdf: "",
      paperFilename: "",
      posterPdf: "",
      posterFilename: "",
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
  certifications: [
    {
      id: "1",
      name: {
        english: "AI Foundations for Everyone",
        japanese: "AI基礎（全員向け）"
      },
      issuer: {
        english: "IBM",
        japanese: "IBM"
      },
      date: {
        english: "2023",
        japanese: "2023年"
      },
      expiryDate: {
        english: "2025",
        japanese: "2025年"
      },
      image: "/certifications/AI Foundations for Everyone.jpg",
      pdf: "/certifications/AI Foundations for Everyone.pdf"
    },
    {
      id: "2",
      name: {
        english: "Building AI Powered Chatbots Without Programming",
        japanese: "プログラミングなしでAI駆動チャットボットを構築"
      },
      issuer: {
        english: "IBM",
        japanese: "IBM"
      },
      date: {
        english: "2023",
        japanese: "2023年"
      },
      expiryDate: {
        english: "2025",
        japanese: "2025年"
      },
      image: "/certifications/Building AI Powered Chatbots Without Programming.jpg",
      pdf: "/certifications/Building AI Powered Chatbots Without Programming.pdf"
    }
  ],
  contact: {
    email: "mushabbir@example.com",
    phone: "+81 90-XXXX-XXXX",
    location: {
      english: "Saga, Japan",
      japanese: "佐賀県、日本"
    },
    social: {
      github: "https://github.com/mushabbir",
      linkedin: "https://linkedin.com/in/mushabbir",
      whatsapp: "https://wa.me/+8190XXXXXXX",
      facebook: "https://facebook.com/mushabbir",
      indeed: "https://indeed.com/profile/mushabbir"
    }
  }
};

export default function AdminPage() {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [showCVUploadModal, setShowCVUploadModal] = useState(false);
  const [cvUploadLanguage, setCvUploadLanguage] = useState<'en' | 'ja'>('en');
  const [showPaperUploadModal, setShowPaperUploadModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState<any>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalType, setSaveModalType] = useState<'success' | 'error'>('success');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [openIconDropdown, setOpenIconDropdown] = useState<string | null>(null);
  const [dataDebug, setDataDebug] = useState<any>(null);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'previewing' | 'migrating' | 'completed' | 'error'>('idle');
  const [migrationData, setMigrationData] = useState<any>(null);
  const [migrationError, setMigrationError] = useState<string>('');

  // Get section from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  // Load saved data from API
  const fetchData = async () => {
    try {
      console.log('🔄 Fetching portfolio data from API...');
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const fetchedData = await response.json();
        console.log('📊 Raw fetched data:', fetchedData);
        console.log('🔍 Skills data analysis:');
        console.log('  - Skills exists:', !!fetchedData?.skills);
        console.log('  - Skills type:', typeof fetchedData?.skills);
        console.log('  - Skills keys:', fetchedData?.skills ? Object.keys(fetchedData.skills) : 'undefined');
        console.log('  - Languages:', fetchedData?.skills?.languages);
        console.log('  - Frameworks:', fetchedData?.skills?.frameworks);
        console.log('  - Databases:', fetchedData?.skills?.databases);
        console.log('  - Tools:', fetchedData?.skills?.tools);
        
        // Sanitize the fetched data to ensure correct structure
        const sanitizedData = {
          ...fetchedData,
          hero: {
            ...fetchedData.hero,
            name: typeof fetchedData.hero?.name === 'string' 
              ? { english: fetchedData.hero.name, japanese: fetchedData.hero.name }
              : fetchedData.hero?.name || { english: "Mushabbir Ahmed", japanese: "ムサビル・アハメド" },
            title: typeof fetchedData.hero?.title === 'string'
              ? { english: fetchedData.hero.title, japanese: fetchedData.hero.title }
              : fetchedData.hero?.title || { english: "AI Specialist & Software Engineer", japanese: "AIスペシャリスト・ソフトウェアエンジニア" },
            subtitle: typeof fetchedData.hero?.subtitle === 'string'
              ? { english: fetchedData.hero.subtitle, japanese: fetchedData.hero.subtitle }
              : fetchedData.hero?.subtitle || { english: "Passionate about creating innovative solutions", japanese: "革新的なソリューションの創造に情熱を注ぐ" },
            description: typeof fetchedData.hero?.description === 'string'
              ? { english: fetchedData.hero.description, japanese: fetchedData.hero.description }
              : fetchedData.hero?.description || { english: "I'm a results-driven AI Specialist and Software Engineer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan.", japanese: "現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程に在籍しているAIスペシャリスト・ソフトウェアエンジニアです。" },
            profilePicture: typeof fetchedData.hero?.profilePicture === 'string' ? fetchedData.hero.profilePicture : null,
            tools: Array.isArray(fetchedData.hero?.tools) ? fetchedData.hero.tools : []
          },
          about: {
            english: typeof fetchedData.about?.english === 'string' ? fetchedData.about.english : "",
            japanese: typeof fetchedData.about?.japanese === 'string' ? fetchedData.about.japanese : "",
            location: typeof fetchedData.about?.location === 'string' 
              ? { english: fetchedData.about.location, japanese: fetchedData.about.location }
              : (typeof fetchedData.about?.location === 'object' && fetchedData.about?.location?.english && fetchedData.about?.location?.japanese)
              ? fetchedData.about.location
              : { english: "Saga, Japan", japanese: "佐賀県、日本" },
            status: typeof fetchedData.about?.status === 'string' ? fetchedData.about.status : "",
            education: typeof fetchedData.about?.education === 'string' ? fetchedData.about.education : ""
          },
          education: Array.isArray(fetchedData.education) ? fetchedData.education.map((edu: any, index: number) => ({
            ...edu,
            id: edu.id || `edu-${index}-${Date.now()}`,
            institution: typeof edu.institution === 'string'
              ? { english: edu.institution, japanese: edu.institution }
              : edu.institution || { english: "", japanese: "" },
            degree: typeof edu.degree === 'string'
              ? { english: edu.degree, japanese: edu.degree }
              : edu.degree || { english: "", japanese: "" },
            period: typeof edu.period === 'string'
              ? { english: edu.period, japanese: edu.period }
              : edu.period || { english: "", japanese: "" },
            description: typeof edu.description === 'string'
              ? { english: edu.description, japanese: edu.description }
              : edu.description || { english: "", japanese: "" },
            achievements: {
              english: Array.isArray(edu.achievements?.english) ? edu.achievements.english : [],
              japanese: Array.isArray(edu.achievements?.japanese) ? edu.achievements.japanese : []
            }
          })) : [],
          projects: Array.isArray(fetchedData.projects) ? fetchedData.projects.map((project: any, index: number) => ({
            ...project,
            id: project.id || `project-${index}-${Date.now()}`,
            title: typeof project.title === 'string'
              ? { english: project.title, japanese: project.title }
              : project.title || { english: "", japanese: "" },
            description: typeof project.description === 'string'
              ? { english: project.description, japanese: project.description }
              : project.description || { english: "", japanese: "" },
            technologies: Array.isArray(project.technologies) ? project.technologies : [],
            images: Array.isArray(project.images) ? project.images : []
          })) : [],
          papers: Array.isArray(fetchedData.papers) ? fetchedData.papers.map((paper: any, index: number) => ({
            ...paper,
            id: paper.id || `paper-${index}-${Date.now()}`,
            title: typeof paper.title === 'string'
              ? { english: paper.title, japanese: paper.title }
              : (typeof paper.title === 'object' && paper.title?.english && paper.title?.japanese)
              ? paper.title
              : { english: "", japanese: "" },
            date: typeof paper.date === 'string'
              ? { english: paper.date, japanese: paper.date }
              : (typeof paper.date === 'object' && paper.date?.english && paper.date?.japanese)
              ? paper.date
              : { english: "", japanese: "" },
            conference: typeof paper.conference === 'string'
              ? { english: paper.conference, japanese: paper.conference }
              : (typeof paper.conference === 'object' && paper.conference?.english && paper.conference?.japanese)
              ? paper.conference
              : { english: "", japanese: "" },
            description: typeof paper.description === 'string'
              ? { english: paper.description, japanese: paper.description }
              : (typeof paper.description === 'object' && paper.description?.english && paper.description?.japanese)
              ? paper.description
              : { english: "", japanese: "" },
            abstract: typeof paper.abstract === 'string'
              ? { english: paper.abstract, japanese: paper.abstract }
              : (typeof paper.abstract === 'object' && paper.abstract?.english && paper.abstract?.japanese)
              ? paper.abstract
              : { english: "", japanese: "" },
            authors: typeof paper.authors === 'string'
              ? { english: [paper.authors], japanese: [paper.authors] }
              : (typeof paper.authors === 'object' && paper.authors?.english && paper.authors?.japanese)
              ? paper.authors
              : { english: [], japanese: [] }
          })) : [],
          certifications: (() => {
            // Handle both certifications and certificates arrays
            const certs = fetchedData.certifications || fetchedData.certificates || [];
            if (!Array.isArray(certs)) return [];
            
            return certs.map((cert: any, index: number) => {
              // Handle different certificate data structures
              const certData = {
                id: cert.id || `cert-${index}-${Date.now()}`,
                name: typeof cert.name === 'string'
                  ? { english: cert.name, japanese: cert.name }
                  : (typeof cert.name === 'object' && cert.name?.english && cert.name?.japanese)
                  ? cert.name
                  : { english: cert.name || "", japanese: cert.name || "" },
                issuer: typeof cert.issuer === 'string'
                  ? { english: cert.issuer, japanese: cert.issuer }
                  : (typeof cert.issuer === 'object' && cert.issuer?.english && cert.issuer?.japanese)
                  ? cert.issuer
                  : { english: cert.issuer || "", japanese: cert.issuer || "" },
                date: typeof cert.date === 'string'
                  ? { english: cert.date, japanese: cert.date }
                  : (typeof cert.date === 'object' && cert.date?.english && cert.date?.japanese)
                  ? cert.date
                  : { english: cert.date || "", japanese: cert.date || "" },
                expiryDate: typeof cert.expiryDate === 'string'
                  ? { english: cert.expiryDate, japanese: cert.expiryDate }
                  : (typeof cert.expiryDate === 'object' && cert.expiryDate?.english && cert.expiryDate?.japanese)
                  ? cert.expiryDate
                  : { english: cert.expiryDate || "", japanese: cert.expiryDate || "" },
                image: typeof cert.image === 'string' ? cert.image : "",
                pdf: typeof cert.pdf === 'string' ? cert.pdf : (typeof cert.url === 'string' ? cert.url : "")
              };
              
              console.log(`Processing certification ${index}:`, cert, '→', certData);
              return certData;
            });
          })(),
          cv: fetchedData.cv || {
            english: { url: "", filename: "", isActive: false },
            japanese: { url: "", filename: "", isActive: false }
          },
          contact: fetchedData.contact || {
            email: "mushabbirahmed99@gmail.com",
            phone: "(+81)090-3402-4637",
            location: { english: "Saga, Japan", japanese: "佐賀県、日本" },
            social: {
              github: "https://github.com/mushabbir-ahmed",
              linkedin: "https://linkedin.com/in/mushabbir-ahmed",
              whatsapp: "https://wa.me/819034024637",
              facebook: "https://facebook.com/mushabbir.ahmed",
              indeed: "https://indeed.com/profile/mushabbir-ahmed"
            }
          },
          skills: (() => {
            // Ensure skills is always an object with arrays
            const skills = fetchedData.skills;
            console.log('🔧 Skills sanitization process:');
            console.log('  - Input skills:', skills);
            console.log('  - Skills type:', typeof skills);
            console.log('  - Skills is object:', skills && typeof skills === 'object');
            
            if (!skills || typeof skills !== 'object') {
              console.log('  - No skills data, returning defaults');
              return {
                languages: [],
                frameworks: [],
                databases: [],
                tools: []
              };
            }
            
            // Clean and fix malformed skills data
            const cleanSkills = (skillArray: any[], category: string) => {
              console.log(`  - Cleaning ${category}:`, skillArray);
              console.log(`  - ${category} is array:`, Array.isArray(skillArray));
              
              if (!Array.isArray(skillArray)) {
                console.log(`  - ${category} is not array, returning empty`);
                return [];
              }
              
              const cleaned = skillArray
                .filter(skill => skill && typeof skill === 'object')
                .map((skill: any, index: number) => {
                  console.log(`  - Processing ${category} skill ${index}:`, skill);
                  
                  // Fix malformed skills (like the "English" skill that got split into characters)
                  if (skill['0'] && skill['1']) {
                    // This is a malformed skill, reconstruct it
                    const name = Object.values(skill)
                      .filter(val => typeof val === 'string')
                      .join('');
                    console.log(`  - Fixed malformed skill:`, { original: skill, fixed: name });
                    return {
                      id: skill.id || `skill-${category}-${index}-${Date.now()}`,
                      name,
                      icon: skill.icon || '🔧'
                    };
                  }
                  
                  // Normal skill object - preserve empty names until user edits
                  const cleanedSkill = {
                    ...skill,
                    id: skill.id || `skill-${category}-${index}-${Date.now()}`,
                    name: typeof skill.name === 'string' ? skill.name : '',
                    icon: typeof skill.icon === 'string' ? skill.icon : '🔧'
                  };
                  console.log(`  - Cleaned skill:`, cleanedSkill);
                  return cleanedSkill;
                });
              
              console.log(`  - Final ${category} result:`, cleaned);
              return cleaned;
            };
            
            const result = {
              languages: cleanSkills(skills.languages, 'lang'),
              frameworks: cleanSkills(skills.frameworks, 'frame'),
              databases: cleanSkills(skills.databases, 'db'),
              tools: cleanSkills(skills.tools, 'tool')
            };
            
            console.log('  - Final skills result:', result);
            return result;
          })(),
          experience: Array.isArray(fetchedData.experience) ? fetchedData.experience.map((exp: any, index: number) => ({
            ...exp,
            id: exp.id || `exp-${index}-${Date.now()}`,
            title: typeof exp.title === 'string'
              ? { english: exp.title, japanese: exp.title }
              : exp.title || { english: "", japanese: "" },
            company: typeof exp.company === 'string'
              ? { english: exp.company, japanese: exp.company }
              : exp.company || { english: "", japanese: "" },
            period: typeof exp.period === 'string'
              ? { english: exp.period, japanese: exp.period }
              : exp.period || { english: "", japanese: "" },
            description: typeof exp.description === 'string'
              ? { english: exp.description, japanese: exp.description }
              : exp.description || { english: "", japanese: "" },
            technologies: Array.isArray(exp.technologies) ? exp.technologies : []
          })) : []
        };
        
        console.log('✅ Sanitized data:', sanitizedData);
        console.log('✅ Skills data in sanitized data:', sanitizedData.skills);
        setData(sanitizedData);
        setDataDebug(sanitizedData);
      } else {
        console.error('❌ Failed to fetch portfolio data:', response.status);
        toast.error('Failed to load portfolio data. Using default data.');
        // Keep using default data if fetch fails
      }
    } catch (error) {
      console.error('💥 Error fetching portfolio data:', error);
      toast.error('Error loading portfolio data. Using default data.');
      // Keep using default data if fetch fails
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Close icon dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openIconDropdown && !(event.target as Element).closest('.icon-dropdown-container')) {
        setOpenIconDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openIconDropdown]);

  // Debug data changes
  useEffect(() => {
    console.log('🔄 Data state changed:', data);
    console.log('🔄 Skills data in state:', data?.skills);
    console.log('🔄 Skills structure:', {
      languages: data?.skills?.languages?.length || 0,
      frameworks: data?.skills?.frameworks?.length || 0,
      databases: data?.skills?.databases?.length || 0,
      tools: data?.skills?.tools?.length || 0
    });
  }, [data]);

  // Fetch admin logs
  const fetchAdminLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs?limit=50');
      if (response.ok) {
        const logs = await response.json();
        // Ensure logs is always an array
        if (Array.isArray(logs)) {
          setAdminLogs(logs);
        } else {
          console.warn('Admin logs response is not an array:', logs);
          setAdminLogs([]);
        }
      } else {
        console.error('Failed to fetch admin logs');
        setAdminLogs([]);
      }
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      setAdminLogs([]);
    }
  };

  const refreshLogs = async () => {
    setIsLoadingLogs(true);
    try {
      await fetchAdminLogs();
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const saveData = async () => {
    setIsSaving(true);
    try {
      console.log('💾 Starting to save portfolio data...');
      
      // Ensure data structure is correct before saving
      const sanitizedData = {
        ...data,
        hero: {
          ...data.hero,
          name: typeof data.hero.name === 'object' && data.hero.name?.english && data.hero.name?.japanese
            ? data.hero.name
            : { english: "Mushabbir Ahmed", japanese: "ムサビル・アハメド" },
          title: typeof data.hero.title === 'object' && data.hero.title?.english && data.hero.title?.japanese
            ? data.hero.title
            : { english: "AI Specialist & Software Engineer", japanese: "AIスペシャリスト・ソフトウェアエンジニア" },
          subtitle: typeof data.hero.subtitle === 'object' && data.hero.subtitle?.english && data.hero.subtitle?.japanese
            ? data.hero.subtitle
            : { english: "Passionate about creating innovative solutions", japanese: "革新的なソリューションの創造に情熱を注ぐ" },
          description: typeof data.hero.description === 'object' && data.hero.description?.english && data.hero.description?.japanese
            ? data.hero.description
            : { english: "I'm a results-driven AI Specialist and Software Engineer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan.", japanese: "現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程に在籍しているAIスペシャリスト・ソフトウェアエンジニアです。" },
          profilePicture: typeof data.hero.profilePicture === 'string' ? data.hero.profilePicture : null,
          tools: Array.isArray(data.hero.tools) ? data.hero.tools : []
        },
        about: {
          english: typeof data.about.english === 'string' ? data.about.english : "",
          japanese: typeof data.about.japanese === 'string' ? data.about.japanese : "",
          location: typeof data.about.location === 'string' ? data.about.location : "",
          status: typeof data.about.status === 'string' ? data.about.status : "",
          education: typeof data.about.education === 'string' ? data.about.education : ""
        },
        education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
          ...edu,
          institution: typeof edu.institution === 'object' && edu.institution?.english && edu.institution?.japanese
            ? edu.institution
            : { english: "", japanese: "" },
          degree: typeof edu.degree === 'object' && edu.degree?.english && edu.degree?.japanese
            ? edu.degree
            : { english: "", japanese: "" },
          period: typeof edu.period === 'object' && edu.period?.english && edu.period?.japanese
            ? edu.period
            : { english: "", japanese: "" },
          description: typeof edu.description === 'object' && edu.description?.english && edu.description?.japanese
            ? edu.description
            : { english: "", japanese: "" },
          achievements: {
            english: Array.isArray(edu.achievements?.english) ? edu.achievements.english : [],
            japanese: Array.isArray(edu.achievements?.japanese) ? edu.achievements.japanese : []
          }
        })) : [],
        projects: Array.isArray(data.projects) ? data.projects.map((project: any) => ({
          ...project,
          title: typeof project.title === 'object' && project.title?.english && project.title?.japanese
            ? project.title
            : { english: "", japanese: "" },
          description: typeof project.description === 'object' && project.description?.english && project.description?.japanese
            ? project.description
            : { english: "", japanese: "" },
          technologies: Array.isArray(project.technologies) ? project.technologies : [],
          images: Array.isArray(project.images) ? project.images : []
        })) : [],
        papers: Array.isArray(data.papers) ? data.papers : [],
        skills: {
          languages: data.skills.languages.map(({id, name, icon}) => ({id, name, icon})),
          frameworks: data.skills.frameworks.map(({id, name, icon}) => ({id, name, icon})),
          databases: data.skills.databases.map(({id, name, icon}) => ({id, name, icon})),
          tools: data.skills.tools.map(({id, name, icon}) => ({id, name, icon})),
        }
      };
      
      console.log('📝 Sanitized data prepared, saving to Supabase...');
      
      // Use the main portfolio API to save the entire document
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Portfolio saved successfully:', result);
        toast.success('Portfolio updated successfully!');
        
        // Refresh data from server to ensure sync
        await fetchData();
      } else {
        const errorData = await response.json();
        console.error('❌ Save failed:', errorData);
        throw new Error(errorData.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('💥 Save error:', error);
      toast.error(`Failed to save portfolio data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updateData = async (section: keyof PortfolioData, updates: any) => {
    try {
      setData(prev => {
        // Special handling for papers to ensure it's always an array
        if (section === 'papers') {
          return {
            ...prev,
            papers: updates // Direct assignment for papers array
          };
        }
        
        return {
          ...prev,
          [section]: { ...prev[section], ...updates }
        };
      });

      // Send update to API
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: updates })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update data');
      }
    } catch (error) {
      console.error('Update data error:', error);
      toast.error('Failed to update data. Please try again.');
    }
  };

  const addEducation = async () => {
    const newEducation = {
      id: uuidv4(),
      institution: { english: '', japanese: '' },
      degree: { english: '', japanese: '' },
      period: { english: '', japanese: '' },
      description: { english: '', japanese: '' },
      achievements: { english: [], japanese: [] }
    };

    // Optimistic update
    const prevData = { ...data };
    setData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));

    try {
      const response = await fetch('/api/portfolio/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'education',
          data: [...data.education, newEducation]
        })
      });

      if (response.ok) {
        toast.success('Education entry added successfully!');
        fetchAdminLogs(); // Refresh logs
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add education entry');
      }
    } catch (error) {
      // Revert optimistic update on error
      setData(prevData);
      toast.error('Failed to add education entry. Please try again.');
    }
  };

  const updateEducation = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  };

  const removeEducation = async (id: string) => {
    setIsDeleting(id);
    
    // Optimistic update
    const prevData = { ...data };
    const updatedEducation = data.education.filter(edu => edu.id !== id);
    setData(prev => ({
      ...prev,
      education: updatedEducation
    }));

    try {
      const response = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'education', id: id })
      });

      if (response.ok) {
        toast.success('Education entry removed successfully!');
        fetchAdminLogs(); // Refresh logs
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove education entry');
      }
    } catch (error) {
      // Revert optimistic update on error
      setData(prevData);
      console.error('Remove education error:', error);
      toast.error('Failed to remove education entry. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const addExperience = async () => {
    const newExperience = {
      id: uuidv4(),
      title: { english: '', japanese: '' },
      company: { english: '', japanese: '' },
      period: { english: '', japanese: '' },
      description: { english: '', japanese: '' },
      technologies: []
    };

    // Optimistic update
    const prevData = { ...data };
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));

    try {
      const response = await fetch('/api/portfolio/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'experience',
          data: [...data.experience, newExperience]
        })
      });

      if (response.ok) {
        toast.success('Experience entry added successfully!');
        fetchAdminLogs(); // Refresh logs
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add experience entry');
      }
    } catch (error) {
      // Revert optimistic update on error
      setData(prevData);
      toast.error('Failed to add experience entry. Please try again.');
    }
  };

  const updateExperience = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    }));
  };

  const removeExperience = async (id: string) => {
    setIsDeleting(id);
    
    // Optimistic update
    const prevData = { ...data };
    const updatedExperience = data.experience.filter(exp => exp.id !== id);
    setData(prev => ({
      ...prev,
      experience: updatedExperience
    }));

    try {
      const response = await fetch('/api/portfolio/sections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'experience',
          id: id
        })
      });

      if (response.ok) {
        toast.success('Experience entry removed successfully!');
        fetchAdminLogs(); // Refresh logs
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove experience entry');
      }
    } catch (error) {
      // Revert optimistic update on error
      setData(prevData);
      console.error('Remove experience error:', error);
      toast.error('Failed to remove experience entry. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const addSkill = (category: keyof PortfolioData['skills']) => {
    const newSkill = { id: uuidv4(), name: '', icon: '🔧', iconKey: 'SiCode' };
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: Array.isArray(prev.skills[category])
          ? [...prev.skills[category], newSkill]
          : [newSkill]
      }
    }));
    toast.success(`${category} skill added successfully!`);
  };

  const updateSkill = (category: keyof PortfolioData['skills'], index: number, updates: any) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: Array.isArray(prev.skills[category])
          ? prev.skills[category].map((skill, i) => 
              i === index ? { ...skill, ...updates } : skill
            )
          : []
      }
    }));
  };

  const removeSkill = async (category: keyof PortfolioData['skills'], index: number) => {
    try {
      // Ensure skills array exists and is valid
      if (!data.skills || !data.skills[category] || !Array.isArray(data.skills[category])) {
        console.error('Skills array not found or invalid for category:', category);
        toast.error('Skills data not available. Please refresh the page.');
        return;
      }

      const skillToRemove = data.skills[category][index];
      if (!skillToRemove) {
        console.error('Skill not found at index:', index);
        toast.error('Skill not found. Please refresh the page.');
        return;
      }
      
      // Ensure the skill has a proper ID
      if (!skillToRemove.id) {
        // If no ID, just remove from local state
        setData(prev => ({
          ...prev,
          skills: {
            ...prev.skills,
            [category]: Array.isArray(prev.skills[category]) 
              ? prev.skills[category].filter((_, i) => i !== index)
              : []
          }
        }));
        toast.success(`${category} skill removed successfully!`);
        return;
      }

      const response = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'skills', id: skillToRemove.id })
      });

      if (response.ok) {
        setData(prev => ({
          ...prev,
          skills: {
            ...prev.skills,
            [category]: Array.isArray(prev.skills[category])
              ? prev.skills[category].filter((_, i) => i !== index)
              : []
          }
        }));
        toast.success(`${category} skill removed successfully!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove skill');
      }
    } catch (error) {
      console.error('Remove skill error:', error);
      toast.error('Failed to remove skill. Please try again.');
    }
  };

  const addCertification = () => {
    const newCert = {
      id: uuidv4(),
      name: {
        english: "",
        japanese: ""
      },
      issuer: {
        english: "",
        japanese: ""
      },
      date: {
        english: "",
        japanese: ""
      },
      expiryDate: {
        english: "",
        japanese: ""
      },
      image: "",
      pdf: ""
    };
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
    toast.success('Certification added successfully!');
  };

  const updateCertification = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, ...updates } : cert
      )
    }));
  };

  const removeCertification = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'certifications', id: id })
      });

      if (response.ok) {
        setData(prev => ({
          ...prev,
          certifications: prev.certifications.filter(cert => cert.id !== id)
        }));
        toast.success('Certification removed successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove certification');
      }
    } catch (error) {
      console.error('Remove certification error:', error);
      toast.error('Failed to remove certification. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const addProject = () => {
    const newProject = {
      id: uuidv4(),
      title: {
        english: "",
        japanese: ""
      },
      description: {
        english: "",
        japanese: ""
      },
      technologies: [],
      github: "",
      live: "",
      showImage: false,
      showLiveDemo: false,
      images: []
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    toast.success('Project added successfully!');
  };

  const updateProject = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    }));
  };

  const removeProject = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'projects', id: id })
      });

      if (response.ok) {
        setData(prev => ({
          ...prev,
          projects: prev.projects.filter(project => project.id !== id)
        }));
        toast.success('Project removed successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove project');
      }
    } catch (error) {
      console.error('Remove project error:', error);
      toast.error('Failed to remove project. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const addProjectImage = (projectId: string, imageUrl: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === projectId 
          ? { ...project, images: [...project.images, imageUrl] }
          : project
      )
    }));
  };

  const removeProjectImage = (projectId: string, imageIndex: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === projectId 
          ? { ...project, images: project.images.filter((_, i) => i !== imageIndex) }
          : project
      )
    }));
  };

  const handleCVUpload = async (file: File, language: 'en' | 'ja') => {
    try {
      console.log('Starting CV upload:', { fileName: file.name, fileSize: file.size, language });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      console.log('Sending request to /api/upload/cv...');
      const response = await fetch('/api/upload/cv', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it automatically for FormData
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (response.ok && result.success) {
        // Update the CV data to reflect the new file
        const cvKey = language === 'en' ? 'english' : 'japanese';
        
        setData(prev => ({
          ...prev,
          cv: {
            ...prev.cv,
            [cvKey]: {
              url: result.url,
              filename: result.filename,
              isActive: true
            }
          }
        }));

        alert(`✅ CV uploaded successfully!\n\nFile: ${result.filename}\nURL: ${result.url}\nMessage: ${result.message || 'Upload completed'}`);
        console.log('CV upload completed successfully');
      } else {
        console.error('CV upload failed:', result);
        const errorMessage = result.details ? 
          `Failed to upload CV:\n\nError: ${result.error}\n\nDetails: ${result.details}` :
          `Failed to upload CV: ${result.error}`;
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert(`❌ Error uploading CV:\n\n${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease check the console for more details.`);
    }
    
    setShowCVUploadModal(false);
  };



  const removeCV = async (language: 'en' | 'ja') => {
    try {
      console.log('🗑️ Removing CV for language:', language);
      
      const cvKey = language === 'en' ? 'english' : 'japanese';
      const currentCV = data.cv?.[cvKey];
      
      if (!currentCV?.url) {
        toast.error('No CV found to delete for this language');
        return;
      }
      
      const response = await fetch('/api/upload/cv', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          url: currentCV.url
        })
      });

      const result = await response.json();
      console.log('🗑️ CV removal result:', result);

      if (response.ok && result.success) {
        // Update local state
        setData(prev => ({
          ...prev,
          cv: {
            ...prev.cv,
            [cvKey]: {
              url: "",
              filename: "",
              isActive: false
            }
          }
        }));

        toast.success(`✅ CV removed successfully for ${language === 'en' ? 'English' : 'Japanese'}!`);
        
        // Refresh data from server to ensure sync
        await fetchData();
      } else {
        console.error('❌ CV delete failed:', result);
        toast.error(`Failed to delete CV: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('💥 Error deleting CV:', error);
      toast.error(`Error deleting CV: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  // Papers Management Functions
  const addPaper = () => {
    const newPaper = {
      id: uuidv4(),
      title: {
        english: "",
        japanese: ""
      },
      type: "oral" as 'poster' | 'oral',
      date: {
        english: "",
        japanese: ""
      },
      conference: {
        english: "",
        japanese: ""
      },
      description: {
        english: "",
        japanese: ""
      },
      abstract: {
        english: "",
        japanese: ""
      },
      authors: {
        english: [],
        japanese: []
      },
      paperPdf: "",
      paperFilename: "",
      posterPdf: "",
      posterFilename: "",
      presentationPdf: "",
      presentationFilename: "",
    };
    
    setData(prev => ({
      ...prev,
      papers: [...(prev.papers || []), newPaper]
    }));
    toast.success('Paper added successfully!');
  };

  const updatePaper = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      papers: (prev.papers || []).map(paper => 
        paper.id === id ? { ...paper, ...updates } : paper
      )
    }));
  };

  const removePaper = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'papers', id: id })
      });

      if (response.ok) {
        setData(prev => ({
          ...prev,
          papers: (prev.papers || []).filter(paper => paper.id !== id)
        }));
        toast.success('Paper removed successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove paper');
      }
    } catch (error) {
      console.error('Remove paper error:', error);
      toast.error('Failed to remove paper. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePaperUpload = async (file: File, paperId: string, fileType: 'paper' | 'poster' | 'presentation') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('paperId', paperId);
      formData.append('fileType', fileType);

      const response = await fetch('/api/papers', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const updates: any = {};
        if (fileType === 'paper') {
          updates.paperPdf = result.url;
          updates.paperFilename = result.filename;
        } else if (fileType === 'poster') {
          updates.posterPdf = result.url;
          updates.posterFilename = result.filename;
        } else if (fileType === 'presentation') {
          updates.presentationPdf = result.url;
          updates.presentationFilename = result.filename;
        }
        
        updatePaper(paperId, updates);
        alert(`${fileType} uploaded successfully!`);
      } else {
        console.error(`${fileType} upload failed:`, result.error);
        alert(`Failed to upload ${fileType}: ` + result.error);
      }
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      alert(`Error uploading ${fileType}. Please try again.`);
    }
  };

  const handleProjectImageUpload = async (file: File, projectId: string) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('projectId', projectId);

      const response = await fetch('/api/project-image-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData(prev => ({
          ...prev,
          projects: prev.projects.map(project => 
            project.id === projectId 
              ? { ...project, images: [...project.images, result.imageUrl] }
              : project
          )
        }));
        alert('Project image uploaded successfully!');
      } else {
        console.error('Failed to upload project image');
        alert('Failed to upload project image');
      }
    } catch (error) {
      console.error('Error uploading project image:', error);
      alert('Error uploading project image. Please try again.');
    }
  };

  const addProjectImageUrl = (projectId: string, imageUrl: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === projectId 
          ? { ...project, images: [...project.images, imageUrl] }
          : project
      )
    }));
  };

  const renderHeroSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Hero Section</h3>
      
      {/* Profile Picture Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          {data.hero.profilePicture ? (
            <div className="relative">
              <img 
                src={data.hero.profilePicture} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
              <button
                onClick={() => updateData('hero', { profilePicture: undefined })}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {data.hero.name?.english?.charAt(0) || 'M'}
            </div>
          )}
          <button
            onClick={() => document.getElementById('profile-picture-input')?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Picture
          </button>
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const formData = new FormData();
                  formData.append('file', file);

                  const response = await fetch('/api/profile-picture-upload', {
                    method: 'POST',
                    body: formData,
                  });

                  const result = await response.json();

                  if (result.success) {
                    
                    updateData('hero', { profilePicture: result.url });
                    alert('Profile picture uploaded successfully!');
                  } else {
                    console.error('Profile picture upload failed:', result.error);
                    alert('Failed to upload profile picture: ' + result.error);
                  }
                } catch (error) {
                  console.error('Profile picture upload error:', error);
                  alert('Failed to upload profile picture. Please try again.');
                }
              }
            }}
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload a profile picture to replace the default initial display
        </p>
      </div>
      
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name (English)
          </label>
          <input
            type="text"
            value={data.hero.name.english}
            onChange={(e) => updateData('hero', { name: { ...data.hero.name, english: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name (Japanese)
          </label>
          <input
            type="text"
            value={data.hero.name.japanese}
            onChange={(e) => updateData('hero', { name: { ...data.hero.name, japanese: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title (English)
          </label>
          <input
            type="text"
            value={data.hero.title.english}
            onChange={(e) => updateData('hero', { title: { ...data.hero.title, english: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title (Japanese)
          </label>
          <input
            type="text"
            value={data.hero.title.japanese}
            onChange={(e) => updateData('hero', { title: { ...data.hero.title, japanese: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtitle (English)
          </label>
          <input
            type="text"
            value={data.hero.subtitle.english}
            onChange={(e) => updateData('hero', { subtitle: { ...data.hero.subtitle, english: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtitle (Japanese)
          </label>
          <input
            type="text"
            value={data.hero.subtitle.japanese}
            onChange={(e) => updateData('hero', { subtitle: { ...data.hero.subtitle, japanese: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        

      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (English)
          </label>
          <textarea
            rows={4}
            value={data.hero.description.english}
            onChange={(e) => updateData('hero', { description: { ...data.hero.description, english: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description (Japanese)
          </label>
          <textarea
            rows={4}
            value={data.hero.description.japanese}
            onChange={(e) => updateData('hero', { description: { ...data.hero.description, japanese: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Me Section</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location (English)
          </label>
          <input
            type="text"
            value={data.about.location.english}
            onChange={(e) => updateData('about', { location: { ...data.about.location, english: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location (Japanese)
          </label>
          <input
            type="text"
            value={data.about.location.japanese}
            onChange={(e) => updateData('about', { location: { ...data.about.location, japanese: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <input
            type="text"
            value={data.about.status}
            onChange={(e) => updateData('about', { status: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Education
          </label>
          <input
            type="text"
            value={data.about.education}
            onChange={(e) => updateData('about', { education: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          English Description
        </label>
        <textarea
          rows={6}
          value={data.about.english}
          onChange={(e) => updateData('about', { english: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Japanese Description (日本語)
        </label>
        <textarea
          rows={6}
          value={data.about.japanese}
          onChange={(e) => updateData('about', { japanese: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education Section</h2>
        <button
          onClick={addEducation}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>
      
      <div className="space-y-6">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education #{index + 1}</h3>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution (English)
                </label>
                <input
                  type="text"
                  value={edu.institution.english}
                  onChange={(e) => updateEducation(edu.id, { institution: { ...edu.institution, english: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution (Japanese)
                </label>
                <input
                  type="text"
                  value={edu.institution.japanese}
                  onChange={(e) => updateEducation(edu.id, { institution: { ...edu.institution, japanese: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree (English)
                </label>
                <input
                  type="text"
                  value={edu.degree.english}
                  onChange={(e) => updateEducation(edu.id, { degree: { ...edu.degree, english: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree (Japanese)
                </label>
                <input
                  type="text"
                  value={edu.degree.japanese}
                  onChange={(e) => updateEducation(edu.id, { degree: { ...edu.degree, japanese: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period (English)
                </label>
                <input
                  type="text"
                  value={edu.period.english}
                  onChange={(e) => updateEducation(edu.id, { period: { ...edu.period, english: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period (Japanese)
                </label>
                <input
                  type="text"
                  value={edu.period.japanese}
                  onChange={(e) => updateEducation(edu.id, { period: { ...edu.period, japanese: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (English)
              </label>
              <textarea
                value={edu.description.english}
                onChange={(e) => updateEducation(edu.id, { description: { ...edu.description, english: e.target.value } })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Japanese)
              </label>
              <textarea
                value={edu.description.japanese}
                onChange={(e) => updateEducation(edu.id, { description: { ...edu.description, japanese: e.target.value } })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Achievements (English)
              </label>
              <textarea
                value={edu.achievements.english.join('\n')}
                onChange={(e) => updateEducation(edu.id, { achievements: { ...edu.achievements, english: e.target.value.split('\n').filter(item => item.trim()) } })}
                rows={3}
                placeholder="Enter achievements, one per line"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Achievements (Japanese)
              </label>
              <textarea
                value={edu.achievements.japanese.join('\n')}
                onChange={(e) => updateEducation(edu.id, { achievements: { ...edu.achievements, japanese: e.target.value.split('\n').filter(item => item.trim()) } })}
                rows={3}
                placeholder="Enter achievements, one per line"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Section</h2>
        <button
          onClick={addExperience}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>
      
      <div className="space-y-6">
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Experience #{index + 1}</h3>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={exp.title.english}
                  onChange={(e) => updateExperience(exp.id, { title: { ...exp.title, english: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title (Japanese)
                </label>
                <input
                  type="text"
                  value={exp.title.japanese}
                  onChange={(e) => updateExperience(exp.id, { title: { ...exp.title, japanese: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company (English)
                </label>
                <input
                  type="text"
                  value={exp.company.english}
                  onChange={(e) => updateExperience(exp.id, { company: { ...exp.company, english: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company (Japanese)
                </label>
                <input
                  type="text"
                  value={exp.company.japanese}
                  onChange={(e) => updateExperience(exp.id, { company: { ...exp.company, japanese: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period (English)
                </label>
                <input
                  type="text"
                  value={exp.period.english}
                  onChange={(e) => updateExperience(exp.id, { period: { ...exp.period, english: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period (Japanese)
                </label>
                <input
                  type="text"
                  value={exp.period.japanese}
                  onChange={(e) => updateExperience(exp.id, { period: { ...exp.period, japanese: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (English)
              </label>
              <textarea
                value={exp.description.english}
                onChange={(e) => updateExperience(exp.id, { description: { ...exp.description, english: e.target.value } })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Japanese)
              </label>
              <textarea
                value={exp.description.japanese}
                onChange={(e) => updateExperience(exp.id, { description: { ...exp.description, japanese: e.target.value } })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technologies
              </label>
              <textarea
                value={exp.technologies.join(', ')}
                onChange={(e) => updateExperience(exp.id, { technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech) })}
                rows={2}
                placeholder="Enter technologies, separated by commas"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills Section</h2>
      
      {(['languages', 'frameworks', 'databases', 'tools'] as const).map((category) => (
        <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {category}
            </h3>
            <button
              onClick={() => addSkill(category)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Skill</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {(() => {
              // Ensure we have valid data before mapping
              const skills = data.skills?.[category];
              console.log(`🎯 Rendering skills for ${category}:`);
              console.log(`  - Skills data:`, skills);
              console.log(`  - Skills type:`, typeof skills);
              console.log(`  - Skills is array:`, Array.isArray(skills));
              console.log(`  - Skills length:`, skills?.length);
              console.log(`  - Full data.skills:`, data.skills);
              console.log(`  - Category:`, category);
              
              if (!skills || !Array.isArray(skills)) {
                console.log(`  - No valid skills for ${category}, showing empty state`);
                return (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No skills found for {category}. Click &quot;Add Skill&quot; to get started.
                    <br />
                    <small className="text-xs text-gray-400">
                      Debug: skills={JSON.stringify(skills)} | type={typeof skills} | isArray={Array.isArray(skills)}
                    </small>
                  </div>
                );
              }
              
              return skills.map((skill, index) => (
                <motion.div 
                  key={skill.id || `skill-${category}-${index}`} 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="relative icon-dropdown-container">
                    <motion.button
                      type="button"
                      onClick={() => setOpenIconDropdown(openIconDropdown === skill.id ? null : skill.id)}
                      className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {(() => {
                        const Icon = skill.iconKey ? (si as any)[skill.iconKey] : null;
                        return Icon ? <Icon size={20} /> : (skill.icon || '🔧');
                      })()}
                    </motion.button>
                    {openIconDropdown === skill.id && (
                      <motion.div 
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpenIconDropdown(null)}
                      >
                        <motion.div 
                          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
                          initial={{ opacity: 0, y: -20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                              Choose Icon for {skill.name || 'Skill'}
                            </h4>
                            <button
                              type="button"
                              onClick={() => setOpenIconDropdown(null)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Icon Grid */}
                          <div className="mb-4">
                            <SkillIconPicker
                              value={skill.iconKey || skill.icon}
                              onChange={(iconKey) => {
                                setData(prev => ({
                                  ...prev,
                                  skills: {
                                    ...prev.skills,
                                    [category]: Array.isArray(prev.skills[category])
                                      ? prev.skills[category].map(s =>
                                          s.id === skill.id ? { ...s, iconKey, icon: iconKey } : s
                                        )
                                      : []
                                  }
                                }));
                                setOpenIconDropdown(null);
                              }}
                            />
                          </div>

                          {/* Footer */}
                          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <button
                              type="button"
                              onClick={() => setOpenIconDropdown(null)}
                              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => setOpenIconDropdown(null)}
                              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              Done
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                  <motion.input
                    type="text"
                    value={skill.name || ''}
                    onChange={(e) => updateSkill(category, index, { name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Skill name"
                    whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button
                    onClick={() => removeSkill(category, index)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Trash2 className="h-5 w-4" />
                  </motion.button>
                </motion.div>
              ));
            })()}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCertificationsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications Section</h2>
        <button
          onClick={addCertification}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certification</span>
        </button>
      </div>
      
      <div className="space-y-6">
        {data.certifications.map((cert, index) => (
          <div key={cert.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Certification #{index + 1}
              </h3>
              <button
                onClick={() => removeCertification(cert.id)}
                disabled={isDeleting === cert.id}
                className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting === cert.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (English)
                </label>
                <input
                  type="text"
                  value={cert.name.english}
                  onChange={(e) => updateCertification(cert.id, { name: { ...cert.name, english: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (Japanese)
                </label>
                <input
                  type="text"
                  value={cert.name.japanese}
                  onChange={(e) => updateCertification(cert.id, { name: { ...cert.name, japanese: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuer (English)
                </label>
                <input
                  type="text"
                  value={cert.issuer.english}
                  onChange={(e) => updateCertification(cert.id, { issuer: { ...cert.issuer, english: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuer (Japanese)
                </label>
                <input
                  type="text"
                  value={cert.issuer.japanese}
                  onChange={(e) => updateCertification(cert.id, { issuer: { ...cert.issuer, japanese: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date (English)
                </label>
                <input
                  type="text"
                  value={cert.date.english}
                  onChange={(e) => updateCertification(cert.id, { date: { ...cert.date, english: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date (Japanese)
                </label>
                <input
                  type="text"
                  value={cert.date.japanese}
                  onChange={(e) => updateCertification(cert.id, { date: { ...cert.date, japanese: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date (English)
                </label>
                <input
                  type="text"
                  value={cert.expiryDate?.english || ''}
                  onChange={(e) => updateCertification(cert.id, { expiryDate: { ...cert.expiryDate, english: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Optional expiry date"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date (Japanese)
                </label>
                <input
                  type="text"
                  value={cert.expiryDate?.japanese || ''}
                  onChange={(e) => updateCertification(cert.id, { expiryDate: { ...cert.expiryDate, japanese: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Optional expiry date"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={cert.image}
                    onChange={(e) => updateCertification(cert.id, { image: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // For demo purposes, we'll use a placeholder URL
                          // In a real app, you'd upload to a server
                          updateCertification(cert.id, { image: `/certifications/${file.name}` });
                        }
                      };
                      input.click();
                    }}
                    className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={cert.pdf}
                    onChange={(e) => updateCertification(cert.id, { pdf: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com/certificate.pdf"
                  />
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // For demo purposes, we'll use a placeholder URL
                          // In a real app, you'd upload to a server
                          updateCertification(cert.id, { pdf: `/certifications/${file.name}` });
                        }
                      };
                      input.click();
                    }}
                    className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preview */}
              {cert.image && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview</label>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={cert.image}
                      alt={cert.name.english}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Section</h2>
        <button
          onClick={addProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-6">
        {data.projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{typeof project.title === 'object' && project.title?.english ? project.title.english : (typeof project.title === 'string' ? project.title : 'Untitled Project')}</h3>
              <button
                onClick={() => removeProject(project.id)}
                disabled={isDeleting === project.id}
                className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting === project.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={typeof project.title === 'object' && project.title?.english ? project.title.english : (typeof project.title === 'string' ? project.title : '')}
                  onChange={(e) => updateProject(project.id, { title: { ...project.title, english: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (Japanese)</label>
                <input
                  type="text"
                  value={typeof project.title === 'object' && project.title?.japanese ? project.title.japanese : ''}
                  onChange={(e) => updateProject(project.id, { title: { ...project.title, japanese: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={typeof project.description === 'object' && project.description?.english ? project.description.english : (typeof project.description === 'string' ? project.description : '')}
                  onChange={(e) => updateProject(project.id, { description: { ...project.description, english: e.target.value } })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Japanese)</label>
                <textarea
                  value={typeof project.description === 'object' && project.description?.japanese ? project.description.japanese : ''}
                  onChange={(e) => updateProject(project.id, { description: { ...project.description, japanese: e.target.value } })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={project.github}
                  onChange={(e) => updateProject(project.id, { github: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Live URL</label>
                <input
                  type="url"
                  value={project.live}
                  onChange={(e) => updateProject(project.id, { live: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, { technologies: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={project.showImage}
                    onChange={(e) => updateProject(project.id, { showImage: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Images on Main Site</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={project.showLiveDemo}
                    onChange={(e) => updateProject(project.id, { showLiveDemo: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Live Demo on Main Site</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Images</label>
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload project images</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleProjectImageUpload(file, project.id);
                          }
                        }}
                        className="hidden"
                        id={`project-image-upload-${project.id}`}
                      />
                      <label
                        htmlFor={`project-image-upload-${project.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-block"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>

                  {/* Add Image URL */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Or add image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            addProjectImageUrl(project.id, input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input.value.trim()) {
                          addProjectImageUrl(project.id, input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Existing Images */}
                  <div className="space-y-2">
                    {project.images.map((image, index) => (
                      <div key={`${project.id}-image-${index}`} className="flex items-center space-x-2">
                        <img
                          src={image}
                          alt={`Project ${index + 1}`}
                          className="w-12 h-12 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => {
                            const newImages = [...project.images];
                            newImages[index] = e.target.value;
                            updateProject(project.id, { images: newImages });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Image URL"
                        />
                        <button
                          onClick={() => removeProjectImage(project.id, index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Section</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={data.contact.email}
            onChange={(e) => updateData('contact', { email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={data.contact.phone}
            onChange={(e) => updateData('contact', { phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location (English)
          </label>
          <input
            type="text"
            value={data.contact.location.english}
            onChange={(e) => updateData('contact', { location: { ...data.contact.location, english: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location (Japanese)
          </label>
          <input
            type="text"
            value={data.contact.location.japanese}
            onChange={(e) => updateData('contact', { location: { ...data.contact.location, japanese: e.target.value } })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub
            </label>
            <input
              type="url"
              value={data.contact.social.github}
              onChange={(e) => updateData('contact', { 
                social: { ...data.contact.social, github: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              value={data.contact.social.linkedin}
              onChange={(e) => updateData('contact', { 
                social: { ...data.contact.social, linkedin: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              WhatsApp
            </label>
            <input
              type="url"
              value={data.contact.social.whatsapp}
              onChange={(e) => updateData('contact', { 
                social: { ...data.contact.social, whatsapp: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={data.contact.social.facebook}
              onChange={(e) => updateData('contact', { 
                social: { ...data.contact.social, facebook: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Indeed
            </label>
            <input
              type="url"
              value={data.contact.social.indeed}
              onChange={(e) => updateData('contact', { 
                social: { ...data.contact.social, indeed: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCVSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CV Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English CV */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">English CV</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CV File</label>
              <div className="flex items-center space-x-2">
                {data.cv.english.url ? (
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{data.cv.english.filename}</p>
                    <a 
                      href={data.cv.english.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View CV
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-500">No CV uploaded</p>
                )}
                <button
                  onClick={() => {
                    setCvUploadLanguage('en');
                    setShowCVUploadModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
                {data.cv.english.url && (
                  <button
                    onClick={() => removeCV('en')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            

          </div>
        </div>

        {/* Japanese CV */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Japanese CV</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CV File</label>
              <div className="flex items-center space-x-2">
                {data.cv.japanese.url ? (
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{data.cv.japanese.filename}</p>
                    <a 
                      href={data.cv.japanese.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View CV
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-500">No CV uploaded</p>
                )}
                <button
                  onClick={() => {
                    setCvUploadLanguage('ja');
                    setShowCVUploadModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
                {data.cv.japanese.url && (
                  <button
                    onClick={() => removeCV('ja')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );

  const renderPapersSection = () => {
    const papersArray = data.papers || [];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Papers Management</h2>
          <button
            onClick={addPaper}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Paper</span>
          </button>
        </div>

        <div className="space-y-6">
          {papersArray.map((paper, index) => (
            <div key={paper.id || `paper-${index}`} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {paper.title.english || 'Untitled Paper'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removePaper(paper.id)}
                    disabled={isDeleting === paper.id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDeleting === paper.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={paper.title.english || ''}
                    onChange={(e) => updatePaper(paper.id, { title: { ...paper.title, english: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Paper title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (Japanese)</label>
                  <input
                    type="text"
                    value={paper.title.japanese || ''}
                    onChange={(e) => updatePaper(paper.id, { title: { ...paper.title, japanese: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Paper title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    value={paper.type || 'oral'}
                    onChange={(e) => updatePaper(paper.id, { type: e.target.value as 'poster' | 'oral' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  >
                    <option value="poster">Poster</option>
                    <option value="oral">Oral Presentation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date (English)</label>
                  <input
                    type="text"
                    value={paper.date.english || ''}
                    onChange={(e) => updatePaper(paper.id, { date: { ...paper.date, english: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="2024"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date (Japanese)</label>
                  <input
                    type="text"
                    value={paper.date.japanese || ''}
                    onChange={(e) => updatePaper(paper.id, { date: { ...paper.date, japanese: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="2024年"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conference (English)</label>
                  <input
                    type="text"
                    value={paper.conference.english || ''}
                    onChange={(e) => updatePaper(paper.id, { conference: { ...paper.conference, english: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Conference name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conference (Japanese)</label>
                  <input
                    type="text"
                    value={paper.conference.japanese || ''}
                    onChange={(e) => updatePaper(paper.id, { conference: { ...paper.conference, japanese: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Conference name"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (English)</label>
                  <textarea
                    value={paper.description?.english || ''}
                    onChange={(e) => updatePaper(paper.id, { description: { ...paper.description, english: e.target.value } })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Enter paper description in English"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Japanese)</label>
                  <textarea
                    value={paper.description?.japanese || ''}
                    onChange={(e) => updatePaper(paper.id, { description: { ...paper.description, japanese: e.target.value } })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Enter paper description in Japanese"
                  />
                </div>

                {/* Paper PDF Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paper PDF</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={paper.paperPdf || ''}
                      onChange={(e) => updatePaper(paper.id, { paperPdf: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                      placeholder="PDF URL or upload file"
                    />
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            handlePaperUpload(file, paper.id, 'paper');
                          }
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Abstract */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Abstract (English)</label>
                  <textarea
                    value={paper.abstract?.english || ''}
                    onChange={(e) => updatePaper(paper.id, { abstract: { ...paper.abstract, english: e.target.value } })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Enter paper abstract in English"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Abstract (Japanese)</label>
                  <textarea
                    value={paper.abstract?.japanese || ''}
                    onChange={(e) => updatePaper(paper.id, { abstract: { ...paper.abstract, japanese: e.target.value } })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Enter paper abstract in Japanese"
                  />
                </div>

                {/* Authors */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authors (English)</label>
                  <input
                    type="text"
                    value={paper.authors?.english?.join(', ') || ''}
                    onChange={(e) => updatePaper(paper.id, { authors: { ...paper.authors, english: e.target.value.split(',').map(author => author.trim()).filter(author => author) } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Enter authors separated by commas"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authors (Japanese)</label>
                  <input
                    type="text"
                    value={paper.authors?.japanese?.join(', ') || ''}
                    onChange={(e) => updatePaper(paper.id, { authors: { ...paper.authors, japanese: e.target.value.split(',').map(author => author.trim()).filter(author => author) } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Enter authors separated by commas"
                  />
                </div>

                {/* Poster PDF Upload (for poster type) */}
                {paper.type === 'poster' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Poster PDF</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={paper.posterPdf || ''}
                        onChange={(e) => updatePaper(paper.id, { posterPdf: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        placeholder="PDF URL or upload file"
                      />
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handlePaperUpload(file, paper.id, 'poster');
                            }
                          };
                          input.click();
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Presentation PDF Upload (for oral type) */}
                {paper.type === 'oral' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Presentation PDF</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={paper.presentationPdf || ''}
                        onChange={(e) => updatePaper(paper.id, { presentationPdf: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        placeholder="PDF URL or upload file"
                      />
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handlePaperUpload(file, paper.id, 'presentation');
                            }
                          };
                          input.click();
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLogsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Logs</h2>
        <button
          onClick={refreshLogs}
          disabled={isLoadingLogs}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          {isLoadingLogs ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Refresh Logs</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {(!adminLogs || !Array.isArray(adminLogs) || adminLogs.length === 0) ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No admin logs found. Click &quot;Refresh Logs&quot; to load recent activity.</p>
            </div>
          ) : (
            adminLogs.map((log) => (
              <div key={log.id || `log-${Date.now()}`} className={`p-4 rounded-lg border ${
                log.success 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action === 'create' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        log.action === 'update' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        log.action === 'delete' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {log.action?.toUpperCase() || 'UNKNOWN'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(log.time || Date.now()).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Section: {log.section || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By: {log.by || 'Unknown'}
                    </p>
                    {log.error_message && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Error: {log.error_message}
                      </p>
                    )}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    log.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderMigrationSection = () => {
    const previewMigration = async () => {
      try {
        setMigrationStatus('previewing');
        const response = await fetch('/api/migrate-certifications', { method: 'GET' });
        const data = await response.json();
        
        if (response.ok) {
          setMigrationData(data);
          setMigrationStatus('idle');
        } else {
          throw new Error(data.error || 'Failed to preview migration');
        }
      } catch (error: any) {
        setMigrationError(error.message);
        setMigrationStatus('error');
      }
    };

    const executeMigration = async () => {
      try {
        setMigrationStatus('migrating');
        const response = await fetch('/api/migrate-certifications', { method: 'POST' });
        const data = await response.json();
        
        if (response.ok) {
          setMigrationData(data);
          setMigrationStatus('completed');
          // Refresh the main data after successful migration
          await fetchData();
          toast.success('Migration completed successfully!');
        } else {
          throw new Error(data.error || 'Failed to execute migration');
        }
      } catch (error: any) {
        setMigrationError(error.message);
        setMigrationStatus('error');
        toast.error(`Migration failed: ${error.message}`);
      }
    };

    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications Migration Tool</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            This tool will consolidate your duplicate certifications and certificates data into a single, clean schema.
            <br />
            <strong className="text-orange-600">⚠️ This is a one-time operation. Run it only once!</strong>
          </p>
        </div>

        {/* Current Data Status */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Current Data Status</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-200">Certifications:</span>
              <span className="ml-2 text-blue-600 dark:text-blue-300">{data?.certifications?.length || 0} entries</span>
            </div>
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-200">Certificates:</span>
              <span className="ml-2 text-blue-600 dark:text-blue-300">{(data as any)?.certificates?.length || 0} entries</span>
            </div>
          </div>
        </div>

        {/* Migration Actions */}
        <div className="flex space-x-4">
          <button
            onClick={previewMigration}
            disabled={migrationStatus === 'previewing'}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${migrationStatus === 'previewing' ? 'animate-spin' : ''}`} />
            <span>Preview Migration</span>
          </button>
          
          <button
            onClick={executeMigration}
            disabled={migrationStatus === 'migrating' || migrationStatus === 'completed'}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
          >
            <RotateCcw className={`h-4 w-4 ${migrationStatus === 'migrating' ? 'animate-spin' : ''}`} />
            <span>Execute Migration</span>
          </button>
        </div>

        {/* Migration Results */}
        {migrationData && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              {migrationStatus === 'completed' ? 'Migration Completed!' : 'Migration Preview'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium text-green-800 dark:text-green-200">Before:</span>
                <div className="text-sm text-green-600 dark:text-green-300">
                  <div>Certifications: {migrationData.summary?.before?.certifications || migrationData.before?.certifications || 0}</div>
                  <div>Certificates: {migrationData.summary?.before?.certificates || migrationData.before?.certificates || 0}</div>
                </div>
              </div>
              <div>
                <span className="font-medium text-green-800 dark:text-green-200">After:</span>
                <div className="text-sm text-green-600 dark:text-green-300">
                  <div>Certifications: {migrationData.summary?.after?.certifications || migrationData.after?.certifications || 0}</div>
                  <div>Certificates: 0 (removed)</div>
                </div>
              </div>
            </div>

            {migrationStatus === 'completed' && (
              <div className="text-sm text-green-700 dark:text-green-300">
                ✅ Migration executed successfully! Your data has been consolidated into a single certifications schema.
                <br />
                The old certificates field has been removed to prevent future confusion.
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {migrationError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Migration Error</h3>
            <p className="text-red-700 dark:text-red-300">{migrationError}</p>
          </div>
        )}

        {/* Migration Details */}
        {migrationData && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Migration Details</h3>
            <pre className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded border overflow-auto">
              {JSON.stringify(migrationData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroSection();
      case 'about':
        return renderAboutSection();
      case 'cv':
        return renderCVSection();
      case 'education':
        return renderEducationSection();
      case 'experience':
        return renderExperienceSection();
      case 'skills':
        return renderSkillsSection();

      case 'projects':
        return renderProjectsSection();
      case 'certifications':
        return <CertificatesSection />;
      case 'contact':
        return renderContactSection();
      case 'papers':
        return renderPapersSection();
      case 'migration':
        return renderMigrationSection();
      case 'certificates-manager':
        return <CertificateManager />;
      case 'logs':
        return renderLogsSection();
      default:
        return <div>Select a section to edit</div>;
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
      
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio Editor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Edit your portfolio content and see live preview
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
          
          <button
            onClick={saveData}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'hero', label: 'Hero', icon: '👤' },
              { id: 'about', label: 'About', icon: 'ℹ️' },
              { id: 'cv', label: 'CV Management', icon: '📄' },
              { id: 'education', label: 'Education', icon: '🎓' },
              { id: 'experience', label: 'Experience', icon: '💼' },
              { id: 'skills', label: 'Skills', icon: '💻' },
              { id: 'projects', label: 'Projects', icon: '🚀' },
              { id: 'certifications', label: 'Certifications', icon: '🏆' },
              { id: 'certificates-manager', label: 'Certificates Manager', icon: '📜' },
              { id: 'contact', label: 'Contact', icon: '📞' },
              { id: 'papers', label: 'Papers', icon: '📄' },
              { id: 'migration', label: 'Migration Tool', icon: '🔄' },
              { id: 'logs', label: 'Admin Logs', icon: '📊' }
            ].map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </motion.button>
            ))}
          </div>
        </div>
        
        {renderSection()}
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Live Preview
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Here you would render the actual portfolio with the current data */}
              <div className="prose dark:prose-invert max-w-none">
                <h1>{data.hero.name.english}</h1>
                <h2>{data.hero.title.english}</h2>
                <p>{data.hero.subtitle.english}</p>
                <p>{data.hero.description.english}</p>
                
                <h3>About Me</h3>
                <p><strong>Location:</strong> {data.about.location.english}</p>
                <p><strong>Status:</strong> {data.about.status}</p>
                <p><strong>Education:</strong> {data.about.education}</p>
                
                <h4>English</h4>
                <p>{data.about.english}</p>
                
                <h4>Japanese</h4>
                <p>{data.about.japanese}</p>
                
                <h3>Education</h3>
                {data.education.map((edu, index) => (
                  <div key={edu.id} className="mb-4">
                    <h4>{typeof edu.institution === 'object' && edu.institution?.english ? edu.institution.english : (typeof edu.institution === 'string' ? edu.institution : '')}</h4>
                    <p><strong>{typeof edu.degree === 'object' && edu.degree?.english ? edu.degree.english : (typeof edu.degree === 'string' ? edu.degree : '')}</strong></p>
                    <p>{typeof edu.period === 'object' && edu.period?.english ? edu.period.english : (typeof edu.period === 'string' ? edu.period : '')}</p>
                    <p>{typeof edu.description === 'object' && edu.description?.english ? edu.description.english : (typeof edu.description === 'string' ? edu.description : '')}</p>
                  </div>
                ))}
                
                <h3>Skills</h3>
                {(['languages', 'frameworks', 'databases', 'tools'] as const).map((category) => (
                  <div key={category}>
                    <h4 className="capitalize">{category}</h4>
                    <ul>
                      {data.skills[category].map((skill, index) => {
                        const Icon = skill.iconKey ? (si as any)[skill.iconKey] : null;
                        return (
                          <li key={skill.id || `skill-${category}-${index}`} className="flex items-center gap-2">
                            {Icon ? <Icon size={16} /> : (skill.icon || '🔧')} {skill.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                
                <h3>Certifications</h3>
                {data.certifications.map((cert, index) => (
                  <div key={cert.id} className="mb-4">
                    <h4>{cert.name.english}</h4>
                    <p>{cert.issuer.english} • {cert.date.english}</p>
                  </div>
                ))}
                

                
                <h3>Contact</h3>
                <p><strong>Email:</strong> {data.contact.email}</p>
                <p><strong>Phone:</strong> {data.contact.phone}</p>
                <p><strong>Location:</strong> {data.contact.location.english}</p>
                
                <h4>Social Media</h4>
                <ul>
                  <li><strong>GitHub:</strong> {data.contact.social.github}</li>
                  <li><strong>LinkedIn:</strong> {data.contact.social.linkedin}</li>
                  <li><strong>WhatsApp:</strong> {data.contact.social.whatsapp}</li>
                  <li><strong>Facebook:</strong> {data.contact.social.facebook}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              {saveModalType === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-red-500" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {saveModalType === 'success' ? 'Success!' : 'Error!'}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {saveModalType === 'success' 
                ? 'Portfolio data saved successfully!' 
                : 'Failed to save portfolio data. Please try again.'
              }
            </p>
            <button
              onClick={() => setShowSaveModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* CV Upload Modal */}
      {showCVUploadModal && (
        <CVUploadModal
          isOpen={showCVUploadModal}
          onClose={() => setShowCVUploadModal(false)}
          onSave={handleCVUpload}
          language={cvUploadLanguage}
        />
      )}
    </div>
  );
} 