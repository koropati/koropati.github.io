# Portfolio Website - JSON Data Management System

## 📋 Overview

Portfolio website yang menggunakan sistem JSON untuk manajemen data yang mudah dan fleksibel. Semua data portfolio (skills, experience, projects, dll) disimpan dalam file `data.json` yang terpisah dari kode.

## 🚀 Quick Start

### Option 1: Web Server (Recommended)
```bash
# Using Python (if installed)
python -m http.server 8000
# atau
python3 -m http.server 8000

# Using Node.js (if installed)
npx http-server

# Using PHP (if installed)
php -S localhost:8000
```
Kemudian buka: `http://localhost:8000`

### Option 2: Direct File Access (Local Development)
- Buka `index.html` langsung di browser
- Portfolio akan menggunakan fallback data yang sudah di-embed
- Update data dengan edit fallback di `script.js` atau gunakan admin panel

### Option 3: GitHub Pages (Production)
1. Upload files ke GitHub repository
2. Enable GitHub Pages di repository settings
3. Access via `username.github.io/repository-name`

## 🐛 CORS Error Fix

Jika mendapat error:
```
Access to fetch at 'file:///data.json' has been blocked by CORS policy
```

**Solusi:**
1. ✅ **Gunakan Web Server** (Option 1 di atas)
2. ✅ **Fallback Data** - Portfolio akan otomatis menggunakan data yang sudah di-embed
3. ✅ **GitHub Pages** - Deploy ke GitHub Pages untuk production

## 📁 File Structure

```
portfolio/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # JavaScript functionality
├── data.json           # Portfolio data (optional - fallback available)
└── README.md           # Documentation
```

## 🔧 Development Modes

### Local Development (No Server)
- Portfolio menggunakan fallback data di `script.js`
- Admin panel tetap berfungsi
- Export/import masih bekerja
- Data changes hanya berlaku di session saat itu

### Web Server Development
- Portfolio load data dari `data.json`
- Real file management
- Persistent data changes
- Full functionality

### Production (GitHub Pages)
- Data dari `data.json`
- SEO optimized
- Full performance

## 📊 Data Management

### Method 1: Edit Fallback Data (No Server)
Edit fallback data di `script.js`:
```javascript
const fallbackData = {
  "personal": {
    "name": "Your Name",
    // ... update data here
  },
  "skills": {
    "programmingLanguages": [
      { "name": "Python", "level": 95 }
      // ... add/edit skills here
    ]
  }
  // ... rest of data
};
```

### Method 2: Edit JSON File (With Server)
```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Job Title"
  },
  "skills": {
    "programmingLanguages": [
      { "name": "Python", "level": 95 }
    ]
  }
}
```

### Method 3: Admin Panel (Both Modes)
- Press `Ctrl + Shift + A`
- Use GUI to add/edit data
- Export current state
- Import new data

## 🛠️ Admin Panel Features

### Access
- **Keyboard**: `Ctrl + Shift + A`
- **Works in**: Both local and server modes

### Features
- ✅ Add skills, experience, projects via forms
- ✅ Export current data as JSON
- ✅ Import JSON data
- ✅ Real-time preview
- ✅ Data validation

### Quick Actions
```javascript
// Add skill
addSkill('programmingLanguages', { name: 'Rust', level: 85 });

// Add experience
addExperience({
  title: 'Senior Developer',
  company: 'Tech Corp',
  startDate: 'Jan 2024',
  endDate: 'Present',
  description: 'Leading development...'
});

// Add project
addProject({
  title: 'Cool App',
  description: 'Amazing project...',
  technologies: ['React', 'Node.js'],
  featured: true
});
```

## 🚀 Deployment Options

### GitHub Pages
1. Create GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Select source branch
5. Access via GitHub Pages URL

### Netlify
1. Drag & drop folder to Netlify
2. Automatic deployment
3. Custom domain support

### Vercel
1. Import GitHub repository
2. Zero configuration deployment
3. Automatic HTTPS

### Traditional Hosting
1. Upload files via FTP
2. Ensure `data.json` is accessible
3. Configure web server if needed

## 📝 Updating Content

### Adding New Skill
```javascript
// Via console or admin panel
addSkill('frameworks', { 
  name: 'SvelteKit', 
  level: 80 
});
```

### Adding New Experience
```javascript
addExperience({
  title: 'Technical Lead',
  company: 'Innovation Labs',
  location: 'Remote',
  startDate: 'Mar 2024',
  endDate: 'Present',
  description: 'Leading technical architecture decisions...',
  current: true
});
```

### Adding New Project
```javascript
addProject({
  title: 'AI Dashboard',
  icon: 'fas fa-chart-line',
  description: 'Real-time analytics dashboard with AI insights',
  technologies: ['Vue.js', 'Python', 'TensorFlow'],
  category: 'AI/ML',
  featured: true
});
```

