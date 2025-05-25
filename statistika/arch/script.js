// ==================== GLOBAL VARIABLES ====================
let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;
let isFullscreen = false;
let apsChart = null;
let varianceChart = null;

// Data APS untuk chart
const apsData = [10.11, 10.75, 11.22, 11.98, 12.82, 13.64, 14.84, 16.06, 17.18, 18.99, 20.05, 21.55, 23.28, 24.80, 26.56, 27.24, 27.86, 29.15, 29.68, 30.17, 30.92];
const years = Array.from({
    length: 21
}, (_, i) => 2003 + i);
const varianceData = [null, 0.940, 0.577, 0.374, 0.403, 0.504, 0.687, 0.665, 0.631, 0.658, 0.398, 0.372, 0.372, 0.456, 0.616, 1.072, 0.683, 0.432, 0.472, 0.373, 0.559];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('ARCH Presentation Initialized');
    initializePresentation();
    setupEventListeners();
    updateSlideCounter();
    showSlide(currentSlide);

    // Delay chart creation to ensure DOM is ready
    setTimeout(() => {
        createCharts();

        // Fallback: recreate charts if they failed to load
        setTimeout(() => {
            if (!apsChart || !varianceChart) {
                console.log('Retrying chart creation...');
                createCharts();
            }
        }, 1000);
    }, 100);
});

// ==================== PRESENTATION INITIALIZATION ====================
function initializePresentation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Set tooltips
    if (prevBtn) prevBtn.setAttribute('title', 'Previous Slide (← or Left Arrow)');
    if (nextBtn) nextBtn.setAttribute('title', 'Next Slide (→ or Right Arrow)');
    if (fullscreenBtn) fullscreenBtn.setAttribute('title', 'Toggle Fullscreen (F key)');
    if (exportBtn) exportBtn.setAttribute('title', 'Export to PDF');

    // Smooth page load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Add slide numbers
    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.setAttribute('data-slide-number', index + 1);
    });

    console.log(`Presentation initialized with ${totalSlides} slides`);
}

// ==================== EVENT LISTENERS SETUP ====================
function setupEventListeners() {
    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exportBtn = document.getElementById('exportBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => navigateSlide('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateSlide('next'));
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (exportBtn) exportBtn.addEventListener('click', exportToPDF);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Fullscreen events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Window events
    window.addEventListener('resize', debounce(handleResize, 250));
    window.addEventListener('orientationchange', handleOrientationChange);

    // Touch/swipe events for mobile
    setupTouchNavigation();

    // Fullscreen hint events
    setupFullscreenHintEvents();

    console.log('Event listeners initialized');
}

// ==================== NAVIGATION FUNCTIONS ====================
function navigateSlide(direction) {
    const newSlide = direction === 'next' ?
        Math.min(currentSlide + 1, totalSlides) :
        Math.max(currentSlide - 1, 1);

    if (newSlide !== currentSlide) {
        showSlide(newSlide);
    }
}

function showSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) {
        console.warn(`Invalid slide number: ${slideNumber}`);
        return;
    }

    currentSlide = slideNumber;

    // Hide all slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });

    // Show target slide
    const targetSlide = document.getElementById(`slide${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');

        // Smooth scroll to slide
        if (!isFullscreen) {
            targetSlide.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Add slide transition effect
        targetSlide.style.opacity = '0';
        targetSlide.style.transform = 'translateX(20px)';

        setTimeout(() => {
            targetSlide.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            targetSlide.style.opacity = '1';
            targetSlide.style.transform = 'translateX(0)';

            setTimeout(() => {
                targetSlide.style.transition = '';
            }, 300);
        }, 50);

        console.log(`Navigated to slide ${slideNumber}`);
    }

    updateNavigationButtons();
    updateSlideCounter();
    updateURL();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
        prevBtn.style.opacity = currentSlide === 1 ? '0.5' : '1';
    }

    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
        nextBtn.style.opacity = currentSlide === totalSlides ? '0.5' : '1';
    }
}

function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    if (counter) {
        counter.textContent = `${currentSlide} / ${totalSlides}`;

        // Add progress indicator
        const progress = (currentSlide / totalSlides) * 100;
        counter.style.background = `linear-gradient(90deg, var(--secondary-color) ${progress}%, transparent ${progress}%)`;
        counter.style.backgroundClip = 'text';
        counter.style.webkitBackgroundClip = 'text';
        counter.style.fontWeight = 'bold';

        // Fallback for browsers that don't support background-clip: text
        setTimeout(() => {
            if (getComputedStyle(counter).color === 'transparent') {
                counter.style.background = '';
                counter.style.color = 'var(--dark-color)';
            }
        }, 100);
    }
}

function updateURL() {
    history.replaceState(null, null, `#slide${currentSlide}`);
}

