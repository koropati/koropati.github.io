// Modal functionality for image and code preview
class ModalController {
    constructor() {
        this.modal = null;
        this.modalTitle = null;
        this.modalBody = null;
        this.closeBtn = null;
        this.copyBtn = null;
        this.currentContent = null;
        this.currentType = null;
        
        this.init();
    }
    
    init() {
        // Get modal elements
        this.modal = document.getElementById('previewModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.closeBtn = document.getElementById('closeModal');
        this.copyBtn = document.getElementById('copyModalContent');
        
        if (!this.modal) {
            console.error('Modal elements not found');
            return;
        }
        
        // Bind events
        this.bindEvents();
        
        // Initialize clickable elements
        this.initializeClickableElements();
        
        console.log('Modal controller initialized');
    }
    
    bindEvents() {
        // Close modal events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Copy content event
        this.copyBtn.addEventListener('click', () => this.copyContent());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });
    }
    
    initializeClickableElements() {
        // Add click handlers to all image containers
        const imageContainers = document.querySelectorAll('.image-container');
        imageContainers.forEach(container => {
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openImageModal(container);
            });
        });
        
        // Add click handlers to all code blocks
        const codeBlocks = document.querySelectorAll('pre[class*="language-"], .code-container, code.arduino-code');
        codeBlocks.forEach(block => {
            block.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openCodeModal(block);
            });
        });
        
        // Add click handlers to inline code elements
        const inlineCodes = document.querySelectorAll('code:not(.arduino-code):not([class*="language-"])');
        inlineCodes.forEach(code => {
            // Only add click handler if it's not inside a pre tag
            if (!code.closest('pre')) {
                code.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openCodeModal(code);
                });
                code.style.cursor = 'pointer';
            }
        });
        
        // Add click handlers to mermaid diagrams
        const mermaidDiagrams = document.querySelectorAll('.mermaid');
        mermaidDiagrams.forEach(diagram => {
            diagram.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openDiagramModal(diagram);
            });
            diagram.style.cursor = 'pointer';
            diagram.title = 'Klik untuk memperbesar diagram';
        });
    }
    
    openImageModal(container) {
        const img = container.querySelector('img');
        const placeholder = container.querySelector('.placeholder-content');
        
        let title = 'Preview Gambar';
        let content = '';
        
        if (img) {
            // Real image
            title = img.alt || 'Preview Gambar';
            content = `<img src="${img.src}" alt="${img.alt || ''}" style="max-width: 100%; height: auto;">`;
        } else if (placeholder) {
            // Placeholder content
            const titleEl = placeholder.querySelector('.placeholder-title');
            const subtitleEl = placeholder.querySelector('.placeholder-subtitle');
            
            title = titleEl ? titleEl.textContent : 'Preview Placeholder';
            content = `
                <div class="text-center p-8">
                    <div class="text-6xl mb-4">🖼️</div>
                    <h3 class="text-xl font-bold mb-2">${title}</h3>
                    ${subtitleEl ? `<p class="text-gray-600">${subtitleEl.textContent}</p>` : ''}
                    <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p class="text-sm text-yellow-800">
                            <strong>Catatan:</strong> Ini adalah placeholder untuk gambar yang akan ditambahkan nanti.
                        </p>
                    </div>
                </div>
            `;
        }
        
        this.showModal(title, content, 'image');
    }
    
    openCodeModal(element) {
        let title = 'Preview Kode';
        let content = '';
        
        // Determine the type of code element
        if (element.tagName === 'PRE') {
            // Code block
            const code = element.querySelector('code') || element;
            const language = this.getLanguageFromClass(code.className);
            title = `Kode ${language}`;
            content = `<pre><code class="${code.className}">${code.innerHTML}</code></pre>`;
        } else if (element.tagName === 'CODE') {
            // Inline code or code block
            if (element.classList.contains('arduino-code')) {
                title = 'Kode Arduino';
            } else {
                title = 'Kode';
            }
            
            if (element.textContent.includes('\n')) {
                // Multi-line code
                content = `<pre><code>${element.textContent}</code></pre>`;
            } else {
                // Inline code
                content = `<div class="bg-gray-100 p-4 rounded-lg"><code class="text-lg">${element.textContent}</code></div>`;
            }
        } else {
            // Other elements with code
            title = 'Konten Kode';
            content = element.innerHTML;
        }
        
        this.showModal(title, content, 'code');
    }
    
    getLanguageFromClass(className) {
        if (className.includes('language-c')) return 'C/C++';
        if (className.includes('language-cpp')) return 'C++';
        if (className.includes('language-arduino')) return 'Arduino';
        if (className.includes('language-javascript')) return 'JavaScript';
        if (className.includes('language-html')) return 'HTML';
        if (className.includes('language-css')) return 'CSS';
        if (className.includes('language-json')) return 'JSON';
        return 'Code';
    }
    
    openDiagramModal(diagramElement) {
        const diagramContainer = diagramElement.closest('.mermaid-container') || diagramElement.closest('.slide');
        let title = 'Diagram';
        
        // Get title from slide heading
        const slideHeading = diagramContainer.querySelector('h2, h3, .slide-title');
        if (slideHeading) {
            title = slideHeading.textContent.trim();
        }
        
        // Clone the diagram for modal display
        const diagramClone = diagramElement.cloneNode(true);
        diagramClone.style.maxWidth = '100%';
        diagramClone.style.height = 'auto';
        diagramClone.style.transform = 'scale(1.2)';
        diagramClone.style.transformOrigin = 'center';
        
        const modalContent = `
            <div class="diagram-modal-content" style="text-align: center; padding: 20px;">
                ${diagramClone.outerHTML}
            </div>
        `;
        
        this.showModal(title, modalContent, 'diagram');
    }

    showModal(title, content, type) {
        this.modalTitle.textContent = title;
        this.modalBody.innerHTML = content;
        this.currentContent = content;
        this.currentType = type;
        
        // Show modal with animation
        this.modal.classList.remove('hidden');
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
        
        // Re-initialize Prism.js for syntax highlighting if it's code
        if (type === 'code' && window.Prism) {
            window.Prism.highlightAllUnder(this.modalBody);
        }
        
        // Re-initialize mermaid for diagram type
        if (type === 'diagram' && window.mermaid) {
            setTimeout(() => {
                window.mermaid.init(undefined, this.modalBody.querySelectorAll('.mermaid'));
            }, 100);
        }
        
        // Update copy button visibility
        this.copyBtn.style.display = type === 'code' ? 'flex' : 'none';
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.classList.add('hidden');
            this.modalBody.innerHTML = '';
            this.currentContent = null;
            this.currentType = null;
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    isModalOpen() {
        return this.modal && !this.modal.classList.contains('hidden');
    }
    
    copyContent() {
        if (!this.currentContent || this.currentType !== 'code') return;
        
        // Extract text content from HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.currentContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        navigator.clipboard.writeText(textContent).then(() => {
            this.showCopyNotification('Kode berhasil disalin!');
        }).catch(err => {
            console.error('Failed to copy code: ', err);
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopyNotification('Kode berhasil disalin!');
        });
    }
    
    showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
}

