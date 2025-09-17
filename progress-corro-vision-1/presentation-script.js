// presentation-script.js

class CorrosionPresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 8;
        this.slides = null;
        this.indicators = null;
        this.slideCounter = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.exportBtn = null;
        this.fullscreenBtn = null;
        this.loadingOverlay = null;
        this.isFullscreen = false;
        this.isTransitioning = false;
        this.performanceChart = null;
        this.navigationHideTimer = null;
        this.navigation = null;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }
    
    setupElements() {
        try {
            this.slides = document.querySelectorAll('.slide');
            this.indicators = document.querySelectorAll('.indicator');
            this.slideCounter = document.querySelector('.slide-counter');
            this.prevBtn = document.getElementById('prevBtn');
            this.nextBtn = document.getElementById('nextBtn');
            this.exportBtn = document.getElementById('exportBtn');
            this.fullscreenBtn = document.getElementById('fullscreenBtn');
            this.loadingOverlay = document.getElementById('loadingOverlay');
            this.navigation = document.querySelector('.navigation');
            
            if (!this.slides || this.slides.length === 0) {
                throw new Error('No slides found');
            }
            
            console.log('✅ All DOM elements found successfully');
            
            this.totalSlides = this.slides.length;
            this.initializeSlides();
            this.updateSlideCounter();
            this.updateNavigationButtons();
            this.updateIndicators();
            this.bindEvents();
            this.setupMediaModal();
            this.renderPerformanceChart();
            this.setupLogoUpload();
            this.setupFullscreenNavigation();
            
            console.log(`✅ Presentation initialized with ${this.totalSlides} slides`);
            
        } catch (error) {
            console.error('❌ Error setting up presentation:', error);
            this.showNotification('Error initializing presentation: ' + error.message, 'error');
        }
    }
    
    initializeSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            
            if (index === 0) {
                slide.classList.add('active');
            }
            
            console.log(`Slide ${index + 1} initialized:`, slide.classList.toString());
        });
    }
    
    bindEvents() {
        try {
            // Navigation buttons
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
            
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
            
            // Export and fullscreen
            this.exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportToPDF();
            });
            
            this.fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
            
            // Indicators
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index + 1);
                });
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
            
            // Touch events
            this.setupTouchEvents();
            
            // Fullscreen change events
            document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
            
            console.log('✅ Event listeners bound successfully');
            
        } catch (error) {
            console.error('❌ Error binding events:', error);
        }
    }
    
    setupMediaModal() {
        this.mediaModal = new MediaModal();
        
        // Handle clickable images
        const clickableImages = document.querySelectorAll('.clickable-image');
        clickableImages.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.getAttribute('data-title') || 'Image Viewer';
                if (img) {
                    this.mediaModal.openImage(img.src, title);
                } else {
                    console.error('❌ Image not found in clickable item');
                }
            });
        });
        
        // Handle clickable videos
        const clickableVideos = document.querySelectorAll('.clickable-video');
        clickableVideos.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const video = item.querySelector('video');
                const img = item.querySelector('img');
                const title = item.getAttribute('data-title') || 'Media Viewer';
                
                // Check if it's a video element
                if (video) {
                    const source = video.querySelector('source');
                    if (source && source.src) {
                        console.log(`🎥 Opening video modal with: ${source.src}`);
                        this.mediaModal.openVideo(source.src, title);
                    } else {
                        console.error('❌ Video source not found in clickable item');
                        console.log('Video element:', video);
                        console.log('Source element:', source);
                    }
                }
                // Check if it's an image element (for GIFs)
                else if (img && img.src) {
                    console.log(`🖼️ Opening image modal with GIF: ${img.src}`);
                    this.mediaModal.openImage(img.src, title);
                } else {
                    console.error('❌ No video or image source found in clickable item');
                    console.log('Video element:', video);
                    console.log('Image element:', img);
                }
            });
        });
        
        console.log('✅ Media modal setup completed');
    }
    
    renderPerformanceChart() {
        const canvas = document.getElementById('performanceRadarChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        this.performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['mIoU', 'Precision', 'Recall', 'F1-Score', 'Processing Speed', 'Memory Usage'],
                datasets: [
                    {
                        label: 'YOLOv8n-seg',
                        data: [17.7, 41.5, 24.3, 30.6, 95, 80],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.2)',
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#2563eb'
                    },
                    {
                        label: 'U-Net',
                        data: [43.7, 84.5, 84.9, 83.7, 65, 70],
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.2)',
                        pointBackgroundColor: '#059669',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#059669'
                    },
                    {
                        label: 'SegFormer',
                        data: [17.9, 64.6, 55.7, 58.0, 45, 85],
                        borderColor: '#d97706',
                        backgroundColor: 'rgba(217, 119, 6, 0.2)',
                        pointBackgroundColor: '#d97706',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#d97706'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Model Performance Comparison',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            stepSize: 20,
                            font: {
                                size: 12
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false
                }
            }
        });
        
        console.log('✅ Performance chart rendered');
    }
    
    setupLogoUpload() {
        const logoSlots = document.querySelectorAll('.logo-slot');
        
        logoSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                this.openLogoUpload(slot);
            });
            
            // Add drag and drop functionality
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleLogoFile(files[0], slot);
                }
            });
        });
    }
    
    openLogoUpload(slot) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleLogoFile(file, slot);
            }
        };
        input.click();
    }
    
    handleLogoFile(file, slot) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = slot.querySelector('.logo-image');
            const placeholder = slot.querySelector('.logo-placeholder');
            
            img.src = e.target.result;
            img.classList.add('loaded');
            slot.classList.add('has-image');
            
            img.onload = () => {
                placeholder.style.opacity = '0';
            };
        };
        reader.readAsDataURL(file);
    }

    previousSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            this.showNotification('Already at first slide', 'info');
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            this.showNotification('Already at last slide', 'info');
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        if (this.isTransitioning) return;
        if (slideNumber === this.currentSlide) return;
        
        try {
            this.isTransitioning = true;
            
            // Remove active class from all slides
            this.slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Add active class to target slide
            this.slides[slideNumber - 1].classList.add('active');
            this.currentSlide = slideNumber;
            
            this.updateSlideCounter();
            this.updateNavigationButtons();
            this.updateIndicators();
            
            setTimeout(() => {
                this.isTransitioning = false;
                console.log(`✅ Successfully moved to slide ${slideNumber}`);
                this.showNotification(`Slide ${slideNumber}`, 'success');
            }, 100);
            
        } catch (error) {
            console.error(`❌ Error going to slide ${slideNumber}:`, error);
            this.isTransitioning = false;
            this.showNotification('Error changing slide', 'error');
        }
    }
    
    updateSlideCounter() {
        if (this.slideCounter) {
            this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
        }
    }
    
    updateNavigationButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentSlide - 1) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Don't handle if media modal is open
        if (this.mediaModal && this.mediaModal.isOpen) {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'f':
            case 'F':
                if (e.ctrlKey || e.metaKey) return;
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'Escape':
                e.preventDefault();
                if (this.isFullscreen) {
                    this.exitFullscreen();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                e.preventDefault();
                const slideNum = parseInt(e.key);
                if (slideNum <= this.totalSlides) {
                    this.goToSlide(slideNum);
                }
                break;
        }
    }
    
    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX, startY, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
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
        } else {
            this.simulateFullscreen();
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
        } else {
            this.exitSimulatedFullscreen();
        }
    }
    
    simulateFullscreen() {
        document.body.classList.add('fullscreen-active');
        this.isFullscreen = true;
        this.updateFullscreenButton();
        this.showNotification('Fullscreen mode activated', 'info');
    }
    
    exitSimulatedFullscreen() {
        document.body.classList.remove('fullscreen-active');
        this.isFullscreen = false;
        this.updateFullscreenButton();
        this.showNotification('Fullscreen mode deactivated', 'info');
    }
    
    handleFullscreenChange() {
        const isCurrentlyFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        this.isFullscreen = isCurrentlyFullscreen;
        this.updateFullscreenButton();
        
        if (isCurrentlyFullscreen) {
            document.body.classList.add('fullscreen-active');
            this.showNotification('Fullscreen mode activated', 'success');
            // Hide navigation initially in fullscreen
            if (this.navigation) {
                this.navigation.classList.remove('show');
            }
        } else {
            document.body.classList.remove('fullscreen-active');
            this.showNotification('Fullscreen mode deactivated', 'info');
            // Show navigation when exiting fullscreen
            if (this.navigation) {
                this.navigation.classList.add('show');
            }
            // Clear any pending hide timer
            this.clearNavigationTimer();
        }
    }
    
    updateFullscreenButton() {
        if (this.fullscreenBtn) {
            const icon = this.fullscreenBtn.querySelector('i');
            if (icon) {
                if (this.isFullscreen) {
                    icon.className = 'fas fa-compress';
                    this.fullscreenBtn.title = 'Exit Fullscreen';
                } else {
                    icon.className = 'fas fa-expand';
                    this.fullscreenBtn.title = 'Enter Fullscreen';
                }
            }
        }
    }
    
    setupFullscreenNavigation() {
        // Mouse move event untuk mendeteksi posisi mouse
        document.addEventListener('mousemove', (e) => {
            if (this.isFullscreen) {
                // Jika mouse di area atas (80px dari top), tampilkan navigasi
                if (e.clientY <= 80) {
                    this.showNavigation();
                } else {
                    this.hideNavigationWithDelay();
                }
            }
        });
        
        // Mouse leave event untuk menyembunyikan navigasi ketika mouse keluar dari window
        document.addEventListener('mouseleave', () => {
            if (this.isFullscreen) {
                this.hideNavigationWithDelay();
            }
        });
        
        // Hover events untuk navigasi itu sendiri
        if (this.navigation) {
            this.navigation.addEventListener('mouseenter', () => {
                if (this.isFullscreen) {
                    this.clearNavigationTimer();
                    this.showNavigation();
                }
            });
            
            this.navigation.addEventListener('mouseleave', () => {
                if (this.isFullscreen) {
                    this.hideNavigationWithDelay();
                }
            });
        }
    }
    
    showNavigation() {
        if (this.navigation && this.isFullscreen) {
            this.clearNavigationTimer();
            this.navigation.classList.add('show');
        }
    }
    
    hideNavigationWithDelay() {
        if (this.isFullscreen) {
            this.clearNavigationTimer();
            this.navigationHideTimer = setTimeout(() => {
                if (this.navigation) {
                    this.navigation.classList.remove('show');
                }
            }, 2000); // Hide after 2 seconds
        }
    }
    
    clearNavigationTimer() {
        if (this.navigationHideTimer) {
            clearTimeout(this.navigationHideTimer);
            this.navigationHideTimer = null;
        }
    }
    
    async exportToPDF() {
        try {
            this.showLoading(true);
            this.showNotification('Preparing PDF export...', 'info');
            
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: 'Multi-Class_Corrosion_Segmentation_Research.pdf',
                image: { 
                    type: 'jpeg', 
                    quality: 0.95 
                },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: 1400,
                    height: 900
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'landscape',
                    compress: true
                },
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy']
                }
            };
            
            await this.prepareForPDFExport();
            
            const element = document.querySelector('.presentation-container');
            await html2pdf().set(opt).from(element).save();
            
            this.restoreFromPDFExport();
            
            this.showLoading(false);
            this.showNotification('PDF exported successfully!', 'success');
            
        } catch (error) {
            console.error('PDF export failed:', error);
            this.showLoading(false);
            this.showNotification('PDF export failed. Please try again.', 'error');
        }
    }
    
    async prepareForPDFExport() {
        // Hide navigation
        const navigation = document.querySelector('.navigation');
        if (navigation) {
            navigation.style.display = 'none';
        }
        
        // Hide media modal
        const mediaModal = document.querySelector('.media-modal');
        if (mediaModal) {
            mediaModal.style.display = 'none';
        }
        
        // Show all slides for PDF
        this.slides.forEach((slide, index) => {
            slide.classList.add('active');
            slide.style.position = 'relative';
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.transform = 'none';
            slide.style.marginBottom = '50px';
            slide.style.pageBreakAfter = index < this.slides.length - 1 ? 'always' : 'auto';
            slide.style.pageBreakInside = 'avoid';
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    restoreFromPDFExport() {
        // Restore navigation
        const navigation = document.querySelector('.navigation');
        if (navigation) {
            navigation.style.display = 'flex';
        }
        
        // Restore media modal
        const mediaModal = document.querySelector('.media-modal');
        if (mediaModal) {
            mediaModal.style.display = '';
        }
        
        // Restore slide visibility
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlide - 1) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
            
            slide.style.position = 'absolute';
            slide.style.opacity = '';
            slide.style.visibility = '';
            slide.style.transform = '';
            slide.style.marginBottom = '';
            slide.style.pageBreakAfter = '';
            slide.style.pageBreakInside = '';
        });
    }
    
    showLoading(show) {
        if (this.loadingOverlay) {
            if (show) {
                this.loadingOverlay.classList.add('show');
            } else {
                this.loadingOverlay.classList.remove('show');
            }
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb'};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10001;
            font-weight: 600;
            max-width: 350px;
            transform: translateX(370px);
            transition: transform 0.3s ease;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(370px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }
    
    // Utility methods
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            title: this.slides[this.currentSlide - 1].querySelector('.slide-title')?.textContent || 'Title Slide'
        };
    }
    
    debugInfo() {
        console.log('🔍 Presentation Debug Info:');
        console.log('Current slide:', this.currentSlide);
        console.log('Total slides:', this.totalSlides);
        console.log('Slides found:', this.slides ? this.slides.length : 'null');
        console.log('Is transitioning:', this.isTransitioning);
        console.log('Is fullscreen:', this.isFullscreen);
        
        this.slides.forEach((slide, index) => {
            console.log(`Slide ${index + 1}:`, {
                active: slide.classList.contains('active'),
                classes: slide.classList.toString()
            });
        });
    }
}

