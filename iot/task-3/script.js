// ==================== GLOBAL VARIABLES ====================
let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;
let isFullscreen = false;
let animationTimeout = null;
let hasSwipedOnce = false;

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
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'block';
            }
        });
        
        img.addEventListener('load', function() {
            this.style.display = 'block';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'none';
            }
        });
        
        if (!img.src || img.src === '' || img.src === window.location.href) {
            img.style.display = 'none';
            const fallback = img.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'block';
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
            -webkit-tap-highlight-color: rgba(37, 99, 235, 0.2);
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
    
    const style = document.createElement('style');
    style.textContent = `
        .tablet-device .arch-components {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        
        .tablet-device .aiot-reasons,
        .tablet-device .algorithm-steps {
            gap: 20px;
        }
    `;
    document.head.appendChild(style);
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
    }, { passive: true });
    
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
    }, { passive: false });
    
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
    }, { passive: true });
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
    const newSlide = direction === 'next' 
        ? Math.min(currentSlide + 1, totalSlides)
        : Math.max(currentSlide - 1, 1);
    
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

        if (!isFullscreen || (slideNumber !== 1 && slideNumber !== 14)) {
            targetSlide.style.opacity = '0';
            targetSlide.style.transform = slideNumber > previousSlide 
                ? 'translateX(50px)' 
                : 'translateX(-50px)';
            
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
    }

    updateNavigationButtons();
    updateSlideCounter();
    history.replaceState(null, null, `#slide${slideNumber}`);
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
    counter.style.webkitBackgroundClip = 'text';
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
            
        case '1': case '2': case '3': case '4': case '5':
        case '6': case '7': case '8': case '9':
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
            switch(heading.tagName.toLowerCase()) {
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
            switch(heading.tagName.toLowerCase()) {
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
        case 'slide14':
            optimizeCoverSlide(slide);
            break;
        case 'slide2':
            optimizeProfileSlide(slide);
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
    const enhancedProfileCard = slide.querySelector('.enhanced-profile-card');
    if (enhancedProfileCard && isFullscreen) {
        enhancedProfileCard.style.maxWidth = '900px';
        enhancedProfileCard.style.margin = '0 auto';
        
        const profileMain = slide.querySelector('.profile-main');
        if (profileMain && window.innerWidth < 1024) {
            profileMain.style.flexDirection = 'column';
            profileMain.style.alignItems = 'center';
            profileMain.style.textAlign = 'center';
        }
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

// ==================== PDF EXPORT FUNCTIONALITY ====================
function exportToPDF() {
    const exportBtn = document.getElementById('exportBtn');
    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exporting...';
    exportBtn.disabled = true;
    
    const controls = document.querySelector('.slide-controls');
    const originalControlsDisplay = controls.style.display;
    controls.style.display = 'none';
    
    const originalCurrentSlide = currentSlide;
    const slides = document.querySelectorAll('.slide');
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
    });
    
    let currentSlideIndex = 0;
    let slideImages = [];
    
    function captureSlideSequentially() {
        if (currentSlideIndex >= slides.length) {
            createFinalPDF();
            return;
        }
        
        const slide = slides[currentSlideIndex];
        const slideNumber = currentSlideIndex + 1;
        
        exportBtn.innerHTML = `<i class="bi bi-hourglass-split"></i> Capturing slide ${slideNumber}/${slides.length}...`;
        
        prepareSlideForCapture(slide, slideNumber)
            .then(() => captureSlideAsImage(slide, slideNumber))
            .then((imageData) => {
                slideImages.push(imageData);
                currentSlideIndex++;
                setTimeout(captureSlideSequentially, 300);
            })
            .catch((error) => {
                console.error(`Error capturing slide ${slideNumber}:`, error);
                currentSlideIndex++;
                setTimeout(captureSlideSequentially, 100);
            });
    }
    
    function prepareSlideForCapture(slide, slideNumber) {
        return new Promise((resolve) => {
            slides.forEach(s => {
                s.style.display = 'none';
                s.classList.remove('active');
            });
            
            slide.style.display = 'flex';
            slide.classList.add('active');
            slide.style.position = 'fixed';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '1920px';
            slide.style.height = '1080px';
            slide.style.margin = '0';
            slide.style.padding = '0';
            slide.style.zIndex = '9999';
            slide.style.boxShadow = 'none';
            slide.style.borderRadius = '0';
            slide.style.overflow = 'hidden';
            slide.style.transform = 'scale(1)';
            
            if (slide.classList.contains('cover-slide') || slide.classList.contains('thank-you-slide')) {
                slide.style.background = 'linear-gradient(135deg, #2563eb, #06b6d4)';
            } else {
                slide.style.background = 'white';
            }
            
            const slideContent = slide.querySelector('.slide-content');
            if (slideContent) {
                slideContent.style.padding = '60px';
                slideContent.style.height = '100%';
                slideContent.style.width = '100%';
                slideContent.style.boxSizing = 'border-box';
                slideContent.style.display = 'flex';
                slideContent.style.flexDirection = 'column';
                slideContent.style.overflow = 'visible';
                
                if (slide.classList.contains('cover-slide') || slide.classList.contains('thank-you-slide')) {
                    slideContent.style.justifyContent = 'center';
                    slideContent.style.alignItems = 'center';
                    slideContent.style.textAlign = 'center';
                    slideContent.style.color = 'white';
                }
            }
            
            optimizeSlideLayout(slide);
            setTimeout(resolve, 500);
        });
    }
    
    function optimizeSlideLayout(slide) {
        const slideId = slide.id;
        
        if (slideId === 'slide2') {
            const enhancedProfileCard = slide.querySelector('.enhanced-profile-card');
            if (enhancedProfileCard) {
                enhancedProfileCard.style.maxWidth = '800px';
                enhancedProfileCard.style.margin = '0 auto';
                
                const profileMain = slide.querySelector('.profile-main');
                if (profileMain) {
                    profileMain.style.flexDirection = 'row';
                    profileMain.style.alignItems = 'flex-start';
                    profileMain.style.gap = '30px';
                    profileMain.style.padding = '30px';
                }
                
                const profileGrid = slide.querySelector('.profile-grid');
                if (profileGrid) {
                    profileGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    profileGrid.style.gap = '15px';
                }
                
                const expertiseTags = slide.querySelector('.expertise-tags');
                if (expertiseTags) {
                    expertiseTags.style.gap = '10px';
                }
            }
        }
        
        const headings = slide.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.marginBottom = '20px';
            heading.style.lineHeight = '1.2';
        });
        
        const paragraphs = slide.querySelectorAll('p, li');
        paragraphs.forEach(p => {
            p.style.fontSize = '16px';
            p.style.lineHeight = '1.6';
        });
    }
    
    function captureSlideAsImage(slide, slideNumber) {
        return new Promise((resolve, reject) => {
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
                backgroundColor: slide.classList.contains('cover-slide') || slide.classList.contains('thank-you-slide') ? null : '#ffffff'
            }).then(canvas => {
                const imageData = canvas.toDataURL('image/jpeg', 0.95);
                resolve(imageData);
            }).catch(reject);
        });
    }
    
    function createFinalPDF() {
        exportBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Creating PDF...';
        
        if (slideImages.length === 0) {
            restoreAfterExport();
            exportBtn.innerHTML = originalHTML;
            exportBtn.disabled = false;
            showNotification('Gagal mengunduh PDF. Tidak ada slide yang berhasil dicapture.', 'error');
            return;
        }
        
        pdf.deletePage(1);
        
        slideImages.forEach((imageData, index) => {
            pdf.addPage('a4', 'landscape');
            pdf.addImage(imageData, 'JPEG', 0, 0, 297, 210);
        });
        
        pdf.save('AIoT_OCR_Water_Meter_Dewa_Ketut_Satriawan.pdf');
        
        restoreAfterExport();
        exportBtn.innerHTML = originalHTML;
        exportBtn.disabled = false;
        showNotification('PDF berhasil diunduh!', 'success');
    }
    
    function restoreAfterExport() {
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
            }
        });
        
        controls.style.display = originalControlsDisplay || 'flex';
        showSlide(originalCurrentSlide);
    }
    
    captureSlideSequentially();
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
            <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
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
    }, 3000);
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