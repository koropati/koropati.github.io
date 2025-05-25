// ==================== GLOBAL VARIABLES ====================
let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;
let isFullscreen = false;
let animationTimeout = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializePresentation();
    setupEventListeners();
    setupMemberPhotoFallback(); // Add photo fallback handler
    setupSmartCityImageFallback(); // Add smart city image fallback handler
    updateSlideCounter();
    showSlide(currentSlide);
});

// ==================== MEMBER PHOTO FALLBACK ====================
function setupMemberPhotoFallback() {
    const memberImages = document.querySelectorAll('.member-img');
    
    memberImages.forEach(img => {
        // Handle image load error
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'block';
            }
        });
        
        // Handle successful image load
        img.addEventListener('load', function() {
            this.style.display = 'block';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'none';
            }
        });
        
        // Check if image source is empty or invalid
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
        // Handle image load error
        smartCityImage.addEventListener('error', function() {
            this.style.display = 'none';
            this.classList.add('error');
            const fallback = this.parentElement.querySelector('.illustration-fallback');
            if (fallback) {
                fallback.style.display = 'flex';
            }
        });
        
        // Handle successful image load
        smartCityImage.addEventListener('load', function() {
            this.style.display = 'block';
            this.classList.remove('error');
            const fallback = this.parentElement.querySelector('.illustration-fallback');
            if (fallback) {
                fallback.style.display = 'none';
            }
        });
        
        // Check if image source is empty or invalid
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

function initializePresentation() {
    // Add tooltips to control buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exportBtn = document.getElementById('exportBtn');

    prevBtn.setAttribute('title', 'Previous Slide (← or Left Arrow)');
    nextBtn.setAttribute('title', 'Next Slide (→ or Right Arrow)');
    fullscreenBtn.setAttribute('title', 'Toggle Fullscreen (F key or click)');
    exportBtn.setAttribute('title', 'Export to PDF');

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Initialize slide numbering
    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.setAttribute('data-slide-number', index + 1);
    });
}

