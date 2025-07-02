// script.js

class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 5;
        this.slides = null;
        this.slideCounter = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.exportBtn = null;
        this.fullscreenBtn = null;
        this.loadingOverlay = null;
        this.isFullscreen = false;
        this.isTransitioning = false;
        
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
            this.slideCounter = document.querySelector('.slide-counter');
            this.prevBtn = document.getElementById('prevBtn');
            this.nextBtn = document.getElementById('nextBtn');
            this.exportBtn = document.getElementById('exportBtn');
            this.fullscreenBtn = document.getElementById('fullscreenBtn');
            this.loadingOverlay = document.getElementById('loadingOverlay');
            
            if (!this.slides || this.slides.length === 0) {
                throw new Error('No slides found');
            }
            if (!this.slideCounter) {
                throw new Error('Slide counter not found');
            }
            if (!this.prevBtn || !this.nextBtn) {
                throw new Error('Navigation buttons not found');
            }
            if (!this.exportBtn) {
                throw new Error('Export button not found');
            }
            if (!this.fullscreenBtn) {
                throw new Error('Fullscreen button not found');
            }
            
            console.log('✅ All DOM elements found successfully');
            
            this.totalSlides = this.slides.length;
            this.initializeSlides();
            this.updateSlideCounter();
            this.updateNavigationButtons();
            this.bindEvents();
            this.checkImages();
            this.setupImageHandling();
            this.setupImageModal();
            this.setupTitleSlideEnhancements();
            
            console.log(`✅ Presentation initialized with ${this.totalSlides} slides`);
            
        } catch (error) {
            console.error('❌ Error setting up presentation:', error);
            this.showNotification('Error initializing presentation: ' + error.message, 'error');
        }
    }
    
    setupTitleSlideEnhancements() {
        const titleSlide = document.getElementById('slide1');
        if (!titleSlide) return;
        
        const mainTitle = titleSlide.querySelector('.main-title');
        if (mainTitle && !mainTitle.querySelector('.gradient-text')) {
            const text = mainTitle.textContent;
            mainTitle.innerHTML = `<span class="gradient-text">${text}</span>`;
        }
        
        const infoCards = titleSlide.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('focus', () => {
                card.style.outline = '2px solid #4f46e5';
                card.style.outlineOffset = '2px';
            });
            card.addEventListener('blur', () => {
                card.style.outline = 'none';
            });
        });
        
        const logo = titleSlide.querySelector('.logo-placeholder');
        if (logo) {
            logo.addEventListener('click', () => {
                this.showNotification('🎓 Universitas Pendidikan Ganesha', 'info');
            });
            logo.style.cursor = 'pointer';
            logo.setAttribute('title', 'Click for university info');
        }
    }
    
    initializeSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'slide-enter', 'slide-enter-active', 'slide-exit', 'slide-exit-active');
            
            if (index === 0) {
                slide.classList.add('active');
            }
            
            console.log(`Slide ${index + 1} initialized:`, slide.classList.toString());
        });
    }
    
    bindEvents() {
        try {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.previousSlide();
            });
            
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                this.nextSlide();
            });
            
            this.exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Export button clicked');
                this.exportToPDF();
            });
            
            this.fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Fullscreen button clicked');
                this.toggleFullscreen();
            });
            
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
            this.setupTouchEvents();
            
            document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
            document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
            
            console.log('✅ Event listeners bound successfully');
            
        } catch (error) {
            console.error('❌ Error binding events:', error);
        }
    }
    
    // Image Modal Setup
    setupImageModal() {
        this.imageModal = new ImageModal();
        
        // Add click handlers to all clickable images
        const clickableImages = document.querySelectorAll('.clickable-image');
        clickableImages.forEach(container => {
            container.addEventListener('click', () => {
                const img = container.querySelector('img');
                const title = container.getAttribute('data-title') || 'Image Viewer';
                
                if (img && img.src && img.src !== '' && img.src !== window.location.href) {
                    this.imageModal.open(img.src, title);
                } else {
                    this.showNotification('Image not available', 'warning');
                }
            });
        });
        
        console.log('✅ Image modal setup completed');
    }
    
    previousSlide() {
        if (this.isTransitioning) {
            console.log('Transition in progress, ignoring click');
            return;
        }
        
        console.log(`Previous slide called. Current: ${this.currentSlide}`);
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        } else {
            console.log('Already at first slide');
            this.showNotification('Already at first slide', 'info');
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) {
            console.log('Transition in progress, ignoring click');
            return;
        }
        
        console.log(`Next slide called. Current: ${this.currentSlide}`);
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            console.log('Already at last slide');
            this.showNotification('Already at last slide', 'info');
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.log(`Invalid slide number: ${slideNumber}`);
            return;
        }
        
        if (this.isTransitioning) {
            console.log('Already transitioning, please wait');
            return;
        }
        
        if (slideNumber === this.currentSlide) {
            console.log(`Already on slide ${slideNumber}`);
            return;
        }
        
        console.log(`Going to slide ${slideNumber} from ${this.currentSlide}`);
        
        try {
            this.isTransitioning = true;
            
            const currentSlideElement = this.slides[this.currentSlide - 1];
            const targetSlideElement = this.slides[slideNumber - 1];
            
            this.slides.forEach(slide => {
                slide.classList.remove('active', 'slide-enter', 'slide-enter-active', 'slide-exit', 'slide-exit-active');
            });
            
            targetSlideElement.classList.add('active');
            this.currentSlide = slideNumber;
            
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
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
    
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Don't handle keyboard events if modal is open
        if (this.imageModal && this.imageModal.isOpen) {
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
                if (e.ctrlKey || e.metaKey) {
                    return;
                }
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
        this.showNotification('Fullscreen mode activated (simulated)', 'info');
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
        } else {
            document.body.classList.remove('fullscreen-active');
            this.showNotification('Fullscreen mode deactivated', 'info');
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
    
    setupImageHandling() {
        const imageContainers = document.querySelectorAll('.image-placeholder');
        
        imageContainers.forEach(container => {
            const img = container.querySelector('img');
            const fallback = container.querySelector('.image-fallback');
            
            if (img) {
                if (fallback) fallback.style.display = 'flex';
                img.style.display = 'none';
                
                img.addEventListener('load', () => {
                    if (img.src && img.src !== '' && img.src !== window.location.href) {
                        img.style.display = 'block';
                        if (fallback) fallback.style.display = 'none';
                    }
                });
                
                img.addEventListener('error', () => {
                    img.style.display = 'none';
                    if (fallback) fallback.style.display = 'flex';
                });
                
                if (img.src && img.src !== '' && img.src !== window.location.href) {
                    if (img.complete) {
                        img.style.display = 'block';
                        if (fallback) fallback.style.display = 'none';
                    }
                }
            }
        });
    }
    
    checkImages() {
        this.setupImageHandling();
    }
    
    async exportToPDF() {
        try {
            this.showLoading(true);
            this.showNotification('Preparing PDF export...', 'info');
            
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: 'OCR_Water_Meter_Presentation.pdf',
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
                    width: 1200,
                    height: 800
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
        const originalSlide = this.currentSlide;
        
        const navigation = document.querySelector('.navigation');
        if (navigation) {
            navigation.style.display = 'none';
        }
        
        const imageModal = document.querySelector('.image-modal');
        if (imageModal) {
            imageModal.style.display = 'none';
        }
        
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
        const navigation = document.querySelector('.navigation');
        if (navigation) {
            navigation.style.display = 'flex';
        }
        
        const imageModal = document.querySelector('.image-modal');
        if (imageModal) {
            imageModal.style.display = '';
        }
        
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
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: ${type === 'warning' ? '#000' : 'white'};
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10001;
            font-weight: 500;
            max-width: 300px;
            transform: translateX(320px);
            transition: transform 0.3s ease;
            font-size: 14px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(320px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }
    
    setImage(slideId, imageId, imageSrc) {
        const slide = document.getElementById(slideId);
        if (slide) {
            const img = slide.querySelector(`#${imageId}`);
            if (img) {
                img.src = imageSrc;
                this.setupImageHandling();
                console.log(`✅ Image set: ${slideId} -> ${imageId}`);
                return true;
            } else {
                console.error(`❌ Image element not found: ${imageId} in ${slideId}`);
            }
        } else {
            console.error(`❌ Slide not found: ${slideId}`);
        }
        return false;
    }
    
    setImages(imageConfig) {
        let successCount = 0;
        let totalCount = 0;
        
        Object.keys(imageConfig).forEach(slideId => {
            const slide = document.getElementById(slideId);
            if (slide) {
                Object.keys(imageConfig[slideId]).forEach(imgId => {
                    totalCount++;
                    const img = slide.querySelector(`#${imgId}`);
                    if (img) {
                        img.src = imageConfig[slideId][imgId];
                        successCount++;
                    }
                });
            }
        });
        
        this.setupImageHandling();
        console.log(`✅ Images set: ${successCount}/${totalCount} successful`);
        this.showNotification(`Images updated: ${successCount}/${totalCount}`, successCount === totalCount ? 'success' : 'warning');
    }
    
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
        console.log('Navigation buttons:', {
            prev: !!this.prevBtn,
            next: !!this.nextBtn,
            fullscreen: !!this.fullscreenBtn,
            export: !!this.exportBtn
        });
        console.log('Is fullscreen:', this.isFullscreen);
        
        this.slides.forEach((slide, index) => {
            console.log(`Slide ${index + 1}:`, {
                active: slide.classList.contains('active'),
                classes: slide.classList.toString()
            });
        });
    }
    
    refreshSlides() {
        console.log('🔄 Refreshing slide states...');
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'slide-enter', 'slide-enter-active', 'slide-exit', 'slide-exit-active');
            
            if (index === this.currentSlide - 1) {
                slide.classList.add('active');
            }
        });
        
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.showNotification('Slides refreshed', 'success');
        console.log('✅ Slides refreshed');
    }
}

