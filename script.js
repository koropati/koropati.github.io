// ===== GLOBAL VARIABLES =====
let currentTheme = localStorage.getItem('theme') || 'light';
let portfolioData = null;

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioData();
});

// ===== FALLBACK DATA =====
const fallbackData = {
  "personal": {
    "name": "Dewa Ketut Satriawan Suditresnajaya",
    "title": "Software Engineer",
    "tagline": "Software Engineer specializing in Full Stack Development, AI Systems & Modern Web Technologies",
    "description": "Experienced Software Engineer with 5+ years of expertise in full-stack development, AI systems, and modern web technologies. Currently contributing to innovative solutions at PT Bima Sakti Alterra, with proven experience in building SHRIS, AI ChatBot systems with LLM RAG, and enterprise applications using cutting-edge technologies like Golang, FastAPI, and Nuxt.js 3.",
    "contact": {
      "email": "windowsdewa@gmail.com",
      "phone": "+62 823 4080 3646",
      "location": "Jl. Sawo, Gianyar, Bali, Indonesia",
      "birthdate": "June 21, 1997",
      "languages": ["Indonesian", "English"]
    }
  },
  "statistics": {
    "projects": "20+",
    "experience": "5+",
    "gpa": "3.93"
  },
  "skills": {
    "programmingLanguages": [
      { "name": "Python", "level": 95 },
      { "name": "PHP", "level": 90 },
      { "name": "JavaScript", "level": 85 },
      { "name": "Golang", "level": 80 },
      { "name": "C++", "level": 75 }
    ],
    "frameworks": [
      { "name": "FastAPI", "level": 90 },
      { "name": "Django", "level": 95 },
      { "name": "Laravel", "level": 90 },
      { "name": "Gin Fiber", "level": 80 },
      { "name": "Node.js", "level": 85 },
      { "name": "Nuxt.js 3", "level": 85 },
      { "name": "Vue.js", "level": 85 },
      { "name": "Symfony", "level": 75 },
      { "name": "Arduino", "level": 85 }
    ],
    "databases": [
      { "name": "MongoDB", "level": 85 },
      { "name": "MySQL", "level": 85 },
      { "name": "PostgreSQL", "level": 80 },
      { "name": "Tailwind CSS", "level": 90 }
    ]
  },
  "experience": [
    {
      "title": "Software Engineer",
      "company": "PT Bima Sakti Alterra",
      "location": "",
      "startDate": "Feb 2022",
      "endDate": "Present",
      "description": "Developing scalable applications using modern technologies including Golang, FastAPI, and Nuxt.js 3. Built enterprise systems like SHRIS and AI ChatBot with hybrid RAG LLM architecture. Implementing best practices in software development and collaborating with cross-functional teams to deliver high-quality software solutions.",
      "current": true
    },
    {
      "title": "Leader Team Research and Development",
      "company": "PT. Bangun Inovasi Teknologi",
      "location": "Denpasar",
      "startDate": "Sep 2021",
      "endDate": "Jan 2022",
      "description": "Leading the R&D team, making projects in the field of Artificial Intelligence & Internet of Things. Designing and handling company products in the AI and IoT fields, as well as researching the needs of tools and software for the development team.",
      "current": false
    },
    {
      "title": "Backend Programmer",
      "company": "PT. Bangun Inovasi Teknologi",
      "location": "Denpasar",
      "startDate": "Dec 2020",
      "endDate": "Aug 2021",
      "description": "Developed Internet of Things prototype hardware and handled Frontend projects as a Backend Programmer.",
      "current": false
    },
    {
      "title": "Robotics Specialist",
      "company": "(R)Akademi",
      "location": "Singaraja",
      "startDate": "Dec 2019",
      "endDate": "Feb 2020",
      "description": "Served as a lecturer in the field of robotics at (R)Akademi, which is a robotics lesson located in Sambangan - Singaraja.",
      "current": false
    },
    {
      "title": "Full Stack Developer Intern",
      "company": "PT. Bangun Inovasi Teknologi",
      "location": "Denpasar",
      "startDate": "Jul 2019",
      "endDate": "Sep 2019",
      "description": "Field Work Practice as a Full Stack Developer Programmer, working on WEB-based projects using the Django framework.",
      "current": false
    }
  ],
  "projects": [
    {
      "title": "SHRIS (Strategic Human Resource Information System)",
      "icon": "fas fa-users-cog",
      "description": "Developed comprehensive HR management system for strategic workforce planning and management. Built with modern full-stack architecture featuring advanced analytics and reporting capabilities.",
      "technologies": ["Golang", "Gin Fiber", "Nuxt.js 3", "Vue.js", "Tailwind CSS"],
      "category": "Enterprise",
      "featured": true
    },
    {
      "title": "AI ChatBot with Hybrid RAG LLM",
      "icon": "fas fa-robot",
      "description": "Built intelligent chatbot system using hybrid RAG (Retrieval-Augmented Generation) with LLM. Features FastAPI backend with MongoDB for vector storage and Nuxt.js 3 frontend for seamless user interaction.",
      "technologies": ["Python", "FastAPI", "MongoDB", "LLM", "RAG", "Nuxt.js 3", "Vue.js", "Tailwind CSS"],
      "category": "AI/ML",
      "featured": true
    },
    {
      "title": "Face Recognition Attendance System",
      "icon": "fas fa-brain",
      "description": "Developed an attendance system using Face Recognition with conventional methods (KNN with K-Means using Haar and HoG features) and CNN. Built with Python and PHP Laravel.",
      "technologies": ["Python", "PHP Laravel", "CNN", "OpenCV"],
      "category": "AI/ML",
      "featured": true
    },
    {
      "title": "OCR for KTP and BPJS Cards",
      "icon": "fas fa-id-card",
      "description": "Developed an OCR system for Identity Card and BPJS Card documents as an API for online registration systems such as patient registration at hospitals.",
      "technologies": ["Python", "OCR", "API", "Healthcare"],
      "category": "AI/ML",
      "featured": true
    },
    {
      "title": "Smart Infusion Monitoring System",
      "icon": "fas fa-heartbeat",
      "description": "Built an IoT system for monitoring Infusion in patients using prototype hardware specifically designed for infusion monitoring.",
      "technologies": ["IoT", "C++", "PHP Laravel", "Healthcare"],
      "category": "IoT",
      "featured": true
    },
    {
      "title": "Human Detection & Counting",
      "icon": "fas fa-users",
      "description": "Created a human detection system for monitoring the number of people in a room with capacity limitations, including heatmap visualization for crowd analysis.",
      "technologies": ["Python", "Computer Vision", "IoT", "Analytics"],
      "category": "AI/ML",
      "featured": true
    }
  ],
  "education": [
    {
      "degree": "Informatics Engineering",
      "institution": "Universitas Pendidikan Ganesha",
      "location": "Singaraja",
      "startDate": "Sep 2016",
      "endDate": "Nov 2020",
      "gpa": "3.93",
      "description": "Majoring in Informatics Engineering, with the Informatics Engineering Education Study Program. Graduated with a very satisfactory predicate."
    },
    {
      "degree": "Computer and Network Engineering",
      "institution": "SMK N 1 Tanjung",
      "location": "Lombok Utara",
      "startDate": "2013",
      "endDate": "2016",
      "gpa": null,
      "description": "Vocational high school specializing in computer and network engineering."
    }
  ],
  "certifications": [
    {
      "name": "Software Development",
      "issuer": "National Professional Certification Agency (BNSP)",
      "date": "Sep 2019",
      "description": "Obtaining a Software Development Competency Certificate with qualifications as a Programmer."
    },
    {
      "name": "Java Fundamental",
      "issuer": "Oracle Academy",
      "date": "Jan 2018",
      "description": "Obtaining training on Java Fundamentals online."
    }
  ],
  "seo": {
    "title": "Dewa Ketut Satriawan - Software Engineer",
    "description": "Dewa Ketut Satriawan Suditresnajaya - Software Engineer specializing in AI, IoT, and Full Stack Development",
    "keywords": "Software Engineer, AI Developer, IoT Specialist, Full Stack Developer, Python, Golang, FastAPI, Nuxt.js, RAG LLM",
    "author": "Dewa Ketut Satriawan Suditresnajaya"
  }
};

