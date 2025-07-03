// ==================== GLOBAL VARIABLES ====================
let currentSlide = 1;
const totalSlides = 16; // Updated to include related journal slide
let isFullscreen = false;
let animationTimeout = null;
let hasSwipedOnce = false;

// Export related variables
let isExporting = false;
let exportProgress = 0;

// ==================== DEVICE DETECTION ====================
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializePresentation();
    setupEventListeners();
    setupImageFallbacks();
    initializeMobileFeatures();
    updateSlideCounter();
    showSlide(currentSlide);
});

// ==================== IMAGE FALLBACK SETUP ====================
function setupImageFallbacks() {
    const profileImages = document.querySelectorAll('.profile-img');

    profileImages.forEach(img => {
        img.addEventListener('error', function () {
            console.log('Image failed to load:', this.src);
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'flex';
            }
        });

        img.addEventListener('load', function () {
            console.log('Image loaded successfully:', this.src);
            this.style.display = 'block';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'none';
            }
        });

        // Check if image source is valid
        if (!img.src || img.src === '' || img.src === window.location.href || img.src.includes('undefined')) {
            console.log('Invalid image source:', img.src);
            img.style.display = 'none';
            const fallback = img.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'flex';
            }
        }
    });
}

// ==================== PRESENTATION INITIALIZATION ====================
function initializePresentation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exportBtn = document.getElementById('exportBtn');

    prevBtn.setAttribute('title', 'Previous Slide (← or Left Arrow)');
    nextBtn.setAttribute('title', 'Next Slide (→ or Right Arrow)');
    fullscreenBtn.setAttribute('title', 'Toggle Fullscreen (F key or click)');
    exportBtn.setAttribute('title', 'Export to PDF');

    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.setAttribute('data-slide-number', index + 1);
    });

    // Add modern animations
    addModernAnimations();
}

// ==================== MODERN ANIMATIONS ====================
function addModernAnimations() {
    // Animate profile cards on load
    const profileCards = document.querySelectorAll('.modern-profile-card');
    profileCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 200));
    });

    // Animate info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.4s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 100));
    });

    // Animate related journal cards
    const journalCards = document.querySelectorAll('.related-journal-card');
    journalCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 + (index * 150));
    });
}

// ==================== EVENT LISTENERS SETUP ====================
function setupEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', () => navigateSlide('prev'));
    document.getElementById('nextBtn').addEventListener('click', () => navigateSlide('next'));
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('exportBtn').addEventListener('click', exportToPDF);

    document.addEventListener('keydown', handleKeyNavigation);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    window.addEventListener('resize', debounce(handleResize, 250));
    window.addEventListener('orientationchange', handleOrientationChange);

    setupEnhancedTouchNavigation();
}

// ==================== MOBILE FEATURES INITIALIZATION ====================
function initializeMobileFeatures() {
    optimizeForMobile();
    optimizeForTablet();
    preventDoubleTargetZoom();
    optimizeMobileExport();

    if (isMobile()) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            .mobile-device .slide {
                min-height: calc(var(--vh, 1vh) * 100);
            }
            
            .mobile-device .slide-content {
                min-height: calc(var(--vh, 1vh) * 100 - 80px);
            }
        `;
        document.head.appendChild(mobileStyle);

        // Add swipe indicator
        const swipeIndicator = document.createElement('div');
        swipeIndicator.className = 'swipe-indicator';
        swipeIndicator.innerHTML = '← Geser untuk navigasi →';
        swipeIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.8rem;
            z-index: 1000;
            text-align: center;
            pointer-events: none;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 20px;
        `;
        document.body.appendChild(swipeIndicator);

        document.addEventListener('touchend', () => {
            if (!hasSwipedOnce && swipeIndicator) {
                hasSwipedOnce = true;
                setTimeout(() => {
                    if (swipeIndicator.parentNode) {
                        swipeIndicator.style.opacity = '0';
                        setTimeout(() => {
                            swipeIndicator.parentNode.removeChild(swipeIndicator);
                        }, 300);
                    }
                }, 2000);
            }
        });
    }
}