// Global utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success notification
        showCopyNotification('URL berhasil disalin!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyNotification('URL berhasil disalin!');
    });
}

function showCopyNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// IoT RFID Presentation JavaScript
// Interactive presentation with navigation, fullscreen, and PDF export

class PresentationController {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.slides = [];
        this.isFullscreen = false;
        this.isExporting = false;
        
        this.init();
    }
    
    init() {
        // Get all slides
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        
        // Initialize UI
        this.updateSlideCounter();
        this.updateProgressBar();
        
        // Bind events
        this.bindEvents();
        
        // Show first slide
        this.showSlide(0);
        
        console.log(`Presentation initialized with ${this.totalSlides} slides`);
    }
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportToPDF());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch/swipe support for mobile
        this.bindTouchEvents();
        
        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
        
        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }
    
    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const presentation = document.getElementById('presentation');
        
        presentation.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        presentation.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Minimum swipe distance
            const minSwipeDistance = 50;
            
            // Horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide(); // Swipe right = previous
                } else {
                    this.nextSlide(); // Swipe left = next
                }
            }
        }, { passive: true });
    }
    
    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
                
            case 'ArrowRight':
            case 'ArrowDown':
            case 'PageDown':
            case ' ': // Spacebar
                e.preventDefault();
                this.nextSlide();
                break;
                
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
                
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
                
            case 'f':
            case 'F11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
                
            case 'Escape':
                if (this.isFullscreen) {
                    this.exitFullscreen();
                }
                break;
                
            case 'p':
                e.preventDefault();
                this.exportToPDF();
                break;
                
            // Number keys for direct slide navigation
            case '1': case '2': case '3': case '4': case '5':
            case '6': case '7': case '8': case '9':
                e.preventDefault();
                const slideNum = parseInt(e.key) - 1;
                if (slideNum < this.totalSlides) {
                    this.goToSlide(slideNum);
                }
                break;
        }
    }
    
    showSlide(index) {
        // Validate index
        if (index < 0 || index >= this.totalSlides) return;
        
        // Remove active class from all slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (i < index) {
                slide.classList.add('prev');
            } else if (i > index) {
                slide.classList.add('next');
            }
        });
        
        // Add active class to current slide
        this.slides[index].classList.add('active');
        
        // Update current slide index
        this.currentSlide = index;
        
        // Update UI
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Trigger slide change event
        this.onSlideChange(index);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    updateSlideCounter() {
        document.getElementById('currentSlide').textContent = this.currentSlide + 1;
        document.getElementById('totalSlides').textContent = this.totalSlides;
    }
    
    updateProgressBar() {
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Disable/enable buttons based on current slide
        prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = this.currentSlide === this.totalSlides - 1 ? '0.5' : '1';
        
        prevBtn.style.cursor = this.currentSlide === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.cursor = this.currentSlide === this.totalSlides - 1 ? 'not-allowed' : 'pointer';
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    enterFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    handleFullscreenChange() {
        this.isFullscreen = !!(document.fullscreenElement || 
                              document.webkitFullscreenElement || 
                              document.mozFullScreenElement || 
                              document.msFullscreenElement);
        
        // Update fullscreen button icon
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const icon = fullscreenBtn.querySelector('i');
        
        if (this.isFullscreen) {
            icon.setAttribute('data-feather', 'minimize');
            document.body.classList.add('fullscreen');
        } else {
            icon.setAttribute('data-feather', 'maximize');
            document.body.classList.remove('fullscreen');
        }
        
        // Re-render feather icons
        feather.replace();
    }
    
    handleResize() {
        // Handle responsive adjustments if needed
        console.log('Window resized');
    }
    
    async exportToPDF() {
        if (this.isExporting) return;
        
        this.isExporting = true;
        const exportBtn = document.getElementById('exportBtn');
        const originalIcon = exportBtn.innerHTML;
        
        // Show loading state
        exportBtn.innerHTML = '<div class="loading"></div>';
        exportBtn.disabled = true;
        
        try {
            // Create PDF using jsPDF and html2canvas
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            // Hide navigation elements
            const navigation = document.getElementById('navigation');
            const slideCounter = document.getElementById('slideCounter');
            const progressBar = document.getElementById('progressBar');
            
            navigation.style.display = 'none';
            slideCounter.style.display = 'none';
            progressBar.style.display = 'none';
            
            // Export each slide
            for (let i = 0; i < this.totalSlides; i++) {
                // Show current slide
                this.showSlide(i);
                
                // Wait for slide transition
                await this.sleep(500);
                
                // Capture slide as canvas
                const slide = this.slides[i];
                const canvas = await html2canvas(slide, {
                    width: 1920,
                    height: 1080,
                    scale: 1,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });
                
                // Add page to PDF (except for first slide)
                if (i > 0) {
                    pdf.addPage();
                }
                
                // Add canvas to PDF
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210); // A4 landscape dimensions
                
                // Update progress (optional: show progress to user)
                console.log(`Exported slide ${i + 1}/${this.totalSlides}`);
            }
            
            // Restore navigation elements
            navigation.style.display = 'flex';
            slideCounter.style.display = 'block';
            progressBar.style.display = 'block';
            
            // Save PDF
            const fileName = `IoT-RFID-Presentation-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            // Show success message
            this.showNotification('PDF berhasil diekspor!', 'success');
            
        } catch (error) {
            console.error('Error exporting PDF:', error);
            this.showNotification('Gagal mengekspor PDF. Silakan coba lagi.', 'error');
        } finally {
            // Restore button state
            exportBtn.innerHTML = originalIcon;
            exportBtn.disabled = false;
            this.isExporting = false;
            
            // Re-render feather icons
            feather.replace();
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        }`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100px)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    onSlideChange(index) {
        // Custom logic for specific slides
        const slide = this.slides[index];
        
        // Add fade-in animation to slide content
        const slideContent = slide.children[0];
        if (slideContent) {
            slideContent.classList.add('fade-in');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                slideContent.classList.remove('fade-in');
            }, 500);
        }
        
        // Log slide change for analytics (if needed)
        console.log(`Slide changed to: ${index + 1}`);
        
        // Update document title with current slide
        const slideTitle = slide.querySelector('h1');
        if (slideTitle) {
            document.title = `${slideTitle.textContent} - IoT RFID Presentation`;
        }
    }
    
    // Utility methods
    getCurrentSlideIndex() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    isFirstSlide() {
        return this.currentSlide === 0;
    }
    
    isLastSlide() {
        return this.currentSlide === this.totalSlides - 1;
    }
}

