'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Presentation
} from 'lucide-react';

import CVUploadModal from '../components/CVUploadModal';

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
    tools: Array<{ name: string; icon: string }>;
  };
  about: {
    english: string;
    japanese: string;
    location: string;
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
  skills: {
    languages: Array<{ name: string; icon: string }>;
    frameworks: Array<{ name: string; icon: string }>;
    databases: Array<{ name: string; icon: string }>;
    tools: Array<{ name: string; icon: string }>;
  };
  papers: Array<{
    id: string;
    title: string;
    type: 'poster' | 'oral';
    date: string;
    conference: string;
    paperPdf: string;
    paperFilename: string;
    posterPdf?: string;
    posterFilename?: string;
    presentationPdf?: string;
    presentationFilename?: string;
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
    title: string;
    issuer: string;
    date: string;
    image: string;
    pdf: string;
  }>;
  contact: {
    email: string;
    phone: string;
    location: string;
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
      type: 'oral',
      date: "2024",
      conference: "IEEE International Conference on Artificial Intelligence",
      paperPdf: "",
      paperFilename: "",
      presentationPdf: "",
      presentationFilename: "",
    },
    {
      id: "2",
      title: "Deep Learning for Computer Vision",
      type: 'poster',
      date: "2024",
      conference: "Computer Vision Conference",
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

  // Get section from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  useEffect(() => {
    // Load saved data from API
    const fetchData = async () => {
      try {
        console.log('Fetching portfolio data from API...');
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const fetchedData = await response.json();
          console.log('Fetched data:', fetchedData);
          
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
              location: typeof fetchedData.about?.location === 'string' ? fetchedData.about.location : "",
              status: typeof fetchedData.about?.status === 'string' ? fetchedData.about.status : "",
              education: typeof fetchedData.about?.education === 'string' ? fetchedData.about.education : ""
            },
            education: Array.isArray(fetchedData.education) ? fetchedData.education.map((edu: any) => ({
              ...edu,
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
            projects: Array.isArray(fetchedData.projects) ? fetchedData.projects.map((project: any) => ({
              ...project,
              title: typeof project.title === 'string'
                ? { english: project.title, japanese: project.title }
                : project.title || { english: "", japanese: "" },
              description: typeof project.description === 'string'
                ? { english: project.description, japanese: project.description }
                : project.description || { english: "", japanese: "" },
              technologies: Array.isArray(project.technologies) ? project.technologies : [],
              images: Array.isArray(project.images) ? project.images : []
            })) : [],
            papers: Array.isArray(fetchedData.papers) ? fetchedData.papers : []
          };
          
          console.log('Sanitized data:', sanitizedData);
          setData(sanitizedData);
        } else {
          console.error('Failed to fetch portfolio data');
          setData(defaultData);
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setData(defaultData);
      }
    };

    fetchData();
  }, []);

  const saveData = async () => {
    setIsSaving(true);
    try {
      console.log('Saving portfolio data:', data);
      
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
        papers: Array.isArray(data.papers) ? data.papers : []
      };
      
      console.log('Sanitized data:', sanitizedData);
      
      // Save to API
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      });
      
      if (response.ok) {
        setSaveModalType('success');
        setShowSaveModal(true);
        setTimeout(() => setShowSaveModal(false), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save data');
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveModalType('error');
      setShowSaveModal(true);
      setTimeout(() => setShowSaveModal(false), 3000);
    }
    setIsSaving(false);
  };

  const updateData = (section: keyof PortfolioData, updates: any) => {
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
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: {
        english: "",
        japanese: ""
      },
      degree: {
        english: "",
        japanese: ""
      },
      period: {
        english: "",
        japanese: ""
      },
      description: {
        english: "",
        japanese: ""
      },
      achievements: {
        english: [],
        japanese: []
      }
    };
    setData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (category: keyof PortfolioData['skills']) => {
    const newSkill = { name: '', icon: '🔧' };
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], newSkill]
      }
    }));
  };

  const updateSkill = (category: keyof PortfolioData['skills'], index: number, updates: any) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => 
          i === index ? { ...skill, ...updates } : skill
        )
      }
    }));
  };

  const removeSkill = (category: keyof PortfolioData['skills'], index: number) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      title: "",
      issuer: "",
      date: "",
      image: "",
      pdf: ""
    };
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, ...updates } : cert
      )
    }));
  };

  const removeCertification = (id: string) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
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
  };

  const updateProject = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      const response = await fetch('/api/cv-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the CV data to reflect the new file
        const cvKey = language === 'en' ? 'english' : 'japanese';
        const filename = language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf';
        
        setData(prev => ({
          ...prev,
          cv: {
            ...prev.cv,
            [cvKey]: {
              url: result.url,
              filename: filename,
              isActive: true
            }
          }
        }));

        alert('CV uploaded successfully!');
      } else {
        console.error('CV upload failed:', result.error);
        alert('Failed to upload CV: ' + result.error);
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Error uploading CV. Please try again.');
    }
    
    setShowCVUploadModal(false);
  };

  const toggleCVActive = (language: 'en' | 'ja') => {
    const cvKey = language === 'en' ? 'english' : 'japanese';
    setData(prev => ({
      ...prev,
      cv: {
        ...prev.cv,
        [cvKey]: {
          ...prev.cv[cvKey],
          isActive: !prev.cv[cvKey].isActive
        }
      }
    }));
  };

  const removeCV = async (language: 'en' | 'ja') => {
    try {
      const response = await fetch(`/api/cv-upload?language=${language}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const cvKey = language === 'en' ? 'english' : 'japanese';
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

        alert('CV removed successfully!');
      } else {
        console.error('CV delete failed:', result.error);
        alert('Failed to delete CV: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Error deleting CV. Please try again.');
    }
  };

  // Papers Management Functions
  const addPaper = () => {
    const newPaper = {
      id: Date.now().toString(),
      title: "",
      type: "oral" as 'poster' | 'oral',
      date: "",
      conference: "",
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
  };

  const updatePaper = (id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      papers: (prev.papers || []).map(paper => 
        paper.id === id ? { ...paper, ...updates } : paper
      )
    }));
  };

  const removePaper = (id: string) => {
    setData(prev => ({
      ...prev,
      papers: (prev.papers || []).filter(paper => paper.id !== id)
    }));
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
              {data.hero.name.english.charAt(0)}
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
                    console.log('Profile picture upload successful:', result.url);
                    console.log('Profile picture type:', typeof result.url);
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
            Location
          </label>
          <input
            type="text"
            value={data.about.location}
            onChange={(e) => updateData('about', { location: e.target.value })}
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>
      
      <div className="space-y-6">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Education #{index + 1}
              </h3>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution (English)
                </label>
                <input
                  type="text"
                  value={typeof edu.institution === 'object' && edu.institution?.english ? edu.institution.english : (typeof edu.institution === 'string' ? edu.institution : '')}
                  onChange={(e) => updateEducation(edu.id, { institution: { ...edu.institution, english: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Institution (Japanese)
                </label>
                <input
                  type="text"
                  value={typeof edu.institution === 'object' && edu.institution?.japanese ? edu.institution.japanese : ''}
                  onChange={(e) => updateEducation(edu.id, { institution: { ...edu.institution, japanese: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree (English)
                </label>
                <input
                  type="text"
                  value={typeof edu.degree === 'object' && edu.degree?.english ? edu.degree.english : (typeof edu.degree === 'string' ? edu.degree : '')}
                  onChange={(e) => updateEducation(edu.id, { degree: { ...edu.degree, english: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Degree (Japanese)
                </label>
                <input
                  type="text"
                  value={typeof edu.degree === 'object' && edu.degree?.japanese ? edu.degree.japanese : ''}
                  onChange={(e) => updateEducation(edu.id, { degree: { ...edu.degree, japanese: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period (English)
                </label>
                <input
                  type="text"
                  value={typeof edu.period === 'object' && edu.period?.english ? edu.period.english : (typeof edu.period === 'string' ? edu.period : '')}
                  onChange={(e) => updateEducation(edu.id, { period: { ...edu.period, english: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period (Japanese)
                </label>
                <input
                  type="text"
                  value={typeof edu.period === 'object' && edu.period?.japanese ? edu.period.japanese : ''}
                  onChange={(e) => updateEducation(edu.id, { period: { ...edu.period, japanese: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (English)
              </label>
              <textarea
                rows={3}
                                  value={typeof edu.description === 'object' && edu.description?.english ? edu.description.english : (typeof edu.description === 'string' ? edu.description : '')}
                onChange={(e) => updateEducation(edu.id, { description: { ...edu.description, english: e.target.value } })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Japanese)
              </label>
              <textarea
                rows={3}
                                  value={typeof edu.description === 'object' && edu.description?.japanese ? edu.description.japanese : ''}
                onChange={(e) => updateEducation(edu.id, { description: { ...edu.description, japanese: e.target.value } })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            {data.skills[category].map((skill, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={skill.icon}
                  onChange={(e) => updateSkill(category, index, { icon: e.target.value })}
                  className="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                  placeholder="🔧"
                />
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(category, index, { name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Skill name"
                />
                <button
                  onClick={() => removeSkill(category, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
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
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={cert.title}
                  onChange={(e) => updateCertification(cert.id, { title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuer
                </label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      alt={cert.title}
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
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
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
                      <div key={index} className="flex items-center space-x-2">
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
            Location
          </label>
          <input
            type="text"
            value={data.contact.location}
            onChange={(e) => updateData('contact', { location: e.target.value })}
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
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="english-cv-active"
                checked={data.cv.english.isActive}
                onChange={() => toggleCVActive('en')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="english-cv-active" className="text-sm text-gray-700 dark:text-gray-300">
                Show on main site
              </label>
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
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="japanese-cv-active"
                checked={data.cv.japanese.isActive}
                onChange={() => toggleCVActive('ja')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="japanese-cv-active" className="text-sm text-gray-700 dark:text-gray-300">
                Show on main site
              </label>
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
          {papersArray.map((paper) => (
            <div key={paper.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {paper.title || 'Untitled Paper'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removePaper(paper.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={paper.title || ''}
                    onChange={(e) => updatePaper(paper.id, { title: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={paper.date || ''}
                    onChange={(e) => updatePaper(paper.id, { date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conference</label>
                  <input
                    type="text"
                    value={paper.conference || ''}
                    onChange={(e) => updatePaper(paper.id, { conference: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Conference name"
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
      case 'skills':
        return renderSkillsSection();

      case 'projects':
        return renderProjectsSection();
      case 'certifications':
        return renderCertificationsSection();
      case 'contact':
        return renderContactSection();
      case 'papers':
        return renderPapersSection();
      default:
        return <div>Select a section to edit</div>;
    }
  };

  return (
    <div className="space-y-6">
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
              { id: 'skills', label: 'Skills', icon: '💻' },

              { id: 'projects', label: 'Projects', icon: '🚀' },
              { id: 'certifications', label: 'Certifications', icon: '🏆' },
              { id: 'contact', label: 'Contact', icon: '📞' },
              { id: 'papers', label: 'Papers', icon: '📄' }
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
                <p><strong>Location:</strong> {data.about.location}</p>
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
                      {data.skills[category].map((skill, index) => (
                        <li key={index}>{skill.icon} {skill.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <h3>Certifications</h3>
                {data.certifications.map((cert, index) => (
                  <div key={cert.id} className="mb-4">
                    <h4>{cert.title}</h4>
                    <p>{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
                

                
                <h3>Contact</h3>
                <p><strong>Email:</strong> {data.contact.email}</p>
                <p><strong>Phone:</strong> {data.contact.phone}</p>
                <p><strong>Location:</strong> {data.contact.location}</p>
                
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