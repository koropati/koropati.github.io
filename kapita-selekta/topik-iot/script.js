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
    setupMemberPhotoFallback();
    setupSmartCityImageFallback();
    initializeMobileFeatures();
    updateSlideCounter();
    showSlide(currentSlide);
});

// ==================== MEMBER PHOTO FALLBACK ====================
function setupMemberPhotoFallback() {
    const memberImages = document.querySelectorAll('.member-img');
    
    memberImages.forEach(img => {
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

// ==================== SMART CITY IMAGE FALLBACK ====================
function setupSmartCityImageFallback() {
    const smartCityImage = document.querySelector('.smart-city-img');
    
    if (smartCityImage) {
        smartCityImage.addEventListener('error', function() {
            this.style.display = 'none';
            this.classList.add('error');
            const fallback = this.parentElement.querySelector('.illustration-fallback');
            if (fallback) {
                fallback.style.display = 'flex';
            }
        });
        
        smartCityImage.addEventListener('load', function() {
            this.style.display = 'block';
            this.classList.remove('error');
            const fallback = this.parentElement.querySelector('.illustration-fallback');
            if (fallback) {
                fallback.style.display = 'none';
            }
        });
        
        if (!smartCityImage.src || smartCityImage.src === '' || smartCityImage.src === window.location.href) {
            smartCityImage.style.display = 'none';
            smartCityImage.classList.add('error');
            const fallback = smartCityImage.parentElement.querySelector('.illustration-fallback');
            if (fallback) {
                fallback.style.display = 'flex';
            }
        }
    }
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
            -webkit-tap-highlight-color: rgba(52, 152, 219, 0.2);
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
        .tablet-device .penerapan-grid-2col {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
        }
        
        .tablet-device .component-grid,
        .tablet-device .smart-city-pillars {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

// ==================== ENHANCED FULLSCREEN OPTIMIZATION ====================
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
        addScrollIndicators(activeSlide);
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
        slideContent.style.maxWidth = '1600px';
        slideContent.style.margin = '0 auto';
    } else if (viewport.width >= 1200) {
        slideContent.style.padding = '50px 80px';
        // slideContent.style.maxWidth = '1400px';
        slideContent.style.margin = '0 auto';
    } else if (viewport.width >= 1024) {
        slideContent.style.padding = '40px 60px';
    } else if (viewport.width >= 768) {
        slideContent.style.padding = '30px 40px';
    } else {
        slideContent.style.padding = '20px 25px';
    }
    
    applyResponsiveTypography(slide, viewport);
    applyResponsiveGrids(slide, viewport);
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
    
    if (viewport.height <= 600) {
        headings.forEach(heading => {
            if (heading.tagName.toLowerCase() === 'h2') {
                heading.style.fontSize = '1.5rem';
                heading.style.marginBottom = '0.8rem';
            }
        });
    }
}

function applyResponsiveGrids(slide, viewport) {
    const grids = slide.querySelectorAll('.component-grid, .smart-city-pillars, .penerapan-grid, .penerapan-grid-2col, .impact-metrics');
    const rows = slide.querySelectorAll('.row');
    
    grids.forEach(grid => {
        if (viewport.width <= 767) {
            grid.style.gridTemplateColumns = '1fr';
            grid.style.gap = '15px';
        } else if (viewport.width <= 1023) {
            if (grid.classList.contains('penerapan-grid-2col')) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
            }
            grid.style.gap = '20px';
        } else {
            if (grid.classList.contains('penerapan-grid-2col')) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gap = '25px';
            }
        }
    });
    
    if (slide.id === 'slide2') {
        optimizeMemberSlideGrid(slide, viewport);
    }
    
    rows.forEach(row => {
        if (slide.id !== 'slide2') {
            if (viewport.width <= 767) {
                row.style.display = 'block';
                const cols = row.querySelectorAll('[class*="col-"]');
                cols.forEach(col => {
                    col.style.width = '100%';
                    col.style.marginBottom = '20px';
                });
            } else {
                row.style.display = 'flex';
                row.style.flexWrap = 'wrap';
            }
        }
    });
}

function optimizeMemberSlideGrid(slide, viewport) {
    const memberRow = slide.querySelector('.row');
    const memberCards = slide.querySelectorAll('.member-card');
    
    if (!memberRow || memberCards.length === 0) return;
    
    memberRow.style.display = 'grid';
    memberRow.style.alignItems = 'stretch';
    memberRow.style.width = '100%';
    memberRow.style.margin = '0';
    memberRow.style.padding = '0';
    
    if (viewport.width >= 1200) {
        memberRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
        memberRow.style.gap = '25px';
    } else if (viewport.width >= 768) {
        memberRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
        memberRow.style.gap = '20px';
    } else if (viewport.width >= 480) {
        memberRow.style.gridTemplateColumns = 'repeat(2, 1fr)';
        memberRow.style.gap = '15px';
    } else {
        memberRow.style.gridTemplateColumns = '1fr';
        memberRow.style.gap = '15px';
    }
    
    memberCards.forEach(card => {
        const cardParent = card.parentElement;
        
        cardParent.style.padding = '0';
        cardParent.style.margin = '0';
        cardParent.style.width = 'auto';
        cardParent.style.flex = 'none';
        
        card.style.height = 'auto';
        card.style.minHeight = viewport.width <= 767 ? '180px' : '200px';
        card.style.width = '100%';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        card.style.padding = viewport.width <= 767 ? '15px' : '20px';
        card.style.margin = '0';
        card.style.boxSizing = 'border-box';
        
        const photoPlaceholder = card.querySelector('.photo-placeholder');
        if (photoPlaceholder) {
            if (viewport.width <= 767) {
                photoPlaceholder.style.width = '80px';
                photoPlaceholder.style.height = '80px';
                photoPlaceholder.style.fontSize = '2.5rem';
            } else {
                photoPlaceholder.style.width = '100px';
                photoPlaceholder.style.height = '100px';
                photoPlaceholder.style.fontSize = '3rem';
            }
        }
        
        const memberImg = card.querySelector('.member-img');
        if (memberImg) {
            if (viewport.width <= 767) {
                memberImg.style.width = '70px';
                memberImg.style.height = '70px';
            } else {
                memberImg.style.width = '90px';
                memberImg.style.height = '90px';
            }
        }
    });
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

function addScrollIndicators(slide) {
    const slideContent = slide.querySelector('.slide-content');
    if (!slideContent) return;
    
    const existingIndicator = slide.querySelector('.scroll-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const isScrollable = slideContent.scrollHeight > slideContent.clientHeight;
    
    if (isScrollable && isFullscreen) {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '↕';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            z-index: 1000;
            opacity: 0.7;
            transition: opacity 0.3s ease;
            pointer-events: none;
            animation: pulse 2s infinite;
        `;
        
        if (!document.querySelector('#scroll-indicator-keyframes')) {
            const style = document.createElement('style');
            style.id = 'scroll-indicator-keyframes';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        slide.appendChild(indicator);
        
        let hasScrolled = false;
        slideContent.addEventListener('scroll', () => {
            if (!hasScrolled) {
                hasScrolled = true;
                indicator.style.opacity = '0.3';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.remove();
                    }
                }, 3000);
            }
        });
    }
}

function optimizeSlideSpecifics(slide) {
    const slideId = slide.id;
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    
    switch (slideId) {
        case 'slide1':
            optimizeCoverSlide(slide);
            break;
        case 'slide14':
            optimizeThankYouSlide(slide);
            break;
        case 'slide2':
            break; // Already handled in grid optimization
        case 'slide7':
            optimizeCaseStudySlide(slide, viewport);
            break;
        case 'slide8':
            optimizeTechPillarsSlide(slide, viewport);
            break;
        case 'slide9':
            optimizeChallengesSlide(slide, viewport);
            break;
        case 'slide10':
            optimizeTrendsSlide(slide, viewport);
            break;
        case 'slide11':
            optimizeResearchSlide(slide, viewport);
            break;
        case 'slide13':
            optimizeReferencesSlide(slide);
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

function optimizeThankYouSlide(slide) {
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
        
        const containerFluid = slide.querySelector('.container-fluid');
        if (containerFluid) {
            containerFluid.style.width = '100%';
            containerFluid.style.height = '100%';
            containerFluid.style.maxWidth = 'none';
            containerFluid.style.margin = '0';
            containerFluid.style.padding = '20px';
            containerFluid.style.display = 'flex';
            containerFluid.style.alignItems = 'center';
            containerFluid.style.justifyContent = 'center';
            containerFluid.style.boxSizing = 'border-box';
        }
        
        const row = slide.querySelector('.row');
        if (row) {
            row.style.width = '100%';
            row.style.height = '100%';
            row.style.margin = '0';
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'center';
        }
        
        const col = slide.querySelector('.col-12');
        if (col) {
            col.style.display = 'flex';
            col.style.flexDirection = 'column';
            col.style.alignItems = 'center';
            col.style.justifyContent = 'center';
            col.style.textAlign = 'center';
            col.style.width = '100%';
            col.style.height = '100%';
        }
        
        const h2 = slide.querySelector('h2');
        const h4 = slide.querySelector('h4');
        const thankYouIcon = slide.querySelector('.thank-you-icon');
        const contactInfo = slide.querySelector('.contact-info');
        
        if (h2) {
            h2.style.fontSize = '4rem';
            h2.style.lineHeight = '1.1';
            h2.style.marginBottom = '1rem';
            h2.style.color = 'white';
        }
        
        if (h4) {
            h4.style.fontSize = '2rem';
            h4.style.marginBottom = '1.5rem';
            h4.style.color = 'white';
        }
        
        if (thankYouIcon) {
            thankYouIcon.style.fontSize = '4rem';
            thankYouIcon.style.margin = '2rem 0';
        }
        
        if (contactInfo) {
            contactInfo.style.marginTop = '1.5rem';
        }
    }
}

function optimizeCaseStudySlide(slide, viewport) {
    const caseStudyRow = slide.querySelector('.row');
    if (!caseStudyRow) return;
    
    caseStudyRow.style.display = 'grid';
    caseStudyRow.style.alignItems = 'stretch';
    caseStudyRow.style.gap = '25px';
    caseStudyRow.style.margin = '0';
    
    if (viewport.width <= 767) {
        caseStudyRow.style.gridTemplateColumns = '1fr';
        caseStudyRow.style.gap = '20px';
    } else if (viewport.width <= 1023) {
        caseStudyRow.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        caseStudyRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
    
    const cards = slide.querySelectorAll('.case-study-card');
    cards.forEach(card => {
        card.style.height = '100%';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            cardBody.style.flex = '1';
        }
    });
}

function optimizeTechPillarsSlide(slide, viewport) {
    const techRow = slide.querySelector('.row');
    if (!techRow) return;
    
    techRow.style.display = 'grid';
    techRow.style.alignItems = 'stretch';
    techRow.style.gap = '25px';
    techRow.style.margin = '0';
    
    if (viewport.width <= 767) {
        techRow.style.gridTemplateColumns = '1fr';
        techRow.style.gap = '20px';
    } else if (viewport.width <= 1023) {
        techRow.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        techRow.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
    
    const pillars = slide.querySelectorAll('.tech-pillar');
    pillars.forEach(pillar => {
        pillar.style.height = '100%';
        pillar.style.display = 'flex';
        pillar.style.flexDirection = 'column';
        
        const list = pillar.querySelector('ul');
        if (list) {
            list.style.flex = '1';
        }
    });
}

function optimizeChallengesSlide(slide, viewport) {
    const challengeRow = slide.querySelector('.row');
    if (!challengeRow) return;
    
    challengeRow.style.display = 'grid';
    challengeRow.style.alignItems = 'start';
    challengeRow.style.gap = '25px';
    challengeRow.style.margin = '0';
    
    if (viewport.width <= 767) {
        challengeRow.style.gridTemplateColumns = '1fr';
        challengeRow.style.gap = '20px';
    } else {
        challengeRow.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
    
    const challengeBoxes = slide.querySelectorAll('.challenge-box');
    challengeBoxes.forEach(box => {
        if (viewport.width <= 767) {
            box.style.flexDirection = 'column';
            const icon = box.querySelector('.challenge-icon');
            if (icon) {
                icon.style.minWidth = 'auto';
                icon.style.width = '100%';
                icon.style.padding = '15px';
            }
        }
    });
}

function optimizeTrendsSlide(slide, viewport) {
    const trendsRow = slide.querySelector('.row');
    if (!trendsRow) return;
    
    trendsRow.style.display = 'grid';
    trendsRow.style.alignItems = 'start';
    trendsRow.style.gap = '25px';
    trendsRow.style.margin = '0';
    
    if (viewport.width <= 767) {
        trendsRow.style.gridTemplateColumns = '1fr';
        trendsRow.style.gap = '20px';
    } else {
        trendsRow.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
    
    const trendItems = slide.querySelectorAll('.trend-item');
    trendItems.forEach(item => {
        if (viewport.width <= 767) {
            item.style.flexDirection = 'column';
            item.style.textAlign = 'center';
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.marginRight = '0';
                icon.style.marginBottom = '10px';
            }
        }
    });
}

function optimizeResearchSlide(slide, viewport) {
    const researchRow = slide.querySelector('.row');
    if (!researchRow) return;
    
    researchRow.style.display = 'grid';
    researchRow.style.alignItems = 'start';
    researchRow.style.gap = '25px';
    researchRow.style.margin = '0';
    
    if (viewport.width <= 767) {
        researchRow.style.gridTemplateColumns = '1fr';
        researchRow.style.gap = '20px';
    } else {
        researchRow.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
    
    const researchItems = slide.querySelectorAll('.research-item');
    researchItems.forEach(item => {
        item.style.height = '100%';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        
        const content = item.querySelector('.research-content');
        if (content) {
            content.style.flex = '1';
        }
    });
}

function optimizeReferencesSlide(slide) {
    const references = slide.querySelector('.references');
    if (references) {
        references.style.maxHeight = 'calc(100vh - 200px)';
        references.style.overflowY = 'auto';
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
        
        const containerFluid = slide.querySelector('.container-fluid');
        if (containerFluid) {
            containerFluid.style.width = '';
            containerFluid.style.height = '';
            containerFluid.style.maxWidth = '';
            containerFluid.style.margin = '';
            containerFluid.style.padding = '';
            containerFluid.style.display = '';
            containerFluid.style.alignItems = '';
            containerFluid.style.justifyContent = '';
            containerFluid.style.boxSizing = '';
        }
        
        const row = slide.querySelector('.row');
        if (row) {
            row.style.width = '';
            row.style.height = '';
            row.style.margin = '';
            row.style.display = '';
            row.style.alignItems = '';
            row.style.justifyContent = '';
        }
        
        const col = slide.querySelector('.col-12');
        if (col) {
            col.style.display = '';
            col.style.flexDirection = '';
            col.style.alignItems = '';
            col.style.justifyContent = '';
            col.style.textAlign = '';
            col.style.width = '';
            col.style.height = '';
        }
        
        const h1 = slide.querySelector('h1');
        const h2 = slide.querySelector('h2');
        const h3 = slide.querySelector('h3');
        const h4 = slide.querySelector('h4');
        const coverIcon = slide.querySelector('.cover-icon');
        const thankYouIcon = slide.querySelector('.thank-you-icon');
        const coverInfo = slide.querySelector('.cover-info');
        const contactInfo = slide.querySelector('.contact-info');
        
        if (h1) {
            h1.style.fontSize = '';
            h1.style.lineHeight = '';
            h1.style.marginBottom = '';
            h1.style.color = '';
        }
        if (h2) {
            h2.style.fontSize = '';
            h2.style.lineHeight = '';
            h2.style.marginBottom = '';
            h2.style.color = '';
        }
        if (h3) {
            h3.style.fontSize = '';
            h3.style.marginBottom = '';
            h3.style.color = '';
        }
        if (h4) {
            h4.style.fontSize = '';
            h4.style.marginBottom = '';
            h4.style.color = '';
        }
        if (coverIcon) {
            coverIcon.style.fontSize = '';
            coverIcon.style.margin = '';
        }
        if (thankYouIcon) {
            thankYouIcon.style.fontSize = '';
            thankYouIcon.style.margin = '';
        }
        if (coverInfo) {
            coverInfo.style.marginTop = '';
        }
        if (contactInfo) {
            contactInfo.style.marginTop = '';
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
                slide.style.background = 'linear-gradient(135deg, #3498db, #1abc9c)';
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
            const memberRow = slide.querySelector('.row');
            const memberCards = slide.querySelectorAll('.member-card');
            
            if (memberRow && memberCards.length > 0) {
                memberRow.style.display = 'grid';
                memberRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
                memberRow.style.gap = '25px';
                memberRow.style.margin = '0';
                memberRow.style.padding = '0';
                memberRow.style.width = '100%';
                // memberRow.style.maxWidth = '1400px';
                memberRow.style.marginLeft = 'auto';
                memberRow.style.marginRight = 'auto';
                
                memberCards.forEach((card, index) => {
                    const cardParent = card.parentElement;
                    
                    cardParent.style.padding = '0';
                    cardParent.style.margin = '0';
                    cardParent.style.width = 'auto';
                    cardParent.style.flex = 'none';
                    
                    card.style.height = '280px';
                    card.style.width = '100%';
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.justifyContent = 'space-between';
                    card.style.padding = '20px';
                    card.style.margin = '0';
                    card.style.boxSizing = 'border-box';
                    card.style.backgroundColor = 'white';
                    card.style.borderRadius = '12px';
                    card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                    card.style.border = '1px solid rgba(52, 152, 219, 0.1)';
                    
                    const photoPlaceholder = card.querySelector('.photo-placeholder');
                    if (photoPlaceholder) {
                        photoPlaceholder.style.width = '100px';
                        photoPlaceholder.style.height = '100px';
                        photoPlaceholder.style.margin = '0 auto 15px auto';
                        photoPlaceholder.style.borderRadius = '50%';
                        photoPlaceholder.style.background = 'linear-gradient(135deg, #3498db, #1abc9c)';
                        photoPlaceholder.style.display = 'flex';
                        photoPlaceholder.style.alignItems = 'center';
                        photoPlaceholder.style.justifyContent = 'center';
                        photoPlaceholder.style.color = 'white';
                        photoPlaceholder.style.fontSize = '3rem';
                        photoPlaceholder.style.position = 'relative';
                        photoPlaceholder.style.overflow = 'hidden';
                        photoPlaceholder.style.padding = '5px';
                        
                        const memberImg = photoPlaceholder.querySelector('.member-img');
                        if (memberImg && memberImg.src && !memberImg.classList.contains('error')) {
                            memberImg.style.width = '90px';
                            memberImg.style.height = '90px';
                            memberImg.style.borderRadius = '50%';
                            memberImg.style.objectFit = 'cover';
                            memberImg.style.objectPosition = 'center';
                            memberImg.style.display = 'block';
                            memberImg.style.zIndex = '2';
                            memberImg.style.position = 'relative';
                        }
                        
                        const fallback = photoPlaceholder.querySelector('.photo-fallback');
                        if (fallback) {
                            fallback.style.position = 'absolute';
                            fallback.style.top = '50%';
                            fallback.style.left = '50%';
                            fallback.style.transform = 'translate(-50%, -50%)';
                            fallback.style.fontSize = '3rem';
                            fallback.style.color = 'white';
                            fallback.style.zIndex = '1';
                            
                            const img = photoPlaceholder.querySelector('.member-img');
                            if (!img || !img.src || img.classList.contains('error')) {
                                fallback.style.display = 'block';
                            } else {
                                fallback.style.display = 'none';
                            }
                        }
                    }
                    
                    const memberInfo = card.querySelector('.member-info');
                    if (memberInfo) {
                        memberInfo.style.textAlign = 'center';
                        
                        const name = memberInfo.querySelector('h5');
                        const nim = memberInfo.querySelector('.nim');
                        
                        if (name) {
                            name.style.fontSize = '1.1rem';
                            name.style.fontWeight = '600';
                            name.style.color = '#2c3e50';
                            name.style.marginBottom = '8px';
                            name.style.lineHeight = '1.3';
                        }
                        
                        if (nim) {
                            nim.style.fontSize = '0.95rem';
                            nim.style.color = '#95a5a6';
                            nim.style.fontWeight = '500';
                            nim.style.margin = '0';
                        }
                    }
                });
                
                if (memberCards.length === 8) {
                    memberRow.style.gridTemplateRows = 'repeat(2, 1fr)';
                    memberRow.style.height = 'auto';
                    memberRow.style.alignItems = 'stretch';
                }
            }
        }
        
        const grids = slide.querySelectorAll('.component-grid, .smart-city-pillars, .penerapan-grid, .penerapan-grid-2col, .impact-metrics');
        grids.forEach(grid => {
            if (slide.id === 'slide2' && grid.closest('.row')) {
                return;
            }
            
            if (grid.classList.contains('penerapan-grid-2col')) {
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gap = '25px';
                grid.style.alignItems = 'start';
                grid.style.marginTop = '20px';
                
                const items = grid.querySelectorAll('.penerapan-item');
                items.forEach(item => {
                    item.style.height = 'auto';
                    item.style.minHeight = '250px';
                    item.style.display = 'flex';
                    item.style.flexDirection = 'column';
                    
                    const body = item.querySelector('.penerapan-body');
                    if (body) {
                        body.style.flex = '1';
                        body.style.padding = '20px';
                    }
                });
                
                return;
            }
            
            const itemCount = grid.children.length;
            let columns = 3;
            
            if (itemCount <= 2) columns = 2;
            else if (itemCount <= 4) columns = 2;
            else if (itemCount <= 6) columns = 3;
            else columns = 4;
            
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            grid.style.gap = '20px';
            grid.style.alignItems = 'stretch';
        });
        
        if (slideId === 'slide13') {
            const references = slide.querySelector('.references');
            if (references) {
                references.style.maxHeight = '900px';
                references.style.overflowY = 'auto';
                references.style.fontSize = '14px';
                references.style.lineHeight = '1.4';
            }
        }
        
        if (slideId === 'slide12') {
            const smartCityImg = slide.querySelector('.smart-city-img');
            const illustrationFallback = slide.querySelector('.illustration-fallback');
            
            if (smartCityImg) {
                smartCityImg.style.maxWidth = '350px';
                smartCityImg.style.maxHeight = '250px';
                smartCityImg.style.objectFit = 'cover';
                smartCityImg.style.borderRadius = '12px';
            }
            
            if (illustrationFallback) {
                illustrationFallback.style.maxWidth = '350px';
                illustrationFallback.style.height = '250px';
                illustrationFallback.style.borderRadius = '12px';
            }
            
            const conclusionContainer = slide.querySelector('.conclusion-visual-container');
            if (conclusionContainer) {
                conclusionContainer.style.gap = '20px';
            }
        }
        
        const headings = slide.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.marginBottom = '20px';
            heading.style.lineHeight = '1.2';
        });
        
        const paragraphs = slide.querySelectorAll('p, li');
        paragraphs.forEach(p => {
            if (!p.closest('.member-info')) {
                p.style.fontSize = '16px';
                p.style.lineHeight = '1.6';
            }
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
        
        pdf.save('IoT_untuk_Kota_Pintar_Kelompok_4.pdf');
        
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
                slideContent.style.position = '';
                slideContent.style.top = '';
                slideContent.style.left = '';
                slideContent.style.right = '';
                slideContent.style.bottom = '';
                slideContent.style.margin = '';
            }
            
            const containerFluid = slide.querySelector('.container-fluid');
            if (containerFluid) {
                containerFluid.style.width = '';
                containerFluid.style.height = '';
                containerFluid.style.maxWidth = '';
                containerFluid.style.margin = '';
                containerFluid.style.padding = '';
                containerFluid.style.display = '';
                containerFluid.style.alignItems = '';
                containerFluid.style.justifyContent = '';
                containerFluid.style.boxSizing = '';
            }
            
            const row = slide.querySelector('.row');
            if (row) {
                row.style.width = '';
                row.style.height = '';
                row.style.margin = '';
                row.style.display = '';
                row.style.alignItems = '';
                row.style.justifyContent = '';
            }
            
            const col = slide.querySelector('.col-12');
            if (col) {
                col.style.display = '';
                col.style.flexDirection = '';
                col.style.alignItems = '';
                col.style.justifyContent = '';
                col.style.textAlign = '';
                col.style.width = '';
                col.style.height = '';
            }
            
            const h1 = slide.querySelector('h1');
            const h2 = slide.querySelector('h2');
            const h3 = slide.querySelector('h3');
            const h4 = slide.querySelector('h4');
            const coverIcon = slide.querySelector('.cover-icon');
            const thankYouIcon = slide.querySelector('.thank-you-icon');
            const coverInfo = slide.querySelector('.cover-info');
            const contactInfo = slide.querySelector('.contact-info');
            
            if (h1) {
                h1.style.fontSize = '';
                h1.style.lineHeight = '';
                h1.style.marginBottom = '';
                h1.style.color = '';
            }
            if (h2) {
                h2.style.fontSize = '';
                h2.style.lineHeight = '';
                h2.style.marginBottom = '';
                h2.style.color = '';
            }
            if (h3) {
                h3.style.fontSize = '';
                h3.style.marginBottom = '';
                h3.style.color = '';
            }
            if (h4) {
                h4.style.fontSize = '';
                h4.style.marginBottom = '';
                h4.style.color = '';
            }
            if (coverIcon) {
                coverIcon.style.fontSize = '';
                coverIcon.style.margin = '';
            }
            if (thankYouIcon) {
                thankYouIcon.style.fontSize = '';
                thankYouIcon.style.margin = '';
            }
            if (coverInfo) {
                coverInfo.style.marginTop = '';
            }
            if (contactInfo) {
                contactInfo.style.marginTop = '';
            }
            
            const grids = slide.querySelectorAll('.component-grid, .smart-city-pillars, .penerapan-grid, .impact-metrics');
            grids.forEach(grid => {
                grid.style.display = '';
                grid.style.gridTemplateColumns = '';
                grid.style.gap = '';
                grid.style.alignItems = '';
            });
            
            const memberRow = slide.querySelector('.row');
            if (memberRow && slide.id === 'slide2') {
                memberRow.style.display = '';
                memberRow.style.gridTemplateColumns = '';
                memberRow.style.gap = '';
                memberRow.style.margin = '';
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
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
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