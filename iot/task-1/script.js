document.addEventListener('DOMContentLoaded', function () {
    // Get all necessary elements
    const book = document.getElementById('book');
    const pages = document.querySelectorAll('.page');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const pageIndicator = document.getElementById('pageIndicator');
    const leftNav = document.getElementById('leftNav');
    const rightNav = document.getElementById('rightNav');

    // Set initial state
    let currentPage = 1;
    const totalPages = pages.length; // This will automatically calculate based on the actual number of pages

    // Create page dots (checking if element exists first)
    let pageDots = document.getElementById('pageDots');
    if (!pageDots) {
        // If it doesn't exist, create it
        pageDots = document.createElement('div');
        pageDots.id = 'pageDots';
        pageDots.className = 'page-dots';
        document.body.appendChild(pageDots);
    }

    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('page-dot');
        dot.setAttribute('data-page', i);
        pageDots.appendChild(dot);

        // Add click event to each dot
        dot.addEventListener('click', function () {
            const targetPage = parseInt(this.getAttribute('data-page'));
            jumpToPage(targetPage);
        });
    }

    // Function to jump to a specific page
    function jumpToPage(targetPage) {
        if (targetPage === currentPage) return;

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.classList.remove('flipped');
            page.classList.remove('turning');
            page.style.display = 'none';
        });

        // Show target page
        const newPage = document.querySelector(`.page[data-page="${targetPage}"]`);
        if (newPage) {
            newPage.style.display = 'block';
            newPage.classList.add('active');

            // Update current page
            currentPage = targetPage;
            updatePageIndicator();
        }
    }

    // Update page indicator and dots
    function updatePageIndicator() {
        if (pageIndicator) {
            pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        }

        if (prevButton) {
            prevButton.disabled = currentPage <= 1;
        }

        if (nextButton) {
            nextButton.disabled = currentPage >= totalPages;
        }

        // Update active dot
        if (pageDots) {
            document.querySelectorAll('.page-dot').forEach(dot => {
                dot.classList.remove('active');
            });
            const activeDot = document.querySelector(`.page-dot[data-page="${currentPage}"]`);
            if (activeDot) {
                activeDot.classList.add('active');
            }
        }

        // Update active TOC item if table of contents exists
        updateActiveTocItem();
    }

    // Function to turn to next page
    function goToNextPage() {
        if (currentPage < totalPages) {
            // Get the pages involved
            const oldPage = document.querySelector(`.page[data-page="${currentPage}"]`);
            const newPage = document.querySelector(`.page[data-page="${currentPage + 1}"]`);

            // Ensure the pages exist before processing
            if (!oldPage || !newPage) {
                console.error(`Page not found: current=${currentPage}, next=${currentPage + 1}`);
                return;
            }

            // Add turning animation class
            oldPage.classList.add('turning');

            // Display next page
            newPage.style.display = 'block';

            // After a brief delay for visual processing
            setTimeout(() => {
                // Apply the flipped class
                oldPage.classList.add('flipped');

                // After animation completes
                setTimeout(() => {
                    // Hide the old page
                    oldPage.classList.remove('active');
                    oldPage.classList.remove('turning');

                    // Show the new page
                    newPage.classList.add('active');

                    // Update current page
                    currentPage++;
                    updatePageIndicator();
                }, 700); // Match the CSS transition time
            }, 50);
        }
    }

    // Function to turn to previous page
    function goToPrevPage() {
        if (currentPage > 1) {
            // Get the pages involved
            const currentActivePage = document.querySelector(`.page[data-page="${currentPage}"]`);
            const prevPage = document.querySelector(`.page[data-page="${currentPage - 1}"]`);

            // Ensure the pages exist before processing
            if (!currentActivePage || !prevPage) {
                console.error(`Page not found: current=${currentPage}, prev=${currentPage - 1}`);
                return;
            }

            // Show previous page that was flipped
            prevPage.style.display = 'block';
            prevPage.classList.add('turning');

            // After a short delay for the browser to process
            setTimeout(() => {
                // Remove flipped class to animate it back
                prevPage.classList.remove('flipped');

                // After animation transition time
                setTimeout(() => {
                    // Remove active from current
                    currentActivePage.classList.remove('active');
                    currentActivePage.style.display = 'none';

                    // Make previous page active
                    prevPage.classList.add('active');
                    prevPage.classList.remove('turning');

                    // Update current page
                    currentPage--;
                    updatePageIndicator();
                }, 700); // Match the CSS transition time
            }, 50);
        }
    }

    // Event listeners
    nextButton.addEventListener('click', goToNextPage);
    prevButton.addEventListener('click', goToPrevPage);

    // Keyboard navigation
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' || event.key === ' ') {
            goToNextPage();
        } else if (event.key === 'ArrowLeft') {
            goToPrevPage();
        } else if (event.key === 'f' || event.key === 'F') {
            toggleFullScreen();
        } else if (event.key === 'm' || event.key === 'M') {
            if (typeof toggleTableOfContents === 'function') {
                toggleTableOfContents();
            }
        }
    });

    // Table of Contents functionality - only initialize if elements exist
    const tocButton = document.getElementById('tocButton');
    const tableOfContents = document.getElementById('tableOfContents');
    const closeTocButton = tableOfContents ? document.getElementById('closeTocButton') : null;
    const tocItems = tableOfContents ? document.querySelectorAll('.toc-item') : [];

    function toggleTableOfContents() {
        if (tableOfContents) {
            tableOfContents.classList.toggle('active');
            updateActiveTocItem();
        }
    }

    function updateActiveTocItem() {
        if (tocItems && tocItems.length) {
            tocItems.forEach(item => {
                item.classList.remove('active');
                if (parseInt(item.getAttribute('data-page')) === currentPage) {
                    item.classList.add('active');
                }
            });
        }
    }

    if (tocButton && tableOfContents) {
        tocButton.addEventListener('click', toggleTableOfContents);

        if (closeTocButton) {
            closeTocButton.addEventListener('click', toggleTableOfContents);
        }

        if (tocItems.length) {
            tocItems.forEach(item => {
                item.addEventListener('click', function () {
                    const targetPage = parseInt(this.getAttribute('data-page'));
                    jumpToPage(targetPage);
                    toggleTableOfContents();
                });
            });
        }
    }

    // Show keyboard tip on page load if element exists
    const keyboardTip = document.getElementById('keyboardTip');
    if (keyboardTip) {
        setTimeout(() => {
            keyboardTip.style.opacity = '1';
            setTimeout(() => {
                keyboardTip.style.opacity = '0';
            }, 3000);
        }, 2000);
    }

    // Enhanced swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;

    book.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = new Date().getTime();

        // Show navigation temporarily when touch starts
        if (leftNav) leftNav.style.opacity = '1';
        if (rightNav) rightNav.style.opacity = '1';
        if (pageDots) pageDots.style.opacity = '1';
        if (pageIndicator) pageIndicator.style.opacity = '1';

        // Hide after 3 seconds
        setTimeout(() => {
            if (!book.classList.contains('touching')) {
                if (leftNav) leftNav.style.opacity = '';
                if (rightNav) rightNav.style.opacity = '';
                if (pageDots) pageDots.style.opacity = '';
                if (pageIndicator) pageIndicator.style.opacity = '';
            }
        }, 3000);

        book.classList.add('touching');
    });

    book.addEventListener('touchmove', function (e) {
        e.preventDefault(); // Prevent scrolling while swiping
    }, {
        passive: false
    });

    book.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        book.classList.remove('touching');
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeTimeThreshold = 300; // milliseconds
        const swipeTime = new Date().getTime() - touchStartTime;

        // Calculate swipe distance and angle
        const swipeDistanceX = Math.abs(touchEndX - touchStartX);
        const swipeDistanceY = Math.abs(touchEndY - touchStartY);

        // Only register horizontal swipes (ignore vertical scrolling attempts)
        if (swipeDistanceX > swipeDistanceY) {
            const isFastSwipe = swipeTime < swipeTimeThreshold;

            if (touchEndX < touchStartX - swipeThreshold || (isFastSwipe && touchEndX < touchStartX)) {
                // Swipe left - go to next page
                goToNextPage();
            } else if (touchEndX > touchStartX + swipeThreshold || (isFastSwipe && touchEndX > touchStartX)) {
                // Swipe right - go to previous page
                goToPrevPage();
            }
        }
    }

    // Make the book responsive on window resize
    function adjustBookSize() {
        const vh = window.innerHeight * 0.9;
        const vw = window.innerWidth * 0.9;

        // Set max width based on aspect ratio
        if (vw / vh > 1.5) {
            // Landscape orientation - limit width
            book.style.width = `${vh * 1.4}px`;
        } else {
            // Portrait orientation - use available width
            book.style.width = '100%';
        }
    }

    // Call once on load and then on resize
    adjustBookSize();
    window.addEventListener('resize', adjustBookSize);

    // Initialize
    updatePageIndicator();

    const slideNavigation = document.getElementById('slideNavigation');
    if (slideNavigation) {
        const slideMinimapContainer = slideNavigation.querySelector('.slide-minimap');
        const slideNumbersContainer = slideNavigation.querySelector('.slide-numbers');

        // Create slide thumbnails and numbers
        if (slideMinimapContainer && slideNumbersContainer) {
            // Generate thumbnails
            for (let i = 1; i <= totalPages; i++) {
                // Create thumbnail
                const thumbnail = document.createElement('div');
                thumbnail.classList.add('slide-thumbnail', `slide-thumbnail-gradient-${(i % 9) + 1}`);
                thumbnail.setAttribute('data-page', i);
                thumbnail.innerHTML = `<div class="slide-thumbnail-label">${i}</div>`;

                // Add click event
                thumbnail.addEventListener('click', function () {
                    const targetPage = parseInt(this.getAttribute('data-page'));
                    jumpToPage(targetPage);
                });

                slideMinimapContainer.appendChild(thumbnail);

                // Create number button
                const numberButton = document.createElement('div');
                numberButton.classList.add('slide-number');
                numberButton.setAttribute('data-page', i);
                numberButton.textContent = i;

                // Add click event
                numberButton.addEventListener('click', function () {
                    const targetPage = parseInt(this.getAttribute('data-page'));
                    jumpToPage(targetPage);
                });

                slideNumbersContainer.appendChild(numberButton);
            }

            // Update active slide in navigation
            function updateSlideNavigation() {
                // Update thumbnails
                slideMinimapContainer.querySelectorAll('.slide-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                    if (parseInt(thumb.getAttribute('data-page')) === currentPage) {
                        thumb.classList.add('active');
                        // Scroll to make active thumbnail visible
                        thumb.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                            inline: 'center'
                        });
                    }
                });

                // Update number buttons
                slideNumbersContainer.querySelectorAll('.slide-number').forEach(num => {
                    num.classList.remove('active');
                    if (parseInt(num.getAttribute('data-page')) === currentPage) {
                        num.classList.add('active');
                    }
                });
            }

            // Modify the existing updatePageIndicator function to also update slide navigation
            const originalUpdatePageIndicator = updatePageIndicator;
            updatePageIndicator = function () {
                originalUpdatePageIndicator();
                updateSlideNavigation();
            };

            // Initial update
            updateSlideNavigation();
        }
    }
});

