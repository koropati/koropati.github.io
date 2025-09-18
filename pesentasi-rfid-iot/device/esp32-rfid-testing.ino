/*
  ESP32 PN532 RFID Reader Test (I2C Mode)
  
  Hardware:
  - ESP32 DevKit
  - PN532 NFC Module V3 (I2C Mode)
  - Optional: LED + Buzzer untuk feedback
  
  Connections:
  PN532 → ESP32
  VCC   → 3.3V
  GND   → GND  
  SDA   → Pin 21
  SCL   → Pin 22
  IRQ   → Pin 4 (Optional)
  RST   → Pin 3 (Optional)
  
  PN532 Jumper Setting untuk I2C:
  SEL0: ON
  SEL1: ON
  
  Library Required:
  - Adafruit_PN532
*/

#include <Wire.h>
#include <Adafruit_PN532.h>

// Pin definitions
#define I2C_SDA 21
#define I2C_SCL 22
#define PN532_IRQ 4    // Optional
#define PN532_RESET 3  // Optional

#define LED_PIN 2      // Built-in LED
#define BUZZER_PIN 26  // Optional buzzer

// PN532 I2C instance
Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

// Variables
String lastUID = "";
unsigned long lastScanTime = 0;
bool buzzerActive = false;
unsigned long buzzerStartTime = 0;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("=================================");
  Serial.println("🔍 ESP32 PN532 RFID Test (I2C)");
  Serial.println("=================================");
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  
  // Initialize I2C
  Wire.begin(I2C_SDA, I2C_SCL);
  Wire.setClock(100000); // 100kHz
  
  Serial.println("📡 I2C initialized");
  Serial.println("   SDA: Pin " + String(I2C_SDA));
  Serial.println("   SCL: Pin " + String(I2C_SCL));
  
  // Scan I2C devices
  Serial.println();
  scanI2CDevices();
  
  // Initialize PN532
  Serial.println();
  Serial.println("🚀 Initializing PN532...");
  
  if (!nfc.begin()) {
    Serial.println("❌ PN532 board not found!");
    Serial.println("   Check connections and jumper settings");
    Serial.println("   Expected I2C address: 0x24");
    while (1) {
      // Blink LED to indicate error
      digitalWrite(LED_PIN, HIGH);
      delay(200);
      digitalWrite(LED_PIN, LOW);
      delay(200);
    }
  }
  
  // Get firmware version
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("❌ Didn't find PN53x board");
    while (1) {
      digitalWrite(LED_PIN, HIGH);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      delay(100);
    }
  }
  
  // Print firmware info
  Serial.println("✅ PN532 Found!");
  Serial.print("   Chip: PN5");
  Serial.println((versiondata >> 24) & 0xFF, HEX);
  Serial.print("   Firmware: ");
  Serial.print((versiondata >> 16) & 0xFF, DEC);
  Serial.print('.');
  Serial.println((versiondata >> 8) & 0xFF, DEC);
  
  // Configure PN532 to read RFID tags
  nfc.SAMConfig();
  
  Serial.println();
  Serial.println("🎯 Ready to scan RFID cards!");
  Serial.println("   Place your card near the reader...");
  Serial.println("=================================");
  
  // Success indication
  playSuccessBeep();
}

void loop() {
  unsigned long currentTime = millis();
  
  // Handle buzzer timing
  if (buzzerActive && currentTime - buzzerStartTime > 150) {
    digitalWrite(BUZZER_PIN, LOW);
    buzzerActive = false;
  }
  
  // Scan for RFID cards every 500ms
  if (currentTime - lastScanTime > 500) {
    scanForCards();
    lastScanTime = currentTime;
  }
}

void scanForCards() {
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  // Try to read a card with timeout of 100ms
  if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 100)) {
    
    // Convert UID to hex string
    String cardUID = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) cardUID += "0";
      cardUID += String(uid[i], HEX);
    }
    cardUID.toUpperCase();
    
    // Only process if it's a new card or enough time has passed
    if (cardUID != lastUID || millis() - lastScanTime > 2000) {
      lastUID = cardUID;
      
      // Card detected - show info
      Serial.println();
      Serial.println("📱 CARD DETECTED!");
      Serial.println("   UID: " + cardUID);
      Serial.println("   Length: " + String(uidLength) + " bytes");
      Serial.print("   Raw bytes: ");
      for (uint8_t i = 0; i < uidLength; i++) {
        Serial.print("0x");
        if (uid[i] < 0x10) Serial.print("0");
        Serial.print(uid[i], HEX);
        if (i < uidLength - 1) Serial.print(" ");
      }
      Serial.println();
      Serial.println("   Timestamp: " + String(millis()) + "ms");
      Serial.println("---------------------------------");
      
      // Visual and audio feedback
      playBeep();
      blinkLED(2);
      
      // Try to read card type
      identifyCardType(uid, uidLength);
    }
  }
}

void scanI2CDevices() {
  Serial.println("🔍 Scanning I2C bus...");
  
  byte error, address;
  int nDevices = 0;
  
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("   Found device at 0x");
      if (address < 16) Serial.print("0");
      Serial.print(address, HEX);
      
      // Identify known devices
      if (address == 0x24) Serial.print(" (PN532 NFC)");
      else if (address == 0x27) Serial.print(" (LCD)");
      else if (address == 0x3C || address == 0x3D) Serial.print(" (OLED)");
      else if (address == 0x48) Serial.print(" (ADS1115 ADC)");
      else if (address == 0x68) Serial.print(" (DS3231 RTC)");
      else Serial.print(" (Unknown)");
      
      Serial.println();
      nDevices++;
    }
  }
  
  Serial.println("   Total devices found: " + String(nDevices));
  
  if (nDevices == 0) {
    Serial.println("   ⚠️  No I2C devices found!");
    Serial.println("   Check wiring and power connections");
  }
}

void identifyCardType(uint8_t* uid, uint8_t uidLength) {
  Serial.println("🔍 Card Analysis:");
  
  // Analyze UID length
  switch (uidLength) {
    case 4:
      Serial.println("   Type: Likely MIFARE Classic 1K/4K");
      break;
    case 7:
      Serial.println("   Type: Likely MIFARE Ultralight or Random UID");
      break;
    case 10:
      Serial.println("   Type: Likely MIFARE DESFire or Plus");
      break;
    default:
      Serial.println("   Type: Unknown (" + String(uidLength) + " bytes)");
      break;
  }
  
  // Check for common patterns
  if (uid[0] == 0x04) {
    Serial.println("   Standard: ISO14443A Type A");
  }
  
  // Check if UID starts with manufacturer code
  switch (uid[0]) {
    case 0x04:
      Serial.println("   Manufacturer: NXP Semiconductors");
      break;
    case 0x02:
      Serial.println("   Manufacturer: STMicroelectronics");
      break;
    case 0x05:
      Serial.println("   Manufacturer: Infineon Technologies");
      break;
    default:
      Serial.println("   Manufacturer: Unknown (0x" + String(uid[0], HEX) + ")");
      break;
  }
}

void playBeep() {
  digitalWrite(BUZZER_PIN, HIGH);
  buzzerActive = true;
  buzzerStartTime = millis();
}

void playSuccessBeep() {
  // Play 3 short beeps for success
  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
  }
}

void blinkLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  }
}