function setupEventListeners() {
    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => navigateSlide('prev'));
    document.getElementById('nextBtn').addEventListener('click', () => navigateSlide('next'));
    
    // Fullscreen button
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportToPDF);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Window resize handler
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Touch/swipe support for mobile
    setupTouchNavigation();
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
    // Clear any existing animation timeout
    if (animationTimeout) {
        clearTimeout(animationTimeout);
    }

    // Validate slide number
    if (slideNumber < 1 || slideNumber > totalSlides) {
        return;
    }

    // Update current slide
    const previousSlide = currentSlide;
    currentSlide = slideNumber;

    // Reset ALL slides styles first
    document.querySelectorAll('.slide').forEach((slide) => {
        slide.classList.remove('active');
        
        // Reset positioning for all slides
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

    // Show target slide with animation
    const targetSlide = document.getElementById(`slide${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
        
        if (isFullscreen) {
            targetSlide.style.display = 'flex';
            // Ensure proper fullscreen layout
            setTimeout(() => {
                optimizeForFullscreen(targetSlide);
            }, 50);
        } else {
            // Reset any fullscreen-specific styles when not in fullscreen
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
            
            // Smooth scroll to slide for non-fullscreen view
            targetSlide.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }

        // Add slide transition animation
        if (!isFullscreen || (slideNumber !== 1 && slideNumber !== 14)) {
            targetSlide.style.opacity = '0';
            targetSlide.style.transform = slideNumber > previousSlide 
                ? 'translateX(50px)' 
                : 'translateX(-50px)';
            
            animationTimeout = setTimeout(() => {
                targetSlide.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                targetSlide.style.opacity = '1';
                targetSlide.style.transform = 'translateX(0)';
                
                // Clear transition after animation
                setTimeout(() => {
                    targetSlide.style.transition = '';
                }, 300);
            }, 50);
        } else {
            // For fullscreen cover/thank you slides, ensure immediate visibility
            targetSlide.style.opacity = '1';
            targetSlide.style.transform = 'translateX(0)';
        }
    }

    // Update navigation buttons state
    updateNavigationButtons();
    updateSlideCounter();
    
    // Update URL hash without triggering scroll
    history.replaceState(null, null, `#slide${slideNumber}`);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
    
    // Add visual feedback
    prevBtn.style.opacity = currentSlide === 1 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === totalSlides ? '0.5' : '1';
}

function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    counter.textContent = `${currentSlide} / ${totalSlides}`;
    
    // Add progress indicator
    const progress = (currentSlide / totalSlides) * 100;
    counter.style.background = `linear-gradient(90deg, var(--primary-color) ${progress}%, transparent ${progress}%)`;
    counter.style.backgroundClip = 'text';
    counter.style.webkitBackgroundClip = 'text';
    counter.style.fontWeight = 'bold';
    
    // Fallback for browsers that don't support background-clip
    setTimeout(() => {
        if (getComputedStyle(counter).color === 'transparent') {
            counter.style.background = '';
            counter.style.color = 'var(--dark-color)';
        }
    }, 100);
}

// ==================== KEYBOARD NAVIGATION ====================
function handleKeyNavigation(event) {
    // Prevent navigation when user is typing in an input
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
        case ' ': // Spacebar
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
            
        // Number keys for direct slide navigation
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
            optimizeForFullscreen();
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
        optimizeForFullscreen();
    } else {
        document.body.classList.remove('is-fullscreen');
        
        // Add a small delay to ensure smooth transition out of fullscreen
        setTimeout(() => {
            restoreNormalView();
            
            // Ensure slide controls are visible and properly positioned
            const controls = document.querySelector('.slide-controls');
            if (controls) {
                controls.style.display = 'flex';
                controls.style.position = 'fixed';
                controls.style.top = '0';
                controls.style.left = '0';
                controls.style.right = '0';
                controls.style.zIndex = '1000';
            }
            
            // Force re-render of current slide
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

function optimizeForFullscreen(targetSlide = null) {
    if (!isFullscreen) return;
    
    // Hide all slides except active one
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.display = slide.classList.contains('active') ? 'flex' : 'none';
    });
    
    const activeSlide = targetSlide || document.querySelector('.slide.active');
    if (!activeSlide) return;
    
    const slideContent = activeSlide.querySelector('.slide-content');
    if (!slideContent) return;
    
    // Reset any previous transformations
    slideContent.style.transform = '';
    slideContent.style.overflow = 'auto';
    
    // Check if content fits in viewport
    setTimeout(() => {
        const contentHeight = slideContent.scrollHeight;
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - 80; // Account for padding
        
        if (contentHeight > availableHeight) {
            slideContent.style.transformOrigin = 'center center';
            slideContent.style.overflow = 'hidden';
        }
        
        // Optimize specific slide types
        optimizeSlideSpecifics(activeSlide);
    }, 100);
}

function optimizeSlideSpecifics(slide) {
    const slideId = slide.id;
    
    // Specific optimizations for different slide types
    switch (slideId) {
        case 'slide1': // Cover slide
            optimizeCoverSlide(slide);
            break;
        case 'slide14': // Thank you slide
            optimizeThankYouSlide(slide);
            break;
        case 'slide2': // Member cards
            optimizeMemberSlide(slide);
            break;
        case 'slide11': // Research slide
            optimizeResearchSlide(slide);
            break;
        case 'slide13': // References
            optimizeReferencesSlide(slide);
            break;
    }
}

function optimizeCoverSlide(slide) {
    if (!isFullscreen) return;
    
    // Force absolute positioning for true fullscreen
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
    
    // Force absolute positioning for true fullscreen (same as cover slide)
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
        
        // Ensure container fluid takes full space
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
        
        // Optimize Bootstrap row and col
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
        
        // Optimize text sizes for fullscreen
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

function optimizeMemberSlide(slide) {
    const memberCards = slide.querySelectorAll('.member-card');
    memberCards.forEach(card => {
        card.style.minHeight = 'auto';
    });
}

function optimizeResearchSlide(slide) {
    const researchItems = slide.querySelectorAll('.research-item');
    researchItems.forEach(item => {
        item.style.marginBottom = '20px';
    });
}

function optimizeReferencesSlide(slide) {
    const references = slide.querySelector('.references');
    if (references) {
        references.style.maxHeight = 'calc(100vh - 200px)';
        references.style.overflowY = 'auto';
    }
}

function restoreNormalView() {
    // Reset all slide displays and positioning
    document.querySelectorAll('.slide').forEach(slide => {
        // Reset slide positioning
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
            // Reset slide content positioning and sizing
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
        
        // Reset Bootstrap components
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
        
        // Reset text elements sizing
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
    
    // Show only active slide
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.display = slide.classList.contains('active') ? 'flex' : 'none';
    });
    
    // Small delay to ensure proper rendering
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

// ==================== PDF EXPORT (FIXED - FULLSCREEN CAPTURE) ====================
function exportToPDF() {
    // Show loading state
    const exportBtn = document.getElementById('exportBtn');
    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exporting...';
    exportBtn.disabled = true;
    
    // Hide controls during export
    const controls = document.querySelector('.slide-controls');
    const originalControlsDisplay = controls.style.display;
    controls.style.display = 'none';
    
    // Store current slide state
    const originalCurrentSlide = currentSlide;
    const slides = document.querySelectorAll('.slide');
    
    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
    });
    
    let currentSlideIndex = 0;
    let slideImages = [];
    
    // Function to capture slides one by one
    function captureSlideSequentially() {
        if (currentSlideIndex >= slides.length) {
            // All slides captured, create PDF
            createFinalPDF();
            return;
        }
        
        const slide = slides[currentSlideIndex];
        const slideNumber = currentSlideIndex + 1;
        
        // Update loading message
        exportBtn.innerHTML = `<i class="bi bi-hourglass-split"></i> Capturing slide ${slideNumber}/${slides.length}...`;
        
        // Prepare slide for capture
        prepareSlideForCapture(slide, slideNumber)
            .then(() => captureSlideAsImage(slide, slideNumber))
            .then((imageData) => {
                slideImages.push(imageData);
                currentSlideIndex++;
                // Small delay before next slide
                setTimeout(captureSlideSequentially, 300);
            })
            .catch((error) => {
                console.error(`Error capturing slide ${slideNumber}:`, error);
                // Continue with next slide even if one fails
                currentSlideIndex++;
                setTimeout(captureSlideSequentially, 100);
            });
    }
    
    function prepareSlideForCapture(slide, slideNumber) {
        return new Promise((resolve) => {
            // Hide all slides first
            slides.forEach(s => {
                s.style.display = 'none';
                s.classList.remove('active');
            });
            
            // Show and style current slide for fullscreen capture
            slide.style.display = 'flex';
            slide.classList.add('active');
            slide.style.position = 'fixed';
            slide.style.top = '0';
            slide.style.left = '0';
            slide.style.width = '1920px'; // Fixed width for consistent capture
            slide.style.height = '1080px'; // Fixed height for consistent capture
            slide.style.margin = '0';
            slide.style.padding = '0';
            slide.style.zIndex = '9999';
            slide.style.boxShadow = 'none';
            slide.style.borderRadius = '0';
            slide.style.overflow = 'hidden';
            slide.style.transform = 'scale(1)';
            
            // Set background based on slide type
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
                
                // Special styling for cover and thank you slides
                if (slide.classList.contains('cover-slide') || slide.classList.contains('thank-you-slide')) {
                    slideContent.style.justifyContent = 'center';
                    slideContent.style.alignItems = 'center';
                    slideContent.style.textAlign = 'center';
                    slideContent.style.color = 'white';
                }
            }
            
            // Optimize layout for each slide
            optimizeSlideLayout(slide);
            
            // Wait for layout and fonts to load
            setTimeout(resolve, 500);
        });
    }
    
    function optimizeSlideLayout(slide) {
        // Handle different slide layouts
        const slideId = slide.id;
        
        // Member cards slide (slide2) - FIXED LAYOUT
        if (slideId === 'slide2') {
            const memberRow = slide.querySelector('.row');
            const memberCards = slide.querySelectorAll('.member-card');
            
            if (memberRow && memberCards.length > 0) {
                // Remove Bootstrap classes and apply custom grid
                memberRow.style.display = 'grid';
                memberRow.style.gridTemplateColumns = 'repeat(4, 1fr)';
                memberRow.style.gap = '25px';
                memberRow.style.margin = '0';
                memberRow.style.padding = '0';
                memberRow.style.width = '100%';
                memberRow.style.maxWidth = '1400px';
                memberRow.style.marginLeft = 'auto';
                memberRow.style.marginRight = 'auto';
                
                // Style each member card for consistent layout
                memberCards.forEach((card, index) => {
                    const cardParent = card.parentElement;
                    
                    // Remove Bootstrap column classes effect
                    cardParent.style.padding = '0';
                    cardParent.style.margin = '0';
                    cardParent.style.width = 'auto';
                    cardParent.style.flex = 'none';
                    
                    // Style the card itself
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
                    
                    // Style photo placeholder
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
                        
                        // Style member image if present
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
                        
                        // Style fallback icon
                        const fallback = photoPlaceholder.querySelector('.photo-fallback');
                        if (fallback) {
                            fallback.style.position = 'absolute';
                            fallback.style.top = '50%';
                            fallback.style.left = '50%';
                            fallback.style.transform = 'translate(-50%, -50%)';
                            fallback.style.fontSize = '3rem';
                            fallback.style.color = 'white';
                            fallback.style.zIndex = '1';
                            
                            // Show fallback only if image is not available
                            const img = photoPlaceholder.querySelector('.member-img');
                            if (!img || !img.src || img.classList.contains('error')) {
                                fallback.style.display = 'block';
                            } else {
                                fallback.style.display = 'none';
                            }
                        }
                    }
                    
                    // Style member info
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
                
                // Handle if we have 8 members (2 rows of 4)
                if (memberCards.length === 8) {
                    memberRow.style.gridTemplateRows = 'repeat(2, 1fr)';
                    memberRow.style.height = 'auto';
                    memberRow.style.alignItems = 'stretch';
                }
            }
        }
        
        // Handle other grids
        const grids = slide.querySelectorAll('.component-grid, .smart-city-pillars, .penerapan-grid, .penerapan-grid-2col, .impact-metrics');
        grids.forEach(grid => {
            // Skip if this is the member row we already handled
            if (slide.id === 'slide2' && grid.closest('.row')) {
                return;
            }
            
            // Special handling for slide 6 (2-column layout)
            if (grid.classList.contains('penerapan-grid-2col')) {
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gap = '25px';
                grid.style.alignItems = 'start';
                grid.style.marginTop = '20px';
                
                // Ensure each item has proper height
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
                
                return; // Skip general grid handling for this specific grid
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
        
        // References slide (slide13)
        if (slideId === 'slide13') {
            const references = slide.querySelector('.references');
            if (references) {
                references.style.maxHeight = '900px';
                references.style.overflowY = 'auto';
                references.style.fontSize = '14px';
                references.style.lineHeight = '1.4';
            }
        }
        
        // Conclusion slide (slide12) with smart city image
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
        
        // Ensure all text is visible and properly sized
        const headings = slide.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.marginBottom = '20px';
            heading.style.lineHeight = '1.2';
        });
        
        const paragraphs = slide.querySelectorAll('p, li');
        paragraphs.forEach(p => {
            if (!p.closest('.member-info')) { // Skip member info paragraphs as they're already styled
                p.style.fontSize = '16px';
                p.style.lineHeight = '1.6';
            }
        });
    }
    
    function captureSlideAsImage(slide, slideNumber) {
        return new Promise((resolve, reject) => {
            // Use html2canvas to capture the slide
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
        
        // Remove default blank page
        pdf.deletePage(1);
        
        slideImages.forEach((imageData, index) => {
            // Add new page for each slide
            pdf.addPage('a4', 'landscape');
            
            // Add image to fill the entire page (297x210mm for A4 landscape)
            pdf.addImage(imageData, 'JPEG', 0, 0, 297, 210);
        });
        
        // Download the PDF
        pdf.save('IoT_untuk_Kota_Pintar_Kelompok_4.pdf');
        
        restoreAfterExport();
        exportBtn.innerHTML = originalHTML;
        exportBtn.disabled = false;
        showNotification('PDF berhasil diunduh!', 'success');
    }
    
    function restoreAfterExport() {
        // Restore all slides to normal state
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
            
            // Reset Bootstrap components
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
            
            // Reset text elements
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
            
            // Reset grids
            const grids = slide.querySelectorAll('.component-grid, .smart-city-pillars, .penerapan-grid, .impact-metrics');
            grids.forEach(grid => {
                grid.style.display = '';
                grid.style.gridTemplateColumns = '';
                grid.style.gap = '';
                grid.style.alignItems = '';
            });
            
            // Reset member row
            const memberRow = slide.querySelector('.row');
            if (memberRow && slide.id === 'slide2') {
                memberRow.style.display = '';
                memberRow.style.gridTemplateColumns = '';
                memberRow.style.gap = '';
                memberRow.style.margin = '';
            }
        });
        
        // Show controls
        controls.style.display = originalControlsDisplay || 'flex';
        
        // Restore original slide
        showSlide(originalCurrentSlide);
    }
    
    // Start the capture process
    captureSlideSequentially();
}

// ==================== TOUCH/SWIPE NAVIGATION ====================
function setupTouchNavigation() {
    let startX = 0;
    let startY = 0;
    let isSwipe = false;
    
    const presentation = document.getElementById('presentation');
    
    presentation.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwipe = true;
    }, { passive: true });
    
    presentation.addEventListener('touchmove', (e) => {
        if (!isSwipe) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        // If vertical movement is greater, it's likely a scroll
        if (diffY > diffX) {
            isSwipe = false;
        }
    }, { passive: true });
    
    presentation.addEventListener('touchend', (e) => {
        if (!isSwipe) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const minSwipeDistance = 50;
        
        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left - next slide
                navigateSlide('next');
            } else {
                // Swipe right - previous slide
                navigateSlide('prev');
            }
        }
        
        isSwipe = false;
    }, { passive: true });
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

function handleResize() {
    if (isFullscreen) {
        optimizeForFullscreen();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
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
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
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

// Check for initial hash on load
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

// ==================== PRESENTATION TIMER (OPTIONAL) ====================
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
    
    // You can display this timer somewhere if needed
    console.log(`Presentation time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
}

function stopPresentationTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Start timer when first slide is shown
if (currentSlide === 1) {
    startPresentationTimer();
}