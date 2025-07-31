# 🚀 My Portfolio - AI Specialist & Software Engineer

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features a comprehensive admin panel for content management and secure authentication system.

## ✨ Features

### 🌐 Public Site
- **Multi-language Support**: English and Japanese
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Automatic theme switching
- **Interactive Sections**: Hero, About, Education, Skills, Projects, Papers, Certifications
- **File Management**: PDF uploads for CV, papers, and certifications
- **Contact Form**: EmailJS integration for secure communication

### 🔐 Admin Panel
- **Secure Authentication**: Two-factor authentication with OTP
- **Content Management**: Full CRUD operations for all sections
- **File Upload**: PDF and image upload support
- **Session Management**: Auto-logout with activity tracking
- **Real-time Updates**: Instant content synchronization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Custom OTP system with EmailJS
- **File Storage**: Local file system with public directory
- **Email**: EmailJS for contact form and OTP delivery
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # EmailJS Configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

### Login Credentials
- **User ID**: `ahmed`
- **Password**: `Ahmed@2025` (change in production)

### Access Admin Panel
1. Navigate to `/admin/login`
2. Enter credentials
3. Check your email for OTP
4. Enter OTP to access admin panel

## 📁 Project Structure

```
my-portfolio/
├── app/
│   ├── admin/           # Admin panel pages
│   ├── api/             # API routes
│   ├── contexts/        # React contexts
│   ├── components/      # Reusable components
│   └── lib/            # Utility functions
├── data/               # Portfolio data storage
├── public/             # Static assets
│   ├── papers/         # Uploaded PDFs
│   ├── cv/            # CV files
│   └── certifications/ # Certification files
└── package.json
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

### Environment Variables for Production

Set these in your Vercel dashboard:
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### File Storage in Production

- **PDF Files**: Stored in `/public/papers/`, `/public/cv/`, `/public/certifications/`
- **Data Persistence**: Portfolio data stored in `/data/portfolio.json`
- **Security**: Sensitive files excluded via `.gitignore`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Sections

1. Update `PortfolioData` interface in `app/admin/page.tsx`
2. Add section to `defaultData`
3. Create render function
4. Add to navigation array
5. Update main site in `app/page.tsx`

## 📧 EmailJS Setup

1. Create EmailJS account at [emailjs.com](https://www.emailjs.com/)
2. Set up email service (Gmail recommended)
3. Create email template
4. Add credentials to `.env.local`

## 🔒 Security Features

- **Password Hashing**: SHA-256 for admin credentials
- **Session Management**: Secure session tokens with expiration
- **OTP Authentication**: 6-digit codes with 5-minute expiration
- **File Upload Security**: Restricted file types and sizes
- **Environment Variables**: Sensitive data stored securely

## 📱 Responsive Design

- **Mobile**: Optimized for all screen sizes
- **Tablet**: Adaptive layouts
- **Desktop**: Full-featured experience
- **Accessibility**: WCAG compliant

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update component styles in respective files
- Add new animations with Framer Motion

### Content
- Edit `data/portfolio.json` for initial content
- Use admin panel for live updates
- Add new sections following the established pattern

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or issues:
- Email: mushabbirahmed99@gmail.com
- GitHub Issues: [Create an issue](https://github.com/your-username/my-portfolio/issues)

---

**Built with ❤️ by Mushabbir Ahmed**
