document.addEventListener('DOMContentLoaded', function () {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    const totalSections = sections.length;

    // Print button
    const printButton = document.getElementById('print-button');

    // Screenshot to PDF button
    const screenshotButton = document.getElementById('screenshot-button');

    // Fullscreen button
    const fullscreenButton = document.getElementById('fullscreen-button');

    // Drawer elements
    const drawerToggle = document.getElementById('drawer-toggle');
    const sideDrawer = document.getElementById('side-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const tocList = document.getElementById('toc-list');

    // Populate Table of Contents
    function populateTableOfContents() {
        sections.forEach((section, index) => {
            const sectionNumber = index + 1;

            // Find the main heading in each section
            let titleElement = section.querySelector('h1');
            let titleText = titleElement ? titleElement.textContent : `Section ${sectionNumber}`;

            // Create the TOC item
            const tocItem = document.createElement('div');
            tocItem.className = 'toc-item';
            tocItem.dataset.section = sectionNumber;

            if (index === 0) {
                tocItem.classList.add('active');
            }

            tocItem.innerHTML = `
          <div class="flex items-center">
            <span class="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full">
              ${sectionNumber}
            </span>
            <span class="toc-section-title">${titleText}</span>
          </div>
        `;

            tocItem.addEventListener('click', () => {
                goToSection(sectionNumber);
                closeDrawerFunction();
            });

            tocList.appendChild(tocItem);
        });
    }

    // Initialize drawer functionality
    function initializeDrawer() {
        // Toggle drawer on button click
        drawerToggle.addEventListener('click', () => {
            sideDrawer.classList.toggle('open');
            drawerToggle.classList.toggle('open');

            // Toggle icon direction
            const icon = drawerToggle.querySelector('i');
            if (sideDrawer.classList.contains('open')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-chevron-left';
            }
        });

        // Close drawer on close button click
        closeDrawer.addEventListener('click', closeDrawerFunction);

        // Close drawer when clicking outside of it
        document.addEventListener('click', (e) => {
            if (!sideDrawer.contains(e.target) &&
                !drawerToggle.contains(e.target) &&
                sideDrawer.classList.contains('open')) {
                closeDrawerFunction();
            }
        });
    }

    // Close drawer function
    function closeDrawerFunction() {
        sideDrawer.classList.remove('open');
        drawerToggle.classList.remove('open');
        drawerToggle.querySelector('i').className = 'fas fa-chevron-left';
    }

    // Initialize fullscreen functionality
    function initializeFullscreen() {
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                // Enter fullscreen
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> Exit Fullscreen';
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> Fullscreen';
            }
        });

        // Update button text when fullscreen changes (e.g., by Esc key)
        document.addEventListener('fullscreenchange', updateFullscreenButtonText);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButtonText);
        document.addEventListener('msfullscreenchange', updateFullscreenButtonText);

        function updateFullscreenButtonText() {
            if (document.fullscreenElement) {
                fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> Exit Fullscreen';
            } else {
                fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> Fullscreen';
            }
        }
    }

    // Helper functions
    function goToSection(sectionNumber) {
        window.location.hash = `section-${sectionNumber}`;
        updateActiveSection(sectionNumber);

        // Scroll to section
        const targetSection = document.getElementById(`section-${sectionNumber}`);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function updateActiveSection(sectionNumber) {
        // Update TOC items
        document.querySelectorAll('.toc-item').forEach((item) => {
            if (parseInt(item.dataset.section) === parseInt(sectionNumber)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Export to PDF
    if (printButton) {
        printButton.addEventListener('click', function () {
            window.print();
        });
    }

    // SIMPLIFIED EXPORT WITH BETTER SCROLLING APPROACH
    async function handleScreenshotToPDF() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Preparing screenshots...';
        document.body.appendChild(notification);

        try {
            // Original scroll position
            const originalScrollPos = window.scrollY;
            
            // Hide controls and drawer for clean screenshots
            const controls = document.querySelector('.print-controls');
            const drawer = document.querySelector('.side-drawer');
            const drawerToggle = document.querySelector('.drawer-toggle');

            if (controls) controls.style.display = 'none';
            if (drawer) drawer.style.display = 'none';
            if (drawerToggle) drawerToggle.style.display = 'none';

            console.log("Starting PDF generation process");
            
            // Initialize jsPDF - using standard A4 landscape for consistency
            notification.textContent = "Setting up PDF document...";
            const { jsPDF } = window.jspdf;
            
            const pdfWidth = 297; // A4 landscape width
            const pdfHeight = 210; // A4 landscape height
            
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            // Process sections with simpler approach
            let isFirstPage = true;
            
            // Process each section
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const isCoverSection = (i === 0);
                
                notification.textContent = `Processing section ${i + 1}/${sections.length}`;
                
                // Ensure section is in view - scroll with delay
                section.scrollIntoView({behavior: 'auto', block: 'start'});
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // For the first section (cover), ensure we're at the top
                if (isCoverSection) {
                    window.scrollTo(0, 0);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
                
                // For sections with tables, scroll down a bit to ensure they're visible
                const hasTables = section.querySelectorAll('table').length > 0;
                if (hasTables) {
                    // Scroll a bit to make tables visible
                    window.scrollBy(0, 100);
                    await new Promise(resolve => setTimeout(resolve, 800));
                    window.scrollBy(0, 100);
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
                
                // Ensure all images are loaded
                const images = section.querySelectorAll('img');
                if (images.length > 0) {
                    await Promise.all(Array.from(images).map(img => {
                        return new Promise(resolve => {
                            if (img.complete) resolve();
                            else {
                                img.onload = resolve;
                                img.onerror = resolve;
                            }
                        });
                    }));
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                try {
                    // Simple capture options
                    const captureOptions = {
                        scale: 2.5, // Higher quality
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#FFFFFF',
                        logging: false,
                        ignoreElements: (element) => {
                            return element.classList && (
                                element.classList.contains('drawer-toggle') || 
                                element.classList.contains('print-controls') || 
                                element.classList.contains('notification') || 
                                element.classList.contains('side-drawer')
                            );
                        }
                    };
                    
                    // Capture the section
                    const canvas = await html2canvas(section, captureOptions);
                    
                    // Add a new page for non-first sections
                    if (!isFirstPage) {
                        doc.addPage([pdfWidth, pdfHeight]);
                    } else {
                        isFirstPage = false;
                    }
                    
                    // Convert to image
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    
                    // Calculate scaling to fit page
                    const canvasWidth = canvas.width;
                    const canvasHeight = canvas.height;
                    
                    // PDF margins (in mm)
                    const margin = 10;
                    const usableWidth = pdfWidth - 2 * margin;
                    const usableHeight = pdfHeight - 2 * margin;
                    
                    // Convert canvas dimensions to mm
                    const imgWidthMm = canvasWidth / 72 * 25.4;
                    const imgHeightMm = canvasHeight / 72 * 25.4;
                    
                    // Scale to fit page
                    const scale = Math.min(
                        usableWidth / imgWidthMm,
                        usableHeight / imgHeightMm
                    ) * 0.95; // 5% safety margin
                    
                    const scaledWidthMm = imgWidthMm * scale;
                    const scaledHeightMm = imgHeightMm * scale;
                    
                    // Center on page
                    const xOffset = (pdfWidth - scaledWidthMm) / 2;
                    const yOffset = (pdfHeight - scaledHeightMm) / 2;
                    
                    // Add image to PDF
                    doc.addImage(
                        imgData,
                        'JPEG',
                        xOffset,
                        yOffset,
                        scaledWidthMm,
                        scaledHeightMm
                    );
                    
                } catch (sectionError) {
                    console.error(`Error capturing section ${i+1}:`, sectionError);
                    notification.textContent = `Issue with section ${i+1}. Retrying...`;
                    
                    // Simple retry with different options
                    try {
                        // Wait and try again with simpler options
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Very basic capture settings
                        const fallbackCanvas = await html2canvas(section, {
                            scale: 1,
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: '#FFFFFF'
                        });
                        
                        // Add page
                        if (!isFirstPage) {
                            doc.addPage([pdfWidth, pdfHeight]);
                        } else {
                            isFirstPage = false;
                        }
                        
                        const fallbackImgData = fallbackCanvas.toDataURL('image/jpeg', 0.9);
                        doc.addImage(
                            fallbackImgData,
                            'JPEG',
                            margin,
                            margin,
                            pdfWidth - 2 * margin,
                            pdfHeight - 2 * margin
                        );
                        
                    } catch (fallbackError) {
                        console.error(`Fallback capture also failed for section ${i+1}:`, fallbackError);
                        
                        // Add error page
                        if (!isFirstPage) {
                            doc.addPage([pdfWidth, pdfHeight]);
                        } else {
                            isFirstPage = false;
                        }
                        
                        // Add text explaining the error
                        doc.setFontSize(16);
                        doc.text(`Section ${i+1} could not be rendered.`, 20, 20);
                        doc.setFontSize(12);
                        doc.text(`Error: ${fallbackError.message || sectionError.message}`, 20, 30);
                    }
                }
                
                // Wait between sections
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            
            // Restore elements
            if (controls) controls.style.display = '';
            if (drawer) drawer.style.display = '';
            if (drawerToggle) drawerToggle.style.display = '';
            
            // Restore original scroll position
            window.scrollTo(0, originalScrollPos);
            
            // Save PDF
            notification.textContent = "Generating PDF...";
            doc.save('tomato_classification_presentation.pdf');
            
            // Update notification before removing
            notification.textContent = "Download starting...";
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 1000);
            }, 1500);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            notification.textContent = 'Error: ' + error.message;
            notification.style.backgroundColor = '#f87171';
            
            // Restore elements
            const controls = document.querySelector('.print-controls');
            const drawer = document.querySelector('.side-drawer');
            const drawerToggle = document.querySelector('.drawer-toggle');
            if (controls) controls.style.display = '';
            if (drawer) drawer.style.display = '';
            if (drawerToggle) drawerToggle.style.display = '';
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 1000);
            }, 3000);
        }
    }

    // Handle screenshot button
    if (screenshotButton) {
        screenshotButton.addEventListener('click', handleScreenshotToPDF);
    }

    // Initialize the presentation
    populateTableOfContents();
    initializeDrawer();
    initializeFullscreen();

    // Handle keyboard navigation
    document.addEventListener('keydown', function (e) {
        let currentSectionId = window.location.hash.replace('#', '') || 'section-1';
        let currentSectionNumber = parseInt(currentSectionId.split('-')[1]) || 1;

        if (e.key === 'ArrowDown' || e.key === ' ') {
            if (currentSectionNumber < totalSections) {
                goToSection(currentSectionNumber + 1);
            }
        } else if (e.key === 'ArrowUp') {
            if (currentSectionNumber > 1) {
                goToSection(currentSectionNumber - 1);
            }
        }
    });

    // Intersection Observer to update active section based on scrolling
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionId = entry.target.id;
                const sectionNumber = parseInt(sectionId.split('-')[1]);

                window.location.hash = sectionId;
                updateActiveSection(sectionNumber);
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Check if URL has a hash and navigate to that section
    if (window.location.hash) {
        const sectionId = window.location.hash.replace('#', '');
        const sectionNumber = parseInt(sectionId.split('-')[1]);

        if (sectionNumber >= 1 && sectionNumber <= totalSections) {
            goToSection(sectionNumber);
        }
    }
});