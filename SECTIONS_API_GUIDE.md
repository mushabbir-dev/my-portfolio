# Sections API Guide - Portfolio Content Management

## 🎯 Overview

Your portfolio now has a powerful, unified API for managing all content sections. The Admin panel can create, update, and delete items in any array section, while non-array sections can be replaced or merged.

## 🚀 API Endpoints

### 1. **Main Sections API** - `/api/portfolio/sections`

#### **GET** - Read Sections
```typescript
// Get entire portfolio
GET /api/portfolio/sections

// Get specific section
GET /api/portfolio/sections?section=skills
GET /api/portfolio/sections?section=projects
GET /api/portfolio/sections?section=about
```

#### **PUT** - Replace Section (Objects OR Arrays)
```typescript
// Replace entire section
PUT /api/portfolio/sections
{
  "section": "contact",
  "data": {
    "email": "mushabbirahmed99@gmail.com",
    "phone": "(+81)090-3402-4637",
    "location": {
      "english": "Saga, Japan",
      "japanese": "佐賀市、日本"
    },
    "social": {
      "github": "https://github.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourusername",
      "whatsapp": "https://wa.me/819034024637"
    }
  }
}
```

#### **PATCH** - Merge Object Sections (NOT for arrays)
```typescript
// Merge fields into existing object
PATCH /api/portfolio/sections
{
  "section": "hero",
  "data": {
    "headlineEn": "Make Things Work",
    "headlineJa": "実現する"
  }
}
```

#### **POST** - Add Item to Array Section
```typescript
// Add new skill
POST /api/portfolio/sections
{
  "section": "skills",
  "item": {
    "name": "React",
    "level": 5,
    "category": "Frontend"
  }
}
```

#### **DELETE** - Remove Item from Array Section
```typescript
// Delete skill by ID
DELETE /api/portfolio/sections
{
  "section": "skills",
  "id": "react"
}
```

### 2. **Upsert API** - `/api/portfolio/sections/item`

#### **PUT** - Upsert Single Item or Bulk Items
```typescript
// Upsert single item (create or update by ID)
PUT /api/portfolio/sections/item
{
  "section": "education",
  "item": {
    "id": "saga-2025",
    "school": "Saga University",
    "degree": "M.Eng. (AI & Data Science)",
    "start": "2024-04",
    "end": "2026-03",
    "gpa": "3.8/4.0"
  }
}

// Bulk upsert multiple items
PUT /api/portfolio/sections/item
{
  "section": "skills",
  "items": [
    { "id": "react", "name": "React", "level": 5, "category": "Frontend" },
    { "id": "python", "name": "Python", "level": 5, "category": "Backend" },
    { "id": "ai", "name": "AI/ML", "level": 4, "category": "Specialty" }
  ]
}
```

## 📋 Content Section Types

### **Object Sections** (use PUT/PATCH)
- `hero` - Name, title, profile picture, headlines
- `about` - Description, experience, summary
- `contact` - Email, phone, location, social links

### **Array Sections** (use POST/PUT/DELETE)
- `skills` - Technical skills with levels
- `education` - Academic background
- `experience` - Work history
- `projects` - Portfolio projects
- `papers` - Research publications
- `certifications` - Professional certificates
- `languages` - Language proficiencies

## 🛠️ Admin Panel Implementation Examples

### **Error Handling Pattern**
```typescript
async function saveSection(section: string, data: any) {
  try {
    const res = await fetch('/api/portfolio/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data })
    });
    
    const json = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      toast.error(json?.error ?? 'Request failed');
      return false;
    } else {
      toast.success('Saved successfully');
      return true;
    }
  } catch (error) {
    toast.error('Network error');
    return false;
  }
}
```

