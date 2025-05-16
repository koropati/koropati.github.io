// Fungsi khusus untuk optimasi slide cover (slide 1)
function optimizeCoverSlide() {
    if (currentSlide === 1 && (
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement)) {
        
        const coverSlide = document.getElementById('slide1');
        const slideContent = coverSlide.querySelector('.slide-content');
        
        // Spesial handling untuk slide cover
        if (slideContent) {
            // Reset styling terlebih dahulu
            slideContent.style.transform = '';
            
            // Cek ukuran konten vs viewport
            const contentHeight = slideContent.scrollHeight;
            const viewportHeight = window.innerHeight;
            
            // Jika konten terlalu besar untuk viewport
            if (contentHeight > viewportHeight) {
                // Kalkulasi skala optimal
                const scale = Math.min(0.9, viewportHeight / contentHeight);
                slideContent.style.transform = `scale(${scale})`;
                slideContent.style.transformOrigin = 'center center';
            }
            
            // Optimasi tampilan elemen
            const title = coverSlide.querySelector('h1');
            const subtitle = coverSlide.querySelector('h3');
            const teamMembers = coverSlide.querySelector('.team-members');
            
            if (title) title.style.fontSize = '2rem';
            if (subtitle) subtitle.style.fontSize = '1.5rem';
            
            if (teamMembers) {
                // Layout dua kolom untuk daftar tim
                teamMembers.querySelectorAll('p').forEach(p => {
                    p.style.margin = '1px 0';
                    p.style.fontSize = '0.8rem';
                });
            }
        }
    }
}function updateFullscreenButtonIcon() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
    } else {
        fullscreenBtn.innerHTML = '<i class="bi bi-fullscreen"></i>';
    }
}// Fungsi untuk fullscreen
function enterFullscreen() {
    const presentation = document.getElementById('presentation');
    
    if (presentation.requestFullscreen) {
        presentation.requestFullscreen();
    } else if (presentation.mozRequestFullScreen) { // Firefox
        presentation.mozRequestFullScreen();
    } else if (presentation.webkitRequestFullscreen) { // Chrome, Safari, Opera
        presentation.webkitRequestFullscreen();
    } else if (presentation.msRequestFullscreen) { // IE/Edge
        presentation.msRequestFullscreen();
    }
    
    // Sembunyikan dulu semua slide, kecuali yang aktif
    document.querySelectorAll('.slide:not(.active)').forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Setelah fullscreen aktif, atur ulang tampilan
    setTimeout(() => {
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.display = 'none';
        });
        document.querySelector('.slide.active').style.display = 'flex';
        
        // Hilangkan scrollbar
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }, 100);
    
    // Ubah ikon tombol
    document.getElementById('fullscreenBtn').innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
    
    // Kembalikan tampilan normal setelah exit fullscreen
    setTimeout(() => {
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.display = '';
            slide.style.transform = '';
        });
        document.querySelector('.slide.active').style.display = 'block';
        
        // Kembalikan overflow
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }, 100);
    
    // Ubah ikon tombol
    document.getElementById('fullscreenBtn').innerHTML = '<i class="bi bi-fullscreen"></i>';
}

// Toggle fullscreen
document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement && 
        !document.mozFullScreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
});