// Make toggleFullScreen globally available
function toggleFullScreen() {
    const fullscreenButton = document.querySelector('.fullscreen-button i');

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message}`);
        });
        // Change icon to compress when in fullscreen
        if (fullscreenButton) {
            fullscreenButton.classList.remove('fa-expand');
            fullscreenButton.classList.add('fa-compress');
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        // Change icon to expand when exiting fullscreen
        if (fullscreenButton) {
            fullscreenButton.classList.remove('fa-compress');
            fullscreenButton.classList.add('fa-expand');
        }
    }
}
// Add this to your script.js
document.addEventListener('DOMContentLoaded', function() {
    // Get the export button
    const exportPdfButton = document.getElementById('exportPdfButton');
    
    // Add click event listener
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', exportToPdf);
    }
});

async function exportToPdf() {
    // Show a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'pdf-loading-indicator';
    loadingIndicator.innerHTML = '<div class="spinner"></div><p>Generating PDF...</p>';
    document.body.appendChild(loadingIndicator);
    
    try {
        // Get all pages
        const pages = document.querySelectorAll('.page');
        const totalPages = pages.length;
        
        // Save current page
        const currentActivePage = document.querySelector('.page.active');
        let currentPageNumber = 1;
        if (currentActivePage) {
            currentPageNumber = parseInt(currentActivePage.getAttribute('data-page'));
        }
        
        // Elements to hide during capture
        const elementsToHide = document.querySelectorAll('.side-nav, .fullscreen-button, .export-pdf-button, .page-indicator, .keyboard-tip, .slide-navigation, #pageDots, .page-dots');
        
        // Keep track of original display styles
        const originalStyles = new Map();
        elementsToHide.forEach(el => {
            if (el) {
                originalStyles.set(el, el.style.display);
                el.style.display = 'none';
            }
        });
        
        // Create PDF
        const pdf = new jspdf.jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Process each page
        for (let i = 0; i < totalPages; i++) {
            const page = pages[i];
            
            // Update loading message
            loadingIndicator.querySelector('p').textContent = `Generating PDF... (${i+1}/${totalPages})`;
            
            // Store original display and classes
            const originalDisplay = page.style.display;
            const originalClasses = page.className;
            const pageContent = page.querySelector('.page-content');
            
            // Store original content styles
            let originalContentHeight, originalContentOverflow;
            if (pageContent) {
                originalContentHeight = pageContent.style.height;
                originalContentOverflow = pageContent.style.overflow;
                
                // Get the scroll height to capture all content
                const scrollHeight = pageContent.scrollHeight;
                
                // Set temporary styles to show all content
                pageContent.style.height = scrollHeight + 'px';
                pageContent.style.overflow = 'visible';
            }
            
            // Make page visible for capture
            page.style.display = 'block';
            page.className = 'page'; // Remove animation classes but keep 'page'
            
            // Remove any transforms or animations
            const originalTransform = page.style.transform;
            const originalTransition = page.style.transition;
            page.style.transform = 'none';
            page.style.transition = 'none';
            
            // Hide page-turn effects
            const pageTurnEffects = page.querySelectorAll('.page-turn-effect');
            pageTurnEffects.forEach(effect => {
                if (effect) effect.style.visibility = 'hidden';
            });
            
            // Wait for DOM to update
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Capture the page with html2canvas
            const canvas = await html2canvas(page, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
            });
            
            // Add captured image to PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            // Calculate image dimensions for PDF
            const imgRatio = canvas.height / canvas.width;
            let imgWidth = pdfWidth - 10; // 5mm margin on each side
            let imgHeight = imgWidth * imgRatio;
            
            // If image is too tall, scale it to fit
            if (imgHeight > pdfHeight - 10) {
                imgHeight = pdfHeight - 10;
                imgWidth = imgHeight / imgRatio;
            }
            
            // Calculate positions to center the image
            const xPos = (pdfWidth - imgWidth) / 2;
            const yPos = (pdfHeight - imgHeight) / 2;
            
            // Add to PDF
            pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
            
            // Restore original styles
            page.style.display = originalDisplay;
            page.className = originalClasses;
            page.style.transform = originalTransform;
            page.style.transition = originalTransition;
            
            pageTurnEffects.forEach(effect => {
                if (effect) effect.style.visibility = '';
            });
            
            if (pageContent) {
                pageContent.style.height = originalContentHeight;
                pageContent.style.overflow = originalContentOverflow;
            }
            
            // Add new page if not the last one
            if (i < totalPages - 1) {
                pdf.addPage();
            }
        }
        
        // Save the PDF
        pdf.save('presentation.pdf');
        
        // Restore all pages to their original state
        pages.forEach(p => {
            p.style.display = 'none';
            p.classList.remove('active');
        });
        
        // Restore the active page
        const pageToActivate = document.querySelector(`.page[data-page="${currentPageNumber}"]`);
        if (pageToActivate) {
            pageToActivate.style.display = 'block';
            pageToActivate.classList.add('active');
        }
        
        // Restore visibility of hidden elements
        elementsToHide.forEach(el => {
            if (el) el.style.display = originalStyles.get(el) || '';
        });
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    } finally {
        // Remove loading indicator
        document.body.removeChild(loadingIndicator);
    }
}