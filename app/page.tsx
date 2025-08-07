'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { 
  Download, 
  Github, 
  Linkedin, 
  Mail, 
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Code,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Brain,
  FileText,
  ExternalLink,
  Send,
  MapPin,
  Phone,
  Eye,
  Facebook,
  MessageCircle,
  Briefcase,
  FileImage,
  Presentation,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  // Helper function to safely extract multilingual text
  const getMultilingualText = (obj: any, language: 'en' | 'ja', fallback: string = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object' && obj.english && obj.japanese) {
      return obj[language === 'en' ? 'english' : 'japanese'] || fallback;
    }
    return fallback;
  };

  // Helper function to validate data structure
  const isValidData = (data: any) => {
    if (!data || typeof data !== 'object') {
      return false;
    }
    if (!data.hero || typeof data.hero !== 'object') {
      return false;
    }
    // Check if hero properties exist and are objects (for multilingual support)
    if (!data.hero.name || typeof data.hero.name !== 'object') {
      return false;
    }
    if (!data.hero.title || typeof data.hero.title !== 'object') {
      return false;
    }
    if (!data.hero.description || typeof data.hero.description !== 'object') {
      return false;
    }
    // Additional validation to ensure the objects have the required properties
    if (!data.hero.name.english || !data.hero.name.japanese) {
      return false;
    }
    if (!data.hero.title.english || !data.hero.title.japanese) {
      return false;
    }
    if (!data.hero.description.english || !data.hero.description.japanese) {
      return false;
    }
    
    return true;
  };

  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSkillCategory, setActiveSkillCategory] = useState('languages');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // NEW CV Download State
  const [showCVModal, setShowCVModal] = useState(false);
  
  // NEW Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [messagePopupContent, setMessagePopupContent] = useState('');
  const [messagePopupType, setMessagePopupType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Initialize dark mode on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
    }
  }, []);

  // Client-side only state for random values to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

            const fetchPortfolioData = async () => {
            try {
              const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        
        // Ensure data structure is correct
        const sanitizedData = {
          ...data,
          hero: {
            ...data.hero,
            name: typeof data.hero?.name === 'string' 
              ? { english: data.hero.name, japanese: data.hero.name }
              : data.hero?.name || { english: "Mushabbir Ahmed", japanese: "ムサビル・アハメド" },
            title: typeof data.hero?.title === 'string'
              ? { english: data.hero.title, japanese: data.hero.title }
              : data.hero?.title || { english: "AI Specialist & Software Engineer", japanese: "AIスペシャリスト・ソフトウェアエンジニア" },
            subtitle: typeof data.hero?.subtitle === 'string'
              ? { english: data.hero.subtitle, japanese: data.hero.subtitle }
              : data.hero?.subtitle || { english: "Passionate about creating innovative solutions", japanese: "革新的なソリューションの創造に情熱を注ぐ" },
            description: typeof data.hero?.description === 'string'
              ? { english: data.hero.description, japanese: data.hero.description }
              : data.hero?.description || { english: "I'm a results-driven AI Specialist and Software Engineer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan.", japanese: "現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程に在籍しているAIスペシャリスト・ソフトウェアエンジニアです。" },
            profilePicture: typeof data.hero?.profilePicture === 'string' ? data.hero.profilePicture : null,
            tools: Array.isArray(data.hero?.tools) ? data.hero.tools : []
          },
          about: {
            ...data.about,
            english: typeof data.about?.english === 'string' ? data.about.english : "",
            japanese: typeof data.about?.japanese === 'string' ? data.about.japanese : "",
            location: typeof data.about?.location === 'string'
              ? { english: data.about.location, japanese: data.about.location }
              : data.about?.location || { english: "", japanese: "" },
            status: typeof data.about?.status === 'string'
              ? { english: data.about.status, japanese: data.about.status }
              : data.about?.status || { english: "", japanese: "" },
            education: typeof data.about?.education === 'string'
              ? { english: data.about.education, japanese: data.about.education }
              : data.about?.education || { english: "", japanese: "" }
          },
          cv: {
            english: {
              url: data.cv?.english?.url || (typeof data.cv?.english === 'string' ? data.cv.english : "/cv/mushabbir-en.pdf"),
              filename: data.cv?.english?.filename || "mushabbir-en.pdf",
              isActive: data.cv?.english?.isActive !== false
            },
            japanese: {
              url: data.cv?.japanese?.url || (typeof data.cv?.japanese === 'string' ? data.cv.japanese : "/cv/mushabbir-ja.pdf"),
              filename: data.cv?.japanese?.filename || "mushabbir-ja.pdf",
              isActive: data.cv?.japanese?.isActive !== false
            }
          },
          education: Array.isArray(data.education) ? data.education.map((edu: any) => ({
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
          projects: Array.isArray(data.projects) ? data.projects.map((project: any) => ({
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
          papers: Array.isArray(data.papers) ? data.papers.map((paper: any) => ({
            ...paper,
            title: typeof paper.title === 'string'
              ? { english: paper.title, japanese: paper.title }
              : paper.title || { english: "", japanese: "" },
            conference: typeof paper.conference === 'string'
              ? { english: paper.conference, japanese: paper.conference }
              : (typeof paper.journal === 'string' ? { english: paper.journal, japanese: paper.journal } : paper.conference || { english: "", japanese: "" }),
            date: typeof paper.date === 'string'
              ? { english: paper.date, japanese: paper.date }
              : (typeof paper.year === 'string' ? { english: paper.year, japanese: paper.year } : paper.date || { english: "", japanese: "" })
          })) : [],
          skills: {
            languages: Array.isArray(data.skills?.languages) ? data.skills.languages : [],
            frameworks: Array.isArray(data.skills?.frameworks) ? data.skills.frameworks : [],
            databases: Array.isArray(data.skills?.databases) ? data.skills.databases : [],
            tools: Array.isArray(data.skills?.tools) ? data.skills.tools : []
          },
          certifications: Array.isArray(data.certifications) ? data.certifications.map((cert: any) => ({
            ...cert,
            name: typeof cert.name === 'string'
              ? { english: cert.name, japanese: cert.name }
              : cert.name || { english: "", japanese: "" },
            issuer: typeof cert.issuer === 'string'
              ? { english: cert.issuer, japanese: cert.issuer }
              : cert.issuer || { english: "", japanese: "" },
            date: typeof cert.date === 'string'
              ? { english: cert.date, japanese: cert.date }
              : cert.date || { english: "", japanese: "" }
          })) : [],
          contact: {
            email: typeof data.contact?.email === 'string' ? data.contact.email : "",
            phone: typeof data.contact?.phone === 'string' ? data.contact.phone : "",
            location: typeof data.contact?.location === 'string' 
              ? { english: data.contact.location, japanese: data.contact.location }
              : data.contact?.location || { english: "", japanese: "" },
            social: {
              github: typeof data.contact?.github === 'string' ? data.contact.github : 
                     (typeof data.contact?.social?.github === 'string' ? data.contact.social.github : ""),
              linkedin: typeof data.contact?.linkedin === 'string' ? data.contact.linkedin : 
                       (typeof data.contact?.social?.linkedin === 'string' ? data.contact.social.linkedin : ""),
              whatsapp: typeof data.contact?.social?.whatsapp === 'string' ? data.contact.social.whatsapp : "",
              facebook: typeof data.contact?.social?.facebook === 'string' ? data.contact.social.facebook : "",
              indeed: typeof data.contact?.social?.indeed === 'string' ? data.contact.social.indeed : ""
            }
          }
        };
        
        setPortfolioData(sanitizedData);
      } else {
        // Failed to fetch portfolio data
      }
    } catch (error) {
      // Error fetching portfolio data
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch portfolio data
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Refetch data periodically to get updates from admin panel
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPortfolioData();
    }, 5000); // Refetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const openImageModal = (images: string[]) => {
    setSelectedImages(images);
    setSelectedImageIndex(0);
    setShowImageModal(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  // Contact form functions
  // NEW CV Download Function
  const downloadCV = (language: 'en' | 'ja') => {
    // Check if portfolio data is loaded
    if (!portfolioData) {
      setMessagePopupContent(
        language === 'en' 
          ? 'Loading portfolio data... Please try again.' 
          : 'ポートフォリオデータを読み込み中... もう一度お試しください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      setShowCVModal(false);
      return;
    }
    
    const cvData = portfolioData?.cv?.[language];
    
    // Handle both string and object formats for backward compatibility
    let cvUrl = '';
    let cvFilename = '';
    let isActive = false;
    
    if (typeof cvData === 'string') {
      // Old format: simple string URL
      cvUrl = cvData;
      cvFilename = `cv-${language}.pdf`;
      isActive = true; // Assume active if it's a string URL
    } else if (cvData && typeof cvData === 'object') {
      // New format: object with url, filename, isActive
      cvUrl = cvData.url || '';
      cvFilename = cvData.filename || `cv-${language}.pdf`;
      isActive = cvData.isActive !== false; // Default to true if not specified
    }
    
    if (!cvUrl || !isActive) {
      setMessagePopupContent(
        language === 'en' 
          ? 'CV not available. Please upload a CV first.' 
          : 'CVが利用できません。先にCVをアップロードしてください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      setShowCVModal(false);
      return;
    }

    try {
      // Handle base64 data URL
      if (cvUrl.startsWith('data:application/pdf;base64,')) {
        // Extract base64 data
        const base64Data = cvUrl.split(',')[1];
        const binaryData = atob(base64Data);
        
        // Convert to Uint8Array
        const bytes = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }
        
        // Create blob and download
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = cvFilename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        // Handle regular URL (including relative URLs)
        let downloadUrl = cvUrl;
        
        // If it's a relative URL, make it absolute
        if (cvUrl.startsWith('/')) {
          downloadUrl = `${window.location.origin}${cvUrl}`;
        }
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = cvFilename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Show success message
      setMessagePopupContent(
        language === 'en' 
          ? 'CV download started!' 
          : 'CVのダウンロードを開始しました！'
      );
      setMessagePopupType('success');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      setShowCVModal(false);
    } catch (error) {
      // CV download error
      setMessagePopupContent(
        language === 'en' 
          ? 'Failed to download CV. Please try again.' 
          : 'CVのダウンロードに失敗しました。もう一度お試しください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      setShowCVModal(false);
    }
  };

  // NEW Email Validation Function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // NEW Send Message Function
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setMessagePopupContent(
        language === 'en' 
          ? 'Please fill in all required fields.' 
          : 'すべての必須フィールドを入力してください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      return;
    }

    // Validate email format
    if (!validateEmail(contactForm.email)) {
      setMessagePopupContent(
        language === 'en' 
          ? 'Please enter a valid email address.' 
          : '有効なメールアドレスを入力してください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      return;
    }

    // Check if user's email is the same as the target email
    if (contactForm.email.toLowerCase() === 'mushabbirahmed99@gmail.com') {
      setMessagePopupContent(
        language === 'en' 
          ? 'Please change the email address.' 
          : 'メールアドレスを変更してください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      return;
    }

    try {
      // Send email via API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
          message: contactForm.message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessagePopupContent(
          language === 'en' 
            ? 'Message sent successfully! I will get back to you soon.' 
            : 'メッセージが正常に送信されました！すぐに返信いたします。'
        );
        setMessagePopupType('success');
        setShowMessagePopup(true);
        setTimeout(() => setShowMessagePopup(false), 3000);
        
        // Reset form
        setContactForm({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      // Error sending message
      setMessagePopupContent(
        language === 'en' 
          ? 'Failed to send message. Please try again.' 
          : 'メッセージの送信に失敗しました。もう一度お試しください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
    }
  };

  const skillsData = {
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
  };

  const projectsData = [
    {
      title: 'AI-Powered Chat Application',
      description: 'Real-time chat application with AI integration using OpenAI API and WebSocket connections.',
      image: '/projects/chat-app.jpg',
      technologies: ['React', 'Node.js', 'OpenAI API', 'Socket.io'],
      github: 'https://github.com/mushabbir/ai-chat',
      live: 'https://ai-chat-demo.com',
      featured: true
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
      image: '/projects/ecommerce.jpg',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
      github: 'https://github.com/mushabbir/ecommerce',
      live: 'https://ecommerce-demo.com',
      featured: true
    },
    {
      title: 'Portfolio Website',
      description: 'Modern portfolio website with dark mode and smooth animations.',
      image: '/projects/portfolio.jpg',
      technologies: ['React', 'Framer Motion', 'Tailwind CSS'],
      github: 'https://github.com/mushabbir/portfolio',
      live: 'https://mushabbir.dev',
      featured: false
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates.',
      image: '/projects/task-app.jpg',
      technologies: ['React', 'Firebase', 'Material-UI'],
      github: 'https://github.com/mushabbir/task-app',
      live: 'https://task-app-demo.com',
      featured: false
    }
  ];

  const certificationsData = [
    {
      title: 'AI Foundations for Everyone',
      issuer: 'IBM',
      date: '2024',
      image: '/certifications/AI Foundations for Everyone.jpg',
      pdf: '/certifications/AI Foundations for Everyone.pdf'
    },
    {
      title: 'Building AI Powered Chatbots',
      issuer: 'IBM',
      date: '2024',
      image: '/certifications/Building AI Powered Chatbots Without Programming.jpg',
      pdf: '/certifications/Building AI Powered Chatbots Without Programming.pdf'
    },
    {
      title: 'Generative AI Introduction',
      issuer: 'IBM',
      date: '2024',
      image: '/certifications/Generative AI Introduction and Applications.jpg',
      pdf: '/certifications/Generative AI Introduction and Applications.pdf'
    },
    {
      title: 'Prompt Engineering Basics',
      issuer: 'IBM',
      date: '2024',
      image: '/certifications/Generative AI Prompt Engineering Basics.jpg',
      pdf: '/certifications/Generative AI Prompt Engineering Basics.pdf'
    }
  ];

  // Show loading state while data is being fetched
  if (isLoading || !portfolioData || !isValidData(portfolioData) || !isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ja' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold gradient-text"
            >
              Mushabbir
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: 'about', label: language === 'en' ? 'About' : '自己紹介' },
                { id: 'education', label: language === 'en' ? 'Education' : '学歴' },
                { id: 'papers', label: language === 'en' ? 'Papers' : '論文' },
                { id: 'skills', label: language === 'en' ? 'Skills' : 'スキル' },
                { id: 'projects', label: language === 'en' ? 'Projects' : 'プロジェクト' },
                { id: 'certifications', label: language === 'en' ? 'Certifications' : '資格' },
                { id: 'contact', label: language === 'en' ? 'Contact' : '連絡先' }
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    textShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium relative group"
                >
                  {item.label}
                  {/* Underline effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Language Switcher & Theme Toggle */}
            <div className="flex items-center space-x-4">
              {/* Enhanced Language Toggle */}
              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLanguage}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  animate={{ rotate: language === 'ja' ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 text-sm font-medium"
                  style={{ transform: language === 'ja' ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <span style={{ transform: language === 'ja' ? 'rotate(-180deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                    {language === 'en' ? 'EN' : '日本語'}
                  </span>
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ 
                  scale: 1.1,
                  rotate: 180,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  {isDark ? <Sun className="h-5 w-5 group-hover:animate-pulse-gentle" /> : <Moon className="h-5 w-5 group-hover:animate-pulse-gentle" />}
                </motion.div>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4 space-y-4">
                {['about', 'education', 'skills', 'projects', 'certifications', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium capitalize"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 bg-pattern">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20"></div>
          
          {/* Floating particles */}
          {isClient && [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`particle w-2 h-2 bg-blue-400 dark:bg-purple-400`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
          
          {/* Enhanced floating orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2], 
              opacity: [0.6, 0.3, 0.6],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
          
          {/* Additional floating elements */}
          <motion.div
            className="absolute top-1/3 right-1/3 w-16 h-16 bg-green-500/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.2, 0.5, 0.2],
              y: [0, -20, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
          
          {/* Interactive grid pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                className="text-5xl lg:text-7xl font-bold mb-6 gradient-text"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {getMultilingualText(portfolioData?.hero?.name, language, language === 'en' ? "Hi, I'm Mushabbir" : "こんにちは、ムサビルです")}
              </motion.h1>

              <motion.h2
                className="text-2xl lg:text-3xl mb-6 text-blue-600 dark:text-blue-400 font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {getMultilingualText(portfolioData?.hero?.title, language, language === 'en' ? "AI Specialist & Software Engineer" : "AIスペシャリスト・ソフトウェアエンジニア")}
              </motion.h2>

              <motion.p
                className="text-lg lg:text-xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {getMultilingualText(portfolioData?.hero?.description, language, language === 'en' 
                  ? "I'm a results-driven AI Engineer and Full-Stack Developer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan."
                  : "現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程に在籍しているAIエンジニア・フルスタック開発者です。")}
              </motion.p>

              {/* Enhanced Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCVModal(true)}
                  className="btn-primary relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <Download className="h-5 w-5 group-hover:animate-bounce" />
                  <span>{language === 'en' ? 'Download CV' : 'CVダウンロード'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('contact')}
                  className="btn-secondary relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  {language === 'en' ? 'Get In Touch' : 'お問い合わせ'}
                </motion.button>
              </motion.div>

              {/* Enhanced Social Links */}
              <motion.div
                className="flex gap-4 justify-center lg:justify-start mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                {[
                  { icon: Github, href: portfolioData?.contact?.social?.github || "https://github.com/mushabbir", label: "GitHub", color: "hover:bg-gray-100 dark:hover:bg-gray-700" },
                  { icon: Linkedin, href: portfolioData?.contact?.social?.linkedin || "https://linkedin.com/in/mushabbir", label: "LinkedIn", color: "hover:bg-blue-100 dark:hover:bg-blue-900" },
                  { icon: Mail, href: `mailto:${portfolioData?.contact?.email || "mushabbir@example.com"}`, label: "Email", color: "hover:bg-red-100 dark:hover:bg-red-900" },
                  { icon: MessageCircle, href: portfolioData?.contact?.social?.whatsapp || "https://wa.me/+8190XXXXXXX", label: "WhatsApp", color: "hover:bg-green-100 dark:hover:bg-green-900" },
                  { icon: Facebook, href: portfolioData?.contact?.social?.facebook || "https://facebook.com/mushabbir", label: "Facebook", color: "hover:bg-blue-100 dark:hover:bg-blue-900" },
                  { icon: Briefcase, href: portfolioData?.contact?.social?.indeed || "https://indeed.com/profile/mushabbir", label: "Indeed", color: "hover:bg-yellow-100 dark:hover:bg-yellow-900" }
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: [0, -10, 10, 0],
                      y: -5
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover-lift ${social.color} relative overflow-hidden group`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <social.icon className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:animate-pulse-gentle" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Animated Profile Picture Frame */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <div className="relative w-80 h-80">
                  {/* Animated profile frame */}
                  <motion.div
                    className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl border-4 border-white dark:border-gray-700"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                    }}
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{ 
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    {/* Profile Picture or Initial */}
                    {portfolioData?.hero?.profilePicture ? (
                      <div className="w-full h-full">
                        <img
                          src={typeof portfolioData.hero.profilePicture === 'string' ? portfolioData.hero.profilePicture : ''}
                          alt={getMultilingualText(portfolioData?.hero?.name, language, "Profile")}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <motion.div 
                          className="text-white text-6xl font-bold"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {getMultilingualText(portfolioData?.hero?.name, language, "M").charAt(0)}
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Animated floating elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      <motion.div
                        className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-30"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.6, 0.3],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white rounded-full opacity-30"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                          rotate: [360, 180, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-0 w-2 h-2 bg-white rounded-full opacity-30"
                        animate={{ 
                          scale: [1, 1.4, 1],
                          opacity: [0.3, 0.6, 0.3],
                          y: [0, -15, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <motion.div
                        className="absolute bottom-0 right-1/4 w-2 h-2 bg-white rounded-full opacity-30"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.5, 0.3],
                          x: [0, 15, 0]
                        }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Animated border ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-300 dark:border-blue-600"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Glowing background effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <div className="text-center">
              <motion.p 
                className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Scroll to explore
              </motion.p>
              <motion.div
                className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center relative group cursor-pointer hover-glow"
                animate={{ 
                  y: [0, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ 
                  scale: 1.2,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                }}
                onClick={() => scrollToSection('about')}
              >
                {/* Pulsing ring effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-blue-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <ChevronDown className="h-5 w-5 text-blue-500 group-hover:animate-bounce-gentle" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold mb-6 gradient-text"
              whileInView={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                backgroundSize: '200% 200%',
                backgroundImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6)'
              }}
            >
              {language === 'en' ? 'About Me' : '自己紹介'}
            </motion.h2>
            <motion.p 
              className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              whileInView={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {language === 'en' 
                ? 'A passionate developer with expertise in AI and modern web technologies, creating innovative solutions that make a difference.'
                : 'AIとモダンウェブ技術に精通した情熱的な開発者として、革新的なソリューションを創造し、変化をもたらしています。'
              }
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover-lift">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {language === 'en' ? 'Personal Information' : '個人情報'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'en' ? 'Name' : '名前'}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {getMultilingualText(portfolioData?.hero?.name, language, "Mushabbir Ahmed")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'en' ? 'Location' : '所在地'}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">{getMultilingualText(portfolioData?.about?.location, language, "Saga, Japan")}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'en' ? 'Education' : '学歴'}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {getMultilingualText(portfolioData?.about?.education, language, language === 'en' ? "Master&apos;s Student at Saga University" : '佐賀大学大学院生')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'en' ? 'Status' : '状況'}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {getMultilingualText(portfolioData?.about?.status, language, language === 'en' ? 'Actively looking for full-time opportunities in Japan' : '日本でのフルタイム機会を積極的に探しています')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover-lift">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {language === 'en' ? 'What I Do' : '私の仕事'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === 'en' 
                        ? 'Develop modern web applications using React, Next.js, and TypeScript'
                        : 'React、Next.js、TypeScriptを使用したモダンなウェブアプリケーションの開発'
                      }
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === 'en' 
                        ? 'Implement AI-powered solutions and machine learning models'
                        : 'AI駆動ソリューションと機械学習モデルの実装'
                      }
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === 'en' 
                        ? 'Create responsive and accessible user interfaces'
                        : 'レスポンシブでアクセシブルなユーザーインターフェースの作成'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover-lift">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {language === 'en' ? 'About Me' : '自己紹介'}
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {language === 'en' 
                      ? (portfolioData?.about?.english || "I&apos;m Mushabbir Ahmed, a results-driven AI Engineer and Full-Stack Developer currently pursuing my Master&apos;s in Intelligent Information Engineering at Saga University, Japan (Graduating March 2026). With a strong foundation in Software Engineering from Qingdao University, China, I specialize in developing secure, scalable systems using React, Flask, MongoDB, and advanced encryption methods like AES‑256 and RSA‑2048. My hands-on projects include a secure medical data simulation system and a movie recommendation engine. I&apos;m also serving as an International Student Tutor and was appointed as a Saga City International Tourism Ambassador in July 2025. I&apos;m passionate about delivering data-driven, AI-powered solutions that create real-world impact.")
                      : (portfolioData?.about?.japanese || "私はムサビル・アハメドと申します。現在、佐賀大学大学院にて理工学専攻 知能情報工学コースの修士課程（2026年3月修了予定）に在籍しています。中国の青島大学でソフトウェア工学を学び、Python・JavaScript・React・Flask・MongoDBを活用したフルスタック開発および、AES-256・RSA-2048などの高度な暗号技術を用いたセキュアなシステム構築を得意としています。医療データ暗号化シミュレーションや映画レコメンデーションシステムの開発経験があり、現在は佐賀大学の技術サポートチューターとしても活動中です。2025年7月には佐賀市国際観光アンバサダーにも任命され、地域貢献にも力を入れています。")
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 gradient-text">
              {language === 'en' ? 'Education' : '学歴'}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'My academic journey and qualifications in computer science and technology.'
                : 'コンピュータサイエンスと技術における私の学術的経歴と資格。'
              }
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {portfolioData?.education?.map((edu: any, index: number) => (
              <motion.div
                key={`edu-${edu.id}-${language}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl">🎓</span>
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      {getMultilingualText(edu.institution, language, '')}
                    </motion.h3>
                    <motion.p 
                      className="text-blue-600 dark:text-blue-400 font-medium text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      {getMultilingualText(edu.degree, language, '')}
                    </motion.p>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-400 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {getMultilingualText(edu.period, language, '')}
                    </motion.p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {getMultilingualText(edu.description, language, '')}
                  </motion.p>
                  
                  {edu.achievements && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                        {language === 'en' ? 'Achievements' : '実績'}
                      </h4>
                      <div className="space-y-1">
                        {(language === 'en' 
                          ? (edu.achievements?.english || [])
                          : (edu.achievements?.japanese || edu.achievements?.english || [])
                        ).map((achievement: string, i: number) => (
                          <motion.p 
                            key={i} 
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <span className="text-blue-500 mr-2">•</span>
                            {achievement}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section id="papers" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 gradient-text">
              {language === 'en' ? 'Research Papers' : '研究論文'}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Academic papers and presentations from conferences and research projects'
                : '学会発表や研究プロジェクトからの学術論文とプレゼンテーション'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(portfolioData?.papers && Array.isArray(portfolioData.papers) ? portfolioData.papers : []).map((paper: any, index: number) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {paper.type === 'poster' ? (
                        <FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Presentation className="h-6 w-6 text-green-600 dark:text-green-400" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        paper.type === 'poster' 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      }`}>
                        {paper.type === 'poster' ? 'Poster' : 'Oral'}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="text-2xl"
                    >
                      📄
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {getMultilingualText(paper.title, language, 'Paper')}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {getMultilingualText(paper.conference, language, '')}
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    {getMultilingualText(paper.date, language, '')}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (paper.paperPdf) {
                          const link = document.createElement('a');
                          link.href = paper.paperPdf;
                          link.download = paper.paperFilename || 'paper.pdf';
                          link.click();
                        }
                      }}
                      disabled={!paper.paperPdf}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Paper</span>
                    </motion.button>

                    {paper.type === 'poster' && paper.posterPdf && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = paper.posterPdf;
                          link.download = paper.posterFilename || 'poster.pdf';
                          link.click();
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FileImage className="h-4 w-4" />
                        <span>Poster</span>
                      </motion.button>
                    )}

                    {paper.type === 'oral' && paper.presentationPdf && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = paper.presentationPdf;
                          link.download = paper.presentationFilename || 'presentation.pdf';
                          link.click();
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Presentation className="h-4 w-4" />
                        <span>Presentation</span>
                      </motion.button>
                    )}
                  </div>

                  {/* Floating particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                      className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full opacity-30"
                      animate={{ 
                        scale: [1, 1.5, 1], 
                        opacity: [0.3, 0.6, 0.3],
                        y: [0, -10, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                    />
                    <motion.div
                      className="absolute bottom-4 left-4 w-1 h-1 bg-green-500 rounded-full opacity-30"
                      animate={{ 
                        scale: [1, 2, 1], 
                        opacity: [0.3, 0.7, 0.3],
                        x: [0, 8, 0]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {(!portfolioData?.papers || !Array.isArray(portfolioData.papers) || portfolioData.papers.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {language === 'en' ? 'No Papers Available' : '論文がありません'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'en' 
                  ? 'Research papers will be displayed here once added through the admin panel.'
                  : '管理パネルから追加されると、研究論文がここに表示されます。'
                }
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 gradient-text">
              {language === 'en' ? 'Skills & Technologies' : 'スキル・技術'}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'A comprehensive skill set spanning frontend, backend, AI, and modern development tools.'
                : 'フロントエンド、バックエンド、AI、モダン開発ツールにわたる包括的なスキルセット。'
              }
            </p>
          </motion.div>

          {/* Skill Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: 'languages', name: language === 'en' ? 'Languages' : 'プログラミング言語', icon: <Code className="h-5 w-5" /> },
              { id: 'frameworks', name: language === 'en' ? 'Frameworks & Libraries' : 'フレームワーク・ライブラリ', icon: <Database className="h-5 w-5" /> },
              { id: 'databases', name: language === 'en' ? 'Databases' : 'データベース', icon: <Database className="h-5 w-5" /> },
              { id: 'tools', name: language === 'en' ? 'Tools & Platforms' : 'ツール・プラットフォーム', icon: <Globe className="h-5 w-5" /> }
            ].map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveSkillCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSkillCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Enhanced Skills Grid */}
          <motion.div
            key={activeSkillCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(portfolioData?.skills?.[activeSkillCategory as keyof typeof skillsData] || skillsData[activeSkillCategory as keyof typeof skillsData]).map((skill: any, index: number) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)"
                }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg card-hover card-glow relative overflow-hidden group"
              >
                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <div className="flex items-center space-x-3 relative z-10">
                  <motion.span 
                    className="text-2xl"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {skill.icon}
                  </motion.span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {skill.name}
                  </h3>
                </div>
                
                {/* Floating particles for each skill card */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute top-2 right-2 w-1 h-1 bg-blue-500 rounded-full opacity-30"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                  <motion.div
                    className="absolute bottom-2 left-2 w-1 h-1 bg-purple-500 rounded-full opacity-30"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 gradient-text">
              {language === 'en' ? 'Featured Projects' : '主要プロジェクト'}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'A showcase of my latest work, demonstrating expertise in modern web development and AI integration.'
                : 'モダンなウェブ開発とAI統合における専門知識を示す最新の作品のショーケース。'
              }
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {(portfolioData?.projects || projectsData).map((project: any, index: number) => (
              <motion.div
                key={project.id || getMultilingualText(project.title, language, 'Project')}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
                }}
                className={`bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg card-hover card-glow relative ${
                  project.featured ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                  {project.showImage && project.images && project.images.length > 0 ? (
                    <div className="relative h-full">
                      <img
                        src={project.images[0]}
                        alt={getMultilingualText(project.title, language, "Project")}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40"></div>
                      <button
                        onClick={() => openImageModal(project.images)}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-2xl font-bold mb-2">{getMultilingualText(project.title, language, "Project")}</h3>
                          <p className="text-white/80">{getMultilingualText(project.description, language, "")}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 relative">
                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      {getMultilingualText(project.title, language, 'Project')}
                    </motion.h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {getMultilingualText(project.description, language, '')}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.technologies || []).map((tech: string, techIndex: number) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 }}
                          whileHover={{ 
                            scale: 1.1,
                            backgroundColor: "rgb(59 130 246 / 0.2)",
                            color: "rgb(59 130 246)"
                          }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full transition-all duration-300 cursor-pointer"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ 
                            scale: 1.05,
                            y: -2
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover-glow"
                        >
                          <Github className="h-5 w-5 group-hover:animate-bounce-gentle" />
                          <span>Code</span>
                        </motion.a>
                      )}
                      {project.live && project.showLiveDemo && (
                        <motion.a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ 
                            scale: 1.05,
                            y: -2
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover-glow"
                        >
                          <ExternalLink className="h-5 w-5 group-hover:animate-bounce-gentle" />
                          <span>Live Demo</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 gradient-text">
              {language === 'en' ? 'Certifications' : '資格・認定'}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Professional certifications demonstrating expertise in AI, machine learning, and modern technologies.'
                : 'AI、機械学習、モダン技術における専門知識を示すプロフェッショナル認定。'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(portfolioData?.certifications || [
              {
                title: 'AI Foundations for Everyone',
                issuer: 'IBM',
                date: '2024',
                image: '/certifications/AI Foundations for Everyone.jpg',
                pdf: '/certifications/AI Foundations for Everyone.pdf'
              },
              {
                title: 'Building AI Powered Chatbots Without Programming',
                issuer: 'IBM',
                date: '2024',
                image: '/certifications/Building AI Powered Chatbots Without Programming.jpg',
                pdf: '/certifications/Building AI Powered Chatbots Without Programming.pdf'
              },
              {
                title: 'Generative AI Introduction and Applications',
                issuer: 'IBM',
                date: '2024',
                image: '/certifications/Generative AI Introduction and Applications.jpg',
                pdf: '/certifications/Generative AI Introduction and Applications.pdf'
              },
              {
                title: 'Generative AI Prompt Engineering Basics',
                issuer: 'IBM',
                date: '2024',
                image: '/certifications/Generative AI Prompt Engineering Basics.jpg',
                pdf: '/certifications/Generative AI Prompt Engineering Basics.pdf'
              },
              {
                title: 'Introduction to Artificial Intelligence (AI)',
                issuer: 'IBM',
                date: '2024',
                image: '/certifications/Introduction to Artificial Intelligence (AI).jpg',
                pdf: '/certifications/Introduction to Artificial Intelligence (AI).pdf'
              }
            ]).map((cert: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-lg hover-lift"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={cert.image}
                    alt={getMultilingualText(cert.name || cert.title, language, 'Certification')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {getMultilingualText(cert.name || cert.title, language, 'Certification')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{getMultilingualText(cert.issuer, language, '')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{getMultilingualText(cert.date, language, '')}</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.open(cert.image, '_blank')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{language === 'en' ? 'View' : '表示'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = cert.pdf;
                      link.download = getMultilingualText(cert.name || cert.title, language, 'Certification') + '.pdf';
                      link.click();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>{language === 'en' ? 'Download' : 'ダウンロード'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 gradient-text">
              {language === 'en' ? 'Get In Touch' : 'お問い合わせ'}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'en' 
                ? "Ready to start a project or just want to chat? I'd love to hear from you!"
                : 'プロジェクトを始めたい、またはお話ししたいですか？お気軽にお声かけください！'
              }
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover-lift">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {language === 'en' ? 'Contact Information' : '連絡先情報'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Email' : 'メールアドレス'}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">{portfolioData?.contact?.email || "mushabbir@example.com"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Location' : '所在地'}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">{getMultilingualText(portfolioData?.contact?.location, language, "Saga, Japan")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Phone' : '電話番号'}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">{portfolioData?.contact?.phone || "+81 90-XXXX-XXXX"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover-lift">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  {language === 'en' ? 'Let\'s Connect' : 'つながりましょう'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Github, href: portfolioData?.contact?.social?.github || "https://github.com/mushabbir", label: "GitHub", color: "hover:bg-gray-100 dark:hover:bg-gray-600" },
                    { icon: Linkedin, href: portfolioData?.contact?.social?.linkedin || "https://linkedin.com/in/mushabbir", label: "LinkedIn", color: "hover:bg-blue-100 dark:hover:bg-blue-900" },
                    { icon: Mail, href: `mailto:${portfolioData?.contact?.email || "mushabbir@example.com"}`, label: "Email", color: "hover:bg-red-100 dark:hover:bg-red-900" },
                    { icon: MessageCircle, href: portfolioData?.contact?.social?.whatsapp || "https://wa.me/+8190XXXXXXX", label: "WhatsApp", color: "hover:bg-green-100 dark:hover:bg-green-900" },
                    { icon: Facebook, href: portfolioData?.contact?.social?.facebook || "https://facebook.com/mushabbir", label: "Facebook", color: "hover:bg-blue-100 dark:hover:bg-blue-900" },
                    { icon: Briefcase, href: portfolioData?.contact?.social?.indeed || "https://indeed.com/profile/mushabbir", label: "Indeed", color: "hover:bg-yellow-100 dark:hover:bg-yellow-900" }
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200 ${social.color}`}
                    >
                      <social.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover-lift"
            >
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                {language === 'en' ? 'Send a Message' : 'メッセージを送信'}
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Name' : '名前'}
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder={language === 'en' ? 'Your name' : 'お名前'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Email' : 'メールアドレス'}
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder={language === 'en' ? 'your.email@example.com' : 'your.email@example.com'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Message' : 'メッセージ'}
                  </label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder={language === 'en' ? 'Tell me about your project...' : 'プロジェクトについて教えてください...'}
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300"
                >
                  <Send className="h-5 w-5" />
                  <span>{language === 'en' ? 'Send Message' : 'メッセージを送信'}</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 gradient-text">Mushabbir Ahmed</h3>
            <p className="text-gray-400 mb-6">AI Specialist & Software Engineer</p>
            <div className="flex justify-center space-x-6 mb-8">
              {[
                { icon: Github, href: portfolioData?.contact?.social?.github || "https://github.com/mushabbir", label: "GitHub" },
                { icon: Linkedin, href: portfolioData?.contact?.social?.linkedin || "https://linkedin.com/in/mushabbir", label: "LinkedIn" },
                { icon: Mail, href: `mailto:${portfolioData?.contact?.email || "mushabbir@example.com"}`, label: "Email" },
                { icon: MessageCircle, href: portfolioData?.contact?.social?.whatsapp || "https://wa.me/+8190XXXXXXX", label: "WhatsApp" },
                { icon: Facebook, href: portfolioData?.contact?.social?.facebook || "https://facebook.com/mushabbir", label: "Facebook" },
                { icon: Briefcase, href: portfolioData?.contact?.social?.indeed || "https://indeed.com/profile/mushabbir", label: "Indeed" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm">
                © 2024 Mushabbir Ahmed. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>



      {/* Enhanced Image Modal */}
      {showImageModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="relative">
              <img
                src={selectedImages[selectedImageIndex]}
                alt="Project"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {selectedImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronDown className="h-6 w-6 rotate-90" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronDown className="h-6 w-6 -rotate-90" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {selectedImageIndex + 1} / {selectedImages.length}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* NEW Message Popup */}
      {showMessagePopup && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowMessagePopup(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden ${
              messagePopupType === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
            }`}
          >
            {/* Background animation */}
            <motion.div
              className={`absolute inset-0 ${
                messagePopupType === 'error'
                  ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
                  : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />

            <div className="relative z-10 text-center">
              <motion.div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  messagePopupType === 'error'
                    ? 'bg-red-100 dark:bg-red-900'
                    : 'bg-green-100 dark:bg-green-900'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {messagePopupType === 'error' ? (
                  <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                )}
              </motion.div>

              <h3 className={`text-xl font-semibold mb-2 ${
                messagePopupType === 'error'
                  ? 'text-red-900 dark:text-red-100'
                  : 'text-green-900 dark:text-green-100'
              }`}>
                {messagePopupType === 'error'
                  ? (language === 'en' ? 'Error' : 'エラー')
                  : (language === 'en' ? 'Success' : '成功')
                }
              </h3>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {messagePopupContent}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMessagePopup(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  messagePopupType === 'error'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {language === 'en' ? 'OK' : 'OK'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* NEW CV Download Modal */}
      {showCVModal && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCVModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Download className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'en' ? 'Download CV' : 'CVをダウンロード'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {language === 'en' ? 'Choose your preferred language:' : '言語を選択してください:'}
                </p>
              </div>
              
              {/* CV Options */}
              <div className="space-y-4 mb-8">
                {/* English CV */}
                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
            
                    downloadCV('en');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Download className="h-5 w-5" />
                  </div>
                  <span className="text-lg">English CV</span>
                  {portfolioData?.cv?.english?.isActive && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2 px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium"
                    >
                      {language === 'en' ? 'Updated' : '更新済み'}
                    </motion.span>
                  )}
                </motion.button>
                
                {/* Japanese CV */}
                <motion.button
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
            
                    downloadCV('ja');
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Download className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Japanese CV (日本語)</span>
                  {portfolioData?.cv?.japanese?.isActive && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2 px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium"
                    >
                      {language === 'en' ? 'Updated' : '更新済み'}
                    </motion.span>
                  )}
                </motion.button>
              </div>
              
              {/* Cancel Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCVModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors duration-200 px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {language === 'en' ? 'Cancel' : 'キャンセル'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
} 
