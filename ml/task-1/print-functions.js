// Fungsi untuk mengukur dan menyesuaikan ukuran halaman berdasarkan konten tiap section
function handleAdvancedPrinting() {
    // Simpan scroll position asli
    const originalScrollPos = window.scrollY;

    // Ukur semua section terlebih dahulu
    const sections = document.querySelectorAll('.section');
    const sectionMeasurements = [];

    // Ukur setiap section
    sections.forEach((section, index) => {
        // Clone section untuk pengukuran yang akurat
        const clonedSection = section.cloneNode(true);
        clonedSection.style.position = 'absolute';
        clonedSection.style.visibility = 'hidden';
        clonedSection.style.width = '21cm'; // Lebar A4
        clonedSection.style.height = 'auto';
        clonedSection.style.padding = '0.8cm';
        clonedSection.style.overflow = 'visible';
        document.body.appendChild(clonedSection);

        // Ukur tinggi
        const contentHeight = clonedSection.scrollHeight;
        sectionMeasurements.push({
            id: section.id,
            height: contentHeight,
            index: index
        });

        document.body.removeChild(clonedSection);
    });

    // Log tinggi masing-masing section untuk debugging
    console.log("Section heights:", sectionMeasurements);

    // Buat CSS dinamis untuk setiap section
    let cssRules = `
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
            
            /* Styling untuk setiap section secara individual */
    `;

    // Tambahkan CSS untuk setiap section
    sectionMeasurements.forEach(secInfo => {
        // Tambahkan margin untuk keamanan
        const heightInCm = (secInfo.height + 20) / 37.8; // Konversi px ke cm dengan margin
        cssRules += `
            #${secInfo.id} {
                height: ${secInfo.height + 20}px;
                padding: 0.8cm;
            }
            
            #${secInfo.id}:not(#section-1) {
                padding-top: 0.8cm;
            }
            
            @page :nth(${secInfo.index + 1}) {
                size: 21cm ${heightInCm}cm;
            }
        `;
    });

    // Tambahkan styling lainnya
    cssRules += `
            /* Reduce margins in tables and card elements */
            .p-4, .p-5, .p-6 {
                padding: 0.5rem !important;
            }
            
            /* Force backgrounds to print */
            .gradient-bg {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color-adjust: exact;
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
            }
            
            .print-controls, .section-nav {
                display: none !important;
            }
        }
    `;

    // Terapkan style untuk print
    const style = document.createElement('style');
    style.textContent = cssRules;
    document.head.appendChild(style);

    // Trigger print dialog
    setTimeout(() => {
        window.print();

        // Hapus style setelah print
        setTimeout(() => {
            document.head.removeChild(style);
            // Kembalikan scroll position
            window.scrollTo(0, originalScrollPos);
        }, 100);
    }, 500);
}

// Alternatif: Solusi yang lebih sederhana - gunakan ukuran section terpanjang untuk semua halaman
function handleSimplifiedPrinting() {
    // Simpan scroll position asli
    const originalScrollPos = window.scrollY;

    // Ukur semua section
    const sections = document.querySelectorAll('.section');
    let tallestSectionHeight = 0;
    let tallestSection = null;

    // Temukan section terpanjang
    sections.forEach((section) => {
        const clonedSection = section.cloneNode(true);
        clonedSection.style.position = 'absolute';
        clonedSection.style.visibility = 'hidden';
        clonedSection.style.width = '21cm'; // Lebar A4
        clonedSection.style.height = 'auto';
        clonedSection.style.padding = '0.8cm';
        clonedSection.style.overflow = 'visible';
        document.body.appendChild(clonedSection);

        const sectionHeight = clonedSection.scrollHeight;
        if (sectionHeight > tallestSectionHeight) {
            tallestSectionHeight = sectionHeight;
            tallestSection = section;
        }

        document.body.removeChild(clonedSection);
    });

    console.log(`Section terpanjang: ${tallestSection.id}, Tinggi: ${tallestSectionHeight}px`);

    // Tambahkan margin untuk keamanan
    const pageHeight = tallestSectionHeight + 20; // Tambahkan margin 20px

    // Set style untuk print
    const style = document.createElement('style');
    style.textContent = `
        @page {
            size: 21cm ${pageHeight / 37.8}cm; /* Konversi dari px ke cm untuk print */
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
                height: ${pageHeight}px;
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
            
            .print-controls, .section-nav {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Trigger print dialog
    setTimeout(() => {
        window.print();

        // Hapus style after printing
        setTimeout(() => {
            document.head.removeChild(style);
            // Kembalikan scroll position
            window.scrollTo(0, originalScrollPos);
        }, 100);
    }, 300);
}

// Fungsi untuk menambahkan tombol print alternatif
function addPrintingOptions() {
    const printControls = document.querySelector('.print-controls');
    if (!printControls) return;

    // Modifikasi tombol print yang sudah ada
    const originalPrintButton = document.getElementById('print-button');
    if (originalPrintButton) {
        // Hapus event listener lama jika ada
        const newPrintButton = originalPrintButton.cloneNode(true);
        originalPrintButton.parentNode.replaceChild(newPrintButton, originalPrintButton);

        // Tambahkan event listener baru
        newPrintButton.addEventListener('click', handleSimplifiedPrinting);
        newPrintButton.innerHTML = `<i class="fas fa-print mr-2"></i> Export ke PDF (Standard)`;
    }

    // Tambahkan tombol print alternatif
    const advancedPrintButton = document.createElement('button');
    advancedPrintButton.className = 'print-button';
    advancedPrintButton.style.backgroundColor = '#9333ea'; // Ubah warna agar berbeda
    advancedPrintButton.innerHTML = `<i class="fas fa-file-pdf mr-2"></i> Export PDF (Advanced)`;
    advancedPrintButton.addEventListener('click', handleAdvancedPrinting);

    // Tambahkan tombol baru ke dalam print controls
    printControls.appendChild(advancedPrintButton);
}

// Jalankan setup saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function () {
    addPrintingOptions();
});