// ===== LOAD PORTFOLIO DATA =====
async function loadPortfolioData() {
    try {
        // Try to fetch from data.json first
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        portfolioData = await response.json();
        console.log('✅ Portfolio data loaded from data.json');
        
    } catch (error) {
        console.warn('⚠️ Failed to load data.json, using fallback data:', error.message);
        
        // Use fallback data
        portfolioData = fallbackData;
        
        // Show notification to user
        setTimeout(() => {
            showNotification('Using local data. To enable external JSON loading, use a web server.', 'info');
        }, 2000);
    }
    
    initializePortfolio();
}

// ===== INITIALIZE PORTFOLIO =====
function initializePortfolio() {
    initializeTheme();
    initializeNavigation();
    
    if (portfolioData) {
        renderPersonalInfo();
        renderStatistics();
        renderSkills();
        renderExperience();
        renderProjects();
        updateSEO();
    }
    
    initializeAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializePDFDownload();
    initializeScrollEffects();
    
    // Show development info
    createDevInfo();
}

// ===== RENDER PERSONAL INFO =====
function renderPersonalInfo() {
    const { personal } = portfolioData;
    
    // Update hero section
    document.querySelector('.name').textContent = personal.name;
    document.querySelector('.role').textContent = personal.title;
    document.querySelector('.hero-description').innerHTML = personal.tagline.replace(
        /(Full Stack Development|AI Systems|Modern Web Technologies)/g,
        '<span class="highlight">$1</span>'
    );
    
    // Update about section
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.innerHTML = `
            <p>${personal.description}</p>
            <p>My expertise spans across multiple programming languages and frameworks, with a strong focus on 
            Python, Golang, PHP, and JavaScript. I have experience with modern technologies including FastAPI, 
            Gin Fiber, Node.js, and Nuxt.js 3, delivering projects ranging from AI-powered systems to enterprise 
            applications.</p>
        `;
    }
    
    // Update contact info
    const contactInfo = document.querySelector('.info-card');
    if (contactInfo) {
        const infoItems = contactInfo.querySelectorAll('.info-item');
        if (infoItems.length >= 5) {
            infoItems[0].querySelector('span').textContent = personal.contact.location;
            infoItems[1].querySelector('span').textContent = personal.contact.email;
            infoItems[2].querySelector('span').textContent = personal.contact.phone;
            infoItems[3].querySelector('span').textContent = personal.contact.birthdate;
            infoItems[4].querySelector('span').textContent = personal.contact.languages.join(', ');
        }
    }
}