// ==================== MOBILE DEVICE OPTIMIZATIONS ====================
function optimizeForMobile() {
    if (!isMobile()) return;

    const slideCounter = document.getElementById('slideCounter');
    if (slideCounter) {
        slideCounter.style.fontSize = '0.9rem';
        slideCounter.style.marginBottom = '8px';
    }

    document.body.classList.add('mobile-device');

    document.querySelectorAll('.slide-content').forEach(content => {
        content.style.scrollBehavior = 'smooth';
        content.style.overscrollBehavior = 'contain';
    });

    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
        }
        
        .mobile-device .slide-controls button {
            -webkit-tap-highlight-color: rgba(99, 102, 241, 0.2);
        }
    `;
    document.head.appendChild(style);
}

function optimizeForTablet() {
    if (!isTablet()) return;

    document.body.classList.add('tablet-device');

    const controls = document.querySelector('.slide-controls');
    if (controls) {
        controls.style.padding = '12px 20px';
    }
}

// ==================== PREVENT DOUBLE TAP ZOOM ====================
function preventDoubleTargetZoom() {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// ==================== MOBILE EXPORT OPTIMIZATION ====================
function optimizeMobileExport() {
    if (!isMobile()) return;

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', (e) => {
            const proceed = confirm('Ekspor PDF di mobile mungkin memerlukan waktu lebih lama. Lanjutkan?');
            if (!proceed) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    }
}

// ==================== ENHANCED TOUCH NAVIGATION ====================
function setupEnhancedTouchNavigation() {
    let startX = 0;
    let startY = 0;
    let isSwipe = false;
    let startTime = 0;

    const presentation = document.getElementById('presentation');

    presentation.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        isSwipe = true;

        if (isMobile()) {
            document.body.style.userSelect = 'none';
        }
    }, {
        passive: true
    });

    presentation.addEventListener('touchmove', (e) => {
        if (!isSwipe) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);

        if (diffY > diffX && diffY > 30) {
            isSwipe = false;
        }

        if (diffX > diffY && diffX > 30) {
            e.preventDefault();
        }
    }, {
        passive: false
    });

    presentation.addEventListener('touchend', (e) => {
        if (!isSwipe) return;

        const endX = e.changedTouches[0].clientX;
        const endTime = Date.now();
        const diffX = startX - endX;
        const swipeTime = endTime - startTime;
        const minSwipeDistance = isMobile() ? 30 : 50;
        const maxSwipeTime = 500;

        document.body.style.userSelect = '';

        if (Math.abs(diffX) > minSwipeDistance && swipeTime < maxSwipeTime) {
            if (diffX > 0) {
                navigateSlide('next');
                showSwipeFeedback('next');
            } else {
                navigateSlide('prev');
                showSwipeFeedback('prev');
            }
        }

        isSwipe = false;
    }, {
        passive: true
    });
}

// ==================== SWIPE FEEDBACK ====================
function showSwipeFeedback(direction) {
    if (!isMobile()) return;

    const feedback = document.createElement('div');
    feedback.className = 'swipe-feedback';
    feedback.innerHTML = direction === 'next' ? '→' : '←';

    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        ${direction === 'next' ? 'right: 20px;' : 'left: 20px;'}
        transform: translateY(-50%);
        background: var(--primary-color);
        color: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(-50%) scale(1.2)';
    }, 50);

    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-50%) scale(0.8)';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 300);
}

// ==================== SLIDE NAVIGATION ====================
function navigateSlide(direction) {
    const newSlide = direction === 'next' ?
        Math.min(currentSlide + 1, totalSlides) :
        Math.max(currentSlide - 1, 1);

    if (newSlide !== currentSlide) {
        showSlide(newSlide);
    }
}

function showSlide(slideNumber) {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }

    if (slideNumber < 1 || slideNumber > totalSlides) {
        return;
    }

    const previousSlide = currentSlide;
    currentSlide = slideNumber;

    document.querySelectorAll('.slide').forEach((slide) => {
        slide.classList.remove('active');

        if (!isFullscreen) {
            slide.style.position = '';
            slide.style.top = '';
            slide.style.left = '';
            slide.style.right = '';
            slide.style.bottom = '';
            slide.style.zIndex = '';
            slide.style.width = '';
            slide.style.height = '';
        }

        if (isFullscreen) {
            slide.style.display = 'none';
        }
    });

    const targetSlide = document.getElementById(`slide${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');

        if (isFullscreen) {
            targetSlide.style.display = 'flex';
            setTimeout(() => {
                optimizeForFullscreen(targetSlide);
            }, 50);
        } else {
            const slideContent = targetSlide.querySelector('.slide-content');
            if (slideContent) {
                slideContent.style.position = '';
                slideContent.style.top = '';
                slideContent.style.left = '';
                slideContent.style.right = '';
                slideContent.style.bottom = '';
                slideContent.style.width = '';
                slideContent.style.height = '';
                slideContent.style.margin = '';
                slideContent.style.padding = '';
            }

            targetSlide.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        if (!isFullscreen || (slideNumber !== 1 && slideNumber !== totalSlides)) {
            targetSlide.style.opacity = '0';
            targetSlide.style.transform = slideNumber > previousSlide ?
                'translateX(50px)' :
                'translateX(-50px)';

            animationTimeout = setTimeout(() => {
                targetSlide.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                targetSlide.style.opacity = '1';
                targetSlide.style.transform = 'translateX(0)';

                setTimeout(() => {
                    targetSlide.style.transition = '';
                }, 300);
            }, 50);
        } else {
            targetSlide.style.opacity = '1';
            targetSlide.style.transform = 'translateX(0)';
        }

        // Mobile-specific adjustments after slide change
        if (isMobile()) {
            setTimeout(() => {
                window.scrollTo(0, 0);

                const activeSlide = document.querySelector('.slide.active');
                if (activeSlide) {
                    const slideContent = activeSlide.querySelector('.slide-content');
                    if (slideContent && slideContent.scrollHeight > window.innerHeight) {
                        slideContent.style.overflowY = 'auto';
                        slideContent.style.height = 'calc(100vh - 80px)';
                    }
                }
            }, 100);
        }

        // Add slide-specific animations
        addSlideSpecificAnimations(slideNumber);
    }

    updateNavigationButtons();
    updateSlideCounter();
    history.replaceState(null, null, `#slide${slideNumber}`);
}

// ==================== SLIDE SPECIFIC ANIMATIONS ====================
function addSlideSpecificAnimations(slideNumber) {
    if (slideNumber === 2) { // Profile slide
        setTimeout(() => {
            addModernAnimations();
        }, 300);
    }

    if (slideNumber === 11) { // Related Journal slide
        setTimeout(() => {
            animateRelatedJournalElements();
        }, 300);
    }

    if (slideNumber === 13) { // Demo slide (updated index)
        setTimeout(() => {
            animateDemoElements();
        }, 300);
    }
}

function animateRelatedJournalElements() {
    const journalCards = document.querySelectorAll('.related-journal-card');
    journalCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });

    const positionItems = document.querySelectorAll('.position-item');
    positionItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.4s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 800 + (index * 100));
    });

    const trendItems = document.querySelectorAll('.trend-item');
    trendItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-15px)';
        item.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 1200 + (index * 80));
    });
}

function animateDemoElements() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });

    const previewCards = document.querySelectorAll('.preview-card');
    previewCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = 'all 0.4s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 800 + (index * 100));
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;

    prevBtn.style.opacity = currentSlide === 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === totalSlides ? '0.5' : '1';
}

function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    counter.textContent = `${currentSlide} / ${totalSlides}`;

    const progress = (currentSlide / totalSlides) * 100;
    counter.style.background = `linear-gradient(90deg, var(--primary-color) ${progress}%, transparent ${progress}%)`;
    counter.style.backgroundClip = 'text';
    counter.style.fontWeight = 'bold';

    setTimeout(() => {
        if (getComputedStyle(counter).color === 'transparent') {
            counter.style.background = '';
            counter.style.color = 'var(--dark-color)';
        }
    }, 100);
}

// ==================== KEYBOARD NAVIGATION ====================
function handleKeyNavigation(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            event.preventDefault();
            navigateSlide('prev');
            break;

        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
            event.preventDefault();
            navigateSlide('next');
            break;

        case 'Home':
            event.preventDefault();
            showSlide(1);
            break;

        case 'End':
            event.preventDefault();
            showSlide(totalSlides);
            break;

        case 'f':
        case 'F':
            if (!event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                toggleFullscreen();
            }
            break;

        case 'Escape':
            if (isFullscreen) {
                event.preventDefault();
                exitFullscreen();
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
        case '9':
            const slideNum = parseInt(event.key);
            if (slideNum <= totalSlides) {
                event.preventDefault();
                showSlide(slideNum);
            }
            break;
    }
}