// Handle perubahan state fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    updateFullscreenButtonIcon();
    
    // Sesuaikan tampilan slide saat fullscreen
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
        // Masuk ke mode fullscreen, sesuaikan tampilan
        document.body.classList.add('is-fullscreen');
        
        // Sembunyikan elemen lain yang mengganggu
        document.querySelectorAll('.container-fluid > *:not(#presentation):not(.slide-controls)').forEach(el => {
            el.style.display = 'none';
        });
        
        // Hilangkan scrollbar
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Hilangkan margin dan padding dari slide
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.margin = '0';
            slide.style.padding = '0';
            slide.style.overflow = 'hidden';
        });
        
        // Hanya tampilkan slide yang aktif
        document.querySelectorAll('.slide:not(.active)').forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Pastikan slide aktif ditampilkan sebagai flex
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.display = 'flex';
        }
        
        // Sesuaikan konten untuk fullscreen
        adjustFullscreenContent();
        
    } else {
        // Keluar dari mode fullscreen, kembalikan tampilan
        document.body.classList.remove('is-fullscreen');
        
        // Tampilkan kembali elemen yang disembunyikan
        document.querySelectorAll('.container-fluid > *:not(#presentation)').forEach(el => {
            el.style.display = '';
        });
        
        // Kembalikan scrollbar
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        
        // Reset transform dan tampilan slide
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.margin = '';
            slide.style.padding = '';
            slide.style.overflow = '';
            slide.style.display = '';
        });
        
        // Reset transform konten slide
        document.querySelectorAll('.slide-content').forEach(content => {
            content.style.transform = '';
            content.style.overflow = '';
        });
        
        // Pastikan slide aktif ditampilkan
        document.querySelector('.slide.active').style.display = 'block';
    }
}// Variabel untuk melacak slide saat ini
let currentSlide = 1;
const totalSlides = document.querySelectorAll('.slide').length;

// Inisialisasi slide pertama
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    updateSlideCounter();

    // Tambahkan instruksi navigasi keyboard sebagai tooltip
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    prevBtn.setAttribute('title', 'Previous Slide (Left Arrow)');
    nextBtn.setAttribute('title', 'Next Slide (Right Arrow)');
    fullscreenBtn.setAttribute('title', 'Toggle Fullscreen (Esc to Exit)');
    
    // Tambahkan event listener untuk resize
    window.addEventListener('resize', resizeHandler);
    
    // Deteksi khusus untuk Slide 5 (Penerapan IoT)
    document.getElementById('nextBtn').addEventListener('click', function() {
        if (currentSlide === 4) { // Akan pindah ke slide 5
            setTimeout(() => {
                const slide5 = document.getElementById('slide5');
                if (slide5 && document.fullscreenElement) {
                    // Pastikan konten slide 5 terlihat dengan baik
                    const items = slide5.querySelectorAll('.penerapan-item');
                    items.forEach(item => {
                        item.style.opacity = '1';
                        item.style.visibility = 'visible';
                    });
                }
            }, 100);
        }
    });
    
    // Deteksi khusus saat slide 5 ditampilkan
    if (document.getElementById('slide5')) {
        const penerapanItems = document.querySelectorAll('.penerapan-item');
        penerapanItems.forEach(item => {
            // Pastikan item terlihat
            item.style.opacity = '1';
            item.style.visibility = 'visible';
        });
    }
});

// Fungsi untuk menampilkan slide tertentu
function showSlide(slideNumber) {
    // Perbarui currentSlide global
    currentSlide = slideNumber;
    
    // Sembunyikan semua slide
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
        // Saat fullscreen, pastikan display juga diupdate
        if (document.fullscreenElement) {
            slide.style.display = 'none';
        }
    });
    
    // Tampilkan slide yang dipilih
    const slideToShow = document.getElementById('slide' + slideNumber);
    if (slideToShow) {
        slideToShow.classList.add('active');
        
        // Saat fullscreen, pastikan display diupdate
        if (document.fullscreenElement) {
            slideToShow.style.display = 'flex';
            
            // Panggil adjustFullscreenContent setelah slide diperlihatkan
            setTimeout(() => {
                adjustFullscreenContent();
                
                // Khusus untuk slide cover
                if (slideNumber === 1) {
                    optimizeCoverSlide();
                }
            }, 50);
        }
        
        // Scroll ke slide (untuk tampilan mobile atau non-fullscreen)
        if (!document.fullscreenElement) {
            slideToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Penanganan khusus untuk slide 5 (Penerapan IoT)
        if (slideNumber === 5) {
            // Pastikan konten terlihat dengan baik
            const penerapanItems = slideToShow.querySelectorAll('.penerapan-item');
            if (penerapanItems.length > 0) {
                setTimeout(() => {
                    penerapanItems.forEach(item => {
                        item.style.opacity = '1';
                        item.style.visibility = 'visible';
                        item.style.display = 'flex';
                    });
                }, 50);
            }
        }
    }
    
    // Update slide counter
    updateSlideCounter();
}

