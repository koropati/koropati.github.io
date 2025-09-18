/*
  ESP32 RFID School Attendance & Canteen System (I2C Version) - FIXED
  
  Hardware Requirements:
  - ESP32 DEVKITC V4 WROOM-32U
  - PN532 NFC Module V3 (I2C Mode)
  - LCD 16x2 I2C
  - 4 Push Buttons
  - Buzzer
  
  Libraries Required:
  - Adafruit_PN532 (for RFID)
  - PubSubClient (for MQTT)
  - LiquidCrystal_I2C (for LCD)
  - WiFi (ESP32 built-in)
  - WebServer (ESP32 built-in)
  - EEPROM (ESP32 built-in)
  - ArduinoJson (for JSON handling)
  
  I2C Addresses:
  - PN532: 0x24 (default)
  - LCD: 0x27
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>  // For TLS/SSL connections
#include <WebServer.h>
#include <EEPROM.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_PN532.h>
#include <ArduinoJson.h>

// Pin Definitions for I2C
#define I2C_SDA 21
#define I2C_SCL 22

// PN532 I2C specific pins
#define PN532_IRQ   4    // Interrupt pin (optional)
#define PN532_RESET 3    // Reset pin (optional, can be -1 if not used)

#define LCD_ADDR 0x27
#define PN532_I2C_ADDR 0x24  // Default I2C address for PN532

// Hardware Configuration - Set to false if LCD is not connected
#define LCD_ENABLED true  // Change to false if LCD is not connected

#define BUZZER_PIN 26
#define BUTTON1_PIN 32  // Mode switch
#define BUTTON2_PIN 33  // Amount up
#define BUTTON3_PIN 25  // Amount down
#define BUTTON4_PIN 27  // Confirm/Reset

#define LED_PIN 2  // Built-in LED

// Hardware Objects - I2C Configuration
Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);  // I2C mode
LiquidCrystal_I2C lcd(LCD_ADDR, 16, 2);
WiFiClient espClient;
WiFiClientSecure espClientSecure;  // For TLS connections
PubSubClient mqtt(espClient);      // Will be reconfigured based on TLS setting
WebServer webServer(80);

// Configuration Structure
struct Config {
  char wifi_ssid[32] = "MY-WIFI-1";
  char wifi_password[64] = "aaaabbbb2222";
  char mqtt_server[128] = "935f736e5cda4805a5de7bd63b04f43d.s1.eu.hivemq.cloud";  // HiveMQ Cloud broker
  int mqtt_port = 8883;  // TLS port for HiveMQ Cloud
  char mqtt_user[64] = "iot_rfid_web";  // HiveMQ Cloud username
  char mqtt_password[128] = "iot_RFID_web123";  // HiveMQ Cloud password
  char device_id[32] = "rfid-device-1";
  bool is_canteen_mode = false;
  int preset_amounts[4] = {2000, 5000, 10000, 15000};
  char admin_password[32] = "admin123";
  bool config_mode = false;
  bool mqtt_use_tls = true;  // Enable TLS for HiveMQ Cloud
  int mqtt_keepalive = 60;   // Keep alive interval
  bool mqtt_clean_session = true;  // Clean session flag
};

Config config;

// Global variables for diagnostic mode
bool nfcInitialized = false;
bool lcdInitialized = false;
unsigned long lastDiagnosticCheck = 0;

// System State Variables
enum SystemState {
  STATE_INIT,
  STATE_CONNECTING_WIFI,
  STATE_CONNECTING_MQTT,
  STATE_READY,
  STATE_CARD_DETECTED,
  STATE_AMOUNT_SELECT,
  STATE_PROCESSING,
  STATE_CONFIG_MODE,
  STATE_ERROR
};

SystemState currentState = STATE_INIT;
SystemState previousState = STATE_INIT;

// Timing Variables (non-blocking)
unsigned long lastMillis = 0;
unsigned long lastCardCheck = 0;
unsigned long lastButtonCheck = 0;
unsigned long lastMQTTCheck = 0;
unsigned long lastLCDUpdate = 0;
unsigned long buzzerStartTime = 0;
unsigned long statusMessageTime = 0;

// Button Variables
bool button1Pressed = false;
bool button2Pressed = false;
bool button3Pressed = false;
bool button4Pressed = false;
unsigned long button1LastPress = 0;
unsigned long button2LastPress = 0;
unsigned long button3LastPress = 0;
unsigned long button4LastPress = 0;

// RFID Variables
String lastCardUID = "";
unsigned long cardDetectedTime = 0;
bool cardProcessed = false;

// Amount Selection Variables
int selectedAmountIndex = 1; // Default to 5000
bool amountConfirmed = false;

// Status Variables
String statusMessage = "";
String studentName = "";
bool buzzerActive = false;
bool webConfigActive = false;

// Web Server HTML Templates - FIXED VERSION
const char* configPageHTML = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <title>RFID Device Configuration</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial; margin: 20px; background: #f0f0f0; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .form-group { margin: 15px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
        .i2c-info { background: #fff3cd; padding: 10px; margin: 10px 0; border-radius: 4px; color: #856404; }
    </style>
</head>
<body>
    <div class="container">
        <h1>RFID Device Configuration (I2C Mode)</h1>
        <div class="i2c-info">
            <strong>I2C Configuration:</strong><br>
            PN532 Address: 0x24 | LCD Address: 0x27<br>
            SDA: Pin 21 | SCL: Pin 22
        </div>
        <div id="status"></div>
        
        <form id="configForm">
            <h3>WiFi Settings</h3>
            <div class="form-group">
                <label>WiFi SSID:</label>
                <input type="text" id="wifi_ssid" name="wifi_ssid" required>
            </div>
            <div class="form-group">
                <label>WiFi Password:</label>
                <input type="password" id="wifi_password" name="wifi_password">
            </div>
            
            <h3>MQTT Settings</h3>
            <div class="form-group">
                <label>MQTT Server:</label>
                <input type="text" id="mqtt_server" name="mqtt_server" required placeholder="your-cluster.s1.eu.hivemq.cloud">
            </div>
            <div class="form-group">
                <label>MQTT Port:</label>
                <input type="number" id="mqtt_port" name="mqtt_port" value="8883" required>
            </div>
            <div class="form-group">
                <label>MQTT Username:</label>
                <input type="text" id="mqtt_user" name="mqtt_user" required placeholder="HiveMQ Username">
            </div>
            <div class="form-group">
                <label>MQTT Password:</label>
                <input type="password" id="mqtt_password" name="mqtt_password" required placeholder="HiveMQ Password">
            </div>
            <div class="form-group">
                <label>Use TLS/SSL:</label>
                <select id="mqtt_use_tls" name="mqtt_use_tls">
                    <option value="true">Yes (Recommended for HiveMQ Cloud)</option>
                    <option value="false">No (Local MQTT only)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Keep Alive (seconds):</label>
                <input type="number" id="mqtt_keepalive" name="mqtt_keepalive" value="60" min="30" max="300">
            </div>
            
            <h3>Device Settings</h3>
            <div class="form-group">
                <label>Device ID:</label>
                <input type="text" id="device_id" name="device_id" required>
            </div>
            <div class="form-group">
                <label>Device Mode:</label>
                <select id="is_canteen_mode" name="is_canteen_mode">
                    <option value="false">Attendance (Gate)</option>
                    <option value="true">Canteen (Payment)</option>
                </select>
            </div>
            
            <h3>Canteen Amount Presets (Rupiah)</h3>
            <div class="form-group">
                <label>Amount 1:</label>
                <input type="number" id="amount1" name="amount1" value="2000">
            </div>
            <div class="form-group">
                <label>Amount 2:</label>
                <input type="number" id="amount2" name="amount2" value="5000">
            </div>
            <div class="form-group">
                <label>Amount 3:</label>
                <input type="number" id="amount3" name="amount3" value="10000">
            </div>
            <div class="form-group">
                <label>Amount 4:</label>
                <input type="number" id="amount4" name="amount4" value="15000">
            </div>
            
            <div class="form-group">
                <button type="submit">Save Configuration</button>
                <button type="button" onclick="loadConfig()">Load Current Config</button>
                <button type="button" onclick="restartDevice()">Restart Device</button>
                <button type="button" onclick="scanI2C()">Scan I2C Devices</button>
            </div>
        </form>
        
        <h3>Device Status</h3>
        <div id="deviceStatus" class="info">Loading...</div>
        
        <h3>I2C Scanner Results</h3>
        <div id="i2cScanResults" class="info">Click "Scan I2C Devices" to scan</div>
    </div>

    <script>
        function showStatus(message, type) {
            const statusDiv = document.getElementById('status');
            statusDiv.className = 'status ' + (type || 'info');
            statusDiv.innerHTML = message;
        }

        function loadConfig() {
            fetch('/api/config')
            .then(response => response.json())
            .then(data => {
                document.getElementById('wifi_ssid').value = data.wifi_ssid || "";
                document.getElementById('wifi_password').value = data.wifi_password || "";
                document.getElementById('mqtt_server').value = data.mqtt_server || "";
                document.getElementById('mqtt_port').value = data.mqtt_port || 8883;
                document.getElementById('mqtt_user').value = data.mqtt_user || "";
                document.getElementById('mqtt_password').value = data.mqtt_password || "";
                document.getElementById('mqtt_use_tls').value = data.mqtt_use_tls ? 'true' : 'false';
                document.getElementById('mqtt_keepalive').value = data.mqtt_keepalive || 60;
                document.getElementById('device_id').value = data.device_id || "";
                document.getElementById('is_canteen_mode').value = data.is_canteen_mode ? 'true' : 'false';
                document.getElementById('amount1').value = data.preset_amounts[0] || 2000;
                document.getElementById('amount2').value = data.preset_amounts[1] || 5000;
                document.getElementById('amount3').value = data.preset_amounts[2] || 10000;
                document.getElementById('amount4').value = data.preset_amounts[3] || 15000;
                showStatus('Configuration loaded successfully!', 'success');
            })
            .catch(error => {
                showStatus('Error loading configuration: ' + error, 'error');
            });
        }

        function restartDevice() {
            if (confirm('Are you sure you want to restart the device?')) {
                fetch('/api/restart', { method: 'POST' })
                .then(() => {
                    showStatus('Device restarting...', 'info');
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                })
                .catch(error => {
                    showStatus('Error restarting device: ' + error, 'error');
                });
            }
        }

        function scanI2C() {
            fetch('/api/i2c-scan')
            .then(response => response.json())
            .then(data => {
                const resultsDiv = document.getElementById('i2cScanResults');
                let html = '<strong>I2C Devices Found:</strong><br>';
                if (data.devices && data.devices.length > 0) {
                    data.devices.forEach(device => {
                        html += 'Address: 0x' + device.address + ' (' + (device.name || 'Unknown') + ')<br>';
                    });
                } else {
                    html += 'No I2C devices found';
                }
                resultsDiv.innerHTML = html;
            })
            .catch(error => {
                document.getElementById('i2cScanResults').innerHTML = 'Error scanning I2C devices: ' + error;
            });
        }

        function updateDeviceStatus() {
            fetch('/api/status')
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('deviceStatus');
                statusDiv.innerHTML = 
                    '<strong>State:</strong> ' + data.state + '<br>' +
                    '<strong>WiFi:</strong> ' + (data.wifi_connected ? 'Connected' : 'Disconnected') + '<br>' +
                    '<strong>MQTT:</strong> ' + (data.mqtt_connected ? 'Connected' : 'Disconnected') + '<br>' +
                    '<strong>Mode:</strong> ' + (data.is_canteen_mode ? 'Canteen' : 'Attendance') + '<br>' +
                    '<strong>Last Card:</strong> ' + (data.last_card || 'None') + '<br>' +
                    '<strong>PN532 Status:</strong> ' + (data.nfc_status || 'Unknown') + '<br>' +
                    '<strong>Uptime:</strong> ' + Math.floor(data.uptime / 1000) + ' seconds';
            })
            .catch(error => {
                document.getElementById('deviceStatus').innerHTML = 'Error fetching status';
            });
        }

        document.getElementById('configForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const configData = {
                wifi_ssid: formData.get('wifi_ssid'),
                wifi_password: formData.get('wifi_password'),
                mqtt_server: formData.get('mqtt_server'),
                mqtt_port: parseInt(formData.get('mqtt_port')),
                mqtt_user: formData.get('mqtt_user'),
                mqtt_password: formData.get('mqtt_password'),
                mqtt_use_tls: formData.get('mqtt_use_tls') === 'true',
                mqtt_keepalive: parseInt(formData.get('mqtt_keepalive')),
                device_id: formData.get('device_id'),
                is_canteen_mode: formData.get('is_canteen_mode') === 'true',
                preset_amounts: [
                    parseInt(formData.get('amount1')),
                    parseInt(formData.get('amount2')),
                    parseInt(formData.get('amount3')),
                    parseInt(formData.get('amount4'))
                ]
            };

            fetch('/api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(configData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showStatus('Configuration saved successfully!', 'success');
                } else {
                    showStatus('Error saving configuration: ' + data.message, 'error');
                }
            })
            .catch(error => {
                showStatus('Error saving configuration: ' + error, 'error');
            });
        });

        // Load config on page load
        loadConfig();
        updateDeviceStatus();
        
        // Update status every 5 seconds
        setInterval(updateDeviceStatus, 5000);
    </script>
</body>
</html>
)rawliteral";

// I2C Scanner function
void scanI2C() {
  byte error, address;
  int nDevices;
  
  Serial.println("Scanning I2C devices...");
  Serial.println("SDA: GPIO" + String(I2C_SDA) + ", SCL: GPIO" + String(I2C_SCL));
  
  nDevices = 0;
  for(address = 1; address < 127; address++) {
    // Add small delay between scans to prevent overwhelming the bus
    delay(5);
    
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("I2C device found at address 0x");
      if (address < 16) Serial.print("0");
      Serial.print(address, HEX);
      
      // Identify common devices
      if (address == 0x24) Serial.print(" (PN532 NFC)");
      else if (address == 0x27) Serial.print(" (LCD 16x2)");
      else if (address == 0x3F) Serial.print(" (LCD 16x2 Alt)");
      else if (address == 0x3C || address == 0x3D) Serial.print(" (OLED)");
      else if (address == 0x48) Serial.print(" (ADS1115 ADC)");
      else if (address == 0x68) Serial.print(" (DS3231 RTC)");
      else Serial.print(" (Unknown device)");
      
      Serial.println();
      nDevices++;
    }
    else if (error == 4) {
      Serial.print("Unknown error at address 0x");
      if (address < 16) Serial.print("0");
      Serial.print(address, HEX);
      Serial.println(" - Device may be busy or not responding");
    }
    else if (error == 2) {
      // NACK on address - device not present, this is normal
      // Don't print anything to avoid spam
    }
    else {
      Serial.print("Error " + String(error) + " at address 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
    }
  }
  
  Serial.println("I2C devices found: " + String(nDevices));
  if (nDevices == 0) {
    Serial.println("No I2C devices found");
    Serial.println("Check wiring and power connections:");
    Serial.println("- PN532: VCC=3.3V, GND=GND, SDA=21, SCL=22");
    Serial.println("- Jumpers: SEL0=ON, SEL1=ON (I2C mode)");
    Serial.println("- Pull-up resistors may be needed on SDA/SCL");
  } else {
    Serial.println("I2C scan completed");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("RFID School System Starting (I2C Mode)...");
  
  // Initialize EEPROM
  EEPROM.begin(512);
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(BUTTON1_PIN, INPUT_PULLUP);
  pinMode(BUTTON2_PIN, INPUT_PULLUP);
  pinMode(BUTTON3_PIN, INPUT_PULLUP);
  pinMode(BUTTON4_PIN, INPUT_PULLUP);
  
  // Initialize I2C with proper error handling
  Serial.println("Initializing I2C bus...");
  Wire.begin(I2C_SDA, I2C_SCL);
  Wire.setClock(100000);  // Set I2C clock to 100kHz (standard mode)
  delay(200);  // Give I2C bus more time to stabilize
  
  Serial.println("I2C initialized on SDA:" + String(I2C_SDA) + " SCL:" + String(I2C_SCL));
  
  // Scan I2C devices with error handling
  Serial.println("Performing I2C device scan...");
  scanI2C();
  
  // Initialize LCD with retry mechanism
  Serial.println("Initializing LCD display...");
  lcdInitialized = false;
  
  #if LCD_ENABLED
  for (int retry = 0; retry < 3; retry++) {
    lcd.init();
    delay(100);
    lcd.backlight();
    delay(50);
    
    // Test LCD by trying to write to it
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("RFID System I2C");
    lcd.setCursor(0, 1);
    lcd.print("Init attempt " + String(retry + 1));
    
    delay(500);
    lcdInitialized = true;
    Serial.println("LCD initialized successfully on attempt " + String(retry + 1));
    break;
  }
  
  if (!lcdInitialized) {
    Serial.println("WARNING: LCD initialization failed after 3 attempts");
    Serial.println("System will continue without LCD display");
  }
  #else
  Serial.println("LCD disabled in configuration - skipping LCD initialization");
  lcdInitialized = false;
  #endif
  
  // Load configuration
  loadConfig();
  
  // Initialize NFC in I2C mode with retry mechanism
  Serial.println("Initializing PN532 NFC reader in I2C mode...");
  nfcInitialized = false;
  
  for (int retry = 0; retry < 5; retry++) {
    Serial.println("PN532 initialization attempt " + String(retry + 1) + "/5");
    delay(300);  // Wait longer before each attempt
    
    if (nfc.begin()) {
      delay(100);  // Give PN532 time to respond
      
      // Configure PN532 for RFID/NFC
      uint32_t versiondata = nfc.getFirmwareVersion();
      if (versiondata) {
        Serial.print("Found PN5"); Serial.print((versiondata>>24) & 0xFF, HEX); 
        Serial.print((versiondata>>16) & 0xFF, HEX);
        Serial.print(" Firmware ver. "); Serial.print((versiondata>>8) & 0xFF, DEC); 
        Serial.print('.'); Serial.println(versiondata & 0xFF, DEC);
        
        // Configure board to read RFID tags
        nfc.setPassiveActivationRetries(0xFF);
        nfc.SAMConfig();
        
        nfcInitialized = true;
        Serial.println("PN532 initialized successfully!");
        
        #if LCD_ENABLED
        if (lcdInitialized) {
          lcd.clear();
          lcd.setCursor(0, 0);
          lcd.print("RFID System I2C");
          lcd.setCursor(0, 1);
          lcd.print("NFC Ready!");
        }
        #endif
        break;
      } else {
        Serial.println("PN532 found but firmware version read failed - retrying...");
      }
    } else {
      Serial.println("PN532 not found on I2C bus - retrying...");
    }
    
    delay(700);  // Wait longer before retry
  }
  
  if (!nfcInitialized) {
    Serial.println("CRITICAL ERROR: PN532 NFC reader initialization failed!");
    Serial.println("Please check:");
    Serial.println("1. I2C wiring (SDA: GPIO21, SCL: GPIO22)");
    Serial.println("2. PN532 I2C address (should be 0x24)");
    Serial.println("3. Power supply to PN532");
    Serial.println("4. Pull-up resistors on I2C lines");
    
    currentState = STATE_ERROR;
    #if LCD_ENABLED
    if (lcdInitialized) {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("NFC I2C Error!");
      lcd.setCursor(0, 1);
      lcd.print("Check wiring");
    }
    #endif
    
    // Continue with system initialization but mark NFC as unavailable
    Serial.println("System will continue in diagnostic mode...");
  }
  
  // Check if config mode requested (Button 1 + Button 4 on startup)
  if (digitalRead(BUTTON1_PIN) == LOW && digitalRead(BUTTON4_PIN) == LOW) {
    Serial.println("Config mode requested by button combination");
    config.config_mode = true;
    currentState = STATE_CONFIG_MODE;
    startConfigMode();
    return;
  }
  
  // Only proceed with WiFi/MQTT if NFC is working
  if (nfcInitialized) {
    Serial.println("All hardware initialized successfully");
    currentState = STATE_CONNECTING_WIFI;
    connectWiFi();
  } else {
    Serial.println("Running in diagnostic mode - NFC unavailable");
    currentState = STATE_ERROR;
    // Still start config mode for troubleshooting
    startConfigMode();
  }
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Handle web server in config mode
  if (currentState == STATE_CONFIG_MODE) {
    webServer.handleClient();
    return;
  }
  
  // Non-blocking button check
  if (currentMillis - lastButtonCheck > 50) {
    checkButtons();
    lastButtonCheck = currentMillis;
  }
  
  // Non-blocking card check - slower for I2C to avoid bus conflicts
  if (currentMillis - lastCardCheck > 200) {  // Increased interval for I2C
    checkForCard();
    lastCardCheck = currentMillis;
  }
  
  // Non-blocking MQTT check
  if (currentMillis - lastMQTTCheck > 100) {
    if (mqtt.connected()) {
      mqtt.loop();
    }
    lastMQTTCheck = currentMillis;
  }
  
  // Non-blocking LCD update
  if (currentMillis - lastLCDUpdate > 500) {
    updateLCD();
    lastLCDUpdate = currentMillis;
  }
  
  // Handle buzzer timing
  if (buzzerActive && currentMillis - buzzerStartTime > 200) {
    digitalWrite(BUZZER_PIN, LOW);
    buzzerActive = false;
  }
  
  // Clear status message after timeout
  if (statusMessage != "" && currentMillis - statusMessageTime > 3000) {
    statusMessage = "";
    studentName = "";
  }
  
  // Diagnostic mode - periodic I2C health check
  if (currentMillis - lastDiagnosticCheck > 10000) {  // Every 10 seconds
    performDiagnosticCheck();
    lastDiagnosticCheck = currentMillis;
  }
  
  // State machine
  handleSystemState();
  
  // Reconnect if needed
  if (currentMillis - lastMillis > 30000) {
    if (currentState != STATE_CONFIG_MODE) {
      if (WiFi.status() != WL_CONNECTED) {
        currentState = STATE_CONNECTING_WIFI;
        connectWiFi();
      } else if (!mqtt.connected()) {
        currentState = STATE_CONNECTING_MQTT;
        connectMQTT();
      }
    }
    lastMillis = currentMillis;
  }
}

void handleSystemState() {
  switch (currentState) {
    case STATE_INIT:
      // Initialization already done in setup()
      break;
      
    case STATE_CONNECTING_WIFI:
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi Connected!");
        currentState = STATE_CONNECTING_MQTT;
        connectMQTT();
      }
      break;
      
    case STATE_CONNECTING_MQTT:
      if (mqtt.connected()) {
        Serial.println("MQTT Connected!");
        currentState = STATE_READY;
      }
      break;
      
    case STATE_READY:
      // Ready for card detection
      break;
      
    case STATE_CARD_DETECTED:
      if (config.is_canteen_mode) {
        currentState = STATE_AMOUNT_SELECT;
      } else {
        currentState = STATE_PROCESSING;
        processAttendance();
      }
      break;
      
    case STATE_AMOUNT_SELECT:
      if (amountConfirmed) {
        currentState = STATE_PROCESSING;
        processCanteenPayment();
        amountConfirmed = false;
      }
      break;
      
    case STATE_PROCESSING:
      // Processing completed, return to ready
      if (millis() - cardDetectedTime > 2000) {
        currentState = STATE_READY;
        cardProcessed = false;
        lastCardUID = "";
      }
      break;
      
    case STATE_ERROR:
      // Stay in error state until restart
      break;
      
    case STATE_CONFIG_MODE:
      // Handled in main loop
      break;
  }
}

void checkButtons() {
  // Button 1: Mode switch / Config mode
  if (digitalRead(BUTTON1_PIN) == LOW && millis() - button1LastPress > 500) {
    button1LastPress = millis();
    if (currentState == STATE_READY) {
      // Quick mode toggle for testing
      config.is_canteen_mode = !config.is_canteen_mode;
      statusMessage = config.is_canteen_mode ? "Mode: Canteen" : "Mode: Attendance";
      statusMessageTime = millis();
      playBuzzer();
    }
  }
  
  // Button 2: Amount up (canteen mode)
  if (digitalRead(BUTTON2_PIN) == LOW && millis() - button2LastPress > 300) {
    button2LastPress = millis();
    if (currentState == STATE_AMOUNT_SELECT) {
      selectedAmountIndex = (selectedAmountIndex + 1) % 4;
      playBuzzer();
    }
  }
  
  // Button 3: Amount down (canteen mode)
  if (digitalRead(BUTTON3_PIN) == LOW && millis() - button3LastPress > 300) {
    button3LastPress = millis();
    if (currentState == STATE_AMOUNT_SELECT) {
      selectedAmountIndex = (selectedAmountIndex - 1 + 4) % 4;
      playBuzzer();
    }
  }
  
  // Button 4: Confirm / Reset
  if (digitalRead(BUTTON4_PIN) == LOW && millis() - button4LastPress > 500) {
    button4LastPress = millis();
    if (currentState == STATE_AMOUNT_SELECT) {
      amountConfirmed = true;
      playBuzzer();
    } else if (currentState == STATE_READY) {
      // Reset or enter config mode
      statusMessage = "Reset";
      statusMessageTime = millis();
      playBuzzer();
    }
  }
}

void checkForCard() {
  if (currentState != STATE_READY && currentState != STATE_AMOUNT_SELECT) {
    return;
  }
  
  // Skip card check if NFC is not initialized
  if (!nfcInitialized) {
    return;
  }
  
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  // Retry mechanism for I2C communication with PN532
  bool cardRead = false;
  for (int retry = 0; retry < 3; retry++) {
    // Use longer timeout for I2C communication
    if (nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 300)) {
      cardRead = true;
      break;
    }
    
    // Small delay between retries to prevent I2C bus overwhelming
    if (retry < 2) {
      delay(50);
    }
  }
  
  if (cardRead) {
    String cardUID = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) cardUID += "0";
      cardUID += String(uid[i], HEX);
    }
    cardUID.toUpperCase();
    
    if (cardUID != lastCardUID || millis() - cardDetectedTime > 3000) {
      lastCardUID = cardUID;
      cardDetectedTime = millis();
      
      if (currentState == STATE_READY) {
        currentState = STATE_CARD_DETECTED;
        statusMessage = "Card: " + cardUID.substring(0, 8);
        statusMessageTime = millis();
        playBuzzer();
        
        Serial.println("Card detected: " + cardUID);
      }
    }
  }
}

void processAttendance() {
  if (mqtt.connected()) {
    DynamicJsonDocument doc(200);
    doc["rfid_id"] = lastCardUID;
    doc["device"] = config.device_id;
    doc["timestamp"] = millis();
    doc["communication"] = "I2C";
    
    String payload;
    serializeJson(doc, payload);
    
    if (mqtt.publish("school/attendance", payload.c_str())) {
      statusMessage = "Attendance OK";
      studentName = "Welcome!";
      Serial.println("Attendance published: " + payload);
    } else {
      statusMessage = "MQTT Error";
      Serial.println("Failed to publish attendance");
    }
  } else {
    statusMessage = "No Connection";
  }
  
  statusMessageTime = millis();
  playBuzzer();
}

void processCanteenPayment() {
  if (mqtt.connected()) {
    DynamicJsonDocument doc(200);
    doc["rfid_id"] = lastCardUID;
    doc["amount"] = config.preset_amounts[selectedAmountIndex];
    doc["device"] = config.device_id;
    doc["timestamp"] = millis();
    doc["communication"] = "I2C";
    
    String payload;
    serializeJson(doc, payload);
    
    if (mqtt.publish("school/canteen", payload.c_str())) {
      statusMessage = "Payment OK";
      studentName = "Rp " + String(config.preset_amounts[selectedAmountIndex]);
      Serial.println("Canteen payment published: " + payload);
    } else {
      statusMessage = "MQTT Error";
      Serial.println("Failed to publish canteen payment");
    }
  } else {
    statusMessage = "No Connection";
  }
  
  statusMessageTime = millis();
  playBuzzer();
}

void updateLCD() {
  #if LCD_ENABLED
  if (!lcdInitialized) return;  // Skip if LCD is not available
  
  lcd.clear();
  
  switch (currentState) {
    case STATE_CONNECTING_WIFI:
      lcd.setCursor(0, 0);
      lcd.print("Connecting WiFi");
      lcd.setCursor(0, 1);
      lcd.print("Please wait...");
      break;
      
    case STATE_CONNECTING_MQTT:
      lcd.setCursor(0, 0);
      lcd.print("Connecting MQTT");
      lcd.setCursor(0, 1);
      lcd.print("Please wait...");
      break;
      
    case STATE_READY:
      lcd.setCursor(0, 0);
      if (config.is_canteen_mode) {
        lcd.print("CANTEEN I2C");
      } else {
        lcd.print("ATTENDANCE I2C");
      }
      lcd.setCursor(0, 1);
      if (statusMessage != "") {
        lcd.print(statusMessage);
      } else {
        lcd.print("Tap your card");
      }
      break;
      
    case STATE_AMOUNT_SELECT:
      lcd.setCursor(0, 0);
      lcd.print("Select Amount:");
      lcd.setCursor(0, 1);
      lcd.print("Rp ");
      lcd.print(config.preset_amounts[selectedAmountIndex]);
      lcd.print(" [2/3:CHG 4:OK]");
      break;
      
    case STATE_PROCESSING:
      lcd.setCursor(0, 0);
      lcd.print(statusMessage);
      lcd.setCursor(0, 1);
      lcd.print(studentName);
      break;
      
    case STATE_CONFIG_MODE:
      lcd.setCursor(0, 0);
      lcd.print("CONFIG MODE I2C");
      lcd.setCursor(0, 1);
      lcd.print("IP: ");
      lcd.print(WiFi.localIP().toString().substring(0, 11));
      break;
      
    case STATE_ERROR:
      lcd.setCursor(0, 0);
      lcd.print("SYSTEM ERROR");
      lcd.setCursor(0, 1);
      lcd.print("Check I2C conn");
      break;
  }
  #endif
}

void playBuzzer() {
  digitalWrite(BUZZER_PIN, HIGH);
  buzzerActive = true;
  buzzerStartTime = millis();
}

void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(config.wifi_ssid);
  
  WiFi.begin(config.wifi_ssid, config.wifi_password);
  
  // Non-blocking connection check will be done in main loop
}

void connectMQTT() {
  // Configure MQTT client based on TLS setting
  if (config.mqtt_use_tls) {
    // Configure secure client for HiveMQ Cloud
    espClientSecure.setInsecure();  // Skip certificate verification for simplicity
    mqtt.setClient(espClientSecure);
    Serial.println("Using TLS connection for MQTT");
  } else {
    mqtt.setClient(espClient);
    Serial.println("Using non-TLS connection for MQTT");
  }
  
  mqtt.setServer(config.mqtt_server, config.mqtt_port);
  mqtt.setCallback(mqttCallback);
  mqtt.setKeepAlive(config.mqtt_keepalive);
  
  String clientId = "ESP32-I2C-" + String(config.device_id);
  
  Serial.print("Connecting to MQTT broker: ");
  Serial.print(config.mqtt_server);
  Serial.print(":");
  Serial.println(config.mqtt_port);
  
  bool connected = false;
  if (strlen(config.mqtt_user) > 0) {
    Serial.print("Using credentials - User: ");
    Serial.println(config.mqtt_user);
    connected = mqtt.connect(clientId.c_str(), config.mqtt_user, config.mqtt_password, 
                           NULL, 0, config.mqtt_clean_session, NULL);
  } else {
    Serial.println("Connecting without credentials");
    connected = mqtt.connect(clientId.c_str(), NULL, NULL, 
                           NULL, 0, config.mqtt_clean_session, NULL);
  }
  
  if (connected) {
    Serial.println("MQTT Connected successfully!");
    mqtt.subscribe("school/device/command");
    String statusTopic = "school/device/status/" + String(config.device_id);
    mqtt.publish(statusTopic.c_str(), "online-i2c", true);
  } else {
    Serial.print("MQTT Connection failed, rc=");
    Serial.println(mqtt.state());
    Serial.println("MQTT Error codes:");
    Serial.println("-4: Connection timeout");
    Serial.println("-3: Connection lost");
    Serial.println("-2: Connect failed");
    Serial.println("-1: Disconnected");
    Serial.println(" 1: Bad protocol");
    Serial.println(" 2: Bad client ID");
    Serial.println(" 3: Unavailable");
    Serial.println(" 4: Bad credentials");
    Serial.println(" 5: Unauthorized");
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.println("MQTT Message: " + String(topic) + " = " + message);
  
  if (String(topic) == "school/device/command") {
    if (message == "restart") {
      ESP.restart();
    } else if (message == "reset_config") {
      resetConfig();
    } else if (message == "scan_i2c") {
      scanI2C();
    } else if (message.startsWith("student_name:")) {
      studentName = message.substring(13);
      statusMessageTime = millis();
    }
  }
}

void startConfigMode() {
  Serial.println("Starting configuration mode...");
  
  // Start WiFi AP mode
  WiFi.mode(WIFI_AP);
  WiFi.softAP("RFID_Config_I2C", "12345678");
  
  #if LCD_ENABLED
  if (lcdInitialized) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("CONFIG MODE I2C");
    lcd.setCursor(0, 1);
    lcd.print("RFID_Config_I2C");
  }
  #endif
  
  // Setup web server routes
  webServer.on("/", HTTP_GET, []() {
    webServer.send(200, "text/html", configPageHTML);
  });
  
  webServer.on("/api/config", HTTP_GET, []() {
    DynamicJsonDocument doc(1024);
    doc["wifi_ssid"] = config.wifi_ssid;
    doc["wifi_password"] = config.wifi_password;
    doc["mqtt_server"] = config.mqtt_server;
    doc["mqtt_port"] = config.mqtt_port;
    doc["mqtt_user"] = config.mqtt_user;
    doc["mqtt_password"] = config.mqtt_password;
    doc["mqtt_use_tls"] = config.mqtt_use_tls;
    doc["mqtt_keepalive"] = config.mqtt_keepalive;
    doc["device_id"] = config.device_id;
    doc["is_canteen_mode"] = config.is_canteen_mode;
    doc["communication_mode"] = "I2C";
    JsonArray amounts = doc.createNestedArray("preset_amounts");
    for (int i = 0; i < 4; i++) {
      amounts.add(config.preset_amounts[i]);
    }
    
    String response;
    serializeJson(doc, response);
    webServer.send(200, "application/json", response);
  });
  
  webServer.on("/api/config", HTTP_POST, []() {
    if (webServer.hasArg("plain")) {
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, webServer.arg("plain"));
      
      strlcpy(config.wifi_ssid, doc["wifi_ssid"], sizeof(config.wifi_ssid));
      strlcpy(config.wifi_password, doc["wifi_password"], sizeof(config.wifi_password));
      strlcpy(config.mqtt_server, doc["mqtt_server"], sizeof(config.mqtt_server));
      config.mqtt_port = doc["mqtt_port"];
      strlcpy(config.mqtt_user, doc["mqtt_user"], sizeof(config.mqtt_user));
      strlcpy(config.mqtt_password, doc["mqtt_password"], sizeof(config.mqtt_password));
      config.mqtt_use_tls = doc["mqtt_use_tls"];
      config.mqtt_keepalive = doc["mqtt_keepalive"];
      strlcpy(config.device_id, doc["device_id"], sizeof(config.device_id));
      config.is_canteen_mode = doc["is_canteen_mode"];
      
      JsonArray amounts = doc["preset_amounts"];
      for (int i = 0; i < 4 && i < amounts.size(); i++) {
        config.preset_amounts[i] = amounts[i];
      }
      
      saveConfig();
      
      webServer.send(200, "application/json", "{\"success\":true,\"message\":\"Configuration saved\"}");
    } else {
      webServer.send(400, "application/json", "{\"success\":false,\"message\":\"Invalid request\"}");
    }
  });
  
  webServer.on("/api/status", HTTP_GET, []() {
    DynamicJsonDocument doc(512);
    doc["state"] = getStateString();
    doc["wifi_connected"] = WiFi.status() == WL_CONNECTED;
    doc["mqtt_connected"] = mqtt.connected();
    doc["is_canteen_mode"] = config.is_canteen_mode;
    doc["last_card"] = lastCardUID;
    doc["uptime"] = millis();
    doc["communication_mode"] = "I2C";
    doc["nfc_status"] = "I2C Mode - Address 0x24";
    
    String response;
    serializeJson(doc, response);
    webServer.send(200, "application/json", response);
  });
  
  webServer.on("/api/i2c-scan", HTTP_GET, []() {
    DynamicJsonDocument doc(1024);
    JsonArray devices = doc.createNestedArray("devices");
    
    byte error, address;
    for(address = 1; address < 127; address++) {
      Wire.beginTransmission(address);
      error = Wire.endTransmission();
      
      if (error == 0) {
        JsonObject device = devices.createNestedObject();
        device["address"] = String(address, HEX);
        
        if (address == 0x24) device["name"] = "PN532 NFC";
        else if (address == 0x27) device["name"] = "LCD";
        else if (address == 0x3C || address == 0x3D) device["name"] = "OLED";
        else device["name"] = "Unknown";
      }
    }
    
    String response;
    serializeJson(doc, response);
    webServer.send(200, "application/json", response);
  });
  
  webServer.on("/api/restart", HTTP_POST, []() {
    webServer.send(200, "application/json", "{\"success\":true}");
    delay(1000);
    ESP.restart();
  });
  
  webServer.begin();
  Serial.println("Web server started on: " + WiFi.softAPIP().toString());
}

String getStateString() {
  switch (currentState) {
    case STATE_INIT: return "Initializing";
    case STATE_CONNECTING_WIFI: return "Connecting WiFi";
    case STATE_CONNECTING_MQTT: return "Connecting MQTT";
    case STATE_READY: return "Ready (I2C)";
    case STATE_CARD_DETECTED: return "Card Detected";
    case STATE_AMOUNT_SELECT: return "Amount Selection";
    case STATE_PROCESSING: return "Processing";
    case STATE_CONFIG_MODE: return "Configuration Mode (I2C)";
    case STATE_ERROR: return "I2C Error";
    default: return "Unknown";
  }
}

void loadConfig() {
  EEPROM.get(0, config);
  
  // Validate config and set defaults
  if (strlen(config.wifi_ssid) == 0) {
    strcpy(config.wifi_ssid, "YourWiFiSSID");
  }
  if (strlen(config.mqtt_server) == 0) {
    strcpy(config.mqtt_server, "your-hivemq-cluster.s1.eu.hivemq.cloud");
  }
  if (config.mqtt_port == 0) {
    config.mqtt_port = 8883;
  }
  if (strlen(config.mqtt_user) == 0) {
    strcpy(config.mqtt_user, "your-username");
  }
  if (strlen(config.mqtt_password) == 0) {
    strcpy(config.mqtt_password, "your-password");
  }
  if (config.mqtt_keepalive == 0) {
    config.mqtt_keepalive = 60;
  }
  // TLS is enabled by default for HiveMQ Cloud
  config.mqtt_use_tls = true;
  config.mqtt_clean_session = true;
  
  if (strlen(config.device_id) == 0) {
    strcpy(config.device_id, "rfid-device-1");
  }
}

void saveConfig() {
  EEPROM.put(0, config);
  EEPROM.commit();
  Serial.println("Configuration saved to EEPROM");
}

void performDiagnosticCheck() {
  Serial.println("=== I2C Diagnostic Check ===");
  
  // Check I2C bus health
  byte error, address;
  int deviceCount = 0;
  bool nfcFound = false;
  bool lcdFound = false;
  
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      deviceCount++;
      if (address == 0x24) nfcFound = true;
      if (address == 0x27 || address == 0x3F) lcdFound = true;
    }
  }
  
  Serial.println("I2C devices found: " + String(deviceCount));
  Serial.println("PN532 NFC (0x24): " + String(nfcFound ? "OK" : "MISSING"));
  Serial.println("LCD (0x27/0x3F): " + String(lcdFound ? "OK" : "MISSING"));
  
  // Try to reinitialize NFC if it was lost
  if (!nfcFound && nfcInitialized) {
    Serial.println("NFC connection lost - attempting reinitialize...");
    nfcInitialized = false;
    delay(100);
    
    if (nfc.begin()) {
      uint32_t versiondata = nfc.getFirmwareVersion();
      if (versiondata) {
        nfc.setPassiveActivationRetries(0xFF);
        nfc.SAMConfig();
        nfcInitialized = true;
        Serial.println("NFC reinitialized successfully!");
      }
    }
  }
  
  // Try to reinitialize LCD if it was lost
  #if LCD_ENABLED
  if (!lcdFound && lcdInitialized) {
    Serial.println("LCD connection lost - attempting reinitialize...");
    lcdInitialized = false;
    delay(100);
    
    lcd.init();
    lcd.backlight();
    lcdInitialized = true;
    Serial.println("LCD reinitialized successfully!");
  }
  #endif
  
  // Update system status based on diagnostic results
  if (!nfcFound || !lcdFound) {
    Serial.println("WARNING: Some I2C devices are not responding");
    Serial.println("Check connections and power supply");
  }
  
  Serial.println("=== Diagnostic Check Complete ===");
}

void resetConfig() {
  Config defaultConfig;
  config = defaultConfig;
  saveConfig();
  
  #if LCD_ENABLED
  if (lcdInitialized) {
    lcd.backlight();
  }
  #endif
  
  Serial.println("Configuration reset to defaults");
}