// ==================== FULLSCREEN FUNCTIONALITY ====================
function toggleFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const presentation = document.getElementById('presentation');

    const requestFullscreen = presentation.requestFullscreen ||
        presentation.mozRequestFullScreen ||
        presentation.webkitRequestFullscreen ||
        presentation.msRequestFullscreen;

    if (requestFullscreen) {
        requestFullscreen.call(presentation).then(() => {
            isFullscreen = true;
            document.body.classList.add('is-fullscreen');
            setTimeout(() => {
                optimizeMobileFullscreen();
                const activeSlide = document.querySelector('.slide.active');
                if (activeSlide) {
                    optimizeForFullscreen(activeSlide);
                }
            }, 100);
        }).catch((err) => {
            console.warn('Failed to enter fullscreen:', err);
        });
    }
}

function exitFullscreen() {
    const exitFullscreen = document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;

    if (exitFullscreen) {
        exitFullscreen.call(document).then(() => {
            isFullscreen = false;
            document.body.classList.remove('is-fullscreen');
            restoreNormalView();
        }).catch((err) => {
            console.warn('Failed to exit fullscreen:', err);
        });
    }
}

function handleFullscreenChange() {
    const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );

    isFullscreen = isCurrentlyFullscreen;
    updateFullscreenButtonIcon();

    if (isFullscreen) {
        document.body.classList.add('is-fullscreen');
        setTimeout(() => {
            optimizeMobileFullscreen();
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                optimizeForFullscreen(activeSlide);
            }
        }, 100);
    } else {
        document.body.classList.remove('is-fullscreen');

        setTimeout(() => {
            restoreNormalView();

            const controls = document.querySelector('.slide-controls');
            if (controls) {
                controls.style.display = 'flex';
                controls.style.position = 'fixed';
                controls.style.top = '0';
                controls.style.left = '0';
                controls.style.right = '0';
                controls.style.zIndex = '1000';
            }

            showSlide(currentSlide);
        }, 100);
    }
}

function updateFullscreenButtonIcon() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const icon = fullscreenBtn.querySelector('i');

    if (isFullscreen) {
        icon.className = 'bi bi-fullscreen-exit';
        fullscreenBtn.setAttribute('title', 'Exit Fullscreen (Esc)');
    } else {
        icon.className = 'bi bi-fullscreen';
        fullscreenBtn.setAttribute('title', 'Enter Fullscreen (F)');
    }
}

// ==================== FULLSCREEN OPTIMIZATION ====================
function optimizeForFullscreen(targetSlide = null) {
    if (!isFullscreen) return;

    const activeSlide = targetSlide || document.querySelector('.slide.active');
    if (!activeSlide) return;

    const slideContent = activeSlide.querySelector('.slide-content');
    if (!slideContent) return;

    resetSlideStyles(activeSlide);
    applyResponsiveFullscreen(activeSlide);

    setTimeout(() => {
        handleContentOverflow(activeSlide);
        optimizeSlideSpecifics(activeSlide);
    }, 100);
}

function resetSlideStyles(slide) {
    const slideContent = slide.querySelector('.slide-content');
    if (!slideContent) return;

    slideContent.style.transform = '';
    slideContent.style.transformOrigin = '';
    slideContent.style.scale = '';
    slideContent.style.overflowY = 'auto';
    slideContent.style.overflowX = 'hidden';
    slideContent.style.width = '100%';
    slideContent.style.height = '100vh';
    slideContent.style.boxSizing = 'border-box';
}

function applyResponsiveFullscreen(slide) {
    const slideContent = slide.querySelector('.slide-content');
    if (!slideContent) return;

    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    if (viewport.width >= 1920) {
        slideContent.style.padding = '60px 120px';
        slideContent.style.maxWidth = '100%';
        slideContent.style.margin = '0 auto';
    } else if (viewport.width >= 1200) {
        slideContent.style.padding = '50px 80px';
        slideContent.style.margin = '0 auto';
    } else if (viewport.width >= 1024) {
        slideContent.style.padding = '40px 60px';
    } else if (viewport.width >= 768) {
        slideContent.style.padding = '30px 40px';
    } else {
        slideContent.style.padding = '20px 25px';
    }

    applyResponsiveTypography(slide, viewport);
}

function applyResponsiveTypography(slide, viewport) {
    const headings = slide.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = slide.querySelectorAll('p, li');

    if (viewport.width <= 767) {
        headings.forEach(heading => {
            switch (heading.tagName.toLowerCase()) {
                case 'h1':
                    heading.style.fontSize = '1.75rem';
                    break;
                case 'h2':
                    heading.style.fontSize = '1.5rem';
                    break;
                case 'h3':
                    heading.style.fontSize = '1.3rem';
                    break;
                case 'h4':
                    heading.style.fontSize = '1.2rem';
                    break;
                case 'h5':
                    heading.style.fontSize = '1.1rem';
                    break;
            }
            heading.style.lineHeight = '1.2';
            heading.style.marginBottom = '0.8rem';
        });

        paragraphs.forEach(p => {
            p.style.fontSize = '0.9rem';
            p.style.lineHeight = '1.4';
        });
    } else if (viewport.width <= 1023) {
        headings.forEach(heading => {
            switch (heading.tagName.toLowerCase()) {
                case 'h1':
                    heading.style.fontSize = '2rem';
                    break;
                case 'h2':
                    heading.style.fontSize = '1.8rem';
                    break;
                case 'h3':
                    heading.style.fontSize = '1.5rem';
                    break;
                case 'h4':
                    heading.style.fontSize = '1.3rem';
                    break;
            }
        });

        paragraphs.forEach(p => {
            p.style.fontSize = '1rem';
        });
    }
}

function handleContentOverflow(slide) {
    const slideContent = slide.querySelector('.slide-content');
    if (!slideContent) return;

    const contentHeight = slideContent.scrollHeight;
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - 40;

    if (contentHeight > availableHeight) {
        slideContent.style.overflowY = 'auto';
        slideContent.style.height = '100vh';
        slideContent.style.scrollBehavior = 'smooth';

        if (isMobile()) {
            slideContent.style.scrollSnapType = 'y mandatory';
            const sections = slideContent.children;
            Array.from(sections).forEach(section => {
                section.style.scrollSnapAlign = 'start';
            });
        }
    } else {
        slideContent.style.overflowY = 'hidden';
        slideContent.style.display = 'flex';
        slideContent.style.flexDirection = 'column';
        slideContent.style.justifyContent = 'center';
    }
}

function optimizeSlideSpecifics(slide) {
    const slideId = slide.id;

    switch (slideId) {
        case 'slide1':
        case 'slide16': // Updated for new total slides
            optimizeCoverSlide(slide);
            break;
        case 'slide2':
            optimizeProfileSlide(slide);
            break;
        case 'slide11':
            optimizeRelatedJournalSlide(slide);
            break;
    }
}