// ===== RENDER STATISTICS =====
function renderStatistics() {
    const { statistics } = portfolioData;
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = statistics.projects;
        statNumbers[1].textContent = statistics.experience;
        statNumbers[2].textContent = statistics.gpa;
    }
}

// ===== RENDER SKILLS =====
function renderSkills() {
    const { skills } = portfolioData;
    const skillsGrid = document.querySelector('.skills-grid');
    
    if (!skillsGrid) return;
    
    skillsGrid.innerHTML = `
        <div class="skill-category">
            <h3>Programming Languages</h3>
            <div class="skill-items">
                ${skills.programmingLanguages.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" data-width="${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="skill-category">
            <h3>Frameworks & Libraries</h3>
            <div class="skill-items">
                ${skills.frameworks.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" data-width="${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="skill-category">
            <h3>Databases & Tools</h3>
            <div class="skill-items">
                ${skills.databases.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" data-width="${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== RENDER EXPERIENCE =====
function renderExperience() {
    const { experience } = portfolioData;
    const timeline = document.querySelector('.timeline');
    
    if (!timeline) return;
    
    timeline.innerHTML = experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h3>${exp.title}</h3>
                    <span class="timeline-date">${exp.startDate} - ${exp.endDate}</span>
                </div>
                <p class="timeline-company">${exp.company}${exp.location ? ', ' + exp.location : ''}</p>
                <p class="timeline-description">${exp.description}</p>
            </div>
        </div>
    `).join('');
}

// ===== RENDER PROJECTS =====
function renderProjects() {
    const { projects } = portfolioData;
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) return;
    
    const featuredProjects = projects.filter(project => project.featured);
    
    projectsGrid.innerHTML = featuredProjects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <i class="${project.icon} project-icon"></i>
                <h3>${project.title}</h3>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// ===== UPDATE SEO =====