// Fungsi untuk memperbarui penghitung slide
function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    counter.textContent = `${currentSlide} / ${totalSlides}`;
}

// Event listener untuk tombol navigasi
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
        updateFullscreenDisplay(); // Tambahan untuk update fullscreen
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
        updateFullscreenDisplay(); // Tambahan untuk update fullscreen
    }
});

// Navigasi keyboard (panah kiri/kanan)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
        updateFullscreenDisplay(); // Tambahan untuk update fullscreen
    } else if (e.key === 'ArrowRight' && currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
        updateFullscreenDisplay(); // Tambahan untuk update fullscreen
    } else if (e.key === 'Escape' && document.fullscreenElement) {
        exitFullscreen();
    }
});

// Fungsi khusus untuk memperbarui tampilan dalam mode fullscreen
function updateFullscreenDisplay() {
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
        
        // Sembunyikan semua slide
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Tampilkan hanya slide yang aktif
        const activeSlide = document.getElementById('slide' + currentSlide);
        if (activeSlide) {
            activeSlide.style.display = 'flex';
            
            // Pastikan transformasi dan scaling tepat
            const slideContent = activeSlide.querySelector('.slide-content');
            if (slideContent) {
                // Reset transform dulu
                slideContent.style.transform = '';
                
                // Periksa apakah perlu scaling
                setTimeout(() => {
                    const contentHeight = slideContent.scrollHeight;
                    const containerHeight = slideContent.clientHeight;
                    
                    if (contentHeight > containerHeight) {
                        const scale = Math.min(0.95, containerHeight / contentHeight);
                        slideContent.style.transform = `scale(${scale})`;
                        slideContent.style.transformOrigin = 'center center';
                    }
                }, 50);
            }
        }
    }
}

// Fungsi untuk mengekspor ke PDF yang sudah diperbaiki
document.getElementById('exportBtn').addEventListener('click', () => {
    // Sembunyikan kontrol slide saat ekspor
    const controls = document.querySelector('.slide-controls');
    controls.style.display = 'none';
    
    // Tampilkan semua slide untuk ekspor
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        // Reset tampilan dan styling
        slide.style.display = 'block';
        slide.style.height = '';
        slide.style.width = '';
        slide.style.margin = '0';
        slide.style.pageBreakAfter = 'always';
        slide.style.position = 'relative';
        slide.style.overflow = 'visible';
        
        // Reset class active
        slide.classList.remove('active');
        
        // Reset transformasi konten
        const slideContent = slide.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.transform = '';
            slideContent.style.height = '';
            slideContent.style.padding = '20px';
            slideContent.style.overflow = 'visible';
        }
    });
    
    // Persiapkan presentasi untuk ekspor
    const presentationElement = document.getElementById('presentation');
    presentationElement.style.display = 'block';
    
    // Siapkan opsi untuk html2pdf
    const options = {
        filename: 'IoT_untuk_Kota_Pintar.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'landscape',
            compress: true,
            precision: 16
        },
        pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy'],
            before: '.slide + .slide',
            avoid: 'img'
        }
    };
    
    // Ekspor ke PDF dengan callback
    html2pdf()
        .set(options)
        .from(presentationElement)
        .save()
        .then(() => {
            // Kembalikan tampilan seperti semula setelah ekspor
            controls.style.display = 'flex';
            
            slides.forEach(slide => {
                slide.style.display = 'none';
                slide.style.pageBreakAfter = '';
                slide.style.margin = '';
            });
            
            // Aktifkan kembali slide yang sedang ditampilkan
            const currentSlideElement = document.getElementById('slide' + currentSlide);
            if (currentSlideElement) {
                currentSlideElement.classList.add('active');
                currentSlideElement.style.display = 'block';
            }
            
            // Tampilkan kembali presentasi dengan benar
            showSlide(currentSlide);
        });
});