function optimizeCoverSlide(slide) {
    if (!isFullscreen) return;

    slide.style.position = 'fixed';
    slide.style.top = '0';
    slide.style.left = '0';
    slide.style.right = '0';
    slide.style.bottom = '0';
    slide.style.width = '100vw';
    slide.style.height = '100vh';
    slide.style.margin = '0';
    slide.style.padding = '0';
    slide.style.zIndex = '9999';
    slide.style.display = 'flex';
    slide.style.alignItems = 'center';
    slide.style.justifyContent = 'center';

    const slideContent = slide.querySelector('.slide-content');
    if (slideContent) {
        slideContent.style.position = 'absolute';
        slideContent.style.top = '0';
        slideContent.style.left = '0';
        slideContent.style.right = '0';
        slideContent.style.bottom = '0';
        slideContent.style.width = '100vw';
        slideContent.style.height = '100vh';
        slideContent.style.margin = '0';
        slideContent.style.padding = '0';
        slideContent.style.display = 'flex';
        slideContent.style.alignItems = 'center';
        slideContent.style.justifyContent = 'center';
        slideContent.style.overflow = 'hidden';
        slideContent.style.boxSizing = 'border-box';
    }
}

function optimizeProfileSlide(slide) {
    const teamGrid = slide.querySelector('.team-grid');
    if (teamGrid && isFullscreen) {
        teamGrid.style.gridTemplateColumns = window.innerWidth < 1200 ? '1fr' : 'repeat(2, 1fr)';
        teamGrid.style.gap = window.innerWidth < 768 ? '1.5rem' : '2rem';

        const profileCards = slide.querySelectorAll('.modern-profile-card');
        profileCards.forEach(card => {
            card.style.maxWidth = '100%';
            card.style.margin = '0 auto';
        });

        const universityCard = slide.querySelector('.university-card');
        if (universityCard) {
            universityCard.style.maxWidth = '100%';
            universityCard.style.margin = '0 auto';
        }
    }
}

function optimizeRelatedJournalSlide(slide) {
    if (!isFullscreen) return;

    const journalCards = slide.querySelectorAll('.related-journal-card');
    journalCards.forEach(card => {
        card.style.marginBottom = '1rem';
        if (window.innerWidth < 768) {
            card.style.padding = '15px';
        }
    });

    const comparisonSummary = slide.querySelector('.comparison-summary');
    if (comparisonSummary) {
        comparisonSummary.style.maxWidth = '100%';
        comparisonSummary.style.margin = '0 auto';
    }
}

function optimizeMobileFullscreen() {
    if (!isMobile() || !isFullscreen) return;

    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;

    if (window.innerHeight > window.innerWidth) {
        showOrientationHint();
    }

    const slideContent = activeSlide.querySelector('.slide-content');
    if (slideContent) {
        slideContent.style.webkitOverflowScrolling = 'touch';
        slideContent.style.overscrollBehavior = 'contain';
    }

    setTimeout(() => {
        window.scrollTo(0, 1);
    }, 100);
}

function showOrientationHint() {
    const existing = document.querySelector('.orientation-hint');
    if (existing) return;

    const hint = document.createElement('div');
    hint.className = 'orientation-hint';
    hint.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 2rem; margin-bottom: 10px;">📱</div>
            <div>Putar device untuk pengalaman yang lebih baik</div>
        </div>
    `;
    hint.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        text-align: center;
        font-size: 1.2rem;
    `;

    document.body.appendChild(hint);

    function checkOrientation() {
        if (window.innerWidth > window.innerHeight && hint.parentNode) {
            hint.remove();
            window.removeEventListener('resize', checkOrientation);
        }
    }

    window.addEventListener('resize', checkOrientation);

    setTimeout(() => {
        if (hint.parentNode) {
            hint.remove();
        }
    }, 5000);
}

function restoreNormalView() {
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.position = '';
        slide.style.top = '';
        slide.style.left = '';
        slide.style.right = '';
        slide.style.bottom = '';
        slide.style.zIndex = '';
        slide.style.width = '';
        slide.style.height = '';
        slide.style.margin = '';
        slide.style.padding = '';
        slide.style.alignItems = '';
        slide.style.justifyContent = '';
        slide.style.display = '';
        slide.style.overflow = '';

        const slideContent = slide.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.position = '';
            slideContent.style.top = '';
            slideContent.style.left = '';
            slideContent.style.right = '';
            slideContent.style.bottom = '';
            slideContent.style.width = '';
            slideContent.style.height = '';
            slideContent.style.margin = '';
            slideContent.style.padding = '';
            slideContent.style.transform = '';
            slideContent.style.overflow = '';
            slideContent.style.alignItems = '';
            slideContent.style.justifyContent = '';
            slideContent.style.display = '';
            slideContent.style.boxSizing = '';
        }
    });

    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.display = slide.classList.contains('active') ? 'flex' : 'none';
    });

    setTimeout(() => {
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.display = '';
        });
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.display = 'flex';
        }
    }, 100);
}

// ==================== ORIENTATION CHANGE HANDLER ====================
function handleOrientationChange() {
    setTimeout(() => {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.display = 'none';
            setTimeout(() => {
                activeSlide.style.display = 'flex';

                if (isFullscreen) {
                    optimizeForFullscreen(activeSlide);
                }
            }, 100);
        }

        if (isMobile()) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }, 500);
}

// ==================== RESIZE HANDLER ====================
function handleResize() {
    if (isFullscreen) {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                optimizeForFullscreen(activeSlide);
            }
        }, 250);
    }
}

// ==================== DEMO SYSTEM FUNCTIONS ====================
function openGoogleColab() {
    // Replace with your actual Google Colab notebook URL
    const colabUrl = 'https://colab.research.google.com/drive/1Ks2-RAYMWRxbvAlN23sAHedl7Vf47l8a?usp=sharing';

    // Show loading notification
    showNotification('Membuka Google Colab...', 'info');

    // Open in new tab
    window.open(colabUrl, '_blank', 'noopener,noreferrer');

    // Show success notification after a delay
    setTimeout(() => {
        showNotification('Google Colab berhasil dibuka!', 'success');
    }, 1500);
}