## 🎯 Data Structure Reference

### Complete JSON Structure
```json
{
  "personal": {
    "name": "Full Name",
    "title": "Job Title",
    "tagline": "Professional tagline with keywords",
    "description": "About paragraph",
    "contact": {
      "email": "email@domain.com",
      "phone": "+62 xxx xxx xxxx",
      "location": "City, Country",
      "birthdate": "Month Day, Year",
      "languages": ["Language1", "Language2"]
    }
  },
  "statistics": {
    "projects": "20+",
    "experience": "5+",
    "gpa": "3.93"
  },
  "skills": {
    "programmingLanguages": [
      { "name": "Python", "level": 95 }
    ],
    "frameworks": [
      { "name": "React", "level": 90 }
    ],
    "databases": [
      { "name": "MongoDB", "level": 85 }
    ]
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City",
      "startDate": "Mon YYYY",
      "endDate": "Present",
      "description": "Job description...",
      "current": true
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "icon": "fas fa-icon",
      "description": "Project description...",
      "technologies": ["Tech1", "Tech2"],
      "category": "Category",
      "featured": true
    }
  ],
  "education": [...],
  "certifications": [...],
  "seo": {
    "title": "Page Title",
    "description": "Meta description",
    "keywords": "keyword1, keyword2",
    "author": "Your Name"
  }
}
```

## 🔍 Troubleshooting

### CORS Error
**Problem**: `Cross origin requests are only supported for protocol schemes: http, https`

**Solutions**:
1. Use web server (recommended)
2. Use fallback data (automatic)
3. Deploy to GitHub Pages

### Data Not Loading
**Check**:
- Browser console for errors
- JSON syntax validity
- File accessibility
- Network connectivity

### Skills Not Rendering
**Verify**:
- Category names match exactly
- Level values are numbers (1-100)
- Array structure is correct

### Admin Panel Not Working
**Try**:
- `Ctrl + Shift + A` keyboard shortcut
- Check browser console for errors
- Verify JavaScript is enabled

## 🎨 Customization

### Theme Colors
```json
{
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#3b82f6", 
    "accentColor": "#1d4ed8"
  }
}
```

### Icon Options
Use Font Awesome icons:
- `fas fa-code` - Code
- `fas fa-brain` - AI/ML
- `fas fa-mobile-alt` - Mobile
- `fas fa-database` - Database
- `fas fa-users` - Team/HR

## 📈 Performance Tips

1. **Optimize Images**: Use compressed images
2. **CDN Links**: Use CDN for external resources
3. **Minification**: Minify CSS/JS for production
4. **Caching**: Enable browser caching
5. **Lazy Loading**: Implement for images

## 🔒 Security Notes

- No sensitive data in JSON
- Use HTTPS in production
- Validate all inputs
- Regular security updates

---

**Need Help?** Check browser console for detailed error messages and solutions.

**Happy Coding! 🚀**

## 📊 Data.json Structure

File `data.json` mengorganisir semua data portfolio dalam struktur berikut:

### Personal Information
```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Job Title",
    "tagline": "Your professional tagline",
    "description": "About you paragraph",
    "contact": {
      "email": "your@email.com",
      "phone": "+62 xxx xxx xxxx",
      "location": "Your Location",
      "birthdate": "Your Birthdate",
      "languages": ["Indonesian", "English"]
    }
  }
}
```

### Skills Management
```json
{
  "skills": {
    "programmingLanguages": [
      { "name": "Python", "level": 95 },
      { "name": "JavaScript", "level": 85 }
    ],
    "frameworks": [
      { "name": "React", "level": 90 },
      { "name": "Vue.js", "level": 85 }
    ],
    "databases": [
      { "name": "MongoDB", "level": 80 },
      { "name": "MySQL", "level": 85 }
    ]
  }
}
```

### Experience Timeline
```json
{
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Company Name",
      "location": "City",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "description": "Job description...",
      "current": true
    }
  ]
}
```

### Projects Showcase
```json
{
  "projects": [
    {
      "title": "Project Name",
      "icon": "fas fa-code",
      "description": "Project description...",
      "technologies": ["React", "Node.js", "MongoDB"],
      "category": "Web Development",
      "featured": true
    }
  ]
}
```

## 🛠️ How to Update Portfolio

### Method 1: Edit JSON File Directly
1. Open `data.json`
2. Modify the relevant section
3. Save file
4. Refresh website

### Method 2: Use Admin Panel (Recommended)
1. Press `Ctrl + Shift + A` to open admin panel
2. Use quick action buttons to add:
   - New skills
   - Work experience
   - Projects
3. Export/Import data easily