// ==================== KEYBOARD NAVIGATION ====================
function handleKeyNavigation(event) {
    // Don't handle keys when focused on input elements
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

            // Direct slide navigation with number keys
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

// ==================== TOUCH/SWIPE NAVIGATION ====================
function setupTouchNavigation() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    const presentation = document.getElementById('presentation');

    if (!presentation) return;

    presentation.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, {
        passive: true
    });

    presentation.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();

        const diffX = startX - endX;
        const diffY = Math.abs(startY - endY);
        const swipeTime = endTime - startTime;

        // Minimum swipe distance and maximum time
        const minSwipeDistance = 50;
        const maxSwipeTime = 500;

        // Only register horizontal swipes
        if (Math.abs(diffX) > minSwipeDistance &&
            diffY < Math.abs(diffX) &&
            swipeTime < maxSwipeTime) {

            if (diffX > 0) {
                navigateSlide('next');
            } else {
                navigateSlide('prev');
            }
        }
    }, {
        passive: true
    });
}

// ==================== FULLSCREEN HINT FUNCTIONS ====================
let fullscreenHintTimeout = null;

function showFullscreenHint() {
    document.body.classList.add('show-hint');
    document.body.classList.remove('hide-hint');

    // Auto-hide hint after 3 seconds
    clearTimeout(fullscreenHintTimeout);
    fullscreenHintTimeout = setTimeout(() => {
        hideFullscreenHint();
    }, 3000);
}

function hideFullscreenHint() {
    document.body.classList.remove('show-hint');
    document.body.classList.add('hide-hint');
}

function setupFullscreenHintEvents() {
    // Show hint on mouse movement in fullscreen
    document.addEventListener('mousemove', () => {
        if (isFullscreen) {
            showFullscreenHint();
        }
    });

    // Show hint on any key press in fullscreen
    document.addEventListener('keydown', () => {
        if (isFullscreen) {
            showFullscreenHint();
        }
    });
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
    const element = document.documentElement;
    const requestFullscreen = element.requestFullscreen ||
        element.mozRequestFullScreen ||
        element.webkitRequestFullscreen ||
        element.msRequestFullscreen;

    if (requestFullscreen) {
        requestFullscreen.call(element).then(() => {
            isFullscreen = true;
            document.body.classList.add('is-fullscreen');
            hideSlideControls();
            showFullscreenHint();
            console.log('Entered fullscreen mode');
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
            showSlideControls();
            hideFullscreenHint();
            console.log('Exited fullscreen mode');
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
        hideSlideControls();
        showFullscreenHint();
    } else {
        document.body.classList.remove('is-fullscreen');
        showSlideControls();
        hideFullscreenHint();
    }
}

function hideSlideControls() {
    const controls = document.querySelector('.slide-controls');
    if (controls) {
        controls.style.display = 'none';
        controls.style.opacity = '0';
        controls.style.pointerEvents = 'none';
        controls.classList.add('fullscreen-hidden');
        console.log('Slide controls hidden for fullscreen');
    }
}

function showSlideControls() {
    const controls = document.querySelector('.slide-controls');
    if (controls) {
        controls.style.display = 'flex';
        controls.style.opacity = '1';
        controls.style.pointerEvents = 'auto';
        controls.classList.remove('fullscreen-hidden');
        console.log('Slide controls restored');
    }
}

function updateFullscreenButtonIcon() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;

    const icon = fullscreenBtn.querySelector('i');
    if (!icon) return;

    if (isFullscreen) {
        icon.className = 'bi bi-fullscreen-exit';
        fullscreenBtn.setAttribute('title', 'Exit Fullscreen (Esc)');
    } else {
        icon.className = 'bi bi-fullscreen';
        fullscreenBtn.setAttribute('title', 'Enter Fullscreen (F)');
    }
}

// ==================== CHART CREATION ====================
function createCharts() {
    console.log('Creating charts...');

    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                createAPSChart();
                createVarianceChart();
            }, 200);
        });
    } else {
        setTimeout(() => {
            createAPSChart();
            createVarianceChart();
        }, 200);
    }
}

