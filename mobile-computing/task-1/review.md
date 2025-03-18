# Review Jurnal: Multi-Layer Perceptron Neural Network and Internet of Things for Improving the Realtime Aquatic Ecosystem Quality Monitoring and Analysis

## Informasi Umum
- **Judul**: Multi-Layer Perceptron Neural Network and Internet of Things for Improving the Realtime Aquatic Ecosystem Quality Monitoring and Analysis
- **Penulis**: Sumitra Nuanmeesri, Lap Poomhiran
- **Publikasi**: International Journal of Interactive Mobile Technologies (2022)
- **DOI**: https://doi.org/10.3991/ijim.v16i06.28661

## Ringkasan Jurnal

Penelitian ini mengusulkan sistem terintegrasi untuk meningkatkan pengelolaan lingkungan akuarium pada usaha budidaya ikan hias skala kecil melalui sistem akuarium otomatis. Sistem ini dirancang untuk meramalkan kondisi optimal lingkungan ikan menggunakan Multi-Layer Perceptron Neural Network (MLPNN) yang dikombinasikan dengan perangkat Internet of Things (IoT). Karena keterbatasan data yang dikumpulkan, teknik Synthetic Minority Over-Sampling Technique (SMOTE) digunakan untuk menyeimbangkan dataset dan meningkatkan akurasi prediksi.

Sistem yang dikembangkan berbasis perangkat IoT yang terintegrasi dengan berbagai sensor untuk mengukur indikator kualitas air, termasuk suhu, kekeruhan, total padatan terlarut (TDS), pH, oksigen terlarut (DO), dan ion nitrat. Selain itu, aplikasi mobile dikembangkan untuk memfasilitasi pemantauan dan pengendalian sistem otomatis oleh pengusaha budidaya ikan.

## Metodologi Penelitian

### Pengumpulan Data
1. Data dikumpulkan dari berbagai peternakan ikan hias dengan fokus pada lima jenis ikan tropis favorit di Thailand (Angelfish, Goldfish, Guppy, Platy, dan Sumatran Tiger Barb)
2. Total 1.592 catatan dengan 10 fitur (jenis ikan, pH, DO, TDS, nitrat, suhu, kekeruhan, dll.) dan 1 kelas output (kualitas air)

### Penyeimbangan Data
- Teknik SMOTE digunakan untuk mengatasi ketidakseimbangan dataset
- Parameter k=5 tetangga terdekat dan randomSeed=1
- Dataset ditingkatkan dari 1.592 menjadi 5.469 catatan (400% SMOTE)

### Model MLPNN
- Arsitektur tiga lapisan: input, hidden, dan output
- Parameter: enam lapisan tersembunyi, fungsi aktivasi sigmoid
- 500 epoch dengan batch size=auto dan early stopping=true
- Optimasi Adam dengan learning rate=0.005
- Web API dengan framework Flask untuk deployment model

### Implementasi IoT
- Mikrokontroler ESP32 DevKitC dengan kemampuan Wi-Fi
- Sensor suhu, pH, DO, TDS, ion nitrat, dan sensor kekeruhan kustom
- Kontroler untuk pemanas/pendingin air, pompa udara, penggantian air, dan pemberian pakan
- Sistem notifikasi melalui LINE Notify dan aplikasi mobile

## Hasil dan Temuan Utama

### Efektivitas Model
- Model dengan 400% SMOTE + MLPNN menghasilkan akurasi tertinggi (97,31%)
- Model berhenti pada epoch ke-218 dengan MSE terendah (0,0154)
- Akurasi sistem keseluruhan mencapai 99,89%

### Komponen Sistem
1. **Sistem Pemantauan Kualitas Air**: Pengukuran suhu dan DO setiap 5 menit; pH, TDS, nitrat, dan kekeruhan setiap 30 menit
2. **Sistem Kontrol Suhu**: Kipas pendingin atau pemanas air diaktifkan berdasarkan pembacaan sensor
3. **Kontrol Pompa Udara**: Penyesuaian otomatis untuk meningkatkan kadar DO
4. **Sistem Penggantian Air**: Penggantian otomatis ketika kualitas air buruk
5. **Sistem Pemberian Pakan**: Penjadwalan dan pemantauan kuantitas pakan
6. **Sistem Notifikasi**: Peringatan real-time melalui LINE Notify dan aplikasi mobile

### Manfaat Sistem
- Mengurangi tingkat kematian ikan
- Otomatisasi pemeliharaan akuarium
- Pemantauan jarak jauh melalui aplikasi
- Pengaturan yang dapat disesuaikan untuk berbagai spesies ikan