// Auto-play functionality (optional)
class AutoPlay {
    constructor(presentation, interval = 30000) { // 30 seconds default
        this.presentation = presentation;
        this.interval = interval;
        this.timer = null;
        this.isPlaying = false;
    }
    
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.timer = setInterval(() => {
            if (this.presentation.isLastSlide()) {
                this.stop(); // Stop at last slide
            } else {
                this.presentation.nextSlide();
            }
        }, this.interval);
        
        console.log('Auto-play started');
    }
    
    stop() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        console.log('Auto-play stopped');
    }
    
    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Presentation Analytics (optional)
class PresentationAnalytics {
    constructor() {
        this.startTime = Date.now();
        this.slideViews = {};
        this.slideTimeSpent = {};
        this.currentSlideStartTime = Date.now();
    }
    
    trackSlideView(slideIndex) {
        // Track slide views
        this.slideViews[slideIndex] = (this.slideViews[slideIndex] || 0) + 1;
        
        // Track time spent on previous slide
        if (this.currentSlideIndex !== undefined) {
            const timeSpent = Date.now() - this.currentSlideStartTime;
            this.slideTimeSpent[this.currentSlideIndex] = 
                (this.slideTimeSpent[this.currentSlideIndex] || 0) + timeSpent;
        }
        
        this.currentSlideIndex = slideIndex;
        this.currentSlideStartTime = Date.now();
    }
    
