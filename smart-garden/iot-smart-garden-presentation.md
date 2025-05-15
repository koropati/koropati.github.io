# IoT dan Implementasinya pada Smart Garden
## Presentasi untuk SMK Jurusan Teknik Komputer dan Jaringan

---

# Agenda Presentasi

1. Pengenalan Internet of Things (IoT)
2. Mikrokontroler dalam Ekosistem IoT
3. Protokol Komunikasi IoT
4. Pengenalan Smart Garden
5. Arsitektur Sistem Smart Garden
6. Implementasi Praktis Smart Garden
7. Demo dan Studi Kasus
8. Prospek Karir di Bidang IoT
9. Tanya Jawab

---

# Tentang Pembicara

![Foto Pembicara]

**Dewa Ketut Satriawan Suditresnajaya**
- Software Engineer (IoT) di Bima Sakti Alterra
- **Pengalaman:**
  - Pengajar Robotika (R-Akademi) 2019 - Nov 2020
  - Programmer (BIT House) Nov 2020 - Feb 2022
  - Software Engineer (BSA) Feb 2022 - Saat ini

---

# 1. Pengenalan Internet of Things (IoT)

## Apa itu Internet of Things (IoT)?

> IoT adalah jaringan perangkat yang terhubung ke internet untuk saling bertukar data.

**Statistik Terkini:**
- Lebih dari 30 miliar perangkat IoT terhubung di 2023
- Diperkirakan meningkat hingga 75 miliar pada 2025
- Pasar Smart Garden global bernilai USD 14,4 miliar (2023)
- Pertumbuhan tahunan 18,6% hingga 2030

---

# Komponen Utama IoT

1. **Perangkat:**
   - Sensor (mengumpulkan data)
   - Aktuator (melakukan tindakan)

2. **Konektivitas:**
   - WiFi, Bluetooth, ZigBee, LoRa, 5G

3. **Cloud:**
   - Penyimpanan data
   - Pemrosesan dan analisis

4. **Aplikasi:**
   - Antarmuka pengguna
   - Visualisasi data
   - Kontrol dan monitoring

---

# Contoh Penggunaan IoT

## Smart Home
- Otomasi lampu, AC, dan keamanan
- Kontrol perangkat via smartphone

## Smart City
- Manajemen lalu lintas
- Pemantauan kualitas udara
- Pengelolaan sampah dan energi

## Smart Agriculture
- Pemantauan kelembaban tanah
- Pengairan otomatis
- Monitoring kondisi tanaman
- **Smart Garden** (fokus presentasi kita)

---

# 2. Mikrokontroler dalam Ekosistem IoT

## Definisi Mikrokontroler

Mikrokontroler adalah perangkat komputasi kecil yang dapat diprogram untuk:
- Menerima input dari sensor (INPUT)
- Mengolah data (PROSES)
- Mengendalikan aktuator (OUTPUT)

---

# Komponen Mikrokontroler

- **CPU (Central Processing Unit):** Otak mikrokontroler
- **Memori:** ROM, RAM, EEPROM
- **I/O Ports:** Komunikasi dengan perangkat luar
- **Timer dan Counter:** Pengukuran waktu
- **ADC/DAC:** Konversi sinyal analog-digital
- **Komunikasi:** UART, SPI, I2C, WiFi, BLE

---

# Jenis Mikrokontroler Populer

## Arduino
- Berbasis AVR, mudah untuk pemula
- Banyak library dan komunitas besar

## ESP8266/ESP32
- WiFi terintegrasi, cocok untuk IoT
- Harga terjangkau, performa tinggi

## Raspberry Pi Pico
- Berbasis ARM Cortex-M0+
- Dukungan MicroPython dan CircuitPython

## STM32
- Performa tinggi untuk aplikasi industri

---

# ESP8266 vs ESP32: Perbandingan

| Fitur | ESP8266 | ESP32 |
|-------|---------|-------|
| CPU | Single-core 80MHz | Dual-core 240MHz |
| WiFi | 2.4 GHz | 2.4 GHz |
| Bluetooth | Tidak ada | BLE & Classic |
| GPIO | ~11 pin | 36+ pin |
| ADC | 1 channel (10-bit) | 18 channels (12-bit) |
| Harga | $2-4 | $3-10 |
| RAM | ~50KB | 520KB |

