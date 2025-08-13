'use client';

import { useState, useEffect } from 'react';
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

import dynamic from 'next/dynamic';

// Dynamically import UnderConstructionPopup to avoid SSR issues
const UnderConstructionPopup = dynamic(() => import('./UnderConstructionPopup'), {
  ssr: false,
  loading: () => null
});

interface HomeClientProps {
  initialData: any;
}

export default function HomeClient({ initialData }: HomeClientProps) {
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
    if (!data.hero.name || typeof data.hero.name !== 'object') {
      return false;
    }
    if (!data.hero.title || typeof data.hero.title !== 'object') {
      return false;
    }
    if (!data.hero.description || typeof data.hero.description !== 'object') {
      return false;
    }
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
  const [portfolioData, setPortfolioData] = useState<any>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // CV Download State
  const [showCVModal, setShowCVModal] = useState(false);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [messagePopupContent, setMessagePopupContent] = useState('');
  const [messagePopupType, setMessagePopupType] = useState<'success' | 'error'>('success');

  // Client-side only state for random values to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  // Initialize dark mode and client state
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
    }
    setIsClient(true);
  }, []);

  // Update dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

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

  // CV Download Function
  const downloadCV = (language: 'en' | 'ja') => {
    console.log('🚀 CV download requested for language:', language);
    
    if (!portfolioData) {
      setMessagePopupContent(
        language === 'en' 
          ? 'Loading portfolio data... Please try again.' 
          : 'ポートフォリオデータを読み込み中... もう一度お試しください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      return;
    }

    try {
      const cvKey = language === 'en' ? 'english' : 'japanese';
      const cvData = portfolioData.cv?.[cvKey];
      
      if (!cvData || !cvData.isActive || !cvData.url) {
        setMessagePopupContent(
          language === 'en' 
            ? 'CV not available. Please upload a CV first.' 
            : 'CVが利用できません。まずCVをアップロードしてください。'
        );
        setMessagePopupType('error');
        setShowMessagePopup(true);
        setTimeout(() => setShowMessagePopup(false), 3000);
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = cvData.url;
      link.download = cvData.filename || (language === 'en' ? 'mushabbir-en.pdf' : 'mushabbir-ja.pdf');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessagePopupContent(
        language === 'en' 
          ? 'CV download started successfully!' 
          : 'CVのダウンロードが開始されました！'
      );
      setMessagePopupType('success');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
      
      setShowCVModal(false);
      
    } catch (error) {
      console.error('💥 Error downloading CV:', error);
      setMessagePopupContent(
        language === 'en' 
          ? 'Error downloading CV. Please try again.' 
          : 'CVのダウンロードでエラーが発生しました。もう一度お試しください。'
      );
      setMessagePopupType('error');
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
    }
  };

  // Email Validation Function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Send Message Function
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    try {
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
        
        setContactForm({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ja' : 'en');
  };

  // Safer render: guard against null once
  if (!portfolioData) {
    return <main className="p-6">Loading…</main>;
  }

  // Show loading state while data is being fetched
  if (isLoading || !isValidData(portfolioData) || !isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <UnderConstructionPopup />

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

            {/* Desktop Navigation */}
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
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Language Switcher & Theme Toggle */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLanguage}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <span className="text-sm font-medium">
                  {language === 'en' ? 'EN' : '日本語'}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

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
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCVModal(true)}
                  className="btn-primary"
                >
                  <Download className="h-5 w-5" />
                  <span>{language === 'en' ? 'Download CV' : 'CVダウンロード'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('contact')}
                  className="btn-secondary"
                >
                  {language === 'en' ? 'Get In Touch' : 'お問い合わせ'}
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex gap-4 justify-center lg:justify-start mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                {[
                  { icon: Github, href: portfolioData?.contact?.social?.github || "https://github.com/mushabbir", label: "GitHub" },
                  { icon: Linkedin, href: portfolioData?.contact?.social?.linkedin || "https://linkedin.com/in/mushabbir", label: "LinkedIn" },
                  { icon: Mail, href: `mailto:${portfolioData?.contact?.email || "mushabbir@example.com"}`, label: "Email" }
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  >
                    <social.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Profile Picture */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative w-80 h-80">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl border-4 border-white dark:border-gray-700">
                  {portfolioData?.hero?.profilePicture ? (
                    <img
                      src={portfolioData.hero.profilePicture}
                      alt={getMultilingualText(portfolioData?.hero?.name, language, "Profile")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-white text-6xl font-bold">
                        {getMultilingualText(portfolioData?.hero?.name, language, "M").charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scroll to explore</p>
              <motion.div
                className="w-12 h-12 border-2 border-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.2 }}
                onClick={() => scrollToSection('about')}
              >
                <ChevronDown className="h-5 w-5 text-blue-500" />
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
                      {getMultilingualText(portfolioData?.about?.education, language, language === 'en' ? "Master's Student at Saga University" : '佐賀大学大学院生')}
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
                      ? (portfolioData?.about?.english || "I'm Mushabbir Ahmed, a results-driven AI Engineer and Full-Stack Developer currently pursuing my Master's in Intelligent Information Engineering at Saga University, Japan (Graduating March 2026). With a strong foundation in Software Engineering from Qingdao University, China, I specialize in developing secure, scalable systems using React, Flask, MongoDB, and advanced encryption methods like AES‑256 and RSA‑2048. My hands-on projects include a secure medical data simulation system and a movie recommendation engine. I'm also serving as an International Student Tutor and was appointed as a Saga City International Tourism Ambassador in July 2025. I'm passionate about delivering data-driven, AI-powered solutions that create real-world impact.")
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
            {(portfolioData?.education || []).map((edu: any, index: number) => (
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
              { id: 'frontend', name: language === 'en' ? 'Frontend' : 'フロントエンド', icon: <Globe className="h-5 w-5" /> },
              { id: 'backend', name: language === 'en' ? 'Backend' : 'バックエンド', icon: <Database className="h-5 w-5" /> },
              { id: 'tools', name: language === 'en' ? 'Tools & Platforms' : 'ツール・プラットフォーム', icon: <Cloud className="h-5 w-5" /> }
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

          {/* Skills Grid */}
          <motion.div
            key={activeSkillCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(portfolioData?.skills?.[activeSkillCategory as keyof typeof portfolioData.skills] || []).map((skill: any, index: number) => (
              <motion.div
                key={skill.name || skill}
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
                <div className="flex items-center space-x-3 relative z-10">
                  <motion.span 
                    className="text-2xl"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, 0]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {skill.icon || '💻'}
                  </motion.span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {skill.name || skill}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
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
            {(portfolioData?.projects || []).map((project: any, index: number) => (
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
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg card-hover card-glow relative"
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                  {project.images && project.images.length > 0 ? (
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
                      {project.live && (
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
                ? 'Academic publications and research contributions in AI and computer science.'
                : 'AIとコンピュータサイエンスにおける学術論文と研究貢献。'
              }
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {(portfolioData?.papers || []).map((paper: any, index: number) => (
              <motion.div
                key={paper.id || getMultilingualText(paper.title, language, 'Paper')}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.2)"
                }}
                className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg card-hover card-glow relative overflow-hidden group"
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 dark:from-purple-600 dark:to-pink-800 rounded-full flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FileText className="h-8 w-8 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      {getMultilingualText(paper.title, language, 'Paper Title')}
                    </motion.h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm leading-relaxed">
                      {getMultilingualText(paper.abstract, language, '')}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(paper.authors || []).map((author: string, authorIndex: number) => (
                        <motion.span
                          key={author}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: authorIndex * 0.1 }}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                        >
                          {author}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {paper.publicationDate || paper.year || '2024'}
                      </span>
                      {paper.pdfUrl && (
                        <motion.a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {language === 'en' ? 'View PDF' : 'PDFを見る'}
                          </span>
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
                ? 'Professional certifications and achievements in technology and AI.'
                : '技術とAIにおける専門資格と実績。'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(portfolioData?.certifications || []).map((cert: any, index: number) => (
              <motion.div
                key={cert.id || getMultilingualText(cert.title, language, 'Certification')}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.25)"
                }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg card-hover card-glow relative overflow-hidden group"
              >
                <div className="text-center">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-600 dark:from-green-600 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    {getMultilingualText(cert.title, language, 'Certification Title')}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                    {getMultilingualText(cert.issuer, language, '')}
                  </p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {cert.issueDate || cert.year || '2024'}
                    </span>
                    {cert.expiryDate && (
                      <>
                        <span className="text-gray-400">-</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {cert.expiryDate}
                        </span>
                      </>
                    )}
                  </div>
                  {cert.image && (
                    <motion.div 
                      className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={cert.image}
                        alt={getMultilingualText(cert.title, language, "Certification")}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                  {cert.pdfUrl && (
                    <motion.a
                      href={cert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <FileText className="h-4 w-4" />
                      <span>{language === 'en' ? 'View Certificate' : '証明書を見る'}</span>
                    </motion.a>
                  )}
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
                ? 'Ready to collaborate? Let\'s discuss your next project or opportunity.'
                : 'コラボレーションの準備はできていますか？次のプロジェクトや機会について話し合いましょう。'
              }
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {language === 'en' ? 'Contact Information' : '連絡先情報'}
                </h3>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <a 
                        href={`mailto:${portfolioData?.contact?.email || 'mushabbir@example.com'}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {portfolioData?.contact?.email || 'mushabbir@example.com'}
                      </a>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {language === 'en' ? 'Location' : '所在地'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {getMultilingualText(portfolioData?.contact?.location, language, 'Saga, Japan')}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {language === 'en' ? 'Phone' : '電話'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {portfolioData?.contact?.phone || '+81-XXX-XXX-XXXX'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {language === 'en' ? 'Social Media' : 'ソーシャルメディア'}
                </h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Github, href: portfolioData?.contact?.social?.github, label: 'GitHub', color: 'bg-gray-800 hover:bg-gray-900' },
                    { icon: Linkedin, href: portfolioData?.contact?.social?.linkedin, label: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
                    { icon: Facebook, href: portfolioData?.contact?.social?.facebook, label: 'Facebook', color: 'bg-blue-800 hover:bg-blue-900' }
                  ].map((social, index) => (
                    social.href && (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 ${social.color} text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      >
                        <social.icon className="h-6 w-6" />
                      </motion.a>
                    )
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
              className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'en' ? 'Send Message' : 'メッセージを送信'}
              </h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Name' : '名前'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200"
                    placeholder={language === 'en' ? 'Your name' : 'お名前'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Email' : 'メールアドレス'} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200"
                    placeholder={language === 'en' ? 'your.email@example.com' : 'your.email@example.com'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Message' : 'メッセージ'} *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors duration-200 resize-none"
                    placeholder={language === 'en' ? 'Tell me about your project or inquiry...' : 'プロジェクトやお問い合わせについて教えてください...'}
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
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
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-4">Mushabbir</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {language === 'en' 
                  ? 'AI Engineer and Full-Stack Developer passionate about creating innovative solutions that make a difference.'
                  : '変化をもたらす革新的なソリューションの創造に情熱を注ぐAIエンジニア・フルスタック開発者。'
                }
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Quick Links' : 'クイックリンク'}
              </h4>
              <ul className="space-y-2">
                {['about', 'education', 'skills', 'projects', 'contact'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm capitalize"
                    >
                      {language === 'en' ? item : {
                        'about': '自己紹介',
                        'education': '学歴',
                        'skills': 'スキル',
                        'projects': 'プロジェクト',
                        'contact': '連絡先'
                      }[item]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Connect' : 'つながる'}
              </h4>
              <div className="flex space-x-4">
                {[
                  { icon: Github, href: portfolioData?.contact?.social?.github, label: 'GitHub' },
                  { icon: Linkedin, href: portfolioData?.contact?.social?.linkedin, label: 'LinkedIn' },
                  { icon: Mail, href: `mailto:${portfolioData?.contact?.email}`, label: 'Email' }
                ].map((social, index) => (
                  social.href && (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-200"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    >
                      <social.icon className="h-5 w-5 text-gray-300" />
                    </motion.a>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Mushabbir Ahmed. {language === 'en' ? 'All rights reserved.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <motion.img
              key={selectedImageIndex}
              src={selectedImages[selectedImageIndex]}
              alt="Project Image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Navigation Buttons */}
            {selectedImages.length > 1 && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronDown className="h-6 w-6 transform rotate-90" />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronDown className="h-6 w-6 transform -rotate-90" />
                </motion.button>
              </>
            )}
            
            {/* Close Button */}
            <motion.button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-6 w-6" />
            </motion.button>
            
            {/* Image Counter */}
            {selectedImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                {selectedImageIndex + 1} / {selectedImages.length}
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* CV Download Modal */}
      {showCVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'en' ? 'Download CV' : 'CVをダウンロード'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {language === 'en' ? 'Choose your preferred language:' : '言語を選択してください:'}
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <button
                onClick={() => downloadCV('en')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>English CV</span>
              </button>
              
              <button
                onClick={() => downloadCV('ja')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Japanese CV (日本語)</span>
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setShowCVModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium transition-colors duration-200 px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {language === 'en' ? 'Cancel' : 'キャンセル'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Popup */}
      {showMessagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl ${
            messagePopupType === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
          }`}>
            <div className="text-center">
              <div className={`text-6xl mb-4 ${messagePopupType === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {messagePopupType === 'error' ? '❌' : '✅'}
              </div>
              <p className="text-gray-900 dark:text-white text-lg">{messagePopupContent}</p>
              <button
                onClick={() => setShowMessagePopup(false)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
