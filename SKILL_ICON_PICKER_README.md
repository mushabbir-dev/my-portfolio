# Skill Icon Picker

## Overview
The Skill Icon Picker is a new feature that provides a comprehensive selection of development-related icons for skills in your portfolio. It replaces the previous emoji-based icon system with professional SVG icons from the `react-icons` library.

## Features
- **40+ Development Icons**: Covers languages, frameworks, databases, cloud services, and tools
- **Professional Look**: Clean SVG icons instead of emojis
- **Easy Integration**: Drop-in replacement for existing icon systems
- **Consistent Styling**: Matches your existing admin UI design

## Available Icon Categories

### Languages & Core
- Python, JavaScript, TypeScript, Java, C, C++, Go

### Web & Frontend
- React, Next.js, Vite, Tailwind CSS, Bootstrap

### Backend
- Node.js, Express, Flask, Spring, Django

### Databases
- MongoDB, MySQL, PostgreSQL, Supabase, SQLite

### Cloud & DevOps
- Docker, Kubernetes, AWS, Google Cloud, Azure

### Data & ML
- NumPy, Pandas, Scikit-learn, TensorFlow, PyTorch, OpenAI

### Tools
- Git, GitHub, GitLab, Linux, Jest, Testing Library

## How to Use

### In Admin UI
1. Navigate to the Skills section in your admin panel
2. Click on any skill's icon button to open the icon picker
3. Select from the grid of available icons
4. The icon will be automatically saved and displayed

### Adding New Skills
1. Click "Add Skill" for any category
2. New skills automatically get a default icon (SiCode)
3. Click the icon button to change it using the picker

### Technical Implementation

#### Data Structure
Skills now include an `iconKey` field alongside the existing `icon` field:
```typescript
{
  id: string;
  name: string;
  icon: string;        // Legacy emoji fallback
  iconKey?: string;    // New react-icons key (e.g., 'SiPython')
}
```

#### Icon Display Logic
The system automatically chooses between react-icons and emoji fallbacks:
```typescript
const Icon = skill.iconKey ? (si as any)[skill.iconKey] : null;
return Icon ? <Icon size={24} /> : (skill.icon || '🔧');
```

#### Integration Points
- **Admin Skills Section**: Full icon picker integration
- **Main Site Skills Display**: Automatic icon rendering
- **Preview Mode**: Consistent icon display across all views

## Benefits
1. **Professional Appearance**: Clean, scalable SVG icons
2. **Better UX**: Intuitive icon selection interface
3. **Consistency**: Unified icon system across admin and public views
4. **Maintainability**: Centralized icon management
5. **Performance**: Optimized SVG icons with proper sizing

## Migration Notes
- Existing skills with emoji icons will continue to work
- New skills will use the icon picker by default
- The `iconKey` field is optional and backward-compatible
- Emoji fallbacks ensure no broken displays during transition

## Future Enhancements
- Custom icon uploads
- Icon categories and search
- Icon color customization
- Additional icon libraries (Material Icons, Font Awesome, etc.)