// Image Modal Class
class ImageModal {
    constructor() {
        this.modal = null;
        this.modalImage = null;
        this.modalTitle = null;
        this.zoomLevel = 1;
        this.maxZoom = 5;
        this.minZoom = 0.1;
        this.zoomStep = 0.2;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.imagePosition = { x: 0, y: 0 };
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        
        if (!this.modal || !this.modalImage || !this.modalTitle) {
            console.error('❌ Modal elements not found');
            return;
        }
        
        this.bindEvents();
        console.log('✅ Image modal initialized');
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
            }
        });
        
        // Mouse wheel zoom
        this.modalImage.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });
        
        // Drag functionality
        this.modalImage.addEventListener('mousedown', (e) => {
            if (this.zoomLevel > 1) {
                this.isDragging = true;
                this.dragStart = { x: e.clientX - this.imagePosition.x, y: e.clientY - this.imagePosition.y };
                this.modalImage.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.zoomLevel > 1) {
                this.imagePosition.x = e.clientX - this.dragStart.x;
                this.imagePosition.y = e.clientY - this.dragStart.y;
                this.updateImageTransform();
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.modalImage.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
            }
        });
        
        // Touch events for mobile
        this.modalImage.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1 && this.zoomLevel > 1) {
                this.isDragging = true;
                const touch = e.touches[0];
                this.dragStart = { x: touch.clientX - this.imagePosition.x, y: touch.clientY - this.imagePosition.y };
                e.preventDefault();
            }
        });
        
        this.modalImage.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1 && this.zoomLevel > 1) {
                const touch = e.touches[0];
                this.imagePosition.x = touch.clientX - this.dragStart.x;
                this.imagePosition.y = touch.clientY - this.dragStart.y;
                this.updateImageTransform();
                e.preventDefault();
            }
        });
        
        this.modalImage.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }
    
    open(imageSrc, title = 'Image Viewer') {
        if (!this.modal || !this.modalImage || !this.modalTitle) {
            console.error('❌ Modal not properly initialized');
            return;
        }
        
        this.modalImage.src = imageSrc;
        this.modalTitle.textContent = title;
        this.modal.classList.add('show');
        this.isOpen = true;
        
        this.resetZoom();
        document.body.style.overflow = 'hidden';
        
        console.log(`📸 Modal opened: ${title}`);
    }
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        this.isOpen = false;
        this.resetZoom();
        document.body.style.overflow = '';
        
        console.log('📸 Modal closed');
    }
    
    zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
            this.updateImageTransform();
            this.updateZoomDisplay();
        }
    }
    
    zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
            
            // Reset position if zoomed out too much
            if (this.zoomLevel <= 1) {
                this.imagePosition = { x: 0, y: 0 };
            }
            
            this.updateImageTransform();
            this.updateZoomDisplay();
        }
    }
    
    resetZoom() {
        this.zoomLevel = 1;
        this.imagePosition = { x: 0, y: 0 };
        this.updateImageTransform();
        this.updateZoomDisplay();
    }
    
    updateImageTransform() {
        if (!this.modalImage) return;
        
        const transform = `scale(${this.zoomLevel}) translate(${this.imagePosition.x / this.zoomLevel}px, ${this.imagePosition.y / this.zoomLevel}px)`;
        this.modalImage.style.transform = transform;
        
        // Update cursor
        this.modalImage.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
    }
    
    updateZoomDisplay() {
        const zoomDisplay = document.getElementById('zoomLevel');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }
}

