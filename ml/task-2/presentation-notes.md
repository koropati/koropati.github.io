# Catatan Presentasi: Computational Vision for Tomato Classification Using a Decision Tree Algorithm

## Section 1: Cover Page

Selamat datang pada presentasi saya tentang "Computational Vision for Tomato Classification Using a Decision Tree Algorithm." Presentasi ini merupakan kajian dari paper penelitian yang ditulis oleh Caroline S. da Fonseca, Bilton G. Nhantumbo, Yuri M. Ferreira, Layana A. da Silva, dan Anderson G. Costa, yang dipublikasikan dalam jurnal Engenharia Agrícola pada tahun 2025.

Penelitian ini berfokus pada aplikasi metode berbasis Decision Tree untuk klasifikasi tomat berdasarkan karakteristik kolorimetrik yang memengaruhi potensi pembelian oleh konsumen. Studi ini menunjukkan bagaimana computer vision dapat diterapkan dalam industri pertanian untuk meningkatkan efisiensi dan konsistensi dalam kontrol kualitas.

## Section 2: Outline

Presentasi ini akan mencakup beberapa topik utama:

1. Dimulai dengan pendahuluan yang membahas latar belakang dan pentingnya inspeksi kualitas tomat.
2. Kemudian kita akan membahas karakterisasi tomat, mencakup klasifikasi dan konversi model warna.
3. Detail dataset akan dijelaskan untuk memberikan pemahaman tentang data yang digunakan.
4. Proses akuisisi dan preprocessing data akan dibahas secara mendetail.
5. Metodologi penelitian yang menjelaskan analisis statistik dan PCA.
6. Implementasi dan struktur model Decision Tree akan dijelaskan secara menyeluruh.
7. Hasil dan analisis kinerja model akan dipresentasikan.
8. Akan ada perbandingan dengan pendekatan Machine Learning lain.
9. Terakhir, kita akan membahas kesimpulan dan aplikasi potensial dari penelitian ini.

## Section 3: Introduction

Inspeksi kualitas merupakan tahap krusial dalam produksi dan pemasaran tomat. Konsumen sangat memperhatikan atribut fisik seperti bentuk dan warna saat memilih tomat. Namun, proses inspeksi manual menghadapi beberapa tantangan:

- Rentan terhadap kesalahan manusia
- Inkonsistensi dalam standardisasi
- Klasifikasi yang tidak tepat dan penundaan pemrosesan
- Evaluasi subjektif akibat kelelahan

Penyortiran yang tidak tepat berdasarkan tingkat kematangan dapat menyebabkan:
- Pematangan yang dipercepat karena pelepasan etilen
- Pengurangan umur simpan
- Peningkatan kerentanan terhadap penyakit
- Kerugian ekonomi di seluruh rantai produksi

Penelitian ini bertujuan untuk mengklasifikasikan tomat berdasarkan karakteristik kolorimetrik menggunakan algoritma decision tree, dengan tujuan menyediakan solusi otomatis untuk klasifikasi tomat yang dapat meningkatkan kontrol kualitas dan mengurangi kerugian di industri pertanian.

Computer vision menawarkan banyak keuntungan seperti:
- Evaluasi buah yang cepat dan konsisten
- Eliminasi subjektivitas manusia
- Kemampuan memproses volume produk yang besar
- Integrasi dengan lini produksi yang ada
- Pengukuran kuantitatif parameter kualitas

## Section 4: Tomato Characterization

Dalam penelitian ini, tomat diklasifikasikan menjadi dua kategori berdasarkan potensi pembelian konsumen:

1. **Major Purchasing Potential (MPP)**: 20 buah dengan warna merah matang (>90% warna merah)
2. **Low Purchasing Potential (LPP)**: 40 buah dengan warna belum matang (hijau) atau perantara (campuran hijau dan merah)

Klasifikasi ini sejalan dengan standar CEAGESP (2003), dan buah-buah bersumber dari kultivar Italiano (Solanum lycopersicum L.) yang ditanam di rumah kaca.

Setup akuisisi gambar meliputi:
- Kamera digital (Canon Powershot G9 X RGB) dipasang 0,24m di atas meja
- Dua lampu halogen 100W ditempatkan pada ketinggian 0,84m
- Latar belakang putih untuk meminimalkan efek bayangan
- Gambar diproses menggunakan software ImageJ untuk ekstraksi nilai RGB
- Lingkungan terkontrol untuk menjamin pencahayaan dan kualitas gambar yang konsisten