function updateSEO() {
    const { seo, personal } = portfolioData;
    
    document.title = seo.title;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = seo.description;
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.content = seo.keywords;
    
    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) metaAuthor.content = seo.author;
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = seo.title;
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = seo.description;
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Set initial theme
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const body = document.body;
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Set active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
                
                // Trigger counter animations
                if (entry.target.classList.contains('about')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
    
    // Animate cards on scroll
    const cards = document.querySelectorAll('.project-card, .timeline-content, .skill-category');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===== SKILL BARS ANIMATION =====
function initializeSkillBars() {
    // This will be triggered by the intersection observer
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (target % 1 === 0) {
                    counter.textContent = Math.ceil(current);
                } else {
                    counter.textContent = current.toFixed(2);
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target % 1 === 0 ? target : target.toFixed(2);
            }
        };
        
        updateCounter();
    });
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = `mailto:windowsdewa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Message prepared! Your email client should open now.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 400px;
        font-family: inherit;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== PDF DOWNLOAD =====
function initializePDFDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', generatePDF);
    }
}

async function generatePDF() {
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.innerHTML;
    
    try {
        // Show loading state
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;
        
        // Clone the body to avoid modifying the original
        const originalBody = document.body.cloneNode(true);
        
        // Create a temporary container for PDF content
        const pdfContainer = document.createElement('div');
        pdfContainer.style.cssText = `
            font-family: 'Inter', sans-serif;
            background: white;
            color: #1e293b;
            line-height: 1.6;
            padding: 2rem;
        `;
        
        // Build PDF content
        const pdfContent = createPDFContent();
        pdfContainer.appendChild(pdfContent);
        
        // Hide original body and show PDF content
        document.body.style.display = 'none';
        document.body.parentNode.appendChild(pdfContainer);
        
        // PDF options
        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'Dewa_Ketut_Satriawan_Portfolio.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true,
                allowTaint: true
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        };
        
        // Generate PDF
        await html2pdf().set(options).from(pdfContainer).save();
        
        // Restore original content
        document.body.style.display = '';
        pdfContainer.remove();
        
        showNotification('Portfolio PDF downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        showNotification('Failed to generate PDF. Please try again.', 'error');
    } finally {
        // Reset button state
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }
}

function createPDFContent() {
    if (!portfolioData) {
        return createFallbackPDFContent();
    }
    
    const { personal, statistics, skills, experience, projects, education, certifications } = portfolioData;
    
    const container = document.createElement('div');
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid #e2e8f0;">
            <h1 style="font-size: 2.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">
                ${personal.name}
            </h1>
            <h2 style="font-size: 1.5rem; color: #2563eb; margin-bottom: 1rem; font-weight: 600;">
                ${personal.title}
            </h2>
            <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; font-size: 0.9rem; color: #64748b;">
                <div><strong>Email:</strong> ${personal.contact.email}</div>
                <div><strong>Phone:</strong> ${personal.contact.phone}</div>
                <div><strong>Location:</strong> ${personal.contact.location}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">
                Professional Summary
            </h3>
            <p style="color: #64748b; line-height: 1.7; margin-bottom: 1rem;">
                ${personal.description}
            </p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem;">
                <div style="text-align: center; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #2563eb;">${statistics.projects}</div>
                    <div style="font-size: 0.85rem; color: #64748b;">Projects Completed</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #2563eb;">${statistics.experience}</div>
                    <div style="font-size: 0.85rem; color: #64748b;">Years Experience</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #2563eb;">${statistics.gpa}</div>
                    <div style="font-size: 0.85rem; color: #64748b;">University GPA</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">
                Technical Skills
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #374151;">Programming Languages</h4>
                    <div style="color: #64748b;">${skills.programmingLanguages.map(s => s.name).join(' • ')}</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #374151;">Backend Frameworks</h4>
                    <div style="color: #64748b;">${skills.frameworks.filter(f => ['FastAPI', 'Django', 'Laravel', 'Gin Fiber', 'Node.js'].includes(f.name)).map(s => s.name).join(' • ')}</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #374151;">Frontend Technologies</h4>
                    <div style="color: #64748b;">${skills.frameworks.filter(f => ['Nuxt.js 3', 'Vue.js'].includes(f.name)).map(s => s.name).join(' • ')} • ${skills.databases.filter(d => d.name === 'Tailwind CSS').map(s => s.name).join(' • ')}</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #374151;">Databases & Tools</h4>
                    <div style="color: #64748b;">${skills.databases.filter(d => d.name !== 'Tailwind CSS').map(s => s.name).join(' • ')}</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #374151;">AI & Machine Learning</h4>
                    <div style="color: #64748b;">LLM • RAG • Computer Vision • NLP</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: #374151;">Languages</h4>
                    <div style="color: #64748b;">${personal.contact.languages.join(' • ')}</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">
                Professional Experience
            </h3>
            ${experience.map(exp => `
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h4 style="font-weight: 600; color: #374151;">${exp.title}</h4>
                        <span style="color: #2563eb; font-weight: 500; font-size: 0.9rem;">${exp.startDate} - ${exp.endDate}</span>
                    </div>
                    <div style="color: #64748b; font-weight: 500; margin-bottom: 0.5rem;">${exp.company}${exp.location ? ', ' + exp.location : ''}</div>
                    <p style="color: #64748b; line-height: 1.6;">${exp.description}</p>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">
                Key Projects
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                ${projects.filter(p => p.featured).map(project => `
                    <div style="padding: 1rem; background: #f8fafc; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
                        <h4 style="font-weight: 600; color: #374151; margin-bottom: 0.5rem;">${project.title}</h4>
                        <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">${project.description}</p>
                        <div style="margin-top: 0.5rem; color: #2563eb; font-size: 0.8rem;">${project.technologies.join(' • ')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 1rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">
                Education & Certifications
            </h3>
            ${education.map(edu => `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h4 style="font-weight: 600; color: #374151;">${edu.degree}</h4>
                        <span style="color: #2563eb; font-weight: 500; font-size: 0.9rem;">${edu.startDate} - ${edu.endDate}</span>
                    </div>
                    <div style="color: #64748b;">${edu.institution}, ${edu.location}${edu.gpa ? ' • GPA: ' + edu.gpa + '/4.00' : ''}</div>
                </div>
            `).join('')}
            ${certifications.map(cert => `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h4 style="font-weight: 600; color: #374151;">${cert.name}</h4>
                        <span style="color: #2563eb; font-weight: 500; font-size: 0.9rem;">${cert.date}</span>
                    </div>
                    <div style="color: #64748b;">${cert.issuer}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    return container;
}

function createFallbackPDFContent() {
    const container = document.createElement('div');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #64748b;">
            <h1>Portfolio Data Loading...</h1>
            <p>Please ensure data.json is properly loaded and try again.</p>
        </div>
    `;
    return container;
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Add scroll-to-top functionality
    createScrollToTopButton();
}

function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: var(--shadow-large);
        transition: all var(--transition-base);
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
        transform: translateY(100px);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
            scrollBtn.style.transform = 'translateY(100px)';
        }
    });
    
    // Scroll to top functionality
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// ===== UTILITY FUNCTIONS FOR MANAGING PORTFOLIO DATA =====

/**
 * Add new skill to a specific category
 * @param {string} category - 'programmingLanguages', 'frameworks', or 'databases'
 * @param {Object} skill - {name: string, level: number}
 */
function addSkill(category, skill) {
    if (!portfolioData || !portfolioData.skills[category]) {
        console.error('Invalid category or portfolio data not loaded');
        return false;
    }
    
    portfolioData.skills[category].push(skill);
    renderSkills();
    showNotification(`Added ${skill.name} to ${category}`, 'success');
    return true;
}

/**
 * Add new experience entry
 * @param {Object} experience - Experience object with required fields
 */
function addExperience(experience) {
    if (!portfolioData) {
        console.error('Portfolio data not loaded');
        return false;
    }
    
    // Add to the beginning of the array (most recent first)
    portfolioData.experience.unshift(experience);
    renderExperience();
    showNotification(`Added experience: ${experience.title}`, 'success');
    return true;
}

/**
 * Add new project
 * @param {Object} project - Project object with required fields
 */
function addProject(project) {
    if (!portfolioData) {
        console.error('Portfolio data not loaded');
        return false;
    }
    
    portfolioData.projects.push(project);
    renderProjects();
    showNotification(`Added project: ${project.title}`, 'success');
    return true;
}

/**
 * Update personal information
 * @param {Object} updates - Object with fields to update
 */
function updatePersonalInfo(updates) {
    if (!portfolioData) {
        console.error('Portfolio data not loaded');
        return false;
    }
    
    // Deep merge updates into personal info
    portfolioData.personal = { ...portfolioData.personal, ...updates };
    if (updates.contact) {
        portfolioData.personal.contact = { ...portfolioData.personal.contact, ...updates.contact };
    }
    
    renderPersonalInfo();
    showNotification('Personal information updated', 'success');
    return true;
}

/**
 * Update statistics
 * @param {Object} stats - {projects: string, experience: string, gpa: string}
 */
function updateStatistics(stats) {
    if (!portfolioData) {
        console.error('Portfolio data not loaded');
        return false;
    }
    
    portfolioData.statistics = { ...portfolioData.statistics, ...stats };
    renderStatistics();
    animateCounters(); // Re-animate counters
    showNotification('Statistics updated', 'success');
    return true;
}

/**
 * Remove skill by name and category
 * @param {string} category - Skill category
 * @param {string} skillName - Name of skill to remove
 */
function removeSkill(category, skillName) {
    if (!portfolioData || !portfolioData.skills[category]) {
        console.error('Invalid category or portfolio data not loaded');
        return false;
    }
    
    const index = portfolioData.skills[category].findIndex(skill => skill.name === skillName);
    if (index > -1) {
        portfolioData.skills[category].splice(index, 1);
        renderSkills();
        showNotification(`Removed ${skillName} from ${category}`, 'success');
        return true;
    }
    
    showNotification(`Skill ${skillName} not found`, 'error');
    return false;
}

/**
 * Update fallback data with current portfolio data
 * Useful for syncing changes back to fallback
 */
function updateFallbackData() {
    if (!portfolioData) {
        showNotification('No portfolio data to update fallback', 'error');
        return false;
    }
    
    // Create updated fallback data string
    const fallbackString = `const fallbackData = ${JSON.stringify(portfolioData, null, 2)};`;
    
    // Copy to clipboard for easy pasting
    navigator.clipboard.writeText(fallbackString).then(() => {
        showNotification('Fallback data copied to clipboard! Paste it in script.js', 'success');
    }).catch(() => {
        showNotification('Please manually copy the fallback data from console', 'info');
        console.log('Updated fallback data:');
        console.log(fallbackString);
    });
    
    return true;
}

/**
 * Download current data as JSON file
 */
function downloadDataAsJSON() {
    if (!portfolioData) {
        showNotification('No portfolio data to download', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('data.json downloaded successfully', 'success');
}

// Alias for backward compatibility
const exportPortfolioData = downloadDataAsJSON;

/**
 * Create development info panel
 */
function createDevInfo() {
    const devInfo = document.createElement('div');
    devInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 0.75rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
        box-shadow: var(--shadow-medium);
        z-index: 9999;
        max-width: 250px;
    `;
    
    const isUsingFallback = !window.location.protocol.startsWith('http');
    const dataSource = isUsingFallback ? '📦 Fallback Data' : '📄 data.json';
    
    devInfo.innerHTML = `
        <div style="margin-bottom: 0.5rem;">
            <strong>Dev Mode:</strong> ${dataSource}
        </div>
        <div style="font-size: 0.7rem; color: var(--text-muted);">
            ${isUsingFallback ? 
                'Using embedded data. Start a web server to use data.json' :
                'Loading from external JSON file'
            }
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.7rem;">
            Press <code>Ctrl+Shift+A</code> for admin panel
        </div>
    `;
    
    document.body.appendChild(devInfo);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        devInfo.style.transition = 'opacity 0.5s ease-out';
        devInfo.style.opacity = '0';
        setTimeout(() => {
            if (devInfo.parentNode) {
                devInfo.parentNode.removeChild(devInfo);
            }
        }, 500);
    }, 5000);
}