// Fungsi yang lebih kuat untuk menyesuaikan konten fullscreen
function adjustFullscreenContent() {
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
        
        // Tambahkan kelas untuk slide yang diketahui bermasalah
        const problematicSlides = [1, 3, 4, 6, 7, 8, 9, 11, 12];
        
        if (problematicSlides.includes(currentSlide)) {
            // Slide yang sering terpotong perlu penanganan khusus
            const activeSlide = document.getElementById('slide' + currentSlide);
            if (activeSlide) {
                const slideContent = activeSlide.querySelector('.slide-content');
                if (slideContent) {
                    // Pendekatan 1: Skala slide jika terlalu besar
                    const contentHeight = slideContent.scrollHeight;
                    const containerHeight = window.innerHeight;
                    
                    if (contentHeight > containerHeight) {
                        const scale = Math.min(0.9, containerHeight / contentHeight);
                        slideContent.style.transform = `scale(${scale})`;
                        slideContent.style.transformOrigin = 'center top';
                    }
                    
                    // Pendekatan 2: Sesuaikan padding dan margin
                    slideContent.style.padding = '20px';
                    
                    // Pendekatan 3: Kurangi ukuran font pada elemen tertentu
                    slideContent.querySelectorAll('p, li').forEach(el => {
                        el.style.fontSize = '0.85rem';
                        el.style.marginBottom = '3px';
                    });
                    
                    slideContent.querySelectorAll('h4, h5').forEach(el => {
                        el.style.fontSize = '1rem';
                        el.style.marginBottom = '5px';
                    });
                    
                    // Khusus untuk slide referensi
                    if (currentSlide === 11) {
                        const references = activeSlide.querySelector('.references');
                        if (references) {
                            references.style.maxHeight = 'calc(100vh - 120px)';
                            references.style.overflowY = 'auto';
                        }
                    }
                    
                    // Khusus untuk slide cover dan thank you dengan daftar anggota kelompok
                    if (currentSlide === 1 || currentSlide === 12) {
                        const teamMembers = activeSlide.querySelector('.team-members, .team-members-thank-you');
                        if (teamMembers) {
                            teamMembers.querySelectorAll('p').forEach(p => {
                                p.style.margin = '2px 0';
                                p.style.fontSize = '0.8rem';
                            });
                        }
                    }
                }
            }
        }
        
        // Perlakukan semua slide lainnya
        document.querySelectorAll('.slide:not(.active)').forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Pastikan slide aktif terlihat
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.display = 'flex';
            activeSlide.style.opacity = '1';
            activeSlide.style.visibility = 'visible';
        }
    }
}

// Fungsi untuk menyesuaikan ukuran presentasi saat resize
function resizeHandler() {
    // Menyesuaikan ukuran slide saat normal view
    const slides = document.querySelectorAll('.slide');
    const aspectRatio = 297 / 210; // A4 landscape aspect ratio (width/height)
    
    slides.forEach(slide => {
        // Jika ukuran layar terlalu kecil, maka gunakan ukuran yang responsif
        if (window.innerWidth < 768) {
            slide.style.width = '100%';
            slide.style.height = 'auto';
            slide.style.minHeight = '100vh';
        } else {
            // Jika ukuran layar cukup besar, pertahankan rasio aspek A4 landscape
            const maxWidth = Math.min(window.innerWidth * 0.8, 297 * 3); // 297mm = A4 landscape width
            slide.style.width = maxWidth + 'px';
            slide.style.height = (maxWidth / aspectRatio) + 'px';
        }
    });
    
    // Jika dalam mode fullscreen, sesuaikan konten
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
        
        adjustFullscreenContent();
    }
}