### **Skills Management**
```typescript
// Add new skill
async function addSkill(skill: { name: string; level: number; category: string }) {
  const res = await fetch('/api/portfolio/sections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'skills', item: skill })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to add skill');
  }
  
  return res.json();
}

// Update skill
async function updateSkill(skill: { id: string; name: string; level: number; category: string }) {
  const res = await fetch('/api/portfolio/sections/item', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'skills', item: skill })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update skill');
  }
  
  return res.json();
}

// Delete skill
async function deleteSkill(skillId: string) {
  const res = await fetch('/api/portfolio/sections', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'skills', id: skillId })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete skill');
  }
  
  return res.json();
}
```

### **Projects Management**
```typescript
// Save entire projects array (after editing locally)
async function saveProjects(projects: Project[]) {
  const res = await fetch('/api/portfolio/sections', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'projects', data: projects })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to save projects');
  }
  
  return res.json();
}

// Bulk upsert projects
async function upsertProjects(projects: Project[]) {
  const res = await fetch('/api/portfolio/sections/item', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'projects', items: projects })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upsert projects');
  }
  
  return res.json();
}
```

### **Contact Information**
```typescript
// Update contact info (merge)
async function updateContact(contactData: Partial<Contact>) {
  const res = await fetch('/api/portfolio/sections', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'contact', data: contactData })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update contact');
  }
  
  return res.json();
}

// Replace entire contact section
async function replaceContact(contactData: Contact) {
  const res = await fetch('/api/portfolio/sections', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'contact', data: contactData })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to replace contact');
  }
  
  return res.json();
}
```

## 🔄 Data Flow

### **1. Admin Panel Operations**
```
Admin edits content locally → Saves via API → Supabase updated → Main site reflects changes
```

### **2. File Uploads**
```
File uploaded → Stored in assets bucket → URL stored in portfolio JSON → Main site displays
```

### **3. Real-time Updates**
```
API calls set revalidate = 0 → Main site always reads fresh data → No caching issues
```

## 📊 Response Format

### **Success Responses**
```json
{
  "success": true,
  "data": { ... },        // For GET requests
  "item": { ... },        // For single item operations
  "items": [ ... ]        // For bulk operations
}
```

### **Error Responses**
```json
{
  "error": "Detailed error message",
  "status": 400           // HTTP status code
}
```

## 🚨 Important Notes

### **ID Generation**
- Items without IDs get auto-generated UUIDs
- Use custom IDs for predictable references
- IDs are strings for consistency

### **Array vs Object Sections**
- **Arrays**: Use POST (add), PUT (replace), DELETE (remove), or upsert endpoints
- **Objects**: Use PUT (replace) or PATCH (merge)
- **Never use PATCH on arrays** - it will return an error

### **Bulk Operations**
- Use `/api/portfolio/sections/item` with `items: [...]` for bulk upserts
- More efficient than multiple individual requests
- Atomic operations - all succeed or all fail

### **Error Handling**
- All endpoints return proper 4xx/5xx status codes
- Always check `res.ok` before processing responses
- Display actual error messages to users

## 🧪 Testing Your API

### **Test with curl**
```bash
# Get skills section
curl "https://your-domain.vercel.app/api/portfolio/sections?section=skills"

# Add new skill
curl -X POST "https://your-domain.vercel.app/api/portfolio/sections" \
  -H "Content-Type: application/json" \
  -d '{"section":"skills","item":{"name":"TypeScript","level":4,"category":"Frontend"}}'

# Update skill
curl -X PUT "https://your-domain.vercel.app/api/portfolio/sections/item" \
  -H "Content-Type: application/json" \
  -d '{"section":"skills","item":{"id":"typescript","name":"TypeScript","level":5,"category":"Frontend"}}'
```

### **Test with Postman/Insomnia**
- Import the endpoints above
- Test all HTTP methods
- Verify error responses for invalid data

## 🎯 Best Practices

1. **Always handle errors** - Check `res.ok` and display error messages
2. **Use appropriate methods** - POST for new items, PUT for updates, DELETE for removal
3. **Batch operations** - Use bulk upserts for multiple items
4. **Validate data** - Ensure required fields are present before sending
5. **Test thoroughly** - Verify all CRUD operations work as expected

Your portfolio now has enterprise-grade content management capabilities! 🚀