---

# Pengenalan ESP8266

## Apa Itu ESP8266?
- Modul WiFi berbasis mikrokontroler dengan harga terjangkau
- SoC (System on Chip) dengan kemampuan WiFi
- Dibuat oleh Espressif Systems

## Kelebihan ESP8266:
- Mendukung koneksi WiFi 2.4GHz
- Hemat daya (konsumsi <1W)
- Cocok untuk proyek IoT skala kecil-menengah
- Harga murah (Rp 25.000 - 50.000)

---

# Varian ESP8266

![ESP8266 Variants]

1. **ESP-01:** Versi kompak, 8 pin
2. **NodeMCU:** Development board lengkap dengan USB
3. **Wemos D1 Mini:** Bentuk kecil, pin kompatibel Arduino
4. **ESP-12E/F:** Module dengan lebih banyak GPIO

---

# Komponen Dasar ESP8266

![ESP8266 Components]

1. **Wi-Fi Module:** Terintegrasi untuk komunikasi nirkabel
2. **GPIO Pins:** Untuk input/output digital (D0-D8)
3. **Power Supply:** 3.3V (JANGAN gunakan 5V langsung!)
4. **Serial Interface (UART):** Untuk pemrograman dan komunikasi
5. **ADC:** Konversi sinyal analog ke digital (1 channel)

---

# Cara Kerja ESP8266

1. **Koneksi WiFi:**
   - Terhubung ke jaringan WiFi (client mode)
   - Atau membuat access point sendiri (AP mode)

2. **Pemrograman:**
   - Arduino IDE (via ESP8266 Core)
   - MicroPython atau NodeMCU (Lua)
   - PlatformIO

3. **Komunikasi Data:**
   - HTTP/HTTPS
   - MQTT
   - WebSockets

---

# Pemrograman ESP8266 Dasar

## Struktur Program Arduino:

```cpp
// Library yang dibutuhkan
#include <ESP8266WiFi.h>

// Definisi variabel
const char* ssid = "WiFi_SSID";
const char* password = "WiFi_Password";

void setup() {
  // Kode inisialisasi, dijalankan sekali
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  
  // Koneksi ke WiFi
  WiFi.begin(ssid, password);
}

void loop() {
  // Kode utama, dijalankan berulang-ulang
  digitalWrite(LED_BUILTIN, HIGH); // LED menyala
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);  // LED mati
  delay(1000);
}
```

---

# Contoh Program Membaca Sensor:

```cpp
#include <ESP8266WiFi.h>
#include <DHT.h>

#define DHTPIN 2  // Pin D4 pada NodeMCU
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();      // Baca kelembaban
  float t = dht.readTemperature();   // Baca suhu (Celsius)
  
  if (isnan(h) || isnan(t)) {
    Serial.println("Gagal membaca dari sensor DHT!");
    return;
  }
  
  Serial.print("Kelembaban: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Suhu: ");
  Serial.print(t);
  Serial.println(" °C");
  
  delay(2000);  // Tunggu 2 detik
}
```

---

# 3. Protokol Komunikasi IoT

## Protokol Populer dalam IoT:

1. **HTTP/HTTPS:** Web standard, RESTful API
2. **MQTT:** Message Queuing Telemetry Transport
3. **CoAP:** Constrained Application Protocol
4. **WebSocket:** Komunikasi dua arah real-time
5. **Zigbee/Z-Wave:** Protokol mesh untuk smart home

**Perbandingan:**

| Protokol | Overhead | Keamanan | Konsumsi Daya | Use Case |
|----------|----------|----------|---------------|----------|
| HTTP     | Tinggi   | SSL/TLS  | Tinggi        | Web API  |
| MQTT     | Rendah   | SSL/TLS  | Rendah        | IoT, Sensor |
| CoAP     | Rendah   | DTLS     | Rendah        | Perangkat terbatas |

---

# MQTT: Protokol untuk IoT

