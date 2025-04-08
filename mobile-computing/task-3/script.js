// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the export button
    const exportBtn = document.getElementById('exportBtn');
    
    // Add click event listener to the export button
    exportBtn.addEventListener('click', exportToPDF);
    
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
                        pdf.save('6G_AI_IoT_Resume_Dewa_Satriawan.pdf');
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
});