## Analisis Kritis

### Kekuatan
1. **Pendekatan Komprehensif**: Integrasi yang baik antara kecerdasan buatan (MLPNN) dan teknologi IoT untuk solusi yang menyeluruh
2. **Optimasi Model**: Penggunaan SMOTE untuk mengatasi ketidakseimbangan data meningkatkan akurasi prediksi secara signifikan
3. **Sensor Kustom**: Pengembangan sensor kekeruhan berbasis LED dan LDR dengan persamaan kuadratik menunjukkan inovasi dalam perancangan hardware
4. **Validasi Ekstensif**: Pengujian pada 15 peternakan ikan selama 30 hari memberikan kredibilitas pada hasil penelitian
5. **Arsitektur Modular**: Sistem yang dibangun memiliki komponen modular yang memudahkan pengembangan dan pemeliharaan

### Kelemahan
1. **Cakupan Spesies Terbatas**: Penelitian hanya fokus pada lima jenis ikan hias, membatasi generalisasi untuk spesies lain
2. **Ketergantungan Hardware**: Sistem memerlukan banyak komponen hardware yang mungkin menambah kompleksitas dan biaya
3. **Pertimbangan Skala**: Penelitian terutama ditujukan untuk operasi skala kecil, mungkin memerlukan penyesuaian untuk implementasi skala besar
4. **Faktor Eksternal**: Beberapa faktor eksternal (cuaca, koneksi internet) dapat mempengaruhi akurasi sistem
5. **Perbandingan Terbatas**: Kurangnya perbandingan menyeluruh dengan sistem pemantauan akuarium komersial yang sudah ada

## Kontribusi Ilmiah

Penelitian ini memberikan kontribusi signifikan dalam beberapa aspek:

1. **Integrasi AI-IoT**: Mendemonstrasikan bagaimana jaringan saraf dapat diintegrasikan dengan IoT untuk meningkatkan sistem pemantauan lingkungan akuatik
2. **Peningkatan Data**: Mengaplikasikan teknik SMOTE untuk meningkatkan kualitas dataset terbatas dalam konteks akuakultur
3. **Pengembangan Sensor**: Menciptakan sistem sensor kekeruhan kustom dengan persamaan kuadratik yang dapat diadaptasi untuk aplikasi serupa
4. **Arsitektur End-to-End**: Merancang sistem lengkap dari sensor hingga aplikasi mobile yang dapat diterapkan pada usaha kecil
5. **Validasi Praktis**: Memberikan bukti empiris kinerja sistem dalam lingkungan nyata selama periode pengujian yang signifikan

## Arah Penelitian Masa Depan

Berdasarkan penelitian ini, beberapa arah potensial untuk pengembangan lebih lanjut adalah:

1. Memperluas cakupan untuk mencakup lebih banyak spesies ikan hias
2. Menskalakan sistem dari operasi budidaya ikan kecil ke besar
3. Meningkatkan jaringan komunikasi untuk mengurangi ketergantungan hardware
4. Mengembangkan model pembelajaran adaptif dengan parameter tambahan
5. Mempertimbangkan faktor-faktor seperti jumlah ikan, ukuran tangki, dan jumlah pakan dalam model
6. Menyimpan data sensor di cloud untuk berbagi antar pembudidaya ikan

## Kesimpulan

Jurnal "Multi-Layer Perceptron Neural Network and Internet of Things for Improving the Realtime Aquatic Ecosystem Quality Monitoring and Analysis" menyajikan solusi inovatif dan komprehensif untuk pemantauan dan pengendalian lingkungan akuarium. Pendekatan yang menggabungkan MLPNN, SMOTE, dan teknologi IoT menunjukkan potensi besar dalam meningkatkan efisiensi budidaya ikan hias dan mengurangi tingkat kematian ikan.

Meskipun ada beberapa keterbatasan dalam hal skala dan cakupan, penelitian ini memberikan landasan yang kuat untuk pengembangan sistem pemantauan akuatik otomatis di masa depan. Dengan akurasi tinggi (97,31%) dan implementasi praktis yang berhasil, sistem ini menawarkan solusi yang layak bagi pengusaha budidaya ikan hias skala kecil, terutama dalam konteks keterbatasan tenaga kerja seperti selama pandemi COVID-19.

Secara keseluruhan, penelitian ini tidak hanya berkontribusi pada pengetahuan teoritis tentang aplikasi AI dan IoT dalam akuakultur, tetapi juga menyediakan solusi praktis yang dapat langsung diimplementasikan oleh industri terkait.