## Apa itu MQTT?
- Message Queuing Telemetry Transport
- Ringan, cocok untuk jaringan terbatas
- Model publish/subscribe

## Keunggulan MQTT
- Overhead minimal (2 bytes)
- Mendukung Quality of Service (QoS)
- Dapat menyimpan pesan untuk klien offline
- Dukungan TLS/SSL untuk keamanan

---

# Komponen Utama MQTT

![MQTT Architecture]

1. **Broker:** Server pusat yang menangani pesan
   - Mosquitto, HiveMQ, EMQ X

2. **Publisher:** Pengirim data (sensor)

3. **Subscriber:** Penerima data (aplikasi)

4. **Topic:** Jalur untuk mengkategorikan pesan
   - Contoh: `smartgarden/sensor1/temperature`

---

# Cara Kerja MQTT

1. **Publish:** Mengirim data ke broker dengan topik tertentu
   ```
   PUBLISH smartgarden/sensor1/humidity 85.5
   ```

2. **Subscribe:** Mendaftar untuk menerima data dari topik
   ```
   SUBSCRIBE smartgarden/sensor1/#
   ```

3. **QoS (Quality of Service):**
   - QoS 0: Kirim sekali, tidak ada konfirmasi
   - QoS 1: Kirim hingga dikonfirmasi
   - QoS 2: Pastikan diterima tepat sekali

---

# Implementasi MQTT dengan ESP8266

```cpp
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "WiFi_SSID";
const char* password = "WiFi_Password";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Handle messages received
  // ...
}

void reconnect() {
  while (!client.connected()) {
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      client.subscribe("smartgarden/control/#");
    }
    delay(5000);
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Publish data every 30 seconds
  static unsigned long lastPublish = 0;
  if (millis() - lastPublish > 30000) {
    lastPublish = millis();
    
    float humidity = 75.5;  // getData from sensor
    String payload = String(humidity);
    client.publish("smartgarden/sensor1/humidity", payload.c_str());
  }
}
```

---

# 4. Pengenalan Smart Garden

## Apa itu Smart Garden?

> Smart Garden adalah sistem berbasis IoT yang memantau dan mengontrol lingkungan tanaman secara otomatis untuk mengoptimalkan pertumbuhan dan efisiensi sumber daya.

## Statistik Terkini:
- Pasar Smart Garden Indonesia tumbuh 22% (2022-2023)
- Penghematan air hingga 40-60% dibanding metode manual
- ROI untuk petani kecil: 6-18 bulan

---

# Fitur Utama Smart Garden

## 1. Monitoring Kondisi Tanaman
- Kelembaban tanah
- Suhu dan kelembaban udara
- Intensitas cahaya
- Kadar pH tanah (sistem advanced)

## 2. Otomasi
- Sistem pengairan otomatis
- Penerangan tambahan
- Kontrol nutrisi (hidroponik)

## 3. Analisis Data
- Tren pertumbuhan
- Prediksi kebutuhan air
- Deteksi anomali

---

# Manfaat Smart Garden

## Efisiensi Sumber Daya
- Penghematan air hingga 60%
- Pengurangan penggunaan pupuk
- Optimalisasi energi

## Peningkatan Produktivitas
- Pertumbuhan tanaman optimal
- Deteksi dini hama dan penyakit
- Mengurangi gagal panen

## Kemudahan Operasional
- Monitoring jarak jauh
- Notifikasi real-time
- Mengurangi kebutuhan tenaga kerja

---

# Komponen Utama Smart Garden

## Hardware:
- **Sensor Kelembaban Tanah**
- **Sensor DHT11/DHT22** (suhu & kelembaban)
- **Sensor Cahaya** (LDR/BH1750)
- **Relay** untuk kontrol pompa/solenoid
- **Mikrokontroler** (ESP8266/ESP32)

## Software:
- **Firmware** pada mikrokontroler
- **Broker MQTT** (cloud/local)
- **Backend** (database & logika)
- **Frontend** (dashboard & kontrol)

---

# 5. Arsitektur Sistem Smart Garden

![Smart Garden Architecture]

## Lapisan Fisik
- Sensor dan aktuator
- Mikrokontroler (ESP8266/ESP32)

