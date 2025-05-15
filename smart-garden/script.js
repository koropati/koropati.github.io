// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const startBtn = document.getElementById('startBtn');
    const mobileStartBtn = document.getElementById('mobileStartBtn');
    const landingPage = document.getElementById('landing-page');
    const presentationContainer = document.getElementById('presentation-container');
    const exportBtn = document.getElementById('exportBtn');
    
    // Start presentation buttons
    if (startBtn) {
        startBtn.addEventListener('click', startPresentation);
    }
    
    if (mobileStartBtn) {
        mobileStartBtn.addEventListener('click', startPresentation);
    }
    
    // Function to start the presentation
    function startPresentation() {
        // Animate landing page out
        landingPage.style.opacity = '0';
        landingPage.style.transition = 'opacity 0.5s ease-out';
        
        // After animation, hide landing page and show presentation
        setTimeout(() => {
            landingPage.style.display = 'none';
            presentationContainer.style.display = 'block';
            
            // Animate presentation in
            presentationContainer.style.opacity = '0';
            presentationContainer.style.transform = 'translateY(20px)';
            presentationContainer.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            
            setTimeout(() => {
                presentationContainer.style.opacity = '1';
                presentationContainer.style.transform = 'translateY(0)';
            }, 50);
        }, 500);
    }
    
    // Add click event listener to the export button
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToPDF);
    }
    
    // Function to create a progress indicator
    function createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressContent = document.createElement('div');
        progressContent.className = 'progress-content';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        const message = document.createElement('p');
        message.id = 'progress-message';
        message.textContent = 'Generating PDF... Please wait.';
        
        const progressStatus = document.createElement('p');
        progressStatus.className = 'text-sm text-gray-500 mt-2';
        progressStatus.id = 'progress-status';
        progressStatus.textContent = 'Preparing slides...';
        
        progressContent.appendChild(spinner);
        progressContent.appendChild(message);
        progressContent.appendChild(progressStatus);
        progressContainer.appendChild(progressContent);
        
        document.body.appendChild(progressContainer);
        
        // Add method to update progress
        progressContainer.updateProgress = function(status) {
            document.getElementById('progress-status').textContent = status;
        };
        
        return progressContainer;
    }
    
    // Function to export content to PDF with dynamic page sizes
    function exportToPDF() {
        // Create progress indicator
        const progressIndicator = createProgressIndicator();
        
        // Get all slides to export
        const slides = document.querySelectorAll('.slide');
        const headerSection = document.querySelector('.bg-white:not(.slide)');
        const footerSection = document.querySelector('.bg-white:last-child:not(.slide)');
        const allSections = [headerSection, ...Array.from(slides), footerSection].filter(Boolean);
        
        // Use setTimeout to allow the progress indicator to render
        setTimeout(async () => {
            try {
                // Import jsPDF
                const { jsPDF } = window.jspdf;
                
                progressIndicator.updateProgress('Creating PDF document...');
                
                // Create a new PDF (just as a starting point, we'll add custom pages)
                let pdf = new jsPDF({
                    unit: 'mm'
                });
                
                // Delete the initial blank page
                pdf.deletePage(1);
                
                // Process each section
                for (let i = 0; i < allSections.length; i++) {
                    const section = allSections[i];
                    progressIndicator.updateProgress(`Processing section ${i+1} of ${allSections.length}...`);
                    
                    try {
                        // Get the computed dimensions of the section
                        const rect = section.getBoundingClientRect();
                        
                        // Create a new canvas with the exact dimensions
                        const canvas = document.createElement('canvas');
                        const scale = 2; // Higher resolution
                        canvas.width = rect.width * scale;
                        canvas.height = rect.height * scale;
                        const ctx = canvas.getContext('2d');
                        
                        // Apply white background
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
                        // Use html2canvas to capture the section
                        const canvasResult = await html2canvas(section, {
                            scale: scale,
                            useCORS: true,
                            allowTaint: true,
                            backgroundColor: '#FFFFFF',
                            canvas: canvas,
                            logging: false
                        });
                        
                        // Get image data
                        let imgData;
                        try {
                            imgData = canvasResult.toDataURL('image/jpeg', 0.95);
                        } catch (e) {
                            console.warn('Failed to get image data, trying lower quality JPEG', e);
                            imgData = canvasResult.toDataURL('image/jpeg', 0.85);
                        }
                        
                        // Convert pixels to mm (approximate conversion)
                        const pxToMm = 25.4 / 96; // 96 DPI to mm
                        
                        // Calculate dimensions in mm
                        const margin = 10; // mm
                        const contentWidthMm = rect.width * pxToMm;
                        const contentHeightMm = rect.height * pxToMm;
                        
                        // Add margins to the page size
                        const pageWidthMm = contentWidthMm + (2 * margin);
                        const pageHeightMm = contentHeightMm + (2 * margin);
                        
                        // Determine page orientation based on content aspect ratio
                        const isLandscape = contentWidthMm > contentHeightMm;
                        
                        if (i === 0) {
                            // For the first page, we create a new PDF with custom dimensions
                            pdf = new jsPDF({
                                orientation: isLandscape ? 'landscape' : 'portrait',
                                unit: 'mm',
                                format: [pageWidthMm, pageHeightMm]
                            });
                        } else {
                            // For subsequent pages, add a page with custom dimensions
                            pdf.addPage([pageWidthMm, pageHeightMm], isLandscape ? 'landscape' : 'portrait');
                        }
                        
                        // Add the image to the PDF (centered with margins)
                        pdf.addImage(
                            imgData, 
                            'JPEG', 
                            margin, 
                            margin, 
                            contentWidthMm, 
                            contentHeightMm
                        );
                        
                    } catch (err) {
                        console.error(`Error processing section ${i+1}:`, err);
                        progressIndicator.updateProgress(`Error processing section ${i+1}: ${err.message}`);
                    }
                }
                
                // Save the PDF
                progressIndicator.updateProgress('Finalizing PDF...');
                setTimeout(() => {
                    try {
                        pdf.save('IoT_Smart_Garden_Presentation.pdf');
                        progressIndicator.remove();
                    } catch (saveErr) {
                        console.error('Error saving PDF:', saveErr);
                        alert('Error saving PDF: ' + saveErr.message);
                        progressIndicator.remove();
                    }
                }, 500);
                
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF: ' + error.message);
                progressIndicator.remove();
            }
        }, 100);
    }
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animated particles
    function createParticles() {
        // Get existing particles
        const existingParticles = document.querySelectorAll('.particle');
        
        // Create additional particles if there are fewer than 20
        if (existingParticles.length < 20) {
            const particlesContainer = document.querySelector('.particle').parentNode;
            
            for (let i = existingParticles.length; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random position
                const randomTop = Math.floor(Math.random() * 100);
                const randomLeft = Math.floor(Math.random() * 100);
                
                // Random size
                const randomSize = Math.floor(Math.random() * 10) + 5;
                
                // Random animation delay
                const randomDelay = Math.random() * 5;
                
                // Random animation duration
                const randomDuration = Math.floor(Math.random() * 10) + 8;
                
                // Apply styles
                particle.style.top = `${randomTop}%`;
                particle.style.left = `${randomLeft}%`;
                particle.style.width = `${randomSize}px`;
                particle.style.height = `${randomSize}px`;
                particle.style.animationDelay = `${randomDelay}s`;
                particle.style.animationDuration = `${randomDuration}s`;
                
                particlesContainer.appendChild(particle);
            }
        }
    }
    
    // Call createParticles if landing page is visible
    if (landingPage.style.display !== 'none') {
        createParticles();
    }
});