    getAnalytics() {
        const totalTime = Date.now() - this.startTime;
        
        return {
            totalTime,
            slideViews: this.slideViews,
            slideTimeSpent: this.slideTimeSpent,
            averageTimePerSlide: totalTime / Object.keys(this.slideViews).length
        };
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Initialize Mermaid
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            }
        });
        console.log('Mermaid initialized');
    }
    
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
        console.log('Feather icons initialized');
    }
    
    // Initialize main presentation controller
    window.presentation = new PresentationController();
    
    // Initialize modal controller
    window.modalController = new ModalController();
    
    // Initialize optional features
    window.autoPlay = new AutoPlay(window.presentation);
    window.analytics = new PresentationAnalytics();
    
    // Track slide changes for analytics
    const originalShowSlide = window.presentation.showSlide;
    window.presentation.showSlide = function(index) {
        originalShowSlide.call(this, index);
        window.analytics.trackSlideView(index);
    };
    
    // Initialize copy buttons for code snippets
    initializeCopyButtons();
    
    // Add custom event listeners
    document.addEventListener('slideChanged', (e) => {
        console.log(`Slide changed to: ${e.detail.slideIndex}`);
        
        // Re-initialize modal elements for new slide
        if (window.modalController) {
            window.modalController.initializeClickableElements();
        }
        
        // Re-initialize Prism.js for syntax highlighting
        if (window.Prism) {
            window.Prism.highlightAll();
        }
        
        // Re-initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });
    
    // Add keyboard shortcut help
    console.log(`
    🎯 Keyboard Shortcuts:
    ← ↑ PageUp: Previous slide
    → ↓ PageDown Space: Next slide
    Home: First slide
    End: Last slide
    F/F11: Toggle fullscreen
    P: Export to PDF
    Esc: Exit fullscreen
    1-9: Go to slide number
    `);
    
    // Add swipe gesture help for mobile
    if ('ontouchstart' in window) {
        console.log('📱 Touch gestures enabled: Swipe left/right to navigate');
    }
    
    console.log('Presentation fully initialized');
});

// Function to initialize copy buttons for all code snippets
function initializeCopyButtons() {
    // Find all code blocks with bg-gray-900 class (dark code containers)
    const codeContainers = document.querySelectorAll('.bg-gray-900');
    
    codeContainers.forEach((container, index) => {
        // Add code-container class for styling
        container.classList.add('code-container');
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
        `;
        
        // Add click event listener
        copyButton.addEventListener('click', () => {
            copyCodeToClipboard(container, copyButton);
        });
        
        // Append button to container
        container.appendChild(copyButton);
    });
}

// Function to copy code content to clipboard
async function copyCodeToClipboard(container, button) {
    try {
        // Find the code element within the container
        const codeElement = container.querySelector('pre code') || container.querySelector('code');
        
        if (!codeElement) {
            console.warn('No code element found in container');
            return;
        }
        
        // Get the text content of the code
        const codeText = codeElement.textContent || codeElement.innerText;
        
        // Use the modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(codeText);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = codeText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        
        // Update button appearance
        const originalContent = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            <span>Copied!</span>
        `;
        
        // Show notification
        showCopyNotification('Code berhasil disalin ke clipboard!');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalContent;
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy code: ', err);
        showCopyNotification('Gagal menyalin code. Silakan coba lagi.', 'error');
    }
}

// Export for external use
window.PresentationController = PresentationController;
window.AutoPlay = AutoPlay;
window.PresentationAnalytics = PresentationAnalytics;
window.ModalController = ModalController;