## Lapisan Komunikasi
- WiFi local
- MQTT Broker

## Lapisan Aplikasi
- Database
- Backend logic
- Frontend dashboard

---

# Alur Data dalam Smart Garden

1. **Sensor → ESP8266/ESP32**: Sensor mengirim data ke mikrokontroler
2. **ESP8266/ESP32 → MQTT Broker**: Data dikirim ke broker via WiFi
3. **MQTT Broker → Server/Cloud**: Broker mendistribusikan data
4. **Server → Database**: Data disimpan untuk analisis
5. **Server → Frontend**: Data ditampilkan di dashboard
6. **Frontend → MQTT Broker**: Perintah kontrol dari user
7. **MQTT Broker → ESP8266/ESP32**: Perintah diterima mikrokontroler
8. **ESP8266/ESP32 → Aktuator**: Mikrokontroler mengontrol pompa/solenoid

---

# Protokol Komunikasi dalam Smart Garden

## WiFi
- Koneksi mikrokontroler ke internet
- Local network (alternatif untuk area tanpa internet)

## MQTT
- Komunikasi data sensor ke server
- Komunikasi perintah kontrol ke perangkat

## HTTP/Websocket
- API untuk dashboard
- Koneksi real-time antara dashboard dan server

---

# 6. Implementasi Praktis Smart Garden

## Skema Rangkaian Dasar

![Smart Garden Circuit]

**Komponen:**
- NodeMCU ESP8266
- Sensor kelembaban tanah YL-69/FC-28
- Sensor DHT11/DHT22
- Relay modul 5V
- Solenoid valve 12V
- Adaptor 12V dan regulator 5V

---

# Wiring Diagram

| Komponen | Pin ESP8266 | Catatan |
|----------|-------------|---------|
| Sensor Kelembaban | A0 | Analog input |
| DHT11/DHT22 | D4 (GPIO2) | Digital input |
| Relay | D2 (GPIO4) | Digital output |
| LED Indikator | D1 (GPIO5) | Digital output |
| OLED Display | D3,D5 (SDA,SCL) | I2C |

---

# Kode Program Lengkap

```cpp
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// MQTT Broker
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_user = "";
const char* mqtt_password = "";
const char* clientID = "SmartGardenNode1";

// Topics
const char* topicSensor = "smartgarden/sensor1/data";
const char* topicControl = "smartgarden/sensor1/control";

// Sensor pins
#define SOIL_MOISTURE_PIN A0
#define DHTPIN D4
#define DHTTYPE DHT22
#define RELAY_PIN D2
#define LED_PIN D1

// Variables
float temperature, humidity, soilMoisture;
bool pumpStatus = false;
unsigned long lastMsg = 0;
int soilMoistureThreshold = 30;  // percentage

// Initialize objects
DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
  
  digitalWrite(LED_PIN, HIGH);
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  if (String(topic) == topicControl) {
    DynamicJsonDocument doc(256);
    deserializeJson(doc, message);
    
    if (doc.containsKey("pump")) {
      bool pumpCommand = doc["pump"];
      digitalWrite(RELAY_PIN, pumpCommand ? HIGH : LOW);
      pumpStatus = pumpCommand;
    }
    
    if (doc.containsKey("threshold")) {
      soilMoistureThreshold = doc["threshold"];
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect(clientID, mqtt_user, mqtt_password)) {
      client.subscribe(topicControl);
    } else {
      delay(5000);
    }
  }
}

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
  
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > 30000) {
    lastMsg = now;
    
    // Read sensors
    humidity = dht.readHumidity();
    temperature = dht.readTemperature();
    int soilMoistureRaw = analogRead(SOIL_MOISTURE_PIN);
    soilMoisture = map(soilMoistureRaw, 1023, 0, 0, 100);  // Convert to percentage
    
    // Auto control (if soil is too dry)
    if (soilMoisture < soilMoistureThreshold && !pumpStatus) {
      digitalWrite(RELAY_PIN, HIGH);
      pumpStatus = true;
      delay(10000);  // Pump runs for 10 seconds
      digitalWrite(RELAY_PIN, LOW);
      pumpStatus = false;
    }
    
    // Prepare and send JSON message
    DynamicJsonDocument doc(256);
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["soilMoisture"] = soilMoisture;
    doc["pumpStatus"] = pumpStatus;
    doc["threshold"] = soilMoistureThreshold;
    
    char buffer[256];
    serializeJson(doc, buffer);
    client.publish(topicSensor, buffer);
  }
}
```