Nilai RGB dikonversi ke model warna tambahan:
- Model RGB: nilai intensitas Red, Green, Blue
- Model HSI: Hue (H) mewakili warna (0° hingga 360°)
- Model CIELab:
  - Luminance (L): kecerahan (0 hingga 100)
  - Chromaticity a: hijau (-128) hingga merah (+128)
  - Chromaticity b: biru (-128) hingga kuning (+128)

Faktor preferensi konsumen sangat penting: warna tomat yang merah dan seragam menjadi faktor penentu penerimaan konsumen, yang menjadi dasar klasifikasi MPP dan LPP.

## Section 5: Dataset Details

Dataset penelitian memiliki karakteristik sebagai berikut:

- **Total buah**: 60 tomat (kultivar Italiano)
- **Distribusi kelas**:
  - Major Purchasing Potential (MPP): 20 buah (33,3%)
  - Low Purchasing Potential (LPP): 40 buah (66,7%)
- **Fitur yang diekstraksi per buah**: 7 karakteristik kolorimetrik
- **Jenis fitur**: Semua variabel kontinyu
- **Kondisi pertumbuhan**: Kultivasi rumah kaca
- **Waktu panen**: 85 hari setelah penanaman
- **Sumber geografis**: Wilayah Tengah-Selatan Rio de Janeiro, Brasil (22°25'10" S latitude, 43°25'21" W longitude; ketinggian rata-rata: 610 m)

Karakteristik fitur mencakup:
- Red (R): Rentang 80.0-160.0, rata-rata 121.0, CV 19.0%
- Green (G): Rentang 12.0-104.0, rata-rata 53.5, CV 55.1%
- Blue (B): Rentang 5.0-24.0, rata-rata 11.9, CV 50.0%
- Hue (H): Rentang 2.0-61.0, rata-rata 27.7, CV 76.8%
- Luminance (L): Rentang 29.3-45.0, rata-rata 34.9, CV 9.5%
- Chromaticity a: Rentang -2.9-47.5, rata-rata 24.0, CV 77.3%
- Chromaticity b: Rentang 31.2-53.0, rata-rata 42.4, CV 13.9%

Semua fitur mengikuti distribusi normal (uji Shapiro-Wilk, p<0.05).

## Section 6: Data Acquisition & Preprocessing

Proses akuisisi gambar dilakukan dengan langkah-langkah berikut:
1. **Persiapan sampel**: Tomat dibersihkan dan diposisikan secara individual pada meja pengukuran
2. **Pengambilan gambar**: Kamera digital Canon Powershot G9 X RGB diposisikan 0,24m di atas meja
3. **Kontrol pencahayaan**: Dua lampu halogen 100W pada ketinggian 0,84m memberikan pencahayaan konsisten
4. **Persiapan latar belakang**: Latar belakang putih untuk meminimalkan efek bayangan
5. **Penyimpanan digital gambar**: Gambar disimpan dalam format JPG resolusi tinggi
6. **Kontrol kualitas**: Inspeksi visual setiap gambar untuk memastikan tidak ada refleksi, bayangan, atau artefak

Pemrosesan gambar dan ekstraksi fitur meliputi:
1. **Software**: ImageJ open-source digunakan untuk semua pemrosesan gambar
2. **Seleksi region of interest**: Area buah diisolasi dari latar belakang
3. **Ekstraksi RGB**: Nilai RGB rata-rata dihitung dari semua piksel di region buah
4. **Konversi ruang warna**: Nilai RGB ditransformasikan secara matematis ke:
   - Model HSI menggunakan transformasi rotasi (Pedrini & Schwartz, 2008)
   - Model CIELab menggunakan persamaan ruang warna terstandarisasi
5. **Organisasi data**: Semua fitur yang diekstraksi dikompilasi ke dalam dataset terstruktur
6. **Jaminan kualitas**: Analisis statistik dilakukan untuk memeriksa integritas data

Untuk persiapan machine learning, dilakukan:
- **Seleksi fitur**: Pengujian signifikansi statistik, PCA, evaluasi multikolinearitas, dan indeks impuritas Gini
- **Pembagian data**:
  - Set training (75%): 45 buah (15 MPP, 30 LPP)
  - Set testing (25%): 15 buah (5 MPP, 10 LPP)
- **Standardisasi fitur**: Tidak diperlukan untuk model Decision Tree, ini merupakan keuntungan metode berbasis tree

## Section 7: Methodology

Analisis statistik karakteristik kolorimetrik menunjukkan:

- Nilai Red (R): 147.2 (MPP) vs 107.83 (LPP), perbedaan signifikan
- Nilai Green (G): 18.45 (MPP) vs 71.03 (LPP), perbedaan signifikan
- Nilai Blue (B): 8.40 (MPP) vs 13.63 (LPP), perbedaan signifikan
- Nilai Hue (H): 3.75 (MPP) vs 39.68 (LPP), perbedaan signifikan
- Nilai Luminance (L): 34.03 (MPP) vs 35.28 (LPP), perbedaan tidak signifikan
- Nilai Chromaticity a: 45.16 (MPP) vs 13.40 (LPP), perbedaan signifikan
- Nilai Chromaticity b: 49.02 (MPP) vs 39.15 (LPP), perbedaan signifikan

Principal Component Analysis (PCA) menunjukkan:
- PC1 (79.43% varians): Terutama membedakan tomat matang dari belum matang
- Fitur yang memengaruhi kelas MPP: R (intensitas merah), a (kromatisitas merah), b (kromatisitas kuning)
- Fitur yang memengaruhi kelas LPP: H (hue) dan G (intensitas hijau)
- PC2 (17.73% varians): Memengaruhi variasi dalam kelas kematangan perantara
- Pemisahan yang jelas antara kelas ditunjukkan dalam bidang dua dimensi

Pengembangan Decision Tree:
- **Algoritma**: Part (Recursive Partitioning and Regression Trees) mengimplementasikan teknik CART
- **Kriteria pemisahan**: Indeks Gini untuk memaksimalkan homogenitas kelas
- **Pruning**: Diterapkan untuk mengoptimalkan parameter kompleksitas (cp) dan menghasilkan model paling akurat
- **Pembagian data**:
  - Set training: 75% (15 buah MPP dan 30 buah LPP)
  - Set testing: 25% (5 buah MPP dan 10 buah LPP)
- **Metrik performa**: Akurasi, presisi, recall, dan F1-score

Nilai parameter kompleksitas (cp) optimal 0,019 berkorespondensi dengan pohon dengan empat node, mewakili struktur terbaik dengan menyeimbangkan kesederhanaan dan akurasi.

## Section 8: Decision Tree Model Implementation

Implementasi algoritma menggunakan:
- Lingkungan pemrograman: Software R (versi 4.3.2)
- Algoritma: Part (Recursive Partitioning and Regression Trees)
- Teknik implementasi: CART (Classification and Regression Trees)
- Kriteria split: Pengukuran impuritas indeks Gini
- Package R yang digunakan: `rpart`, `caret`, `e1071`

Optimasi hyperparameter fokus pada parameter kompleksitas (cp):
- cp mencegah overfitting dengan mengontrol pertumbuhan pohon
- cp lebih kecil menciptakan pohon lebih besar, cp lebih besar menciptakan pohon lebih kecil
- Nilai cp optimal 0,019 menghasilkan error validasi silang terendah dengan struktur pohon sederhana (4 node)

Parameter training lainnya:
- minsplit: 2 (jumlah minimum observasi dalam node agar dipisah)
- minbucket: 1 (jumlah minimum observasi dalam node terminal)
- maxdepth: 30 (kedalaman maksimum node dalam pohon)
- usesurrogate: 2 (gunakan split surrogate untuk menangani data yang hilang)

Set aturan Decision Tree:
```
IF (G < 71) THEN
  IF (R < 86) THEN
    PREDICTION = "LPP"
  ELSE
    IF (B < 19) THEN
      PREDICTION = "MPP"
    ELSE
      PREDICTION = "LPP"
    END IF
  END IF
ELSE
  PREDICTION = "LPP"
END IF
```

Interpretasi aturan:
- Titik keputusan pertama (node root) bergantung pada intensitas hijau (G)
- Intensitas hijau < 71 mengindikasikan buah yang potensial matang (perlu pengecekan lebih lanjut)
- Intensitas hijau ≥ 71 langsung mengklasifikasikan buah sebagai LPP (belum matang)
- Untuk buah dengan potensi matang, intensitas merah (R) menjadi faktor keputusan kedua
- Jika intensitas merah < 86, buah diklasifikasikan sebagai LPP (kemerahan tidak mencukupi)
- Untuk buah dengan intensitas merah yang memadai, intensitas biru (B) memberikan klasifikasi final
- Intensitas biru < 19 mengindikasikan MPP (tomat matang penuh)

Signifikansi biologis:
- Intensitas hijau (G) mewakili konsentrasi klorofil dalam kulit buah
- Intensitas merah (R) berkorespondensi dengan akumulasi pigmen likopen selama pematangan
- Intensitas biru (B) berkaitan dengan berbagai pigmen minor dan struktur jaringan
- Jalur keputusan mencerminkan proses pematangan biologis

## Section 9: Decision Tree Model

Struktur Decision Tree:
- **Node pertama**: G < 71 (intensitas hijau)
  - Jika G > 71, klasifikasikan sebagai LPP (33% buah)
  - Jika G < 71, lanjutkan ke node berikutnya
- **Node kedua**: R < 86 (intensitas merah)
  - Jika R < 86, klasifikasikan sebagai LPP (7% buah)
  - Jika R > 86, lanjutkan ke node berikutnya
- **Node ketiga**: B < 19 (intensitas biru)
  - Jika B < 19, klasifikasikan sebagai MPP (2% buah)
  - Jika B > 19, klasifikasikan sebagai LPP (27% buah)
- 67% buah dalam set training langsung diklasifikasikan sebagai MPP

Proses pruning pohon:
- Parameter kompleksitas (cp) mengevaluasi overfitting dan membatasi pertumbuhan pohon
- Nilai cp optimal: 0,019
- Nilai ini berkorespondensi dengan pohon dengan 4 node
- Mewakili keseimbangan terbaik antara kesederhanaan dan akurasi
- Mencegah overfitting sambil mempertahankan kekuatan klasifikasi

Pentingnya fitur:
- Indeks Gini mengidentifikasi fitur-fitur berikut sebagai yang paling penting:
  1. Green (G): Diskriminator utama pada node pertama
  2. Red (R): Diskriminator sekunder pada node kedua
  3. Blue (B): Diskriminator final pada node ketiga

Menariknya, meskipun Hue (H) dan kromatisitas (a, b) memiliki signifikansi statistik, model memilih komponen RGB sebagai prediktor paling efektif, mungkin karena korelasi langsung dengan penampilan visual tomat.

## Section 10: Model Evaluation & Performance Analysis

Metrik performa:
- **Akurasi**: 86.7% (proporsi prediksi benar di antara semua prediksi)
- **Presisi**: 83.3% (proporsi prediksi positif yang benar)
- **Recall (Sensitivitas)**: 100.0% (proporsi positif aktual yang diidentifikasi dengan benar)
- **F1-Score**: 90.9% (rata-rata harmonik presisi dan recall)

Analisis confusion matrix:
- True Positives (TP): 3 tomat MPP dengan benar diklasifikasikan sebagai MPP
- True Negatives (TN): 10 tomat LPP dengan benar diklasifikasikan sebagai LPP
- False Positives (FP): 0 tomat LPP yang salah diklasifikasikan sebagai MPP
- False Negatives (FN): 2 tomat MPP yang salah diklasifikasikan sebagai LPP
- Analisis error: Model cenderung error dengan mengklasifikasikan beberapa tomat matang sebagai belum matang
- Implikasi praktis: Bias konservatif ini lebih disukai untuk keamanan pangan dan kontrol kualitas

Analisis kurva ROC:
- Area Under Curve (AUC): 0.938
- Interpretasi: Kekuatan diskriminatif yang sangat baik (AUC > 0.9)
- Threshold optimal: Berkorespondensi dengan split optimal indeks Gini
- Analisis trade-off: Sensitivitas tinggi diprioritaskan daripada spesifisitas untuk aplikasi ini

Robustness model:
- Stabilitas validasi silang K-fold: Standar deviasi akurasi 3.5%
- Sensitivitas noise: Model mempertahankan akurasi >80% dengan penambahan noise sintetis hingga 10%
- Perturbasi fitur: Paling sensitif terhadap perubahan dalam nilai komponen green (G)
- Kecukupan sampel: Analisis learning curve mengindikasikan ukuran sampel training yang memadai

Analisis fitur:
- Intensitas hijau (G) muncul sebagai fitur terpenting (48.3%)
- Intensitas merah (R) memberikan kontribusi signifikan (31.7%)
- Intensitas biru (B) memberikan penyempurnaan dalam klasifikasi (12.5%)
- Hue (H) digunakan dalam konteks tertentu (4.8%)
- Fitur lain memberikan kontribusi lebih kecil

## Section 11: Results & Analysis

Confusion Matrix menunjukkan:
- Kelas LPP: 10 dari 10 buah dengan benar diklasifikasikan (100%)
- Kelas MPP: 3 dari 5 buah dengan benar diklasifikasikan (60%)
- 2 buah MPP salah diklasifikasikan sebagai LPP
- Akurasi keseluruhan 86.7%

Model menunjukkan performa sangat baik dalam mengidentifikasi tomat LPP, dengan pengenalan sempurna. Untuk tomat MPP, performa baik namun menunjukkan ruang untuk perbaikan. Akurasi lebih tinggi untuk LPP bermanfaat dari perspektif keamanan pangan, karena memastikan tomat belum matang atau sebagian matang tidak keliru dipasarkan sebagai matang penuh.

Interpretasi hasil:
- **Akurasi (86.7%)**: Ketepatan klasifikasi keseluruhan yang tinggi
- **Presisi (83.3%)**: Keandalan prediksi positif yang baik
- **Recall (100%)**: Identifikasi sempurna semua sampel LPP
- **F1-Score (90.9%)**: Keseimbangan sangat baik antara presisi dan recall
- F1-score tinggi mengindikasikan model secara efektif menyeimbangkan false positive dan false negative, menjadikannya cocok untuk aplikasi praktis dalam kontrol kualitas

Perbandingan dengan aplikasi lain:
- Klasifikasi penyakit papaya (Habib et al., 2020): >75%
- Klasifikasi buah kurma (Özaltın, 2024)
- Klasifikasi kismis (Raihen & Akter, 2024)

Performa yang dicapai dalam studi ini (akurasi 86.7%, F1-score 90.9%) dibandingkan secara menguntungkan dengan aplikasi pertanian serupa, menunjukkan efektivitas pendekatan ini untuk klasifikasi buah.

## Section 12: Comparison with Other ML Approaches

Decision Tree dibandingkan dengan metode Machine Learning lain:
- **Interpretabilitas**: Decision Tree memiliki interpretabilitas tinggi dengan aturan keputusan transparan, SVM dan Neural Network lebih sulit diinterpretasi (black box)
- **Penskalaan fitur**: Tidak diperlukan untuk Decision Tree, diperlukan untuk SVM dan Neural Network
- **Persyaratan ukuran sampel**: Decision Tree bekerja baik dengan dataset kecil, Neural Network lebih membutuhkan data banyak
- **Hubungan non-linear**: Decision Tree menangani non-linearitas secara alami, SVM memerlukan fungsi kernel, Neural Network memerlukan arsitektur mendalam
- **Kecepatan training**: Decision Tree cepat, Neural Network lambat
- **Kecepatan prediksi**: Semua metode relatif cepat
- **Tuning hyperparameter**: Decision Tree lebih sederhana (sedikit parameter), Neural Network sangat kompleks
- **Penanganan missing values**: Decision Tree memiliki dukungan built-in, metode lain memerlukan preprocessing
- **Kompleksitas implementasi**: Decision Tree rendah, Neural Network tinggi

Mengapa Decision Tree untuk aplikasi ini:
- **Kompatibilitas dataset kecil**: Dengan hanya 60 sampel buah, decision tree menghindari masalah overfitting yang umum pada model lebih kompleks
- **Interpretabilitas untuk ahli domain**: Insinyur pertanian dan ilmuwan pangan dapat memahami dan mempercayai aturan klasifikasi
- **Implementasi dalam sistem real-time**: Pemrosesan cepat cocok untuk lini sortir otomatis
- **Batas keputusan non-linear**: Dapat menangkap hubungan kompleks antara fitur warna dan kematangan
- **Feedback pentingnya fitur**: Memberikan wawasan tentang karakteristik kolorimetrik mana yang paling relevan

Aplikasi serupa dalam penelitian:
- Deteksi penyakit papaya (Habib et al., 2020)
- Klasifikasi buah kurma (Özaltın, 2024)
- Klasifikasi kismis (Raihen & Akter, 2024)
- Deteksi kontaminasi buah (Sattar et al., 2024)

Evolusi metode berbasis Tree:
- **Model Tree Awal**: ID3 (1986), C4.5 (1993), CART (1984)
- **Metode Ensemble**: Random Forests (2001), Gradient Boosting (1999), XGBoost (2016)
- **Pengembangan Terbaru**: Explainable AI (XAI), Reinforcement Learning Trees, Fuzzy Decision Trees, Neural-backed Decision Trees

## Section 13: Conclusion & Applications

Temuan utama:
- Semua karakteristik kolorimetrik kecuali luminance (L) secara signifikan membedakan antara kelas MPP dan LPP
- Komponen green (G) menunjukkan perbedaan signifikan terbesar antara kelas dalam model RGB
- Chromaticity a (mengukur variasi merah-hijau) adalah karakteristik paling reliabel dalam model CIELab
- Principal component analysis secara efektif memisahkan kelas tomat pada bidang dua dimensi
- Algoritma decision tree mencapai performa klasifikasi sangat baik dengan akurasi tinggi (86.7%) dan F1-score (90.9%)
- Parameter model warna RGB (R, G, B) dipilih sebagai prediktor paling efektif oleh indeks Gini
- Struktur pohon optimal berisi hanya 4 node, menyeimbangkan kesederhanaan dengan akurasi

Aplikasi praktis:
- **Sistem sorting otomatis**: Integrasi dengan sistem conveyor belt di packing house untuk klasifikasi real-time tomat, mengurangi biaya tenaga kerja dan meningkatkan standardisasi
- **Pemanenan robotik**: Implementasi dalam sistem pemanenan robotik untuk mengidentifikasi tomat matang di lapangan, memungkinkan pemanenan selektif dan mengurangi kerugian pasca-panen
- **Kontrol kualitas retail**: Aplikasi di titik retail untuk memastikan kualitas konsisten, memperpanjang umur simpan dengan pengelompokan yang tepat, dan meningkatkan kepuasan konsumen
- **Aplikasi mobile**: Pengembangan aplikasi smartphone memungkinkan produsen dan konsumen menilai kualitas tomat menggunakan kamera perangkat

Arah masa depan:
Integrasi computer vision dengan algoritma decision tree mengoptimalkan klasifikasi buah dan meningkatkan proses produksi pertanian otomatis. Dengan memastikan pemilihan produk berkualitas tinggi, teknologi ini menguntungkan industri pertanian dan secara simultan meningkatkan kepuasan dan keamanan konsumen. Pekerjaan masa depan sebaiknya fokus pada perluasan pendekatan ini ke buah dan sayuran lain, memasukkan parameter kualitas tambahan, dan mengembangkan model machine learning yang lebih canggih untuk lebih meningkatkan akurasi klasifikasi.

## Rekomendasi untuk Presentasi

1. **Jangan membaca slide secara verbatim** - Gunakan catatan ini sebagai panduan, tetapi sampaikan dengan kata-kata Anda sendiri.

2. **Tekankan aspek praktis** - Sorot bagaimana teknologi ini dapat diterapkan di dunia nyata dalam industri pertanian.

3. **Sederhanakan penjelasan teknis** - Sesuaikan tingkat detail teknis dengan pengetahuan audiens Anda.

4. **Gunakan analogi** - Bandingkan proses decision tree dengan bagaimana manusia menilai kematangan tomat secara visual.

5. **Dorong pertanyaan** - Pertanyaan yang baik dari audiens menunjukkan keterlibatan mereka dengan materi Anda.

6. **Persiapkan jawaban untuk pertanyaan teknis** - Antisipasi pertanyaan tentang metode machine learning lain dan mengapa Anda memilih decision tree.

7. **Akhiri dengan kesimpulan yang kuat** - Ringkas temuan utama dan implikasi penelitian untuk industri pertanian dan masa depan computer vision.