function downloadNotebook() {
    // Create a sample notebook file
    const notebookContent = {
        "nbformat": 4,
        "nbformat_minor": 0,
        "metadata": {
            "colab": {
                "name": "ELM_Metaheuristic_Demo.ipynb",
                "provenance": []
            },
            "kernelspec": {
                "name": "python3",
                "display_name": "Python 3"
            }
        },
        "cells": [{
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "# ELM with Metaheuristic Algorithms Demo\n\n",
                    "This notebook demonstrates the implementation of PSS-ELM, INFO-ELM, and RUN-ELM for streamflow prediction.\n\n",
                    "## Authors\n",
                    "- Dewa Ketut Satriawan Suditresnajaya (2429101036)\n",
                    "- Ni Wayan Eva Agustini (2429101015)\n\n",
                    "## Course\n",
                    "Machine Learning - S2 Ilmu Komputer UNDIKSHA"
                ]
            },
            {
                "cell_type": "code",
                "execution_count": null,
                "metadata": {},
                "source": [
                    "# Install required packages\n",
                    "!pip install numpy pandas matplotlib scikit-learn scipy\n",
                    "!pip install mealpy  # For metaheuristic algorithms\n",
                    "\n",
                    "import numpy as np\n",
                    "import pandas as pd\n",
                    "import matplotlib.pyplot as plt\n",
                    "from sklearn.preprocessing import MinMaxScaler\n",
                    "from sklearn.metrics import mean_squared_error, r2_score\n",
                    "from mealpy.swarm_based import PSO\n",
                    "from mealpy.math_based import INFO, RUN\n",
                    "import warnings\n",
                    "warnings.filterwarnings('ignore')"
                ]
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## ELM Implementation\n\n",
                    "Extreme Learning Machine with metaheuristic optimization"
                ]
            },
            {
                "cell_type": "code",
                "execution_count": null,
                "metadata": {},
                "source": [
                    "class ELM:\n",
                    "    def __init__(self, n_hidden_units, activation_func='relu'):\n",
                    "        self.n_hidden_units = n_hidden_units\n",
                    "        self.activation_func = activation_func\n",
                    "        self.input_weights = None\n",
                    "        self.biases = None\n",
                    "        self.output_weights = None\n",
                    "    \n",
                    "    def _activation(self, x):\n",
                    "        if self.activation_func == 'relu':\n",
                    "            return np.maximum(0, x)\n",
                    "        elif self.activation_func == 'sigmoid':\n",
                    "            return 1 / (1 + np.exp(-x))\n",
                    "        elif self.activation_func == 'tanh':\n",
                    "            return np.tanh(x)\n",
                    "        else:\n",
                    "            return x\n",
                    "    \n",
                    "    def fit(self, X, y, input_weights=None, biases=None):\n",
                    "        n_samples, n_features = X.shape\n",
                    "        \n",
                    "        if input_weights is not None:\n",
                    "            self.input_weights = input_weights.reshape(n_features, self.n_hidden_units)\n",
                    "        else:\n",
                    "            self.input_weights = np.random.uniform(-1, 1, (n_features, self.n_hidden_units))\n",
                    "        \n",
                    "        if biases is not None:\n",
                    "            self.biases = biases.reshape(1, self.n_hidden_units)\n",
                    "        else:\n",
                    "            self.biases = np.random.uniform(-1, 1, (1, self.n_hidden_units))\n",
                    "        \n",
                    "        # Calculate hidden layer output\n",
                    "        hidden_output = self._activation(np.dot(X, self.input_weights) + self.biases)\n",
                    "        \n",
                    "        # Calculate output weights using Moore-Penrose pseudoinverse\n",
                    "        self.output_weights = np.dot(np.linalg.pinv(hidden_output), y)\n",
                    "        \n",
                    "        return self\n",
                    "    \n",
                    "    def predict(self, X):\n",
                    "        hidden_output = self._activation(np.dot(X, self.input_weights) + self.biases)\n",
                    "        return np.dot(hidden_output, self.output_weights)\n",
                    "\n",
                    "print(\"ELM class implemented successfully!\")"
                ]
            }
        ]
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(notebookContent, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'ELM_Metaheuristic_Demo.ipynb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Notebook berhasil diunduh!', 'success');
}

// ==================== LIBRARY CHECK FUNCTIONS ====================
function checkLibraries() {
    const libraries = {
        html2canvas: typeof html2canvas !== 'undefined',
        jsPDF: typeof window.jsPDF !== 'undefined' ||
            (typeof window.jspdf !== 'undefined' && typeof window.jspdf.jsPDF !== 'undefined')
    };

    console.log('Library status:', libraries);
    return libraries;
}

