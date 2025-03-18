// Define older portrait PDF function to maintain compatibility
function handleVisuallyAccuratePrinting() {
    // Create print-specific CSS for portrait orientation
    let printCSS = `
        @page {
            size: 21cm 29.7cm portrait; /* A4 in portrait mode */
            margin: 0;
        }
        @media print {
            body, html {
                margin: 0 !important;
                padding: 0 !important;
                height: auto !important;
                width: 100% !important;
                background-color: white;
            }
            
            .print-controls, .section-nav, .side-drawer, .drawer-toggle {
                display: none !important;
            }
            
            /* Make each section a separate page with portrait orientation */
            .section {
                box-sizing: border-box !important;
                position: relative !important;
                page-break-after: always !important;
                break-after: page !important;
                overflow: hidden !important;
                width: 100% !important;
                border: none !important;
                display: flex !important; 
                height: 29.7cm !important; /* Height in portrait mode */
                min-height: 29.7cm !important;
                max-height: 29.7cm !important;
                padding: 1cm !important;
            }
            
            /* Special styling for section 1 (cover) - centered content */
            #section-1 {
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
            }

            /* Other sections - top aligned content */
            .section:not(#section-1) {
                flex-direction: column !important;
                justify-content: flex-start !important;
                align-items: flex-start !important;
            }
            
            /* Ensure contents fill the section */
            .section > div {
                width: 100% !important;
            }
            
            /* Force all background colors to print */
            .gradient-bg {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                background: linear-gradient(135deg, #6366f1, #a855f7) !important;
            }
            
            /* Force all colored elements to print with color */
            .bg-red-50, .bg-green-50, .bg-blue-50, .bg-yellow-50, .bg-indigo-50, 
            .bg-purple-50, .bg-amber-50, .bg-gray-50, .bg-gray-100,
            .bg-indigo-100, .bg-red-100, .bg-green-100, .bg-blue-100,
            .bg-yellow-100, .bg-purple-100, .bg-amber-100,
            table thead tr, table tr {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            /* Table styles for printing */
            table {
                page-break-inside: avoid !important;
                width: 100% !important;
                max-width: 100% !important;
                border-collapse: collapse !important;
            }
            
            th, td {
                border: 1px solid #e5e7eb !important;
            }
            
            /* Disable animations when printing */
            .pulse, .float, .rotate-slow {
                animation: none !important;
            }
        }
    `;
    
    // Create and apply the print style
    const printStyle = document.createElement('style');
    printStyle.textContent = printCSS;
    document.head.appendChild(printStyle);
    
    // Give browser time to apply styles before printing
    setTimeout(() => {
        window.print();
        
        // Remove style after printing
        setTimeout(() => {
            document.head.removeChild(printStyle);
        }, 200);
    }, 500);
}document.addEventListener('DOMContentLoaded', function () {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    const totalSections = sections.length;

    // Print button
    const printButton = document.getElementById('print-button');

    // Language toggle
    const languageButton = document.getElementById('language-button');

    // Fullscreen button
    const fullscreenButton = document.getElementById('fullscreen-button');

    // Drawer elements
    const drawerToggle = document.getElementById('drawer-toggle');
    const sideDrawer = document.getElementById('side-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const tocList = document.getElementById('toc-list');

    // Current language (default: English)
    let currentLanguage = 'en';

    // Create section navigation
    const sectionNav = document.getElementById('section-nav');

    sections.forEach((section, index) => {
        const button = document.createElement('div');
        button.className = 'section-button';
        button.textContent = index + 1;
        button.dataset.section = index + 1;

        if (index === 0) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            goToSection(index + 1);
        });

        sectionNav.appendChild(button);
    });

    // Populate Table of Contents
    populateTableOfContents();

    // Initialize drawer toggle event
    initializeDrawer();

    // Initialize fullscreen button
    initializeFullscreen();

    // Helper function to populate the table of contents
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
                fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> ' + 
                    (currentLanguage === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh');
            } else {
                fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> ' + 
                    (currentLanguage === 'en' ? 'Fullscreen' : 'Layar Penuh');
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
        // Update legacy section buttons
        document.querySelectorAll('.section-button').forEach((button) => {
            if (parseInt(button.dataset.section) === parseInt(sectionNumber)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update TOC items
        document.querySelectorAll('.toc-item').forEach((item) => {
            if (parseInt(item.dataset.section) === parseInt(sectionNumber)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ===== PRINTING FUNCTIONALITY =====

    // Export to PDF with expanded landscape orientation (2x regular size)
    function handleLandscapePrinting() {
        // Save original scroll position
        const originalScrollPos = window.scrollY;
        
        // Get viewport dimensions to determine ideal PDF size
        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        
        // Calculate a larger page size based on viewport ratio but still maintaining PDF proportions
        // Using much larger dimensions (approximately 2x regular A4 landscape)
        const pageWidth = 59.4; // 2x A4 width (29.7 * 2)
        const pageHeight = 42; // 2x A4 height (21 * 2)
        
        console.log(`Using expanded page size: ${pageWidth}cm x ${pageHeight}cm`);
        
        // Create print-specific CSS for expanded landscape orientation
        let printCSS = `
            @page {
                size: ${pageWidth}cm ${pageHeight}cm landscape;
                margin: 0;
            }
            @media print {
                body, html {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: auto !important;
                    width: 100% !important;
                    background-color: white;
                }
                
                .print-controls, .section-nav, .side-drawer, .drawer-toggle {
                    display: none !important;
                }
                
                /* Make each section a separate page with expanded landscape orientation */
                .section {
                    box-sizing: border-box !important;
                    position: relative !important;
                    page-break-after: always !important;
                    break-after: page !important;
                    overflow: visible !important; /* Changed from hidden to visible */
                    width: 100% !important;
                    border: none !important;
                    display: flex !important; 
                    height: ${pageHeight}cm !important;
                    min-height: ${pageHeight}cm !important;
                    max-height: ${pageHeight}cm !important;
                    padding: 2cm !important; /* Increased padding */
                    transform-origin: top left !important;
                    transform: scale(0.9) !important; /* Slight scale down to ensure content fits */
                }
                
                /* Special styling for section 1 (cover) - centered content */
                #section-1 {
                    flex-direction: column !important;
                    justify-content: center !important;
                    align-items: center !important;
                }

                /* Other sections - top aligned content */
                .section:not(#section-1) {
                    flex-direction: column !important;
                    justify-content: flex-start !important;
                    align-items: flex-start !important;
                }
                
                /* Ensure contents fill the section */
                .section > div {
                    width: 100% !important;
                    max-width: 100% !important;
                    overflow: visible !important;
                }
                
                /* Responsive tables should expand fully */
                .responsive-table {
                    overflow: visible !important;
                    max-width: 100% !important;
                    width: 100% !important;
                }
                
                /* Force all background colors to print */
                .gradient-bg {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    background: linear-gradient(135deg, #6366f1, #a855f7) !important;
                }
                
                /* Force all colored elements to print with color */
                .bg-red-50, .bg-green-50, .bg-blue-50, .bg-yellow-50, .bg-indigo-50, 
                .bg-purple-50, .bg-amber-50, .bg-gray-50, .bg-gray-100,
                .bg-indigo-100, .bg-red-100, .bg-green-100, .bg-blue-100,
                .bg-yellow-100, .bg-purple-100, .bg-amber-100 {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                
                /* Set specific background colors for each type */
                .bg-red-50 { background-color: #fef2f2 !important; }
                .bg-green-50 { background-color: #f0fdf4 !important; }
                .bg-blue-50 { background-color: #eff6ff !important; }
                .bg-yellow-50 { background-color: #fefce8 !important; }
                .bg-indigo-50 { background-color: #eef2ff !important; }
                .bg-purple-50 { background-color: #faf5ff !important; }
                .bg-amber-50 { background-color: #fffbeb !important; }
                .bg-gray-50 { background-color: #f9fafb !important; }
                .bg-gray-100 { background-color: #f3f4f6 !important; }
                
                .bg-red-100 { background-color: #fee2e2 !important; }
                .bg-green-100 { background-color: #dcfce7 !important; }
                .bg-blue-100 { background-color: #dbeafe !important; }
                .bg-yellow-100 { background-color: #fef9c3 !important; }
                .bg-indigo-100 { background-color: #e0e7ff !important; }
                .bg-purple-100 { background-color: #f3e8ff !important; }
                .bg-amber-100 { background-color: #fef3c7 !important; }
                
                /* Table styles for printing */
                table {
                    page-break-inside: avoid !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    font-size: 11pt !important; /* Slightly reduced font size */
                }
                
                th, td {
                    border: 1px solid #e5e7eb !important;
                    padding: 4px !important;
                    word-wrap: break-word !important;
                }
                
                /* Ensure buttons, icons and other colored elements print with color */
                [class*="text-"] {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                
                /* Ensure images print properly */
                img {
                    max-width: 100% !important;
                    page-break-inside: avoid !important;
                }
                
                /* Reduce font sizes slightly to help content fit */
                h1 { font-size: 1.8em !important; }
                h2 { font-size: 1.5em !important; }
                h3 { font-size: 1.2em !important; }
                p, li { font-size: 0.95em !important; }
                
                /* Disable animations when printing */
                .pulse, .float, .rotate-slow {
                    animation: none !important;
                }
                
                /* Preserve icons */
                .fas, .fa, .far, .fab {
                    font-family: "Font Awesome 5 Free" !important;
                    display: inline-block !important;
                    visibility: visible !important;
                }
                
                /* Grid adjustments for better print layout */
                .grid {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
                }
            }
        `;
        
        // Create and apply the print style
        const printStyle = document.createElement('style');
        printStyle.textContent = printCSS;
        document.head.appendChild(printStyle);
        
        console.log("Preparing document for expanded landscape PDF export...");
        
        // Give browser time to apply styles before printing
        setTimeout(() => {
            window.print();
            
            // Remove style after printing and restore scroll position
            setTimeout(() => {
                document.head.removeChild(printStyle);
                window.scrollTo(0, originalScrollPos);
                console.log("Expanded landscape PDF export complete");
            }, 300);
        }, 800);
    }
    
    // Capture screenshots of each section individually and combine them into a PDF
    function handleScreenshotPDF() {
        console.log("Starting section-by-section screenshot PDF generation...");
        
        // Create loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.background = 'rgba(0,0,0,0.7)';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.borderRadius = '8px';
        loadingIndicator.style.zIndex = '10000';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin fa-2x mb-2"></i><br>Initializing...<br><small>Please wait, setting up libraries</small>';
        document.body.appendChild(loadingIndicator);
        
        // Check if html2canvas and jspdf are available
        let html2canvasLoaded = typeof html2canvas !== 'undefined';
        let jsPDFLoaded = typeof window.jspdf !== 'undefined';
        
        console.log("Libraries status - html2canvas:", html2canvasLoaded, "jsPDF:", jsPDFLoaded);
        
        // If libraries aren't loaded, try to load them
        const librariesPromises = [];
        
        if (!html2canvasLoaded) {
            const html2canvasPromise = new Promise((resolve, reject) => {
                loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin fa-2x mb-2"></i><br>Loading html2canvas library...<br><small>Please wait</small>';
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = () => {
                    console.log("html2canvas loaded dynamically");
                    resolve();
                };
                script.onerror = () => {
                    console.error("Failed to load html2canvas");
                    reject(new Error("Failed to load html2canvas library"));
                };
                document.head.appendChild(script);
            });
            librariesPromises.push(html2canvasPromise);
        }
        
        if (!jsPDFLoaded) {
            const jsPDFPromise = new Promise((resolve, reject) => {
                loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin fa-2x mb-2"></i><br>Loading jsPDF library...<br><small>Please wait</small>';
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = () => {
                    console.log("jsPDF loaded dynamically");
                    resolve();
                };
                script.onerror = () => {
                    console.error("Failed to load jsPDF");
                    reject(new Error("Failed to load jsPDF library"));
                };
                document.head.appendChild(script);
            });
            librariesPromises.push(jsPDFPromise);
        }
        
        // Continue with PDF generation after ensuring libraries are loaded
        Promise.all(librariesPromises)
            .then(() => {
                // Start the actual PDF generation process
                generatePDF();
            })
            .catch(error => {
                console.error("Error loading libraries:", error);
                loadingIndicator.innerHTML = `<i class="fas fa-exclamation-triangle fa-2x mb-2"></i><br>Error Loading Libraries<br><small>${error.message}</small>`;
                setTimeout(() => {
                    document.body.removeChild(loadingIndicator);
                }, 3000);
            });
        
        // The actual PDF generation function
        function generatePDF() {
            loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin fa-2x mb-2"></i><br>Preparing PDF generation...<br><small>Please wait</small>';
            
            // Double-check if libraries are available
            if (typeof html2canvas === 'undefined') {
                loadingIndicator.innerHTML = '<i class="fas fa-exclamation-triangle fa-2x mb-2"></i><br>Error: html2canvas library not found<br><small>Please try refreshing the page</small>';
                setTimeout(() => {
                    document.body.removeChild(loadingIndicator);
                }, 3000);
                return;
            }
            
            if (typeof window.jspdf === 'undefined') {
                loadingIndicator.innerHTML = '<i class="fas fa-exclamation-triangle fa-2x mb-2"></i><br>Error: jsPDF library not found<br><small>Please try refreshing the page</small>';
                setTimeout(() => {
                    document.body.removeChild(loadingIndicator);
                }, 3000);
                return;
            }
            
            // Get all sections
            const sections = document.querySelectorAll('.section');
            const totalSections = sections.length;
            
            // Hide UI controls
            const printControls = document.querySelector('.print-controls');
            const drawerToggle = document.querySelector('.drawer-toggle');
            const sideDrawer = document.querySelector('.side-drawer');
            const originalDisplay = {
                printControls: printControls ? printControls.style.display : '',
                drawerToggle: drawerToggle ? drawerToggle.style.display : '',
                sideDrawer: sideDrawer ? sideDrawer.style.display : ''
            };
            
            if (printControls) printControls.style.display = 'none';
            if (drawerToggle) drawerToggle.style.display = 'none';
            if (sideDrawer) sideDrawer.style.display = 'none';
            
            // Initialize PDF document
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            console.log("PDF instance created");
            
            // Save original section display states
            const originalSectionDisplays = Array.from(sections).map(s => s.style.display);
            
            // Capture each section with html2canvas sequentially
            let currentIndex = 0;
            
            const captureNextSection = () => {
                if (currentIndex >= totalSections) {
                    // All sections captured, save PDF
                    loadingIndicator.innerHTML = '<i class="fas fa-check-circle fa-2x mb-2"></i><br>PDF Generated!<br><small>Downloading now...</small>';
                    pdf.save('AI-IoT-Presentation.pdf');
                    
                    // Restore all sections to visible
                    sections.forEach((s, i) => {
                        s.style.display = originalSectionDisplays[i];
                    });
                    
                    // Restore UI controls
                    if (printControls) printControls.style.display = originalDisplay.printControls;
                    if (drawerToggle) drawerToggle.style.display = originalDisplay.drawerToggle;
                    if (sideDrawer) sideDrawer.style.display = originalDisplay.sideDrawer;
                    
                    // Remove loading indicator
                    setTimeout(() => {
                        document.body.removeChild(loadingIndicator);
                    }, 2000);
                    return;
                }
                
                const section = sections[currentIndex];
                
                // Update loading indicator
                loadingIndicator.innerHTML = `<i class="fas fa-spinner fa-spin fa-2x mb-2"></i><br>Capturing section ${currentIndex + 1} of ${totalSections}<br><small>Please wait...</small>`;
                
                // Hide all sections except current one
                sections.forEach((s, i) => {
                    s.style.display = i === currentIndex ? 'block' : 'none';
                });
                
                // Ensure the section is visible
                section.style.visibility = 'visible';
                section.style.opacity = '1';
                
                // Make sure the current section is scrolled into view
                section.scrollIntoView({behavior: 'auto', block: 'start'});
                
                // Give browser time to render
                setTimeout(() => {
                    console.log(`Capturing section ${currentIndex + 1}: ${section.id}`);
                    
                    // Use html2canvas to capture the section
                    html2canvas(section, {
                        scale: 2, // Higher quality
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff',
                        windowWidth: window.innerWidth,
                        windowHeight: window.innerHeight,
                        logging: true,
                        onclone: (clonedDoc) => {
                            // Make sure the cloned section is visible
                            const clonedSection = clonedDoc.querySelector(`#${section.id}`);
                            if (clonedSection) {
                                clonedSection.style.display = 'block';
                                clonedSection.style.visibility = 'visible';
                                clonedSection.style.position = 'static';
                                clonedSection.style.width = '100%';
                                clonedSection.style.height = 'auto';
                            }
                        }
                    }).then(canvas => {
                        // Add current page to PDF (except for first page)
                        if (currentIndex > 0) {
                            pdf.addPage();
                        }
                        
                        // Add canvas to PDF
                        const imgData = canvas.toDataURL('image/jpeg', 0.92);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = pdf.internal.pageSize.getHeight();
                        const imgWidth = canvas.width;
                        const imgHeight = canvas.height;
                        
                        // Calculate scale to fit image to page while maintaining aspect ratio
                        const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                        const scaledWidth = imgWidth * scale;
                        const scaledHeight = imgHeight * scale;
                        
                        // Center image on page
                        const x = (pdfWidth - scaledWidth) / 2;
                        const y = (pdfHeight - scaledHeight) / 2;
                        
                        // Add image to PDF
                        pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
                        
                        console.log(`Added section ${currentIndex + 1} to PDF`);
                        
                        // Proceed to next section
                        currentIndex++;
                        captureNextSection();
                    }).catch(error => {
                        console.error(`Error capturing section ${currentIndex + 1}:`, error);
                        loadingIndicator.innerHTML = `<i class="fas fa-exclamation-triangle fa-2x mb-2"></i><br>Error capturing section ${currentIndex + 1}<br><small>${error.message || 'Unknown error'}</small>`;
                        
                        // Restore all sections to visible
                        sections.forEach((s, i) => {
                            s.style.display = originalSectionDisplays[i];
                        });
                        
                        // Restore UI controls
                        if (printControls) printControls.style.display = originalDisplay.printControls;
                        if (drawerToggle) drawerToggle.style.display = originalDisplay.drawerToggle;
                        if (sideDrawer) sideDrawer.style.display = originalDisplay.sideDrawer;
                        
                        // Remove loading indicator after delay
                        setTimeout(() => {
                            document.body.removeChild(loadingIndicator);
                        }, 3000);
                    });
                }, 500); // Allow time for browser rendering
            };
            
            // Start capturing sections
            captureNextSection();
        }
    }

    // ===== LANGUAGE TOGGLE FUNCTIONALITY =====

    // Toggle language between English and Indonesian
    languageButton.addEventListener('click', function () {
        // Toggle language
        currentLanguage = currentLanguage === 'en' ? 'id' : 'en';

        // Update button text
        languageButton.innerHTML = `<i class="fas fa-language mr-2"></i> ${uiTranslations[currentLanguage]['languageToggle']}`;

        // Update UI elements
        updateUILanguage();

        // Update print buttons text
        updatePrintButtonsText();

        // Save language preference to localStorage
        localStorage.setItem('preferredLanguage', currentLanguage);
    });

    // Update print buttons text based on current language
    function updatePrintButtonsText() {
        const printBtn = document.getElementById('print-button');
        if (printBtn) {
            printBtn.innerHTML = `<i class="fas fa-print mr-2"></i> ${uiTranslations[currentLanguage]['exportToPdf']}`;
        }
    }

    // Function to update UI language
    function updateUILanguage() {
        // Update static UI elements
        updateStaticUIElements();

        // Update all elements with data-en and data-id attributes
        document.querySelectorAll('[data-en][data-id]').forEach(element => {
            element.textContent = element.dataset[currentLanguage];
        });

        // Update elements using translations object
        // Only call if the function is defined
        if (typeof updateAllSections === 'function') {
            updateAllSections();
        } else {
            console.log("Warning: updateAllSections function is not defined. Basic translation only.");
            // Apply basic translations to key elements since the full function isn't available
            basicTranslation();
        }

        // Update fullscreen button text
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (isFullscreen) {
            fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> ' + 
                (currentLanguage === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh');
        } else {
            fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> ' + 
                (currentLanguage === 'en' ? 'Fullscreen' : 'Layar Penuh');
        }
        
        // Update drawer text
        const drawerTitle = document.querySelector('.drawer-header h3');
        if (drawerTitle) {
            drawerTitle.textContent = currentLanguage === 'en' ? 'Table of Contents' : 'Daftar Isi';
        }
    }
    
    // Basic translation function as a fallback
    function basicTranslation() {
        // Translate main section titles
        document.querySelectorAll('.section h1').forEach((element, index) => {
            const sectionKeys = [
                'title', 'outlineTitle', 'introTitle', 'integrationTitle', 
                'aiTechTitle', 'benefitsTitle', 'challengesTitle', 'caseStudiesTitle',
                'trendsTitle', 'conclusionTitle', 'referencesTitle'
            ];
            
            if (index < sectionKeys.length && pageTranslations[currentLanguage][sectionKeys[index]]) {
                element.textContent = pageTranslations[currentLanguage][sectionKeys[index]];
            }
        });

        // Translate cover page elements
        const coverTitle = document.querySelector('#section-1 h1');
        if (coverTitle && pageTranslations[currentLanguage]['title']) {
            coverTitle.textContent = pageTranslations[currentLanguage]['title'];
        }
        
        const coverSubtitle = document.querySelector('#section-1 .mb-8.text-xl');
        if (coverSubtitle && pageTranslations[currentLanguage]['subtitle']) {
            coverSubtitle.textContent = pageTranslations[currentLanguage]['subtitle'];
        }
    }

    // Update static UI elements
    function updateStaticUIElements() {
        // Update print button text
        updatePrintButtonsText();
    }

    // Better approach to update all sections
    function updateAllSections() {
        try {
            console.log("Starting translation with language: " + currentLanguage);
            
            // Cover section
            updateElementBySelector('#section-1 h1', 'title');
            updateElementBySelector('#section-1 .mb-8.text-xl', 'subtitle');
            
            // Try to update elements with different selectors if the original ones don't work
            try {
                // First try direct approach
                updateElementBySelector('#section-1 .program', 'program');
                updateElementBySelector('#section-1 .course', 'course');
            } catch (e) {
                // Then try more specific selectors
                console.log("Using alternate selectors for program/course");
                updateElementBySelector('#section-1 .bg-white.bg-opacity-10 p:first-of-type', 'program');
                updateElementBySelector('#section-1 .bg-white.bg-opacity-10 p:last-of-type', 'course');
            }
            
            updateElementBySelector('#section-1 h2:nth-of-type(1)', 'programTitle');
            updateElementBySelector('#section-1 h2:nth-of-type(2)', 'courseTitle');
            updateElementBySelector('#section-1 h2:nth-of-type(3)', 'preparedBy');
            
            try {
                updateElementBySelector('#section-1 .bg-white.bg-opacity-10.px-4.py-2.rounded-lg:nth-of-type(1) p', 'university');
                updateElementBySelector('#section-1 .bg-white.bg-opacity-10.px-4.py-2.rounded-lg:nth-of-type(2) p', 'faculty');
            } catch (e) {
                console.log("Couldn't update university/faculty");
            }

            // Outline section
            updateElementBySelector('#section-2 h1', 'outlineTitle');
            try {
                updateElementsBySelector('#section-2 h2.font-semibold', [
                    'intro', 'aiTech', 'benefits', 'challenges', 'casestudies', 'futureTrends'
                ]);
                updateElementsBySelector('#section-2 p.text-gray-600', [
                    'introDesc', 'aiTechDesc', 'benefitsDesc', 'challengesDesc', 'casestudiesDesc', 'futureTrendsDesc'
                ]);
            } catch (e) {
                console.log("Couldn't update all outline items: " + e.message);
            }

            // Introduction sections
            updateElementBySelector('#section-3 h1', 'introTitle');
            updateElementBySelector('#section-3 h2:nth-of-type(1)', 'iotTitle');
            try {
                updateElementsBySelector('#section-3 .md\\:w-1\\/2:first-of-type .list-disc li', [
                    'iotPoint1', 'iotPoint2', 'iotPoint3', 'iotPoint4'
                ]);
            } catch (e) {
                console.log("Couldn't update iot points");
            }
            
            updateElementBySelector('#section-3 h2:nth-of-type(2)', 'aiTitle');
            try {
                updateElementsBySelector('#section-3 .mt-6 .list-disc li', [
                    'aiPoint1', 'aiPoint2', 'aiPoint3', 'aiPoint4'
                ]);
            } catch (e) {
                console.log("Couldn't update ai points");
            }
            
            updateElementBySelector('#section-3 p.text-center.italic.text-gray-600', 'quote');
            updateElementBySelector('#section-3 h3.font-semibold.text-blue-700', 'whyIntegrate');
            updateElementBySelector('#section-3 .bg-blue-50 p.text-gray-700', 'whyIntegrateDesc');

            // And continue for other sections as needed...
            // Just translate the section titles for now as a fallback
            updateElementBySelector('#section-4 h1', 'integrationTitle');
            updateElementBySelector('#section-5 h1', 'aiTechTitle');
            updateElementBySelector('#section-6 h1', 'benefitsTitle');
            updateElementBySelector('#section-7 h1', 'challengesTitle');
            updateElementBySelector('#section-8 h1', 'caseStudiesTitle');
            updateElementBySelector('#section-9 h1', 'trendsTitle');
            updateElementBySelector('#section-10 h1', 'conclusionTitle');
            updateElementBySelector('#section-11 h1', 'referencesTitle');
            
            console.log("Translation completed");
        } catch (error) {
            console.error("Error in updateAllSections: " + error.message);
            // Fall back to basic translation
            basicTranslation();
        }
    }

    // Helper functions for DOM manipulation with translations

    // Update element by CSS selector
    function updateElementBySelector(selector, translationKey, isHTML = false) {
        try {
            const element = document.querySelector(selector);
            if (element && pageTranslations && pageTranslations[currentLanguage] && pageTranslations[currentLanguage][translationKey]) {
                if (isHTML) {
                    element.innerHTML = pageTranslations[currentLanguage][translationKey];
                } else {
                    element.textContent = pageTranslations[currentLanguage][translationKey];
                }
                return true;
            }
            return false;
        } catch (error) {
            console.warn(`Error updating element with selector ${selector}: ${error.message}`);
            return false;
        }
    }

    // Update multiple elements by CSS selector
    function updateElementsBySelector(selector, translationKeys) {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length && translationKeys && translationKeys.length) {
                // Only update up to the minimum length
                const count = Math.min(elements.length, translationKeys.length);
                for (let i = 0; i < count; i++) {
                    if (pageTranslations && 
                        pageTranslations[currentLanguage] && 
                        pageTranslations[currentLanguage][translationKeys[i]]) {
                        elements[i].textContent = pageTranslations[currentLanguage][translationKeys[i]];
                    }
                }
                return true;
            }
            return false;
        } catch (error) {
            console.warn(`Error updating elements with selector ${selector}: ${error.message}`);
            return false;
        }
    }

    // Assign print functionality to print button
    if (printButton) {
        // Create a dropdown menu for print options
        const printOptions = document.createElement('div');
        printOptions.className = 'print-options';
        printOptions.style.position = 'absolute';
        printOptions.style.top = '100%';
        printOptions.style.right = '0';
        printOptions.style.backgroundColor = 'white';
        printOptions.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        printOptions.style.borderRadius = '4px';
        printOptions.style.padding = '8px 0';
        printOptions.style.zIndex = '9999';
        printOptions.style.display = 'none';
        
        // Add the options
        printOptions.innerHTML = `
            <div class="print-option" style="padding: 8px 16px; cursor: pointer; transition: background-color 0.2s;" 
                 onmouseover="this.style.backgroundColor='#f3f4f6'" 
                 onmouseout="this.style.backgroundColor='transparent'" 
                 data-print-type="portrait">
                <i class="fas fa-file-pdf mr-2"></i> Portrait PDF
            </div>
            <div class="print-option" style="padding: 8px 16px; cursor: pointer; transition: background-color 0.2s;" 
                 onmouseover="this.style.backgroundColor='#f3f4f6'" 
                 onmouseout="this.style.backgroundColor='transparent'" 
                 data-print-type="landscape">
                <i class="fas fa-file-pdf mr-2"></i> Landscape PDF
            </div>
            <div class="print-option" style="padding: 8px 16px; cursor: pointer; transition: background-color 0.2s;" 
                 onmouseover="this.style.backgroundColor='#f3f4f6'" 
                 onmouseout="this.style.backgroundColor='transparent'" 
                 data-print-type="screenshot">
                <i class="fas fa-camera mr-2"></i> Screenshot PDF
            </div>
        `;
        
        // Append the options to the print button
        printButton.parentNode.style.position = 'relative';
        printButton.parentNode.appendChild(printOptions);
        
        // Toggle the options on click
        printButton.addEventListener('click', function(e) {
            e.stopPropagation();
            printOptions.style.display = printOptions.style.display === 'none' ? 'block' : 'none';
        });
        
        // Close the options when clicking elsewhere
        document.addEventListener('click', function() {
            printOptions.style.display = 'none';
        });
        
        // Add event listeners to the options
        const portraitOption = printOptions.querySelector('[data-print-type="portrait"]');
        const landscapeOption = printOptions.querySelector('[data-print-type="landscape"]');
        const screenshotOption = printOptions.querySelector('[data-print-type="screenshot"]');
        
        portraitOption.addEventListener('click', function(e) {
            e.stopPropagation();
            printOptions.style.display = 'none';
            handleVisuallyAccuratePrinting();
        });
        
        landscapeOption.addEventListener('click', function(e) {
            e.stopPropagation();
            printOptions.style.display = 'none';
            handleLandscapePrinting();
        });
        
        screenshotOption.addEventListener('click', function(e) {
            e.stopPropagation();
            printOptions.style.display = 'none';
            handleScreenshotPDF();
        });
    }

    // Initialize language based on saved preference or default to English
    function initializeLanguage() {
        try {
            console.log("Initializing language");
            
            // Check if translations are available
            if (!window.uiTranslations || !window.pageTranslations) {
                console.error("Translation objects not found. Translations may not work correctly.");
                
                // Define default translations if they don't exist
                if (!window.uiTranslations) {
                    window.uiTranslations = {
                        'en': {
                            'exportToPdf': 'Export to PDF',
                            'languageToggle': 'Bahasa Indonesia',
                            'fullscreen': 'Fullscreen',
                            'exitFullscreen': 'Exit Fullscreen'
                        },
                        'id': {
                            'exportToPdf': 'Ekspor ke PDF',
                            'languageToggle': 'English',
                            'fullscreen': 'Layar Penuh',
                            'exitFullscreen': 'Keluar Layar Penuh'
                        }
                    };
                }
            }
            
            // Check if there's a saved language preference
            const savedLanguage = localStorage.getItem('preferredLanguage');
            if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
                currentLanguage = savedLanguage;
                console.log("Using saved language preference: " + currentLanguage);
            } else {
                console.log("Using default language: " + currentLanguage);
            }

            // Set initial button text
            if (languageButton && uiTranslations && uiTranslations[currentLanguage]) {
                languageButton.innerHTML = `<i class="fas fa-language mr-2"></i> ${uiTranslations[currentLanguage]['languageToggle']}`;
            } else {
                console.error("Could not set language button text");
                if (languageButton) {
                    languageButton.innerHTML = `<i class="fas fa-language mr-2"></i> ${currentLanguage === 'en' ? 'Bahasa Indonesia' : 'English'}`;
                }
            }

            // Update UI with the selected language
            updateUILanguage();
            console.log("Language initialization complete");
        } catch (error) {
            console.error("Error in language initialization: " + error.message);
            // Continue without translation
        }
    }

    // Debug function to check translations
    function debugTranslations() {
        console.log("Current Language: " + currentLanguage);
        console.log("UI Translations available:", !!window.uiTranslations);
        console.log("Page Translations available:", !!window.pageTranslations);
        if (window.uiTranslations) {
            console.log("UI Translation keys:", Object.keys(window.uiTranslations[currentLanguage] || {}));
        }
        if (window.pageTranslations) {
            console.log("Page Translation keys:", Object.keys(window.pageTranslations[currentLanguage] || {}));
        }
    }

    // Initialize language when the page loads
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM fully loaded");
        setTimeout(function() {
            initializeLanguage();
            debugTranslations();
        }, 500); // Short delay to ensure translations.js is loaded
    });

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