// Media Modal Class
class MediaModal {
    constructor() {
        this.modal = null;
        this.modalImage = null;
        this.modalVideo = null;
        this.modalTitle = null;
        this.zoomLevel = 1;
        this.maxZoom = 5;
        this.minZoom = 0.1;
        this.zoomStep = 0.2;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.mediaPosition = { x: 0, y: 0 };
        this.isOpen = false;
        this.currentMediaType = null;
        
        this.init();
    }
    
    init() {
        this.modal = document.getElementById('mediaModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalVideo = document.getElementById('modalVideo');
        this.modalTitle = document.getElementById('modalTitle');
        
        if (!this.modal || !this.modalImage || !this.modalVideo || !this.modalTitle) {
            console.error('❌ Modal elements not found');
            return;
        }
        
        this.bindEvents();
        console.log('✅ Media modal initialized');
    }
    
    bindEvents() {
        // Close modal events
        document.getElementById('closeModalBtn')?.addEventListener('click', () => this.close());
        document.getElementById('modalOverlay')?.addEventListener('click', () => this.close());
        
        // Zoom controls
        document.getElementById('zoomInBtn')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('resetZoomBtn')?.addEventListener('click', () => this.resetZoom());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
                case ' ':
                    if (this.currentMediaType === 'video') {
                        e.preventDefault();
                        this.toggleVideoPlayback();
                    }
                    break;
            }
        });
        
        // Mouse wheel zoom
        const mediaContainer = document.querySelector('.media-container');
        if (mediaContainer) {
            mediaContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.zoomIn();
                } else {
                    this.zoomOut();
                }
            });
        }
        
        // Drag functionality for images
        this.setupDragEvents();
    }
    
    setupDragEvents() {
        const mediaContainer = document.querySelector('.media-container');
        if (!mediaContainer) return;
        
        mediaContainer.addEventListener('mousedown', (e) => {
            if (this.zoomLevel > 1 && this.currentMediaType === 'image') {
                this.isDragging = true;
                this.dragStart = { x: e.clientX - this.mediaPosition.x, y: e.clientY - this.mediaPosition.y };
                this.modalImage.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.zoomLevel > 1) {
                this.mediaPosition.x = e.clientX - this.dragStart.x;
                this.mediaPosition.y = e.clientY - this.dragStart.y;
                this.updateMediaTransform();
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.modalImage.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
            }
        });
        
        // Touch events
        mediaContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1 && this.zoomLevel > 1 && this.currentMediaType === 'image') {
                this.isDragging = true;
                const touch = e.touches[0];
                this.dragStart = { x: touch.clientX - this.mediaPosition.x, y: touch.clientY - this.mediaPosition.y };
                e.preventDefault();
            }
        });
        
        mediaContainer.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1 && this.zoomLevel > 1) {
                const touch = e.touches[0];
                this.mediaPosition.x = touch.clientX - this.dragStart.x;
                this.mediaPosition.y = touch.clientY - this.dragStart.y;
                this.updateMediaTransform();
                e.preventDefault();
            }
        });
        
        mediaContainer.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }
    
    openImage(imageSrc, title = 'Image Viewer') {
        if (!this.modal || !this.modalImage || !this.modalTitle) {
            console.error('❌ Modal not properly initialized');
            return;
        }
        
        this.currentMediaType = 'image';
        this.modalImage.src = imageSrc;
        this.modalVideo.style.display = 'none';
        this.modalImage.style.display = 'block';
        this.modalTitle.textContent = title;
        this.modal.classList.add('show');
        this.isOpen = true;
        
        this.resetZoom();
        document.body.style.overflow = 'hidden';
        
        console.log(`🖼️ Image modal opened: ${title}`);
    }
    
    // Helper function to convert cloud storage sharing URLs to direct URLs
    convertCloudStorageUrl(url) {
        // Google Drive conversion - try multiple formats
        if (url.includes('drive.google.com/file/d/')) {
            const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (fileId) {
                // Warning for GitHub Pages deployment
                console.warn('⚠️ Google Drive videos may not work on GitHub Pages due to CORS and embedding restrictions');
                console.warn('💡 Recommended solutions:');
                console.warn('   1. Upload videos directly to your GitHub repository');
                console.warn('   2. Use YouTube (unlisted videos)');
                console.warn('   3. Use Vimeo or other video hosting services');
                console.warn('   4. Use GitHub LFS for large video files');
                
                // Try the embed format first (better for videos)
                return `https://drive.google.com/file/d/${fileId[1]}/preview`;
            }
        }
        
        // Dropbox conversion
        if (url.includes('dropbox.com')) {
            // Convert sharing URL to direct download URL
            if (url.includes('?dl=0')) {
                return url.replace('?dl=0', '?dl=1');
            } else if (url.includes('&dl=0')) {
                return url.replace('&dl=0', '&dl=1');
            } else if (!url.includes('dl=1')) {
                // Add dl=1 parameter if not present
                const separator = url.includes('?') ? '&' : '?';
                return url + separator + 'dl=1';
            }
        }
        
        return url; // Return original URL if not recognized cloud storage or already direct
    }

    openVideo(videoSrc, title = 'Video Player') {
        if (!this.modal || !this.modalVideo || !this.modalTitle) {
            console.error('❌ Modal not properly initialized');
            return;
        }
        
        // Convert cloud storage URL if needed
        const processedVideoSrc = this.convertCloudStorageUrl(videoSrc);
        console.log(`🎥 Attempting to open video: ${processedVideoSrc}`);
        
        this.currentMediaType = 'video';
        
        // Reset video element
        this.modalVideo.pause();
        this.modalVideo.currentTime = 0;
        
        // Remove previous event listeners to avoid duplicates
        this.modalVideo.removeEventListener('error', this.videoErrorHandler);
        this.modalVideo.removeEventListener('loadeddata', this.videoLoadedHandler);
        this.modalVideo.removeEventListener('canplay', this.videoCanPlayHandler);
        
        // Set video source properly
        const source = this.modalVideo.querySelector('source');
        if (source) {
            source.src = processedVideoSrc;
        }
        this.modalVideo.src = processedVideoSrc;
        
        // Show video, hide image
        this.modalImage.style.display = 'none';
        this.modalVideo.style.display = 'block';
        this.modalTitle.textContent = title;
        this.modal.classList.add('show');
        this.isOpen = true;
        
        this.resetZoom();
        document.body.style.overflow = 'hidden';
        
        // Define event handlers
        this.videoErrorHandler = (e) => {
            console.error('❌ Video loading error:', e);
            console.error('Video source:', processedVideoSrc);
            console.error('Error details:', this.modalVideo.error);
            
            // Specific error handling for different error codes
            let errorMessage = 'Video tidak dapat dimuat.';
            let suggestions = '';
            
            if (this.modalVideo.error) {
                switch (this.modalVideo.error.code) {
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMessage = 'Format video tidak didukung atau URL tidak dapat diakses.';
                        if (processedVideoSrc.includes('drive.google.com')) {
                            suggestions = `
                                <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px; color: #856404;">
                                    <strong>⚠️ Google Drive Issue:</strong><br>
                                    Google Drive videos tidak dapat diputar di GitHub Pages karena kebijakan CORS.<br><br>
                                    <strong>Solusi yang disarankan:</strong><br>
                                    • Upload video langsung ke repository GitHub<br>
                                    • Gunakan YouTube (video unlisted)<br>
                                    • Gunakan Vimeo atau layanan hosting video lainnya<br>
                                    • Gunakan GitHub LFS untuk file video besar
                                </div>
                            `;
                        }
                        break;
                    case MediaError.MEDIA_ERR_NETWORK:
                        errorMessage = 'Gagal memuat video karena masalah jaringan.';
                        break;
                    case MediaError.MEDIA_ERR_DECODE:
                        errorMessage = 'Video rusak atau format tidak dapat didecode.';
                        break;
                    case MediaError.MEDIA_ERR_ABORTED:
                        errorMessage = 'Pemuatan video dibatalkan.';
                        break;
                }
            }
            
            // Show user-friendly error message
            this.modalTitle.textContent = `${title} - Error Loading Video`;
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = 'color: #dc3545; text-align: center; padding: 20px; font-size: 16px; line-height: 1.5;';
            errorMsg.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i><br>
                <strong>${errorMessage}</strong><br>
                <small style="color: #666; word-break: break-all;">URL: ${processedVideoSrc}</small>
                ${suggestions}
            `;
            this.modalVideo.style.display = 'none';
            const mediaContainer = this.modalVideo.parentElement;
            
            // Remove existing error messages
            const existingError = mediaContainer.querySelector('.video-error-message');
            if (existingError) {
                existingError.remove();
            }
            
            errorMsg.className = 'video-error-message';
            mediaContainer.appendChild(errorMsg);
        };
        
        this.videoLoadedHandler = () => {
            console.log('✅ Video loaded successfully');
            // Remove any existing error messages
            const mediaContainer = this.modalVideo.parentElement;
            const existingError = mediaContainer.querySelector('.video-error-message');
            if (existingError) {
                existingError.remove();
            }
        };
        
        this.videoCanPlayHandler = () => {
            console.log('✅ Video can start playing');
        };
        
        // Add error handling
        this.modalVideo.addEventListener('error', this.videoErrorHandler);
        this.modalVideo.addEventListener('loadeddata', this.videoLoadedHandler);
        this.modalVideo.addEventListener('canplay', this.videoCanPlayHandler);
        
        // Force reload of video
        this.modalVideo.load();
        
        console.log(`🎥 Video modal opened: ${title}`);
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        this.isOpen = false;
        this.currentMediaType = null;
        this.resetZoom();
        document.body.style.overflow = '';
        
        // Complete video cleanup
        if (this.modalVideo) {
            this.modalVideo.pause();
            this.modalVideo.currentTime = 0;
            this.modalVideo.src = '';
            
            // Clear source element
            const source = this.modalVideo.querySelector('source');
            if (source) {
                source.src = '';
            }
            
            // Remove event listeners to prevent memory leaks
            this.modalVideo.removeEventListener('error', this.videoErrorHandler);
            this.modalVideo.removeEventListener('loadeddata', this.videoLoadedHandler);
            this.modalVideo.removeEventListener('canplay', this.videoCanPlayHandler);
            
            // Hide video element
            this.modalVideo.style.display = 'none';
        }
        
        // Clear image
        if (this.modalImage) {
            this.modalImage.src = '';
            this.modalImage.style.display = 'none';
        }
        
        // Remove any error messages
        const mediaContainer = this.modalVideo?.parentElement;
        if (mediaContainer) {
            const existingError = mediaContainer.querySelector('.video-error-message');
            if (existingError) {
                existingError.remove();
            }
        }
        
        console.log('🖼️ Modal closed and cleaned up');
    }
    
    zoomIn() {
        if (this.currentMediaType !== 'image') return;
        
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
            this.updateMediaTransform();
            this.updateZoomDisplay();
        }
    }
    
    zoomOut() {
        if (this.currentMediaType !== 'image') return;
        
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
            
            if (this.zoomLevel <= 1) {
                this.mediaPosition = { x: 0, y: 0 };
            }
            
            this.updateMediaTransform();
            this.updateZoomDisplay();
        }
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        this.mediaPosition = { x: 0, y: 0 };
        this.updateMediaTransform();
        this.updateZoomDisplay();
    }
    
    updateMediaTransform() {
        if (!this.modalImage || this.currentMediaType !== 'image') return;
        
        const transform = `scale(${this.zoomLevel}) translate(${this.mediaPosition.x / this.zoomLevel}px, ${this.mediaPosition.y / this.zoomLevel}px)`;
        this.modalImage.style.transform = transform;
        
        this.modalImage.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
    }
    
    updateZoomDisplay() {
        const zoomDisplay = document.getElementById('zoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }
    
    toggleVideoPlayback() {
        if (this.currentMediaType === 'video' && this.modalVideo) {
            if (this.modalVideo.paused) {
                this.modalVideo.play();
            } else {
                this.modalVideo.pause();
            }
        }
    }
}

// Media Manager for easy media handling
const MediaManager = {
    setImage: (slideNumber, elementSelector, src) => {
        const slide = document.getElementById(`slide${slideNumber}`);
        if (slide) {
            const element = slide.querySelector(elementSelector);
            if (element) {
                element.addEventListener('click', () => {
                    if (window.presentation && window.presentation.mediaModal) {
                        window.presentation.mediaModal.openImage(src, `Slide ${slideNumber} Image`);
                    }
                });
                return true;
            }
        }
        return false;
    },
    
    setVideo: (slideNumber, elementSelector, src) => {
        const slide = document.getElementById(`slide${slideNumber}`);
        if (slide) {
            const element = slide.querySelector(elementSelector);
            if (element) {
                element.addEventListener('click', () => {
                    if (window.presentation && window.presentation.mediaModal) {
                        window.presentation.mediaModal.openVideo(src, `Slide ${slideNumber} Video`);
                    }
                });
                return true;
            }
        }
        return false;
    },
    
    // Bulk media setup
    setupSlideMedia: (slideNumber, mediaConfig) => {
        let successCount = 0;
        let totalCount = 0;
        
        Object.keys(mediaConfig).forEach(selector => {
            totalCount++;
            const config = mediaConfig[selector];
            
            if (config.type === 'image') {
                if (MediaManager.setImage(slideNumber, selector, config.src)) {
                    successCount++;
                }
            } else if (config.type === 'video') {
                if (MediaManager.setVideo(slideNumber, selector, config.src)) {
                    successCount++;
                }
            }
        });
        
        console.log(`✅ Media setup for slide ${slideNumber}: ${successCount}/${totalCount} successful`);
        return { successCount, totalCount };
    }
};

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Multi-Class Corrosion Segmentation Presentation...');
    
    window.presentation = new CorrosionPresentationController();
    window.MediaManager = MediaManager;
    
    // Example of how to set up media (commented out since we're using direct HTML src attributes)
    /*
    setTimeout(() => {
        // Example image setup
        MediaManager.setupSlideMedia(3, {
            '.dataset-preview': {
                type: 'image',
                src: 'assets/dataset-samples.jpg'
            }
        });
        
        // Setup media for slide 6 - YOLOv8n-seg, U-Net, and SegFormer results
        // Note: This is now handled directly in HTML with src attributes
        MediaManager.setupSlideMedia(6, {
            // YOLOv8n-seg Results
            '.result-showcase:nth-child(1) .showcase-item:nth-child(1)': {
                type: 'image',
                src: 'assets/yolov8n-seg-results.jpg'
            },
            '.result-showcase:nth-child(1) .showcase-item:nth-child(2)': {
                type: 'video',
                src: 'assets/video/yolov8/result_video_1_yolov8n.mp4'
            },
            '.result-showcase:nth-child(1) .showcase-item:nth-child(3)': {
                type: 'video',
                src: 'assets/video/yolov8/result_video_2_yolov8n.mp4'
            },
            '.result-showcase:nth-child(1) .showcase-item:nth-child(4)': {
                type: 'video',
                src: 'assets/video/yolov8/result_video_3_yolov8n.mp4'
            },
            '.result-showcase:nth-child(1) .showcase-item:nth-child(5)': {
                type: 'video',
                src: 'assets/video/yolov8/result_video_4_yolov8n.mp4'
            },
            
            // U-Net Results
            '.result-showcase:nth-child(2) .showcase-item:nth-child(1)': {
                type: 'image',
                src: 'assets/unet-results.jpg'
            },
            '.result-showcase:nth-child(2) .showcase-item:nth-child(2)': {
                type: 'video',
                src: 'assets/video/unet/result_video_1_unet_33.mp4'
            },
            '.result-showcase:nth-child(2) .showcase-item:nth-child(3)': {
                type: 'video',
                src: 'assets/video/unet/result_video_2_unet_33.mp4'
            },
            '.result-showcase:nth-child(2) .showcase-item:nth-child(4)': {
                type: 'video',
                src: 'assets/video/unet/result_video_3_unet_33.mp4'
            },
            '.result-showcase:nth-child(2) .showcase-item:nth-child(5)': {
                type: 'video',
                src: 'assets/video/unet/result_video_4_unet_33.mp4'
            },
            
            // SegFormer Results
            '.result-showcase:nth-child(3) .showcase-item:nth-child(1)': {
                type: 'image',
                src: 'assets/segformer-results.jpg'
            },
            '.result-showcase:nth-child(3) .showcase-item:nth-child(2)': {
                type: 'video',
                src: 'assets/video/segformer/result_video_1_segformer_16.mp4'
            },
            '.result-showcase:nth-child(3) .showcase-item:nth-child(3)': {
                type: 'video',
                src: 'assets/video/segformer/result_video_2_segformer_16.mp4'
            },
            '.result-showcase:nth-child(3) .showcase-item:nth-child(4)': {
                type: 'video',
                src: 'assets/video/segformer/result_video_3_segformer_16.mp4'
            },
            '.result-showcase:nth-child(3) .showcase-item:nth-child(5)': {
                type: 'video',
                src: 'assets/video/segformer/result_video_4_segformer_16.mp4'
            }
        });
    }, 1000);
    */
    
    // Log usage instructions
    setTimeout(() => {
        console.log(`
📋 Multi-Class Corrosion Segmentation Presentation Ready!

🎮 Navigation Controls:
   ⌨️  Arrow Keys / Space: Navigate slides
   🔢 Number Keys (1-8): Jump directly to slide
   🏠 Home/End: First/Last slide  
   🖱️  Mouse: Click navigation buttons or indicators
   📱 Touch: Swipe left/right on mobile
   🖥️ F key: Toggle fullscreen
   ⎋  Escape: Exit fullscreen / Close modal

🖼️  Media Modal Controls:
   🖱️  Click any media element to open modal
   🔍 Mouse wheel: Zoom in/out (images only)
   ➕ + key: Zoom in
   ➖ - key: Zoom out
   0️⃣  0 key: Reset zoom
   🖱️  Drag: Pan when zoomed (images only)
   ⎋  Escape: Close modal
   ⏯️  Space: Toggle video playback

🖼️  Media Management:
   
   Single media setup:
   MediaManager.setImage(slideNumber, '.selector', 'path/to/image.jpg')
   MediaManager.setVideo(slideNumber, '.selector', 'path/to/video.mp4')
   
   Bulk media setup:
   MediaManager.setupSlideMedia(slideNumber, {
     '.selector1': { type: 'image', src: 'path/to/image.jpg' },
     '.selector2': { type: 'video', src: 'path/to/video.mp4' }
   });

📊 Chart Features:
   - Interactive radar chart comparing model performance
   - Hover for detailed metrics
   - Legend toggle functionality

📄 Export PDF: Click the red "Export PDF" button

🎯 Quick Navigation:
   Press 1-8 to jump directly to any slide!

🔧 Debugging:
   presentation.debugInfo() - Show debug information
   presentation.getCurrentSlideInfo() - Get current slide info

📱 Mobile Optimized:
   - Touch-friendly navigation
   - Responsive design
   - Swipe gestures supported
        `);
    }, 1000);
});

// Export for global access
window.CorrosionPresentationController = CorrosionPresentationController;
window.MediaModal = MediaModal;