function createAPSChart() {
    const apsCtx = document.getElementById('apsChart');
    if (!apsCtx) {
        console.warn('APS chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    if (apsChart) {
        apsChart.destroy();
    }

    // Set fixed dimensions for canvas
    apsCtx.style.width = '100%';
    apsCtx.style.height = '300px';

    try {
        apsChart = new Chart(apsCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'APS (%)',
                    data: apsData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: '#3498db',
                    pointBorderColor: '#2c3e50',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(44, 62, 80, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#3498db',
                        borderWidth: 1,
                        cornerRadius: 8,
                        mode: 'index',
                        intersect: false,
                        position: 'nearest',
                        callbacks: {
                            title: function (context) {
                                return `Tahun ${context[0].label}`;
                            },
                            label: function (context) {
                                return `APS: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tahun',
                            font: {
                                weight: 'bold',
                                size: 12
                            }
                        },
                        ticks: {
                            maxTicksLimit: 11,
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'APS (%)',
                            font: {
                                weight: 'bold',
                                size: 12
                            }
                        },
                        beginAtZero: false,
                        min: 8,
                        max: 35,
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    resize: {
                        duration: 0
                    }
                },
                onResize: function (chart, size) {
                    // Prevent chart jumping on resize
                    chart.options.animation.resize.duration = 0;
                }
            }
        });
        console.log('APS chart created successfully');
    } catch (error) {
        console.error('Error creating APS chart:', error);
    }
}

function createVarianceChart() {
    const varianceCtx = document.getElementById('varianceChart');
    if (!varianceCtx) {
        console.warn('Variance chart canvas not found');
        return;
    }

    // Destroy existing chart if it exists
    if (varianceChart) {
        varianceChart.destroy();
    }

    // Set fixed dimensions for canvas
    varianceCtx.style.width = '100%';
    varianceCtx.style.height = '250px';

    try {
        varianceChart = new Chart(varianceCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Predicted Variance',
                    data: varianceData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: '#e74c3c',
                    pointBorderColor: '#c0392b',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(192, 57, 43, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#e74c3c',
                        borderWidth: 1,
                        cornerRadius: 8,
                        mode: 'index',
                        intersect: false,
                        position: 'nearest',
                        callbacks: {
                            title: function (context) {
                                return `Tahun ${context[0].label}`;
                            },
                            label: function (context) {
                                const value = context.parsed.y;
                                return value !== null ? `Variansi: ${value.toFixed(3)}` : 'Tidak ada data';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tahun',
                            font: {
                                weight: 'bold',
                                size: 12
                            }
                        },
                        ticks: {
                            maxTicksLimit: 11,
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Variansi Prediksi',
                            font: {
                                weight: 'bold',
                                size: 12
                            }
                        },
                        beginAtZero: true,
                        max: 1.2,
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    resize: {
                        duration: 0
                    }
                },
                onResize: function (chart, size) {
                    // Prevent chart jumping on resize
                    chart.options.animation.resize.duration = 0;
                }
            }
        });
        console.log('Variance chart created successfully');
    } catch (error) {
        console.error('Error creating variance chart:', error);
    }
}

// ==================== PDF EXPORT FUNCTIONALITY ====================
function exportToPDF() {
    const exportBtn = document.getElementById('exportBtn');
    if (!exportBtn) return;

    const originalHTML = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Exporting...';
    exportBtn.disabled = true;

    console.log('Starting PDF export...');

    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF library not loaded');
        showNotification('Error: PDF library not loaded', 'error');
        restoreExportButton(exportBtn, originalHTML);
        return;
    }

    const {
        jsPDF
    } = window.jspdf;
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'landscape'
    });

    // Hide controls completely for PDF export
    const controls = document.querySelector('.slide-controls');
    const originalControlsDisplay = controls ? getComputedStyle(controls).display : '';
    const originalControlsVisibility = controls ? getComputedStyle(controls).visibility : '';

    if (controls) {
        controls.style.display = 'none !important';
        controls.style.visibility = 'hidden !important';
        controls.style.opacity = '0 !important';
        controls.classList.add('pdf-export-hidden');
    }

    // Process slides sequentially
    processSlideForPDF(1, pdf, () => {
        pdf.save('ARCH_Model_Kelompok_4.pdf');

        // Restore controls after PDF export
        if (controls) {
            controls.style.display = originalControlsDisplay || 'flex';
            controls.style.visibility = originalControlsVisibility || 'visible';
            controls.style.opacity = '1';
            controls.classList.remove('pdf-export-hidden');
        }
        restoreExportButton(exportBtn, originalHTML);
        showSlide(currentSlide);
        showNotification('PDF exported successfully!', 'success');
        console.log('PDF export completed');
    });
}

function processSlideForPDF(slideIndex, pdf, callback) {
    if (slideIndex > totalSlides) {
        pdf.deletePage(1); // Remove empty first page
        callback();
        return;
    }

    const slide = document.getElementById(`slide${slideIndex}`);
    if (!slide) {
        processSlideForPDF(slideIndex + 1, pdf, callback);
        return;
    }

    console.log(`Processing slide ${slideIndex} for PDF...`);

    // Show only current slide
    document.querySelectorAll('.slide').forEach(s => s.style.display = 'none');
    slide.style.display = 'flex';
    slide.style.margin = '0';
    slide.style.marginTop = '0';

    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library not loaded');
        showNotification('Error: Canvas library not loaded', 'error');
        return;
    }

    // Capture slide
    html2canvas(slide, {
        width: 1920,
        height: 1080,
        scale: 0.5,
        useCORS: true,
        logging: false,
        backgroundColor: slide.classList.contains('cover-slide') ? null : '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addPage('a4', 'landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);

        // Process next slide
        setTimeout(() => {
            processSlideForPDF(slideIndex + 1, pdf, callback);
        }, 100);
    }).catch(error => {
        console.error(`Error capturing slide ${slideIndex}:`, error);
        // Continue with next slide
        processSlideForPDF(slideIndex + 1, pdf, callback);
    });
}

function restoreExportButton(exportBtn, originalHTML) {
    if (exportBtn) {
        exportBtn.innerHTML = originalHTML;
        exportBtn.disabled = false;
    }
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
    // Debounced chart resize to prevent jumping
    clearTimeout(window.chartResizeTimeout);
    window.chartResizeTimeout = setTimeout(() => {
        if (apsChart && !apsChart.destroyed) {
            apsChart.resize('none'); // Resize without animation
        }
        if (varianceChart && !varianceChart.destroyed) {
            varianceChart.resize('none'); // Resize without animation
        }
    }, 100);
}

function handleOrientationChange() {
    setTimeout(() => {
        handleResize();

        // Recreate charts on significant layout changes
        if (apsChart && varianceChart) {
            setTimeout(() => {
                createCharts();
            }, 300);
        }
    }, 500);
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
    font-family: inherit;
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
    console.log('Presentation timer started');
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
        console.log('Presentation timer stopped');
    }
}

// Start timer when presentation begins
if (currentSlide === 1) {
    startPresentationTimer();
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (event) => {
    console.error('Presentation error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ==================== PERFORMANCE MONITORING ====================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Presentation loaded in ${loadTime.toFixed(2)}ms`);
    });
}

// ==================== ACCESSIBILITY FEATURES ====================
document.addEventListener('keydown', (event) => {
    // Focus management for screen readers
    if (event.key === 'Tab') {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide && !activeSlide.contains(event.target)) {
            event.preventDefault();
            const firstFocusable = activeSlide.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }
});

// ==================== CONSOLE WELCOME MESSAGE ====================
console.log(`
%c🎓 ARCH Model Presentation - Kelompok 4 🎓
%cNavigation: Arrow keys, Space, or swipe
%cFullscreen: F key
%cExport PDF: Click export button
%cDeveloped for Magister Ilmu Komputer UNDIKSHA
`,
    'color: #3498db; font-size: 16px; font-weight: bold;',
    'color: #2c3e50; font-size: 12px;',
    'color: #2c3e50; font-size: 12px;',
    'color: #2c3e50; font-size: 12px;',
    'color: #27ae60; font-size: 12px; font-style: italic;'
);