/**
 * Load portfolio data from uploaded JSON file
 * @param {File} file - JSON file
 */
function importPortfolioData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            portfolioData = importedData;
            
            // Re-render all sections
            renderPersonalInfo();
            renderStatistics();
            renderSkills();
            renderExperience();
            renderProjects();
            updateSEO();
            
            showNotification('Portfolio data imported successfully', 'success');
        } catch (error) {
            console.error('Error parsing JSON:', error);
            showNotification('Error importing portfolio data', 'error');
        }
    };
    reader.readAsText(file);
}

// ===== ADMIN PANEL FUNCTIONS (For easy data management) =====

/**
 * Create admin panel for easy data management
 */
function createAdminPanel() {
    if (document.querySelector('.admin-panel')) return; // Already exists
    
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: 1rem;
        box-shadow: var(--shadow-large);
        z-index: 10000;
        max-width: 300px;
        transform: translateX(-320px);
        transition: transform var(--transition-base);
    `;
    
    adminPanel.innerHTML = `
        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: var(--text-primary);">Admin Panel</h3>
            <button class="admin-close" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <button class="admin-btn" onclick="downloadDataAsJSON()" style="display: block; width: 100%; margin-bottom: 0.5rem; padding: 0.5rem; background: var(--primary-color); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;">
                📄 Download data.json
            </button>
            <button class="admin-btn" onclick="updateFallbackData()" style="display: block; width: 100%; margin-bottom: 0.5rem; padding: 0.5rem; background: var(--success-color); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;">
                📦 Copy Fallback Data
            </button>
            <input type="file" id="importFile" accept=".json" style="display: none;">
            <button class="admin-btn" onclick="document.getElementById('importFile').click()" style="display: block; width: 100%; margin-bottom: 0.5rem; padding: 0.5rem; background: var(--secondary-color); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;">
                📁 Import JSON
            </button>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <h4 style="color: var(--text-primary); font-size: 0.9rem; margin-bottom: 0.5rem;">Quick Actions:</h4>
            <button onclick="addSkillPrompt()" style="display: block; width: 100%; margin-bottom: 0.25rem; padding: 0.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;">
                ➕ Add Skill
            </button>
            <button onclick="addExperiencePrompt()" style="display: block; width: 100%; margin-bottom: 0.25rem; padding: 0.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;">
                💼 Add Experience
            </button>
            <button onclick="addProjectPrompt()" style="display: block; width: 100%; margin-bottom: 0.25rem; padding: 0.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem;">
                🚀 Add Project
            </button>
        </div>
        
        <div style="margin-top: 1rem; padding-top: 0.5rem; border-top: 1px solid var(--border-color); font-size: 0.7rem; color: var(--text-muted);">
            <div>Data Source: ${window.location.protocol.startsWith('http') ? 'data.json' : 'Fallback'}</div>
            <div style="margin-top: 0.25rem;">Projects: ${portfolioData?.projects?.length || 0} | Skills: ${Object.values(portfolioData?.skills || {}).flat().length || 0}</div>
        </div>
    `;
    
    document.body.appendChild(adminPanel);
    
    // Setup event listeners
    document.getElementById('importFile').addEventListener('change', function(e) {
        if (e.target.files[0]) {
            importPortfolioData(e.target.files[0]);
        }
    });
    
    adminPanel.querySelector('.admin-close').addEventListener('click', function() {
        adminPanel.style.transform = 'translateX(-320px)';
    });
    
    // Show panel
    setTimeout(() => {
        adminPanel.style.transform = 'translateX(0)';
    }, 100);
}

/**
 * Prompt functions for quick adding
 */
function addSkillPrompt() {
    const category = prompt('Skill category (programmingLanguages/frameworks/databases):');
    const name = prompt('Skill name:');
    const level = parseInt(prompt('Skill level (1-100):'));
    
    if (category && name && level) {
        addSkill(category, { name, level });
    }
}

function addExperiencePrompt() {
    const title = prompt('Job title:');
    const company = prompt('Company name:');
    const startDate = prompt('Start date (e.g., Jan 2022):');
    const endDate = prompt('End date (e.g., Present):');
    const description = prompt('Job description:');
    
    if (title && company && startDate && endDate && description) {
        addExperience({
            title,
            company,
            location: '',
            startDate,
            endDate,
            description,
            current: endDate.toLowerCase() === 'present'
        });
    }
}

function addProjectPrompt() {
    const title = prompt('Project title:');
    const description = prompt('Project description:');
    const technologies = prompt('Technologies (comma-separated):').split(',').map(t => t.trim());
    const icon = prompt('Icon class (e.g., fas fa-code):');
    
    if (title && description && technologies.length) {
        addProject({
            title,
            icon: icon || 'fas fa-code',
            description,
            technologies,
            category: 'Development',
            featured: true
        });
    }
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== KEYBOARD SHORTCUTS FOR ADMIN =====
document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + A to open admin panel
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        createAdminPanel();
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical resources
function preloadResources() {
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', preloadResources);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service in production
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault(); // Prevent the default behavior (logging to console)
});

// Add resize listener for responsive adjustments
window.addEventListener('resize', debounce(function() {
    // Recalculate animations or layouts if needed
    console.log('Window resized');
}, 250));

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical resources
function preloadResources() {
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', preloadResources);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service in production
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault(); // Prevent the default behavior (logging to console)
});