// Utility functions for easier image management
const ImageManager = {
    setImage: (slideNumber, imageElement, src) => {
        const slide = document.getElementById(`slide${slideNumber}`);
        if (slide) {
            const img = slide.querySelector(`#${imageElement}`);
            if (img) {
                img.src = src;
                if (window.presentation) {
                    window.presentation.setupImageHandling();
                }
                return true;
            }
        }
        return false;
    },
    
    checkMissingImages: () => {
        const images = document.querySelectorAll('.image-placeholder img');
        const missing = [];
        
        images.forEach(img => {
            if (!img.src || img.src === '' || img.src === window.location.href) {
                const slideId = img.closest('.slide').id;
                const imgId = img.id;
                missing.push({ slideId, imgId, element: img });
            }
        });
        
        console.log('🖼️ Missing images:', missing);
        return missing;
    },
    
    generateImageConfig: () => {
        const config = {};
        
        document.querySelectorAll('.slide').forEach(slide => {
            const slideId = slide.id;
            const images = slide.querySelectorAll('.image-placeholder img[id]');
            
            if (images.length > 0) {
                config[slideId] = {};
                images.forEach(img => {
                    config[slideId][img.id] = 'path/to/your/image.jpg';
                });
            }
        });
        
        console.log('📋 Image configuration template:');
        console.log(JSON.stringify(config, null, 2));
        return config;
    }
};

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing OCR Water Meter Presentation...');
    
    window.presentation = new PresentationController();
    window.ImageManager = ImageManager;
    
    // Log instructions for usage
    setTimeout(() => {
        console.log(`
📋 OCR Water Meter Presentation Ready!

🎮 Navigation Controls:
   ⌨️  Arrow Keys / Space: Navigate slides
   🔢 Number Keys (1-5): Jump directly to slide
   🏠 Home/End: First/Last slide  
   🖱️  Mouse: Click navigation buttons
   📱 Touch: Swipe left/right on mobile
   🔲 F key: Toggle fullscreen
   ⎋  Escape: Exit fullscreen / Close modal

🖼️  Image Modal Controls:
   🖱️  Click any image to open modal
   🔍 Mouse wheel: Zoom in/out
   ➕ + key: Zoom in
   ➖ - key: Zoom out
   0️⃣  0 key: Reset zoom
   🖱️  Drag: Pan when zoomed
   ⎋  Escape: Close modal

🖼️  Image Management:
   
   Single image:
   ImageManager.setImage(slideNumber, 'img-id', 'path/to/image.jpg')
   
   Multiple images:
   presentation.setImages({
     'slide2': { 'img-problem': 'images/problem.jpg' },
     'slide3': { 
       'img-deskew-comparison': 'images/deskew.jpg',
       'img-histogram-projection': 'images/histogram.jpg',
       'img-fixed-grid': 'images/grid.jpg'
     },
     'slide4': { 
       'img-detection': 'images/detection.jpg',
       'img-segmentation': 'images/segmentation.jpg',
       'img-pipeline': 'images/pipeline.jpg'
     },
     'slide5': { 
       'img-confusion-heatmap': 'images/confusion_matrix.jpg',
       'img-classification-report': 'images/classification_report.jpg',
       'img-model-comparison': 'images/model_comparison.jpg'
     }
   });

🔧 Debugging:
   presentation.debugInfo() - Show debug information
   presentation.refreshSlides() - Emergency slide refresh
   ImageManager.checkMissingImages() - List missing images
   ImageManager.generateImageConfig() - Generate template

📄 Export PDF: Click the red "Export PDF" button

🎯 Quick Navigation:
   Press 1, 2, 3, 4, or 5 to jump directly to that slide!

✨ New Features:
   - Click any image to view in full screen modal
   - Zoom in/out with mouse wheel or controls
   - Drag to pan when zoomed in
   - Updated slide 5 with SVM model results
   - 3-column confusion matrix layout
        `);
    }, 1000);
});

// Export for global access
window.PresentationController = PresentationController;
window.ImageModal = ImageModal;