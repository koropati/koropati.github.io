document.addEventListener('DOMContentLoaded', function () {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    const totalSections = sections.length;

    // Print button
    const printButton = document.getElementById('print-button');

    // Screenshot to PDF button
    const screenshotButton = document.getElementById('screenshot-button');

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

    // Translations
    const uiTranslations = {
        'en': {
            'exportToPdf': 'Export to PDF',
            'exportAsScreenshots': 'Export as Screenshots',
            'languageToggle': 'Bahasa Indonesia',
            'fullscreen': 'Fullscreen',
            'exitFullscreen': 'Exit Fullscreen',
            'tableOfContents': 'Table of Contents',
            'presentedBy': 'Presented by:',
            'processingScreenshots': 'Processing screenshots...',
            'generatingPdf': 'Generating PDF...',
            'downloadStarting': 'Download starting...'
        },
        'id': {
            'exportToPdf': 'Ekspor ke PDF',
            'exportAsScreenshots': 'Ekspor sebagai Screenshots',
            'languageToggle': 'English',
            'fullscreen': 'Layar Penuh',
            'exitFullscreen': 'Keluar Layar Penuh',
            'tableOfContents': 'Daftar Isi',
            'presentedBy': 'Dipresentasikan oleh:',
            'processingScreenshots': 'Memproses tangkapan layar...',
            'generatingPdf': 'Membuat PDF...',
            'downloadStarting': 'Unduhan dimulai...'
        }
    };

    const pageTranslations = {
        'en': {
            // Section 1: Cover
            'title': 'Air Quality Monitoring System Based on IoT',
            'subtitle': 'Real Time System Monitoring and Analysis Using Internet of Things Technology in Measuring Outdoor Air Quality',
            'program': 'Master of Computer Science',
            'course': 'Mobile Computing',
            'preparedBy': 'Paper by:',
            'university': 'Review Presentation',

            // Section 2: Outline
            'outlineTitle': 'Presentation Outline',
            'intro': '1. Introduction',
            'introDesc': 'Background, problem statement, and research objectives',
            'relatedWorks': '2. Related Works',
            'relatedWorksDesc': 'Previous research on IoT-based air quality monitoring systems',
            'methodology': '3. Methodology',
            'methodologyDesc': 'Sensors, microcontrollers, and software approach used in the research',
            'systemDesign': '4. System Design',
            'systemDesignDesc': 'Architecture, hardware configuration, and categorization of air quality',
            'results': '5. Results & Analysis',
            'resultsDesc': 'Test measurements, web interface, and data visualization',
            'conclusion': '6. Conclusion & Future Work',
            'conclusionDesc': 'Summary of findings and recommendations for improvement',

            // Section 3: Introduction
            'introTitle': 'Introduction',
            'background': 'Background',
            'backgroundPoint1': 'Air pollution is a major environmental and public health challenge globally',
            'backgroundPoint2': 'Riau province in Indonesia has the largest peatland in Sumatra (4,044 million hectares)',
            'backgroundPoint3': 'Illegal forest burning causes significant air pollution and thick smog annually',
            'backgroundPoint4': 'Current monitoring systems (ISPU) are limited in:',
            'backgroundPoint4Sub1': 'Fixed installation points with limited coverage',
            'backgroundPoint4Sub2': 'Non-real-time updates (only at 15:00 WIB each day)',
            'backgroundPoint4Sub3': 'Slow data processing and management',
            'objectives': 'Research Objectives',
            'objectivesPoint1': 'Develop a real-time air quality monitoring system based on IoT',
            'objectivesPoint2': 'Create an accessible web interface to display air quality information',
            'objectivesPoint3': 'Measure multiple air quality parameters: temperature, humidity, CO, CO2, and alcohol presence',
            'objectivesPoint4': 'Enable remote access to air quality data for public awareness',
            'quote': '"IoT technology enables transferring data over a network without requiring human-to-human or human-to-computer interaction, creating systems that can sense and connect to their environment."',
            'iotTitle': 'Internet of Things (IoT)',
            'iotDesc': 'A network of physical devices connected to the internet that can collect and exchange data without human intervention, providing real-time insights and enabling smarter decision-making.',

            // Other sections would continue here
            'relatedWorksTitle': 'Related Works',
            'methodologyTitle': 'Methodology',
            'systemDesignTitle': 'System Design',
            'resultsTitle': 'Results & Analysis',
            'conclusionTitle': 'Conclusion & Future Work',
            'referencesTitle': 'References',
            'thankYou': 'Thank You!'
        },
        'id': {
            // Section 1: Cover
            'title': 'Sistem Pemantauan Kualitas Udara Berbasis IoT',
            'subtitle': 'Sistem Pemantauan dan Analisis Waktu Nyata Menggunakan Teknologi Internet of Things dalam Mengukur Kualitas Udara Luar Ruangan',
            'program': 'Magister Ilmu Komputer',
            'course': 'Komputasi Bergerak',
            'preparedBy': 'Paper oleh:',
            'university': 'Presentasi Review',

            // Section 2: Outline
            'outlineTitle': 'Garis Besar Presentasi',
            'intro': '1. Pendahuluan',
            'introDesc': 'Latar belakang, pernyataan masalah, dan tujuan penelitian',
            'relatedWorks': '2. Kajian Terkait',
            'relatedWorksDesc': 'Penelitian sebelumnya tentang sistem pemantauan kualitas udara berbasis IoT',
            'methodology': '3. Metodologi',
            'methodologyDesc': 'Sensor, mikrokontroler, dan pendekatan perangkat lunak yang digunakan dalam penelitian',
            'systemDesign': '4. Desain Sistem',
            'systemDesignDesc': 'Arsitektur, konfigurasi perangkat keras, dan kategorisasi kualitas udara',
            'results': '5. Hasil & Analisis',
            'resultsDesc': 'Pengukuran uji, antarmuka web, dan visualisasi data',
            'conclusion': '6. Kesimpulan & Penelitian Selanjutnya',
            'conclusionDesc': 'Ringkasan temuan dan rekomendasi untuk perbaikan',

            // Section 3: Introduction
            'introTitle': 'Pendahuluan',
            'background': 'Latar Belakang',
            'backgroundPoint1': 'Polusi udara adalah tantangan lingkungan dan kesehatan masyarakat yang besar secara global',
            'backgroundPoint2': 'Provinsi Riau di Indonesia memiliki lahan gambut terbesar di Sumatera (4.044 juta hektar)',
            'backgroundPoint3': 'Pembakaran hutan ilegal menyebabkan polusi udara signifikan dan kabut asap tebal setiap tahun',
            'backgroundPoint4': 'Sistem pemantauan saat ini (ISPU) memiliki keterbatasan dalam:',
            'backgroundPoint4Sub1': 'Titik instalasi tetap dengan cakupan terbatas',
            'backgroundPoint4Sub2': 'Pembaruan tidak real-time (hanya pada pukul 15:00 WIB setiap hari)',
            'backgroundPoint4Sub3': 'Pemrosesan dan pengelolaan data yang lambat',
            'objectives': 'Tujuan Penelitian',
            'objectivesPoint1': 'Mengembangkan sistem pemantauan kualitas udara real-time berbasis IoT',
            'objectivesPoint2': 'Membuat antarmuka web yang mudah diakses untuk menampilkan informasi kualitas udara',
            'objectivesPoint3': 'Mengukur beberapa parameter kualitas udara: suhu, kelembaban, CO, CO2, dan keberadaan alkohol',
            'objectivesPoint4': 'Memungkinkan akses jarak jauh ke data kualitas udara untuk kesadaran publik',
            'quote': '"Teknologi IoT memungkinkan transfer data melalui jaringan tanpa memerlukan interaksi manusia-ke-manusia atau manusia-ke-komputer, menciptakan sistem yang dapat merasakan dan terhubung dengan lingkungannya."',
            'iotTitle': 'Internet of Things (IoT)',
            'iotDesc': 'Jaringan perangkat fisik yang terhubung ke internet yang dapat mengumpulkan dan bertukar data tanpa intervensi manusia, memberikan wawasan real-time dan memungkinkan pengambilan keputusan yang lebih cerdas.',

            // Other sections would continue here
            'relatedWorksTitle': 'Kajian Terkait',
            'methodologyTitle': 'Metodologi',
            'systemDesignTitle': 'Desain Sistem',
            'resultsTitle': 'Hasil & Analisis',
            'conclusionTitle': 'Kesimpulan & Penelitian Selanjutnya',
            'referencesTitle': 'Referensi',
            'thankYou': 'Terima Kasih!'
        }
    };

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
        // Update TOC items
        document.querySelectorAll('.toc-item').forEach((item) => {
            if (parseInt(item.dataset.section) === parseInt(sectionNumber)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Export to PDF with expanded landscape orientation
    function handleLandscapePrinting() {
        // Save original scroll position
        const originalScrollPos = window.scrollY;

        // Create print-specific CSS for expanded landscape orientation
        let printCSS = `
        @page {
          size: 29.7cm 21cm landscape;
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
          
          .section {
            box-sizing: border-box !important;
            position: relative !important;
            page-break-after: always !important;
            break-after: page !important;
            overflow: visible !important;
            width: 100% !important;
            border: none !important;
            display: flex !important; 
            height: 21cm !important;
            min-height: 21cm !important;
            max-height: 21cm !important;
            padding: 1cm !important;
            transform-origin: top left !important;
          }
          
          #section-1 {
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
          }
  
          .section:not(#section-1) {
            flex-direction: column !important;
            justify-content: flex-start !important;
            align-items: flex-start !important;
          }
          
          .section > div {
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
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
          
          /* Disable animations when printing */
          .pulse, .float, .rotate-slow {
            animation: none !important;
          }

          /* Ensure the final sections are visible */
          #section-8 .mt-8.text-center,
          #section-9 .mt-8.text-center {
            position: relative !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
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

            // Remove style after printing and restore scroll position
            setTimeout(() => {
                document.head.removeChild(printStyle);
                window.scrollTo(0, originalScrollPos);
            }, 300);
        }, 800);
    }

    // Function to handle screenshot to PDF conversion
    async function handleScreenshotToPDF() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = uiTranslations[currentLanguage]['processingScreenshots'];
        document.body.appendChild(notification);

        try {
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Original scroll position
            const originalScrollPos = window.scrollY;

            // Hide controls and drawer for clean screenshots
            const controls = document.querySelector('.print-controls');
            const drawer = document.querySelector('.side-drawer');
            const drawerToggle = document.querySelector('.drawer-toggle');

            controls.style.display = 'none';
            drawer.style.display = 'none';
            drawerToggle.style.display = 'none';

            console.log("Starting PDF generation process");

            // Split the export process into smaller chunks to avoid canvas size issues
            const chunkSize = 3; // Process 3 sections at a time
            for (let startIdx = 0; startIdx < sections.length; startIdx += chunkSize) {
                const endIdx = Math.min(startIdx + chunkSize, sections.length);
                console.log(`Processing sections ${startIdx + 1} to ${endIdx}`);
                
                notification.textContent = `${uiTranslations[currentLanguage]['processingScreenshots']} (${startIdx + 1}-${endIdx}/${sections.length})`;
                
                // Process each section in this chunk
                for (let i = startIdx; i < endIdx; i++) {
                    const section = sections[i];
                    console.log(`Capturing section ${i + 1}: ${section.id}`);
                    
                    // Scroll to section
                    section.scrollIntoView({behavior: 'auto', block: 'start'});
                    await new Promise(resolve => setTimeout(resolve, 500)); // Longer wait time
                    
                    // Special section handling
                    if (i === 5) { // Section 6 (System Design)
                        console.log("Special handling for System Design section");
                        
                        // Force images to load completely
                        const images = section.querySelectorAll('img');
                        if (images.length > 0) {
                            notification.textContent = "Ensuring images are loaded...";
                            await Promise.all(Array.from(images).map(img => {
                                return new Promise(resolve => {
                                    if (img.complete) resolve();
                                    else {
                                        img.onload = resolve;
                                        img.onerror = resolve; // Continue even if image fails
                                    }
                                });
                            }));
                        }
                        
                        // Additional wait time for Section 6
                        await new Promise(resolve => setTimeout(resolve, 800));
                    }
                    
                    // Final sections (conclusion and references)
                    if (i >= sections.length - 2) {
                        // Scroll to section top first
                        section.scrollIntoView({block: 'start', behavior: 'auto'});
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // Always scroll down a bit to reveal bottom content
                        window.scrollBy(0, 200);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // Add special handling for thank you and final assessment sections
                        const finalBlocksInSection = section.querySelectorAll('.mt-8.text-center');
                        if (finalBlocksInSection.length > 0) {
                            finalBlocksInSection[0].scrollIntoView({block: 'center'});
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                    
                    // Add render preparation
                    window.scrollBy(0, 20);
                    window.scrollBy(0, -20);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    // Update notification
                    notification.textContent = `${uiTranslations[currentLanguage]['processingScreenshots']} (${i + 1}/${sections.length})`;
                    
                    // Improved capture options with better error handling
                    try {
                        const captureOptions = {
                            scale: 1.5, // Reduced from 2 to avoid memory issues
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: '#FFFFFF',
                            logging: false,
                            width: window.innerWidth,
                            height: section.offsetHeight > window.innerHeight ? 
                                   section.offsetHeight : window.innerHeight,
                            scrollX: 0,
                            scrollY: -window.scrollY,
                            ignoreElements: (element) => {
                                // Ignore problematic elements that might cause rendering issues
                                return element.classList.contains('drawer-toggle') || 
                                       element.classList.contains('print-controls');
                            }
                        };
                        
                        // Capture with error fallback
                        let canvas;
                        try {
                            canvas = await html2canvas(section, captureOptions);
                        } catch (canvasError) {
                            console.error("Canvas error:", canvasError);
                            notification.textContent = `Retrying section ${i+1} with simplified rendering...`;
                            
                            // Fallback to simpler capture settings
                            const fallbackOptions = {
                                ...captureOptions,
                                scale: 1,
                                removeContainer: true,
                                ignoreElements: (element) => {
                                    // Ignore more elements in fallback mode
                                    return element.tagName === 'IMG' || 
                                           element.classList.contains('drawer-toggle') || 
                                           element.classList.contains('print-controls');
                                }
                            };
                            
                            await new Promise(resolve => setTimeout(resolve, 500));
                            canvas = await html2canvas(section, fallbackOptions);
                        }
                        
                        // Add to PDF
                        const imgData = canvas.toDataURL('image/jpeg', 0.9);
                        
                        // Add page if not first section
                        if (i > 0) {
                            doc.addPage();
                        }
                        
                        // Add image to PDF with correct sizing
                        if (i === 0) {
                            // Cover page
                            doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
                        } else {
                            // Calculate sizing to fit page
                            const imgWidth = canvas.width;
                            const imgHeight = canvas.height;
                            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                            const imgX = (pageWidth - imgWidth * ratio) / 2;
                            const imgY = 5; // Fixed 5mm margin at top
                            
                            doc.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                        }
                        
                    } catch (sectionError) {
                        console.error(`Error processing section ${i+1}:`, sectionError);
                        notification.textContent = `Skipping section ${i+1} due to error. Continuing...`;
                        
                        // Add an error page instead
                        if (i > 0) {
                            doc.addPage();
                        }
                        
                        // Add text explaining the error
                        doc.setFontSize(16);
                        doc.text(`Section ${i+1} (${section.id}) could not be rendered.`, 20, 20);
                        doc.setFontSize(12);
                        doc.text(`Error: ${sectionError.message}`, 20, 30);
                        
                        // Wait before continuing
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            // Restore elements
            controls.style.display = '';
            drawer.style.display = '';
            drawerToggle.style.display = '';

            // Restore original scroll position
            window.scrollTo(0, originalScrollPos);

            // Update notification
            notification.textContent = uiTranslations[currentLanguage]['generatingPdf'];

            // Save PDF
            doc.save('air_quality_monitoring_presentation.pdf');

            // Update notification before removing
            notification.textContent = uiTranslations[currentLanguage]['downloadStarting'];
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

            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 1000);
            }, 3000);
        }
    }

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
    });

    // Update print buttons text based on current language
    function updatePrintButtonsText() {
        const printBtn = document.getElementById('print-button');
        if (printBtn) {
            printBtn.innerHTML = `<i class="fas fa-print mr-2"></i> ${uiTranslations[currentLanguage]['exportToPdf']}`;
        }

        const screenshotBtn = document.getElementById('screenshot-button');
        if (screenshotBtn) {
            screenshotBtn.innerHTML = `<i class="fas fa-camera mr-2"></i> ${uiTranslations[currentLanguage]['exportAsScreenshots']}`;
        }
    }

    // Function to update UI language
    function updateUILanguage() {
        // Update static UI elements
        updateStaticUIElements();

        // Update all elements with translation keys
        updateAllSections();
    }

    // Better approach to update all sections
    function updateAllSections() {
        try {
            // Cover section
            updateElementBySelector('#section-1 h1', 'title');
            updateElementBySelector('#section-1 .mb-8.text-xl', 'subtitle');

            // Program and course
            const programDivs = document.querySelectorAll('#section-1 .bg-white.bg-opacity-10.p-5.rounded-lg p');
            if (programDivs.length >= 2) {
                programDivs[0].textContent = pageTranslations[currentLanguage]['program'];
                programDivs[1].textContent = pageTranslations[currentLanguage]['course'];
            }

            updateElementBySelector('#section-1 h2:nth-of-type(1)', 'programTitle');
            updateElementBySelector('#section-1 h2:nth-of-type(2)', 'courseTitle');
            updateElementBySelector('#section-1 h2:nth-of-type(3)', 'preparedBy');

            // University info
            const uniDiv = document.querySelector('#section-1 .bg-white.bg-opacity-10.px-4.py-2.rounded-lg p');
            if (uniDiv) {
                uniDiv.textContent = pageTranslations[currentLanguage]['university'];
            }

            // Presenter info
            updateElementBySelector('#section-1 h3.font-semibold', 'presentedBy', false, uiTranslations);

            // Outline section
            updateElementBySelector('#section-2 h1', 'outlineTitle');
            const outlineTitles = document.querySelectorAll('#section-2 h2.font-semibold');
            const outlineDescs = document.querySelectorAll('#section-2 p.text-gray-600');

            if (outlineTitles.length >= 6 && outlineDescs.length >= 6) {
                outlineTitles[0].textContent = pageTranslations[currentLanguage]['intro'];
                outlineDescs[0].textContent = pageTranslations[currentLanguage]['introDesc'];
                outlineTitles[1].textContent = pageTranslations[currentLanguage]['relatedWorks'];
                outlineDescs[1].textContent = pageTranslations[currentLanguage]['relatedWorksDesc'];
                outlineTitles[2].textContent = pageTranslations[currentLanguage]['methodology'];
                outlineDescs[2].textContent = pageTranslations[currentLanguage]['methodologyDesc'];
                outlineTitles[3].textContent = pageTranslations[currentLanguage]['systemDesign'];
                outlineDescs[3].textContent = pageTranslations[currentLanguage]['systemDesignDesc'];
                outlineTitles[4].textContent = pageTranslations[currentLanguage]['results'];
                outlineDescs[4].textContent = pageTranslations[currentLanguage]['resultsDesc'];
                outlineTitles[5].textContent = pageTranslations[currentLanguage]['conclusion'];
                outlineDescs[5].textContent = pageTranslations[currentLanguage]['conclusionDesc'];
            }

            // Update each section title
            updateElementBySelector('#section-3 h1', 'introTitle');
            updateElementBySelector('#section-4 h1', 'relatedWorksTitle');
            updateElementBySelector('#section-5 h1', 'methodologyTitle');
            updateElementBySelector('#section-6 h1', 'systemDesignTitle');
            updateElementBySelector('#section-7 h1', 'resultsTitle');
            updateElementBySelector('#section-8 h1', 'conclusionTitle');
            updateElementBySelector('#section-9 h1', 'referencesTitle');

            // Update drawer title
            const drawerTitle = document.querySelector('.drawer-header h3');
            if (drawerTitle) {
                drawerTitle.textContent = uiTranslations[currentLanguage]['tableOfContents'];
            }

            // Update TOC items after language change
            const tocItems = document.querySelectorAll('.toc-item');
            tocItems.forEach((item, index) => {
                const titleSpan = item.querySelector('.toc-section-title');
                if (titleSpan) {
                    // Get the section title based on index
                    const sectionId = `section-${index + 1}`;
                    const sectionTitle = document.querySelector(`#${sectionId} h1`);
                    if (sectionTitle) {
                        titleSpan.textContent = sectionTitle.textContent;
                    }
                }
            });

        } catch (error) {
            console.error("Error in updateAllSections: " + error.message);
        }
    }

    // Update element by CSS selector
    function updateElementBySelector(selector, translationKey, isHTML = false, translationObj = pageTranslations) {
        try {
            const element = document.querySelector(selector);
            if (element && translationObj && translationObj[currentLanguage] && translationObj[currentLanguage][translationKey]) {
                if (isHTML) {
                    element.innerHTML = translationObj[currentLanguage][translationKey];
                } else {
                    element.textContent = translationObj[currentLanguage][translationKey];
                }
                return true;
            }
            return false;
        } catch (error) {
            console.warn(`Error updating element with selector ${selector}: ${error.message}`);
            return false;
        }
    }

    // Update static UI elements
    function updateStaticUIElements() {
        // Update print button text
        updatePrintButtonsText();

        // Update fullscreen button
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (isFullscreen) {
            fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> ' +
                (currentLanguage === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh');
        } else {
            fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> ' +
                (currentLanguage === 'en' ? 'Fullscreen' : 'Layar Penuh');
        }
    }

    // Assign print functionality to print button
    if (printButton) {
        printButton.addEventListener('click', handleLandscapePrinting);
    }

    // Assign screenshot to PDF functionality to screenshot button
    if (screenshotButton) {
        screenshotButton.addEventListener('click', handleScreenshotToPDF);
    }

    // Initialize language
    function initializeLanguage() {
        // Default to English
        currentLanguage = 'en';

        // Update UI with the selected language
        updateUILanguage();
    }

    // Initialize the presentation
    populateTableOfContents();
    initializeDrawer();
    initializeFullscreen();
    initializeLanguage();

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