---

# Desain Dashboard

![Dashboard Image]

## Fitur Dashboard:
- Visualisasi data real-time
- Grafik historis (harian/mingguan/bulanan)
- Kontrol manual pompa air
- Pengaturan threshold otomasi
- Notifikasi (email/Telegram)

---

# 7. Demo dan Studi Kasus

## Studi Kasus 1: Smart Garden Skala Rumahan
- 5-10 tanaman pot
- Budget < Rp 500.000
- Kontrol via smartphone

## Studi Kasus 2: Vertical Garden Perkotaan
- 50-100 tanaman
- Multiple zone control
- Data logging dan analisis

## Studi Kasus 3: Greenhouse Komersial
- 500+ tanaman
- Integrasi multi-sensor (suhu, kelembaban, CO2, cahaya)
- Prediksi panen menggunakan ML

---

# Praktik Terbaik Smart Garden

## Hardware
- Gunakan waterproof casing untuk elektronik
- Perlindungan terhadap arus lebih (fuse)
- Backup power (baterai/solar panel)

## Software
- OTA updates (Over-The-Air)
- Failsafe mode saat internet terputus
- Data caching untuk mencegah kehilangan data

## Operasional
- Kalibrasi sensor secara berkala
- Pemeliharaan fisik (pembersihan, penggantian)
- Monitoring baterai dan power supply

---

# 8. Prospek Karir di Bidang IoT

## Posisi Pekerjaan di Bidang IoT:
- **IoT Developer**
- **Embedded Systems Engineer**
- **IoT Solution Architect**
- **Data Scientist** (IoT Analytics)
- **Smart Agriculture Specialist**

## Kisaran Gaji:
- Junior IoT Developer: Rp 5-8 juta/bulan
- Senior IoT Engineer: Rp 15-25 juta/bulan
- IoT Solution Architect: Rp 25-40 juta/bulan

---

# Skill yang Dibutuhkan

## Technical Skills:
- Embedded Programming (C/C++)
- Networking & Protocols
- Cloud Platforms (AWS IoT, Azure IoT)
- Database (SQL & NoSQL)
- Frontend/Mobile Development

## Soft Skills:
- Problem Solving
- Project Management
- Komunikasi dengan client
- Kemampuan bekerja dalam tim multidisiplin

---

# Tren Masa Depan IoT & Smart Garden

## 1. AI & Machine Learning
- Prediksi pertumbuhan tanaman
- Deteksi dini penyakit tanaman
- Optimasi otomatis penggunaan air

## 2. Edge Computing
- Pemrosesan data di perangkat lokal
- Mengurangi ketergantungan koneksi internet
- Respons lebih cepat untuk tindakan kritis

## 3. Low-Power Wide Area Networks (LPWAN)
- LoRaWAN untuk area luas
- NB-IoT untuk penetrasi dalam gedung
- Baterai tahan bertahun-tahun

---

# Sumber Belajar Lanjutan

## Online Courses:
- **Coursera:** IoT Specialization (UC San Diego)
- **Udemy:** ESP8266 & ESP32 IoT Projects
- **YouTube:** Andreas Spiess, GreatScott!

## Communities:
- **Hackster.io** - Proyek IoT
- **Forum ESP8266.com**
- **Arduino Forum**
- **Komunitas IoT Indonesia**

## Documentation:
- **ESP8266 Arduino Core**
- **MQTT.org**

---

# Terima Kasih!

Kontak:

**Dewa Ketut Satriawan Suditresnajaya**  
Software Engineer (IoT)  
Bima Sakti Alterra

Email: commercial@bsa.id  
Whatsapp: +62811-3800-8800

Griya Bimasakti  
Jalan Melati No 61, Denpasar, Bali

---

# Sesi Tanya Jawab
