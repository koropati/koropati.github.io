document.addEventListener('DOMContentLoaded', function () {
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
        tocList.innerHTML = ''; // Clear existing TOC

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

    // Function to update fullscreen button text
    // IMPORTANT: Move this out to global scope so it can be accessed from anywhere
    function updateFullscreenButtonText() {
        if (document.fullscreenElement) {
            fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> ' +
                (currentLanguage === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh');
        } else {
            fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> ' +
                (currentLanguage === 'en' ? 'Fullscreen' : 'Layar Penuh');
        }
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
                updateFullscreenButtonText();
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                updateFullscreenButtonText();
            }
        });

        // Update button text when fullscreen changes (e.g., by Esc key)
        document.addEventListener('fullscreenchange', updateFullscreenButtonText);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButtonText);
        document.addEventListener('msfullscreenchange', updateFullscreenButtonText);
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

    // Function for advanced printing
    function handlePrinting() {
        console.log("Handling printing...");

        // Save original scroll position
        const originalScrollPos = window.scrollY;

        // Set style for print
        const style = document.createElement('style');
        style.textContent = `
            @page {
                size: 21cm 29.7cm; /* Default A4 */
                margin: 0;
            }
            @media print {
                body, html {
                    height: auto !important;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    background-color: white;
                }
                /* Base styling for all sections */
                .section {
                    position: relative;
                    page-break-after: always;
                    page-break-inside: avoid;
                    break-after: page;
                    box-sizing: border-box;
                    width: 100%;
                    padding: 0.8cm;
                    overflow: hidden;
                    border: none;
                    display: flex !important;
                }
    
                /* Special styling for section 1 (cover) - centered content */
                #section-1 {
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 1.5cm;
                }
    
                /* Styling for all other sections - top-aligned content */
                .section:not(#section-1) {
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding-top: 0.8cm;
                }
                
                .print-controls, .section-nav, .drawer-toggle, .side-drawer {
                    display: none !important;
                }
                
                /* Force backgrounds to print */
                .gradient-bg {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background: linear-gradient(135deg, #667eea, #764ba2) !important;
                }
                
                table tr.bg-green-50 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background-color: #f0fdf4 !important;
                }
                
                table thead tr.bg-gray-100 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background-color: #f3f4f6 !important;
                }
                
                .bg-red-50, .bg-green-50, .bg-blue-50, .bg-yellow-50, .bg-indigo-50 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                }
            }
        `;
        document.head.appendChild(style);

        // Trigger print dialog
        setTimeout(() => {
            console.log("Calling window.print()");
            window.print();

            // Remove style after print
            setTimeout(() => {
                document.head.removeChild(style);
                // Restore scroll position
                window.scrollTo(0, originalScrollPos);
                console.log("Print completed");
            }, 100);
        }, 300);
    }

    // Toggle language between English and Indonesian
    languageButton.addEventListener('click', function () {
        // Toggle language
        currentLanguage = currentLanguage === 'en' ? 'id' : 'en';

        // Update button text
        languageButton.innerHTML = `<i class="fas fa-language mr-2"></i> ${uiTranslations[currentLanguage]['languageToggle']}`;

        // Update UI elements
        updateUILanguage();

        // Save language preference to localStorage
        localStorage.setItem('preferredLanguage', currentLanguage);
    });

    // Function to update UI language
    function updateUILanguage() {
        // Update static UI elements
        updateStaticUIElements();

        // Update all elements with data-en and data-id attributes
        document.querySelectorAll('[data-en][data-id]').forEach(element => {
            element.textContent = element.dataset[currentLanguage];
        });

        // Update elements using translations object
        updateAllSections();
    }

    // Update static UI elements
    function updateStaticUIElements() {
        // Update print button text
        printButton.innerHTML = `<i class="fas fa-print mr-2"></i> ${uiTranslations[currentLanguage]['exportToPdf']}`;

        // Update fullscreen button text
        updateFullscreenButtonText();

        // Update drawer title
        const drawerTitle = document.querySelector('.drawer-header h3');
        if (drawerTitle) {
            drawerTitle.textContent = uiTranslations[currentLanguage]['tableOfContents'];
        }
    }

    // Update all sections with translations
    function updateAllSections() {
        // Section 1: Cover
        updateElementBySelector('#section-1 h1', 'title');
        updateElementBySelector('#section-1 .mb-8.text-xl', 'paperSummary');
        updateElementsByTag('#section-1', 'h2.font-semibold.mb-2', ['authors', 'publishedIn', 'presentedBy']);
        updateElementBySelector('#section-1 .bg-white.bg-opacity-10.p-5.rounded-lg.border.border-white.border-opacity-20:nth-of-type(2) p', 'conference');
        updateElementBySelector('#section-1 .bg-white.bg-opacity-10.px-4.py-2.rounded-lg:nth-of-type(2) p', 'course');

        // Section 2: Outline
        updateElementBySelector('#section-2 h1', 'outlineTitle');
        updateElementsBySelector('#section-2 .font-semibold', [
            'intro', 'waterQuality', 'methods', 'iotImplementation', 'results', 'comparison', 'uiImplementation', 'conclusion'
        ]);
        updateElementsBySelector('#section-2 .text-gray-600', [
            'problemStatement', 'waterQualityDesc', 'methodsDescription', 'iotImplementationDesc',
            'resultsDescription', 'comparisonDesc', 'uiImplementationDesc', 'conclusionDescription'
        ]);

        // Section 3: Introduction
        updateElementBySelector('#section-3 h1', 'introTitle');
        updateElementBySelector('#section-3 h2:first-of-type', 'background');
        updateElementsBySelector('#section-3 .md\\:w-1\\/2:first-of-type .list-disc li', [
            'backgroundPoint1', 'backgroundPoint2', 'backgroundPoint3'
        ]);
        updateElementBySelector('#section-3 h2:nth-of-type(2)', 'challenges');
        updateElementsBySelector('#section-3 .mt-6 .list-disc li', [
            'challengesPoint1', 'challengesPoint2', 'challengesPoint3'
        ]);
        updateElementBySelector('#section-3 .text-center.italic.text-gray-600', 'quote');
        updateElementBySelector('#section-3 h3.font-semibold.text-blue-700', 'whyIoT');
        updateElementBySelector('#section-3 .bg-blue-50 p.text-gray-700', 'whyIoTDesc');

        // Section 4: Water Quality Parameters
        updateElementBySelector('#section-4 h1', 'waterQualityTitle');

        // Update all parameter titles and descriptions
        const paramTitles = document.querySelectorAll('#section-4 .bg-blue-50 h2.font-semibold');
        const paramKeys = ['temperature', 'ph', 'do', 'turbidity', 'tds', 'nitrate'];
        paramTitles.forEach((el, index) => {
            if (index < paramKeys.length) {
                el.textContent = pageTranslations[currentLanguage][paramKeys[index]];
            }
        });

        // Update nitrogen cycle info
        updateElementBySelector('#section-4 h3.font-semibold.text-indigo-700', 'nitrogenCycle');
        updateElementBySelector('#section-4 .bg-indigo-50 p.text-gray-700', 'nitrogenCycleDesc');

        // Section 5: Research Methods
        updateElementBySelector('#section-5 h1', 'methodsTitle');
        updateElementBySelector('#section-5 h2.font-semibold.mb-3.text-center', 'methodOverview');

        // Update method steps
        updateElementBySelector('#section-5 .flex.flex-col.md\\:flex-row.justify-around.items-center .text-center:nth-of-type(1) p.font-medium', 'dataAcq', true);
        updateElementBySelector('#section-5 .flex.flex-col.md\\:flex-row.justify-around.items-center .text-center:nth-of-type(2) p.font-medium', 'smote', true);
        updateElementBySelector('#section-5 .flex.flex-col.md\\:flex-row.justify-around.items-center .text-center:nth-of-type(3) p.font-medium', 'mlpnn', true);
        updateElementBySelector('#section-5 .flex.flex-col.md\\:flex-row.justify-around.items-center .text-center:nth-of-type(4) p.font-medium', 'iot', true);

        // Update research method sections
        updateElementBySelector('#section-5 .grid.grid-cols-1.md\\:grid-cols-2 h2:nth-of-type(1)', 'dataAcquisition');
        updateElementBySelector('#section-5 .grid.grid-cols-1.md\\:grid-cols-2 h2:nth-of-type(2)', 'smoteTitle');
        updateElementBySelector('#section-5 .grid.grid-cols-1.md\\:grid-cols-2 h2:nth-of-type(3)', 'mlpnnTitle');
        updateElementBySelector('#section-5 .grid.grid-cols-1.md\\:grid-cols-2 h2:nth-of-type(4)', 'evalTitle');

        // Section 6: IoT System Implementation
        updateElementBySelector('#section-6 h1', 'iotSysTitle');
        updateElementBySelector('#section-6 h2.font-semibold.mb-3.text-center', 'iotArchitecture');
        updateElementBySelector('#section-6 p.text-gray-600.italic.mt-2', 'iotArchDesc');
        updateElementBySelector('#section-6 h2.font-semibold.mb-3:nth-of-type(2)', 'hardwareTitle');
        updateElementBySelector('#section-6 h2.font-semibold.mt-6.mb-3', 'turbSensorTitle');
        updateElementBySelector('#section-6 h2.font-semibold.mb-3:nth-of-type(4)', 'autoControlTitle');

        // Update control functions
        const controlTitles = document.querySelectorAll('#section-6 .bg-indigo-50 h3.font-semibold');
        const controlKeys = ['waterMonitoring', 'tempControl', 'airPumpControl', 'waterReplacement', 'feedingSystem', 'notificationSystem'];
        controlTitles.forEach((el, index) => {
            if (index < controlKeys.length) {
                el.textContent = pageTranslations[currentLanguage][controlKeys[index]];
            }
        });

        const controlDescs = document.querySelectorAll('#section-6 .bg-indigo-50 p.text-gray-700');
        const controlDescKeys = ['waterMonitoringDesc', 'tempControlDesc', 'airPumpControlDesc', 'waterReplacementDesc', 'feedingSystemDesc', 'notificationSystemDesc'];
        controlDescs.forEach((el, index) => {
            if (index < controlDescKeys.length) {
                el.textContent = pageTranslations[currentLanguage][controlDescKeys[index]];
            }
        });

        updateElementBySelector('#section-6 h2.font-semibold.mb-3:nth-of-type(5)', 'softwareArchTitle');

        // Section 7: Results and Discussion
        updateElementBySelector('#section-7 h1', 'resultsTitle');
        updateElementBySelector('#section-7 h2.font-semibold.mb-3:nth-of-type(1)', 'modelEffectiveness');
        updateElementBySelector('#section-7 p.text-sm.text-gray-600.mt-2:nth-of-type(1)', 'modelEffectivenessDesc');
        updateElementBySelector('#section-7 h2.font-semibold.mb-3:nth-of-type(2)', 'systemAccuracy');
        updateElementBySelector('#section-7 p.text-sm.text-gray-600.mt-2:nth-of-type(2)', 'systemAccuracyDesc');
        updateElementBySelector('#section-7 h2.font-semibold.mb-3:nth-of-type(3)', 'keyFindings');
        updateElementBySelector('#section-7 h2.font-semibold.mb-3:nth-of-type(4)', 'systemBenefits');

        // Update system benefits
        const benefitTitles = document.querySelectorAll('#section-7 h3.font-semibold.text-green-700');
        const benefitKeys = ['reducedMortality', 'automatedMaint', 'remoteMonitoring', 'customSettings'];
        benefitTitles.forEach((el, index) => {
            if (index < benefitKeys.length) {
                el.textContent = pageTranslations[currentLanguage][benefitKeys[index]];
            }
        });

        const benefitDescs = document.querySelectorAll('#section-7 .bg-green-50 p.text-gray-700');
        const benefitDescKeys = ['reducedMortalityDesc', 'automatedMaintDesc', 'remoteMonitoringDesc', 'customSettingsDesc'];
        benefitDescs.forEach((el, index) => {
            if (index < benefitDescKeys.length) {
                el.textContent = pageTranslations[currentLanguage][benefitDescKeys[index]];
            }
        });

        // Section 8: Comparison with Previous Research
        updateElementBySelector('#section-8 h1', 'comparisonTitle');
        updateElementBySelector('#section-8 h2.font-semibold.mb-3.text-center', 'systemAdvantages');
        updateElementBySelector('#section-8 h2.font-semibold.mb-3:nth-of-type(2)', 'relatedResearch');
        updateElementBySelector('#section-8 h2.font-semibold.mb-3:nth-of-type(3)', 'innovationAspects');

        // Update innovation aspects
        const innovationTitles = document.querySelectorAll('#section-8 h3.font-semibold.text-indigo-700');
        const innovationKeys = ['hybridApproach', 'customTurbidity', 'integratedArch'];
        innovationTitles.forEach((el, index) => {
            if (index < innovationKeys.length) {
                el.textContent = pageTranslations[currentLanguage][innovationKeys[index]];
            }
        });

        const innovationDescs = document.querySelectorAll('#section-8 .bg-indigo-50 p.text-gray-700');
        const innovationDescKeys = ['hybridApproachDesc', 'customTurbidityDesc', 'integratedArchDesc'];
        innovationDescs.forEach((el, index) => {
            if (index < innovationDescKeys.length) {
                el.textContent = pageTranslations[currentLanguage][innovationDescKeys[index]];
            }
        });

        // Section 9: UI and Application Implementation
        updateElementBySelector('#section-9 h1', 'uiImplementationTitle');
        updateElementBySelector('#section-9 h2.font-semibold.mb-4.text-center', 'mobileInterface');

        // Update mobile interface sections
        const mobileInterfaceTitles = document.querySelectorAll('#section-9 h3.font-semibold.text-indigo-700.mb-2.text-center');
        const mobileInterfaceKeys = ['accountRegistration', 'waterQualityMonitor', 'systemControl', 'notification'];
        mobileInterfaceTitles.forEach((el, index) => {
            if (index < mobileInterfaceKeys.length) {
                el.textContent = pageTranslations[currentLanguage][mobileInterfaceKeys[index]];
            }
        });

        const mobileInterfaceDescs = document.querySelectorAll('#section-9 p.mt-2.text-sm.text-gray-600.text-center');
        const mobileInterfaceDescKeys = ['accountRegistrationDesc', 'waterQualityMonitorDesc', 'systemControlDesc', 'notificationDesc'];
        mobileInterfaceDescs.forEach((el, index) => {
            if (index < mobileInterfaceDescKeys.length) {
                el.textContent = pageTranslations[currentLanguage][mobileInterfaceDescKeys[index]];
            }
        });

        updateElementBySelector('#section-9 h2.font-semibold.mb-3:nth-of-type(2)', 'iotSystemArch');
        updateElementBySelector('#section-9 p.mt-2.text-sm.text-gray-600.text-center:nth-of-type(5)', 'iotSystemArchDesc');

        updateElementBySelector('#section-9 h2.font-semibold.mb-3:nth-of-type(3)', 'hardwareDetails');
        updateElementBySelector('#section-9 p.mt-2.text-sm.text-gray-600.text-center:nth-of-type(6)', 'hardwareDetailsDesc');

        updateElementBySelector('#section-9 h2.font-semibold.mb-4.text-center.text-indigo-700', 'uiuxDevelopment');

        // Update UI/UX development process
        const uiuxTitles = document.querySelectorAll('#section-9 .bg-white h3.font-semibold.text-center.mb-2');
        const uiuxKeys = ['design', 'implementation', 'evaluation'];
        uiuxTitles.forEach((el, index) => {
            if (index < uiuxKeys.length) {
                el.textContent = pageTranslations[currentLanguage][uiuxKeys[index]];
            }
        });

        const uiuxDescs = document.querySelectorAll('#section-9 .bg-white p.text-sm.text-gray-700');
        const uiuxDescKeys = ['designDesc', 'implementationDesc', 'evaluationDesc'];
        uiuxDescs.forEach((el, index) => {
            if (index < uiuxDescKeys.length) {
                el.textContent = pageTranslations[currentLanguage][uiuxDescKeys[index]];
            }
        });

        // Section 10: Conclusion
        updateElementBySelector('#section-10 h1', 'conclusionTitle');
        updateElementBySelector('#section-10 h2.font-semibold.mb-3:nth-of-type(1)', 'summaryContributions');
        updateElementBySelector('#section-10 h2.font-semibold.mb-3:nth-of-type(2)', 'futureWorkTitle');
        updateElementBySelector('#section-10 h2.font-semibold.mb-4.text-center', 'keyTakeaways');

        // Update key takeaways
        const takeawayTitles = document.querySelectorAll('#section-10 h3.font-semibold.text-center');
        const takeawayKeys = ['mlpnnEffectiveness', 'iotIntegration', 'businessImpact'];
        takeawayTitles.forEach((el, index) => {
            if (index < takeawayKeys.length) {
                el.textContent = pageTranslations[currentLanguage][takeawayKeys[index]];
            }
        });

        const takeawayDescs = document.querySelectorAll('#section-10 .bg-white p.text-sm.text-gray-700');
        const takeawayDescKeys = ['mlpnnEffectivenessDesc', 'iotIntegrationDesc', 'businessImpactDesc'];
        takeawayDescs.forEach((el, index) => {
            if (index < takeawayDescKeys.length) {
                el.textContent = pageTranslations[currentLanguage][takeawayDescKeys[index]];
            }
        });

        updateElementBySelector('#section-10 h2.font-semibold.text-indigo-700.mb-2', 'thankYou');
        updateElementBySelector('#section-10 p.text-gray-700', 'presentedByFooter');

        // Update table of contents
        updateTocTitles();
    }

    // Update TOC titles based on current language
    function updateTocTitles() {
        const tocItems = document.querySelectorAll('.toc-item');
        const sectionTitles = [
            'title', 'outlineTitle', 'introTitle', 'waterQualityTitle',
            'methodsTitle', 'iotSysTitle', 'resultsTitle', 'comparisonTitle',
            'uiImplementationTitle', 'conclusionTitle'
        ];

        tocItems.forEach((item, index) => {
            if (index < sectionTitles.length) {
                const titleSpan = item.querySelector('.toc-section-title');
                if (titleSpan && pageTranslations[currentLanguage][sectionTitles[index]]) {
                    titleSpan.textContent = pageTranslations[currentLanguage][sectionTitles[index]];
                }
            }
        });
    }

    // Helper functions for DOM manipulation with translations

    // Update element by CSS selector
    function updateElementBySelector(selector, translationKey, isHTML = false) {
        const element = document.querySelector(selector);
        if (element && pageTranslations[currentLanguage][translationKey]) {
            if (isHTML) {
                element.innerHTML = pageTranslations[currentLanguage][translationKey];
            } else {
                element.textContent = pageTranslations[currentLanguage][translationKey];
            }
        }
    }

    // Update multiple elements by CSS selector
    function updateElementsBySelector(selector, translationKeys) {
        const elements = document.querySelectorAll(selector);
        if (elements.length && elements.length <= translationKeys.length) {
            elements.forEach((el, index) => {
                if (pageTranslations[currentLanguage][translationKeys[index]]) {
                    el.textContent = pageTranslations[currentLanguage][translationKeys[index]];
                }
            });
        }
    }

    // Update elements by tag within a section
    function updateElementsByTag(sectionSelector, tag, translationKeys) {
        const section = document.querySelector(sectionSelector);
        if (section) {
            const elements = section.querySelectorAll(tag);
            if (elements.length && elements.length <= translationKeys.length) {
                elements.forEach((el, index) => {
                    if (pageTranslations[currentLanguage][translationKeys[index]]) {
                        el.textContent = pageTranslations[currentLanguage][translationKeys[index]];
                    }
                });
            }
        }
    }

    // Initialize language based on saved preference or default to English
    function initializeLanguage() {
        // Check if there's a saved language preference
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
            currentLanguage = savedLanguage;
        }

        // Set initial button text
        languageButton.innerHTML = `<i class="fas fa-language mr-2"></i> ${uiTranslations[currentLanguage]['languageToggle']}`;

        // Update UI with the selected language
        updateUILanguage();
    }

    // Initialize functionality
    initializeLanguage();

    // Set up print button
    printButton.addEventListener('click', handlePrinting);

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