function getJsPDFInstance() {
    // Try different ways to access jsPDF
    if (window.jspdf && window.jspdf.jsPDF) {
        console.log('jsPDF found at window.jspdf.jsPDF');
        return window.jspdf.jsPDF;
    } else if (window.jsPDF) {
        console.log('jsPDF found at window.jsPDF');
        return window.jsPDF;
    } else if (typeof jsPDF !== 'undefined') {
        console.log('jsPDF found in global scope');
        return jsPDF;
    } else {
        console.error('jsPDF not found in any location');
        console.log('Available window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('pdf')));
        return null;
    }
}

// ==================== ENHANCED PDF EXPORT FUNCTIONALITY ====================
function exportToPDF() {
    if (isExporting) {
        showNotification('Export sedang berlangsung, harap tunggu...', 'warning');
        return;
    }

    // Check libraries
    const libStatus = checkLibraries();
    console.log('Checking libraries...', libStatus);

    if (!libStatus.html2canvas) {
        showNotification('Library html2canvas tidak ditemukan. Pastikan koneksi internet stabil dan reload halaman.', 'error');
        return;
    }

    if (!libStatus.jsPDF) {
        showNotification('Library jsPDF tidak ditemukan. Pastikan koneksi internet stabil dan reload halaman.', 'error');
        return;
    }

    isExporting = true;
    exportProgress = 0;

    // Show loading overlay
    const loadingOverlay = document.getElementById('export-loading');
    const progressText = document.getElementById('export-progress');
    const progressFill = document.getElementById('export-progress-fill');

    loadingOverlay.style.display = 'flex';

    const exportBtn = document.getElementById('exportBtn');
    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exporting...';
    exportBtn.disabled = true;

    // Hide controls
    const controls = document.querySelector('.slide-controls');
    const originalControlsDisplay = controls.style.display;
    controls.style.display = 'none';

    const originalCurrentSlide = currentSlide;
    const slides = document.querySelectorAll('.slide');

    // Get jsPDF instance
    const jsPDFClass = getJsPDFInstance();
    if (!jsPDFClass) {
        console.error('Could not get jsPDF instance');
        restoreAfterExportError();
        showNotification('Tidak dapat mengakses library jsPDF. Silakan reload halaman dan coba lagi.', 'error');
        return;
    }

    const pdf = new jsPDFClass({
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
    });

    let currentSlideIndex = 0;
    let slideImages = [];

    // Add export mode class to body
    document.body.classList.add('export-mode');

    function restoreAfterExportError() {
        // Remove export mode
        document.body.classList.remove('export-mode');

        // Hide loading overlay
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }

        // Restore button
        exportBtn.innerHTML = originalHTML;
        exportBtn.disabled = false;

        // Restore controls
        controls.style.display = originalControlsDisplay || 'flex';

        // Reset export state
        isExporting = false;
        exportProgress = 0;

        // Restore current slide
        showSlide(originalCurrentSlide);
    }

    function updateProgress(current, total, message) {
        exportProgress = (current / total) * 100;
        progressText.textContent = message;
        progressFill.style.width = `${exportProgress}%`;
    }

    function captureSlideSequentially() {
        if (currentSlideIndex >= slides.length) {
            createFinalPDF();
            return;
        }

        const slide = slides[currentSlideIndex];
        const slideNumber = currentSlideIndex + 1;

        updateProgress(currentSlideIndex + 1, slides.length, `Memproses slide ${slideNumber}/${slides.length}...`);

        prepareSlideForExport(slide, slideNumber)
            .then(() => captureSlideAsImage(slide, slideNumber))
            .then((imageData) => {
                slideImages.push(imageData);
                currentSlideIndex++;
                setTimeout(captureSlideSequentially, 500);
            })
            .catch((error) => {
                console.error(`Error capturing slide ${slideNumber}:`, error);
                currentSlideIndex++;
                setTimeout(captureSlideSequentially, 200);
            });
    }

    function prepareSlideForExport(slide, slideNumber) {
        return new Promise((resolve) => {
            // Hide all slides first
            slides.forEach(s => {
                s.style.display = 'none';
                s.classList.remove('active');
            });

            // Show and prepare current slide
            slide.style.display = 'flex';
            slide.classList.add('active');

            // Check if it's a cover or thank you slide
            const isCoverSlide = slide.classList.contains('cover-slide') || slide.classList.contains('thank-you-slide');

            // Set FIXED dimensions for export
            slide.style.position = 'relative';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '1920px';
            slide.style.height = '1080px';
            slide.style.margin = '0';
            slide.style.padding = '0';
            slide.style.zIndex = '1';
            slide.style.overflow = 'hidden';
            slide.style.transform = 'none';
            slide.style.boxShadow = 'none';
            slide.style.borderRadius = '0';

            if (isCoverSlide) {
                // KHUSUS UNTUK COVER SLIDES - FULL PAGE TREATMENT
                slide.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                slide.style.color = 'white';
                slide.style.display = 'flex';
                slide.style.justifyContent = 'center';
                slide.style.alignItems = 'center';

                const slideContent = slide.querySelector('.slide-content');
                if (slideContent) {
                    slideContent.style.width = '100%';
                    slideContent.style.height = '100%';
                    slideContent.style.padding = '0';
                    slideContent.style.margin = '0';
                    slideContent.style.display = 'flex';
                    slideContent.style.flexDirection = 'column';
                    slideContent.style.justifyContent = 'center';
                    slideContent.style.alignItems = 'center';
                    slideContent.style.textAlign = 'center';
                    slideContent.style.overflow = 'hidden';
                    slideContent.style.position = 'relative';
                    slideContent.style.transform = 'none';

                    // Typography untuk cover slides
                    const h1 = slide.querySelector('h1');
                    if (h1) {
                        h1.style.fontSize = '4.5rem';
                        h1.style.fontWeight = '800';
                        h1.style.color = 'white';
                        h1.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
                        h1.style.marginBottom = '2rem';
                        h1.style.background = 'none';
                        h1.style.webkitTextFillColor = 'white';
                    }

                    const h2 = slide.querySelector('h2');
                    if (h2) {
                        h2.style.fontSize = '4.5rem';
                        h2.style.fontWeight = '800';
                        h2.style.color = 'white';
                        h2.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
                        h2.style.marginBottom = '2rem';
                        h2.style.background = 'none';
                        h2.style.webkitTextFillColor = 'white';
                    }

                    const h3 = slide.querySelector('h3');
                    if (h3) {
                        h3.style.fontSize = '2.5rem';
                        h3.style.fontWeight = '400';
                        h3.style.color = 'white';
                        h3.style.opacity = '0.9';
                        h3.style.marginBottom = '3rem';
                    }

                    // Icon styling
                    const icons = slide.querySelectorAll('.cover-icon, .thank-you-icon');
                    icons.forEach(icon => {
                        icon.style.fontSize = '8rem';
                        icon.style.margin = '4rem 0';
                        icon.style.color = 'white';
                        icon.style.opacity = '0.9';
                    });

                    // Paragraph styling
                    const paragraphs = slide.querySelectorAll('p');
                    paragraphs.forEach(p => {
                        if (p.classList.contains('fs-4')) {
                            p.style.fontSize = '2rem';
                            p.style.fontWeight = '300';
                        } else if (p.classList.contains('fs-5')) {
                            p.style.fontSize = '1.6rem';
                            p.style.fontWeight = '300';
                        } else {
                            p.style.fontSize = '1.4rem';
                            p.style.fontWeight = '300';
                        }
                        p.style.color = 'white';
                        p.style.opacity = '0.9';
                        p.style.marginBottom = '1rem';
                    });
                }
            } else {
                // Regular slides
                slide.style.background = 'white';
                slide.style.color = '#374151';

                const slideContent = slide.querySelector('.slide-content');
                if (slideContent) {
                    slideContent.style.width = '100%';
                    slideContent.style.height = '1080px';
                    slideContent.style.boxSizing = 'border-box';
                    slideContent.style.display = 'flex';
                    slideContent.style.flexDirection = 'column';
                    slideContent.style.overflow = 'hidden';
                    slideContent.style.position = 'relative';
                    slideContent.style.transform = 'none';

                    if (slideContent.scrollHeight > 1000) {
                        slideContent.style.padding = '30px 40px';
                        const scaleFactor = Math.min(1, 980 / slideContent.scrollHeight);
                        if (scaleFactor < 1) {
                            slideContent.style.transform = `scale(${scaleFactor})`;
                            slideContent.style.transformOrigin = 'top center';
                        }
                    } else {
                        slideContent.style.padding = '50px 60px';
                    }
                    slideContent.style.justifyContent = 'flex-start';
                }
            }

            // Remove problematic elements
            const floatingIcons = slide.querySelector('.floating-icons');
            if (floatingIcons) {
                floatingIcons.style.display = 'none';
            }

            // Optimize slide layout
            optimizeSlideLayoutForExport(slide);
            preserveElementStyling(slide);

            setTimeout(resolve, 800);
        });
    }

    function preserveElementStyling(slide) {
        // Preserve profile cards styling
        const profileCards = slide.querySelectorAll('.modern-profile-card');
        profileCards.forEach(card => {
            card.style.background = 'white';
            card.style.borderRadius = '20px';
            card.style.border = '1px solid rgba(99, 102, 241, 0.1)';
            card.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
            card.style.overflow = 'hidden';
            card.style.marginBottom = '2rem';
        });

        // Preserve related journal cards styling
        const journalCards = slide.querySelectorAll('.related-journal-card');
        journalCards.forEach(card => {
            card.style.background = 'white';
            card.style.borderRadius = '16px';
            card.style.border = '1px solid rgba(99, 102, 241, 0.1)';
            card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            card.style.marginBottom = '1.5rem';
        });

        // Preserve algorithm features and metric tags
        const metricTags = slide.querySelectorAll('.metric-tag, .feature-tag');
        metricTags.forEach(tag => {
            tag.style.background = 'var(--primary-color)';
            tag.style.color = 'white';
            tag.style.borderRadius = '12px';
            tag.style.padding = '4px 8px';
            tag.style.fontSize = '0.7rem';
            tag.style.fontWeight = '500';
        });

        // Preserve comparison summary styling
        const comparisonSummary = slide.querySelector('.comparison-summary');
        if (comparisonSummary) {
            comparisonSummary.style.background = 'white';
            comparisonSummary.style.borderRadius = '16px';
            comparisonSummary.style.border = '1px solid rgba(16, 185, 129, 0.2)';
            comparisonSummary.style.borderLeft = '4px solid var(--success-color)';
        }

        // Preserve position status styling
        const positionStatuses = slide.querySelectorAll('.position-status');
        positionStatuses.forEach(status => {
            if (status.classList.contains('better')) {
                status.style.background = 'rgba(16, 185, 129, 0.1)';
                status.style.color = 'var(--success-color)';
            } else if (status.classList.contains('much-better')) {
                status.style.background = 'rgba(245, 158, 11, 0.1)';
                status.style.color = 'var(--warning-color)';
            }
            status.style.borderRadius = '12px';
            status.style.padding = '4px 8px';
            status.style.fontSize = '0.85rem';
            status.style.fontWeight = '500';
        });

        // Other existing styling preservation code...
        preserveExistingElements(slide);
    }

    function preserveExistingElements(slide) {
        // Preserve avatar styling
        const avatarRings = slide.querySelectorAll('.avatar-ring');
        avatarRings.forEach(ring => {
            ring.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
            ring.style.borderRadius = '50%';
            ring.style.padding = '4px';
            ring.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.2)';
        });

        // Preserve info items
        const infoItems = slide.querySelectorAll('.info-item');
        infoItems.forEach(item => {
            item.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.05))';
            item.style.borderRadius = '10px';
            item.style.padding = '12px';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '12px';
            item.style.marginBottom = '1rem';
        });

        // Preserve info icons
        const infoIcons = slide.querySelectorAll('.info-icon');
        infoIcons.forEach(icon => {
            icon.style.background = 'linear-gradient(135deg, #6366f1, #06b6d4)';
            icon.style.color = 'white';
            icon.style.borderRadius = '8px';
            icon.style.width = '32px';
            icon.style.height = '32px';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
        });

        // Preserve tags
        const tags = slide.querySelectorAll('.tag');
        tags.forEach(tag => {
            if (tag.classList.contains('primary')) {
                tag.style.background = 'rgba(99, 102, 241, 0.1)';
                tag.style.color = '#6366f1';
                tag.style.border = '1px solid #6366f1';
            } else if (tag.classList.contains('secondary')) {
                tag.style.background = 'rgba(6, 182, 212, 0.1)';
                tag.style.color = '#06b6d4';
                tag.style.border = '1px solid #06b6d4';
            }
            tag.style.borderRadius = '15px';
            tag.style.padding = '4px 12px';
            tag.style.fontSize = '0.8rem';
            tag.style.fontWeight = '500';
        });
    }

    function optimizeSlideLayoutForExport(slide) {
        const slideId = slide.id;
        const isCoverSlide = slide.classList.contains('cover-slide') || slide.classList.contains('thank-you-slide');

        if (isCoverSlide) {
            // Cover slide optimizations remain the same
            optimizeCoverSlideForExport(slide);
        } else {
            // Regular slide optimizations
            optimizeRegularSlideForExport(slide, slideId);
        }
    }

    function optimizeCoverSlideForExport(slide) {
        const slideContent = slide.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.height = '100%';
            slideContent.style.width = '100%';
            slideContent.style.display = 'flex';
            slideContent.style.flexDirection = 'column';
            slideContent.style.justifyContent = 'center';
            slideContent.style.alignItems = 'center';
            slideContent.style.textAlign = 'center';
            slideContent.style.padding = '0';
            slideContent.style.margin = '0';
            slideContent.style.position = 'relative';
        }

        const containers = slide.querySelectorAll('.container-fluid, .container');
        containers.forEach(container => {
            container.style.height = '100%';
            container.style.maxWidth = '100%';
            container.style.padding = '0 60px';
            container.style.margin = '0';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.position = 'relative';
        });

        const rows = slide.querySelectorAll('.row');
        rows.forEach(row => {
            row.style.height = '100%';
            row.style.margin = '0';
            row.style.width = '100%';
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'center';
            row.style.position = 'relative';
        });

        const cols = slide.querySelectorAll('.col-12, [class*="col-"]');
        cols.forEach(col => {
            col.style.height = '100%';
            col.style.display = 'flex';
            col.style.flexDirection = 'column';
            col.style.alignItems = 'center';
            col.style.justifyContent = 'center';
            col.style.textAlign = 'center';
            col.style.padding = '0';
            col.style.position = 'relative';
        });
    }

    function optimizeRegularSlideForExport(slide, slideId) {
        // Profile slide optimization
        if (slideId === 'slide2') {
            const teamGrid = slide.querySelector('.team-grid');
            if (teamGrid) {
                teamGrid.style.display = 'grid';
                teamGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                teamGrid.style.gap = '2rem';
                teamGrid.style.maxWidth = '1200px';
                teamGrid.style.margin = '0 auto 3rem auto';
            }
        }

        // Related Journal slide optimization
        if (slideId === 'slide11') {
            const journalCards = slide.querySelectorAll('.related-journal-card');
            journalCards.forEach(card => {
                card.style.marginBottom = '1.5rem';
            });

            const comparisonSummary = slide.querySelector('.comparison-summary');
            if (comparisonSummary) {
                comparisonSummary.style.marginTop = '2rem';
            }

            const researchTrends = slide.querySelector('.research-trends');
            if (researchTrends) {
                researchTrends.style.marginTop = '1rem';
            }
        }

        // Demo slide optimization
        if (slideId === 'slide13') {
            const featureCards = slide.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                card.style.padding = '1.5rem';
                card.style.background = 'white';
                card.style.borderRadius = '16px';
                card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                card.style.border = '1px solid rgba(99, 102, 241, 0.1)';
            });
        }

        // Table optimization
        const tables = slide.querySelectorAll('table');
        tables.forEach(table => {
            table.style.fontSize = '14px';
            table.style.lineHeight = '1.4';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
        });

        // Card optimizations
        const cards = slide.querySelectorAll('.card, .algorithm-card, .journal-info-card, .dataset-card');
        cards.forEach(card => {
            card.style.background = 'white';
            card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            card.style.borderRadius = '12px';
            card.style.overflow = 'hidden';
        });
    }

    function captureSlideAsImage(slide, slideNumber) {
        return new Promise((resolve, reject) => {
            console.log(`Capturing slide ${slideNumber} with fixed dimensions: 1920x1080`);

            setTimeout(() => {
                html2canvas(slide, {
                    width: 1920,
                    height: 1080,
                    scale: 1,
                    useCORS: true,
                    allowTaint: false,
                    logging: false,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 1920,
                    windowHeight: 1080,
                    backgroundColor: slide.classList.contains('cover-slide') || slide.classList.contains('thank-you-slide') ? null : '#ffffff',
                    ignoreElements: (element) => {
                        return element.classList.contains('floating-icons') ||
                            element.classList.contains('slide-controls') ||
                            element.classList.contains('export-loading-overlay');
                    }
                }).then(canvas => {
                    const imageData = canvas.toDataURL('image/png', 1.0);
                    resolve(imageData);
                }).catch(reject);
            }, 300);
        });
    }

    function createFinalPDF() {
        updateProgress(slides.length, slides.length, 'Membuat file PDF...');

        if (slideImages.length === 0) {
            restoreAfterExport();
            showNotification('Gagal mengunduh PDF. Tidak ada slide yang berhasil dicapture.', 'error');
            return;
        }

        // Remove the default first page
        pdf.deletePage(1);

        // Add each slide as a page
        slideImages.forEach((imageData, index) => {
            pdf.addPage('a4', 'landscape');

            // Calculate dimensions to fit the page
            const pageWidth = 297; // A4 landscape width in mm
            const pageHeight = 210; // A4 landscape height in mm

            // Add image to PDF
            pdf.addImage(imageData, 'JPEG', 0, 0, pageWidth, pageHeight);
        });

        // Save the PDF
        pdf.save('Review_Jurnal_ELM_Dewa_Ketut_Satriawan_Eva_Agustini.pdf');

        restoreAfterExport();
        showNotification('PDF berhasil diunduh!', 'success');
    }

    function restoreAfterExport() {
        // Remove export mode
        document.body.classList.remove('export-mode');

        // Hide loading overlay
        loadingOverlay.style.display = 'none';

        // Restore slides to original state
        slides.forEach(slide => {
            slide.style.position = '';
            slide.style.top = '';
            slide.style.left = '';
            slide.style.width = '';
            slide.style.height = '';
            slide.style.margin = '';
            slide.style.padding = '';
            slide.style.zIndex = '';
            slide.style.background = '';
            slide.style.boxShadow = '';
            slide.style.borderRadius = '';
            slide.style.overflow = '';
            slide.style.display = '';
            slide.style.transform = '';
            slide.style.alignItems = '';
            slide.style.justifyContent = '';
            slide.style.color = '';
            slide.classList.remove('active');

            const slideContent = slide.querySelector('.slide-content');
            if (slideContent) {
                slideContent.style.padding = '';
                slideContent.style.height = '';
                slideContent.style.width = '';
                slideContent.style.boxSizing = '';
                slideContent.style.overflow = '';
                slideContent.style.display = '';
                slideContent.style.flexDirection = '';
                slideContent.style.justifyContent = '';
                slideContent.style.alignItems = '';
                slideContent.style.textAlign = '';
                slideContent.style.color = '';
                slideContent.style.transform = '';
                slideContent.style.transformOrigin = '';
                slideContent.style.position = '';
            }

            // Restore floating icons
            const floatingIcons = slide.querySelector('.floating-icons');
            if (floatingIcons) {
                floatingIcons.style.display = '';
            }
        });

        // Restore controls and current slide
        controls.style.display = originalControlsDisplay || 'flex';
        showSlide(originalCurrentSlide);

        // Reset export state
        isExporting = false;
        exportProgress = 0;
        exportBtn.innerHTML = originalHTML;
        exportBtn.disabled = false;

        console.log('Export process completed and view restored');
    }

    // Start the export process
    setTimeout(captureSlideSequentially, 1000);
}

// ==================== UTILITY FUNCTIONS ====================
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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'error' ? 'exclamation-circle-fill' : type === 'warning' ? 'exclamation-triangle-fill' : 'info-circle-fill'}"></i>
            <span>${message}</span>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6366f1'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ==================== URL HASH NAVIGATION ====================
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    const slideMatch = hash.match(/slide(\d+)/);
    if (slideMatch) {
        const slideNumber = parseInt(slideMatch[1]);
        if (slideNumber >= 1 && slideNumber <= totalSlides) {
            showSlide(slideNumber);
        }
    }
});

window.addEventListener('load', () => {
    const hash = window.location.hash;
    const slideMatch = hash.match(/slide(\d+)/);
    if (slideMatch) {
        const slideNumber = parseInt(slideMatch[1]);
        if (slideNumber >= 1 && slideNumber <= totalSlides) {
            showSlide(slideNumber);
        }
    }
});

// ==================== PRESENTATION TIMER ====================
let presentationStartTime = null;
let timerInterval = null;

function startPresentationTimer() {
    presentationStartTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!presentationStartTime) return;

    const elapsed = Date.now() - presentationStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    console.log(`Presentation time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
}

function stopPresentationTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

if (currentSlide === 1) {
    startPresentationTimer();
}