### Method 3: Use JavaScript Functions
```javascript
// Add new skill
addSkill('programmingLanguages', { name: 'Rust', level: 75 });

// Add new experience
addExperience({
  title: 'Senior Developer',
  company: 'New Company',
  startDate: 'Jan 2024',
  endDate: 'Present',
  description: 'Working on amazing projects...',
  current: true
});

// Add new project
addProject({
  title: 'Cool App',
  icon: 'fas fa-mobile-alt',
  description: 'Amazing mobile application...',
  technologies: ['React Native', 'Firebase'],
  category: 'Mobile',
  featured: true
});
```

## 📱 Admin Panel Features

### Access Admin Panel
- **Keyboard Shortcut**: `Ctrl + Shift + A`
- **Location**: Top-left corner of screen

### Features
- ✅ **Export Data**: Download current portfolio data as JSON
- ✅ **Import Data**: Upload JSON file to update portfolio
- ✅ **Quick Add**: Forms to quickly add skills, experience, projects
- ✅ **Real-time Updates**: Changes reflect immediately on website

## 🎯 Adding New Content

### Adding a New Skill
```javascript
// Via admin panel or console
addSkill('frameworks', { 
  name: 'Svelte', 
  level: 80 
});
```

### Adding New Work Experience
```javascript
addExperience({
  title: 'Lead Developer',
  company: 'Tech Startup',
  location: 'Jakarta',
  startDate: 'Mar 2024',
  endDate: 'Present',
  description: 'Leading development team of 5 engineers...',
  current: true
});
```

### Adding New Project
```javascript
addProject({
  title: 'E-commerce Platform',
  icon: 'fas fa-shopping-cart',
  description: 'Full-stack e-commerce solution with modern tech stack',
  technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
  category: 'Full-stack',
  featured: true
});
```

## 🔧 Customization Options

### Theme Colors
Update theme colors in `data.json`:
```json
{
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#3b82f6",
    "accentColor": "#1d4ed8"
  }
}
```

### SEO Settings
```json
{
  "seo": {
    "title": "Your Name - Software Engineer",
    "description": "Professional description...",
    "keywords": "keyword1, keyword2, keyword3",
    "author": "Your Name"
  }
}
```

### Statistics
```json
{
  "statistics": {
    "projects": "25+",
    "experience": "6+",
    "gpa": "3.85"
  }
}
```

## 📋 Content Categories

### Skills Categories
- `programmingLanguages`: Python, JavaScript, Go, etc.
- `frameworks`: React, Vue, Django, Laravel, etc.
- `databases`: MongoDB, MySQL, PostgreSQL, etc.

### Project Categories
- `Web Development`
- `Mobile Development`
- `AI/ML`
- `IoT`
- `Enterprise`
- `Open Source`

## 🚀 Deployment Tips

### GitHub Pages
1. Upload all files to GitHub repository
2. Ensure `data.json` is in the root directory
3. Enable GitHub Pages in repository settings
4. Website will be available at `username.github.io/repository-name`

### Custom Domain
1. Add `CNAME` file with your domain
2. Update DNS settings to point to GitHub Pages
3. Enable HTTPS in repository settings

## 🔄 Data Migration

### Backup Current Data
```javascript
exportPortfolioData(); // Downloads current data as JSON
```

### Import New Data
1. Use admin panel import feature
2. Or replace `data.json` file directly
3. Refresh page to see changes

## 📝 Best Practices

1. **Regular Backups**: Export your data regularly
2. **Version Control**: Keep `data.json` in version control
3. **Validation**: Test changes in development before deploying
4. **Image Optimization**: Use CDN links for images when possible
5. **Content Quality**: Keep descriptions concise and professional

## 🐛 Troubleshooting

### Data Not Loading
- Check console for errors
- Verify `data.json` syntax is valid
- Ensure file is accessible via HTTP(S)

### Skills Not Rendering
- Check skill category names match exactly
- Verify skill level is a number (1-100)
- Ensure skills array is not empty

### Projects Not Showing
- Verify `featured: true` for projects you want to display
- Check icon class names are valid Font Awesome classes
- Ensure technologies array is not empty

## 🎉 Features

- ✅ **Responsive Design**: Works on all devices
- ✅ **Dark/Light Theme**: Toggle theme preference
- ✅ **PDF Export**: Download portfolio as PDF
- ✅ **SEO Optimized**: Meta tags from JSON data
- ✅ **Admin Panel**: Easy data management
- ✅ **Real-time Updates**: No page refresh needed
- ✅ **Data Validation**: Error handling for invalid data
- ✅ **Keyboard Shortcuts**: Quick access to admin features

---

**Happy Coding! 🚀**

For questions or issues, check the browser console for detailed error messages.