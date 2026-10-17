import { ProAIUnifiedProject, ArchitectureMaterialCalculation } from '../types';

/**
 * Standard Civil Engineering Material Calculation Algorithm
 * Computes:
 * - Bricks count based on wall volume minus doors/windows
 * - Mortar volume (25-30% of brickwork volume, dry volume factor 1.33)
 * - Cement (simit) bags (50kg per bag, 0.035 m3 per bag)
 * - Sand (cu. ft / m3 / metric tons / truckloads)
 * - Reinforced Concrete (RCC slabs & columns) with aggregate, sand, and steel
 */
export function calculateCivilMaterials(
  builtUpAreaSqFt: number,
  floors: number = 1,
  wallThicknessInches: number = 9,
  ceilingHeightFeet: number = 10,
  mortarRatio: string = '1:6 (Standard Masonry)',
  concreteGrade: string = 'M20 (1:1.5:3 RCC)'
): ArchitectureMaterialCalculation {
  const totalFloorAreaSqFt = builtUpAreaSqFt * floors;
  const totalFloorAreaSqM = totalFloorAreaSqFt * 0.092903;

  // Approximate wall length estimate (perimeter + partition walls ~ 1.4 * 4 * sqrt(area))
  const wallLengthFeet = Math.sqrt(builtUpAreaSqFt) * 4 * 1.35 * floors;
  const wallHeightFeet = ceilingHeightFeet;
  const wallThicknessFeet = wallThicknessInches / 12;

  // Total Wall Volume in Cubic Feet (subtract 15% for doors & windows openings)
  const grossWallVolumeCuFt = wallLengthFeet * wallHeightFeet * wallThicknessFeet;
  const netWallVolumeCuFt = grossWallVolumeCuFt * 0.85;
  const netWallVolumeCuM = netWallVolumeCuFt * 0.0283168;

  // Standard Brick Dimension without mortar: 190mm x 90mm x 90mm
  // With mortar (nominal): 200mm x 100mm x 100mm = 0.002 m3 per brick
  // Bricks per m3 of masonry = 500 bricks
  const bricksPerCuM = 500;
  const baseBrickCount = Math.round(netWallVolumeCuM * bricksPerCuM);
  const brickWastage = 0.05; // 5% breakage & cutting wastage
  const totalBricks = Math.round(baseBrickCount * (1 + brickWastage));

  // Mortar Calculation for Brickwork
  // Mortar wet volume is ~ 27% of masonry volume
  const wetMortarVolumeCuM = netWallVolumeCuM * 0.27;
  // Dry volume factor for mortar is 1.33
  const dryMortarVolumeCuM = wetMortarVolumeCuM * 1.33;

  // Ratio parsing (default 1:6 -> 1 part cement, 6 parts sand, sum = 7)
  let cementMortarParts = 1;
  let sandMortarParts = 6;
  if (mortarRatio.includes('1:4')) {
    cementMortarParts = 1;
    sandMortarParts = 4;
  } else if (mortarRatio.includes('1:5')) {
    cementMortarParts = 1;
    sandMortarParts = 5;
  }
  const totalMortarParts = cementMortarParts + sandMortarParts;

  // Cement in Brickwork Mortar
  const mortarCementVolumeCuM = (dryMortarVolumeCuM * cementMortarParts) / totalMortarParts;
  // 1 bag of 50kg cement = 0.035 m3 (~1.25 cu ft)
  const mortarCementBags = mortarCementVolumeCuM / 0.035;

  // Sand in Brickwork Mortar
  const mortarSandVolumeCuM = (dryMortarVolumeCuM * sandMortarParts) / totalMortarParts;
  const mortarSandVolumeCuFt = mortarSandVolumeCuM * 35.3147;

  // RCC Concrete Slab, Beams & Columns Calculation
  // Slab thickness ~ 5 inches (0.416 ft)
  const slabVolumeCuFt = totalFloorAreaSqFt * (5 / 12);
  // Beams and columns add ~ 35% of slab volume
  const totalConcreteVolumeCuFt = slabVolumeCuFt * 1.35;
  const totalConcreteVolumeCuM = totalConcreteVolumeCuFt * 0.0283168;

  // Dry volume factor for concrete is 1.54
  const dryConcreteVolumeCuM = totalConcreteVolumeCuM * 1.54;

  // M20 is 1:1.5:3 (total 5.5 parts) | M25 is 1:1:2 (total 4 parts)
  let cConcParts = 1;
  let sConcParts = 1.5;
  let aConcParts = 3;
  if (concreteGrade.includes('M25')) {
    cConcParts = 1;
    sConcParts = 1;
    aConcParts = 2;
  }
  const totalConcParts = cConcParts + sConcParts + aConcParts;

  const concreteCementVolumeCuM = (dryConcreteVolumeCuM * cConcParts) / totalConcParts;
  const concreteCementBags = concreteCementVolumeCuM / 0.035;

  const concreteSandVolumeCuM = (dryConcreteVolumeCuM * sConcParts) / totalConcParts;
  const concreteSandVolumeCuFt = concreteSandVolumeCuM * 35.3147;

  const concreteAggVolumeCuM = (dryConcreteVolumeCuM * aConcParts) / totalConcParts;
  const concreteAggVolumeCuFt = concreteAggVolumeCuM * 35.3147;

  // Combined Totals
  const totalCementBags = Math.round(mortarCementBags + concreteCementBags);
  const totalCementKg = totalCementBags * 50;
  const totalCementMetricTons = Number((totalCementKg / 1000).toFixed(2));

  const totalSandCuFt = Math.round(mortarSandVolumeCuFt + concreteSandVolumeCuFt);
  const totalSandCuM = Number((totalSandCuFt * 0.0283168).toFixed(2));
  // River/manufactured sand density ~ 1,600 kg/m3 = 1.6 tons/m3
  const totalSandMetricTons = Number((totalSandCuM * 1.6).toFixed(1));
  // 1 standard tipper truck holds approx 300 to 400 cubic feet of sand
  const sandTruckloads = Number((totalSandCuFt / 350).toFixed(1));

  // Steel reinforcement ~ 3.5 to 4.5 kg per sq ft of built-up area for residential/smart structures
  const steelKg = Math.round(totalFloorAreaSqFt * 4.0);
  const steelTons = Number((steelKg / 1000).toFixed(2));

  // Aggregate (Coarse gravel 20mm/10mm)
  const totalAggCuFt = Math.round(concreteAggVolumeCuFt);
  const totalAggTons = Number((totalAggCuFt * 0.0283168 * 1.55).toFixed(1));

  // Water requirement (water-cement ratio ~ 0.45 for concrete + curing)
  const waterLiters = Math.round(totalCementBags * 50 * 0.45 * 2.5);

  // Approximate cost models (India INR / US USD)
  // Cement: ~400 INR/bag ($8/bag)
  // Sand: ~55 INR/cu.ft ($1.50/cu.ft)
  // Bricks: ~9 INR/brick ($0.45/brick)
  // Steel: ~68 INR/kg ($1.10/kg)
  // Aggregate: ~45 INR/cu.ft ($1.10/cu.ft)
  const costINR = Math.round(
    totalCementBags * 410 +
    totalSandCuFt * 55 +
    totalBricks * 9.5 +
    steelKg * 70 +
    totalAggCuFt * 46
  );
  const costUSD = Math.round(costINR / 86);

  return {
    builtUpAreaSqFt,
    floors,
    wallThicknessInches,
    ceilingHeightFeet,
    mortarRatio,
    concreteGrade,
    sand: {
      cubicFeet: totalSandCuFt,
      cubicMeters: totalSandCuM,
      metricTons: totalSandMetricTons,
      truckloads: sandTruckloads,
      formula: `Mortar Sand (${Math.round(mortarSandVolumeCuFt)} cu.ft) + Concrete Sand (${Math.round(concreteSandVolumeCuFt)} cu.ft) based on Dry Volume Factor 1.33 & 1.54`
    },
    cement: {
      bags50kg: totalCementBags,
      metricTons: totalCementMetricTons,
      kg: totalCementKg,
      formula: `Brickwork Mortar (${Math.round(mortarCementBags)} bags) + Concrete Slab/Beams (${Math.round(concreteCementBags)} bags) [50kg / 0.035 m³ per bag]`
    },
    bricks: {
      totalUnits: totalBricks,
      standardSize: '190 mm × 90 mm × 90 mm (Standard Modular Brick)',
      wastagePercent: 5,
      formula: `Net wall volume (${netWallVolumeCuM.toFixed(1)} m³) × 500 bricks/m³ + 5% on-site breakage allowance`
    },
    steel: {
      kg: steelKg,
      tons: steelTons
    },
    aggregateGravel: {
      cubicFeet: totalAggCuFt,
      metricTons: totalAggTons
    },
    waterLiters,
    estimatedMaterialCostINR: costINR,
    estimatedMaterialCostUSD: costUSD
  };
}

export const PRO_AI_PROJECTS: ProAIUnifiedProject[] = [
  {
    id: 'aero-zenith-habitat',
    name: 'AeroZenith: Cyber-Physical Bioclimatic Smart Habitat',
    tagline: 'Autonomous Eco-Living Structure with Embedded Sensor Telemetry, Kinetic Louver Micro-Grid, and Zero-Carbon Building Envelope',
    visionAbstract: 'A groundbreaking multidisciplinary engineering project combining Electronics & Communication Engineering (ECE), Computer Science & Engineering (CSE), and Civil Architecture. The project integrates an intelligent physical structure with an embedded IoT mesh sensor network that monitors temperature, humidity, indoor air quality (CO2/VOC), and human occupancy. Microcontroller actuators control motorized kinetic facade panels to regulate solar glare and natural cross-ventilation. A high-throughput firmware stack and edge computing AI model processes micro-climatic telemetry to optimize energy efficiency, while civil architectural blueprints incorporate optimized thermal zoning and rigorous structural material calculations for sand, cement (simit), and bricks.',
    domainSynergy: {
      eceRole: 'Designs low-power sensor acquisition circuits, I2C/SPI bus multiplexing, solar MPPT battery management, optocoupled relay switching boards, and LoRa wireless telemetry nodes.',
      cseRole: 'Develops robust embedded C++ firmware, real-time edge AI inference algorithms, zero-latency sensor anomaly detection, cloud telemetry synchronization, and self-healing diagnostic error handlers.',
      archRole: 'Architects the passive solar floor plan, natural ventilation light wells, structural kinetic facade integration, and precise quantification of bricks, cement (simit), sand, and steel rebar.',
      unifiedValue: 'Reduces residential HVAC power consumption by 48%, eliminates thermal bridging, minimizes construction material wastage to under 3%, and provides autonomous self-healing monitoring for 50+ years.'
    },
    systemDesignBlueprint: {
      overallArchitecture: 'The habitat operates as a 3-tier cyber-physical architecture: 1) Physical Architectural Shell with Passive Thermal Mass & Kinetic Envelope, 2) Distributed ECE Sensor & Power Subsystem with Embedded Transceivers, and 3) CSE Edge-to-Cloud Analytics Core with Real-Time Closed-Loop Feedback Control.',
      subsystems: [
        {
          name: 'Kinetic Bioclimatic Façade & Shell',
          dept: 'ARCHITECTURE',
          description: 'Double-skin ventilated wall with motorized honeycomb louvers, green roof thermal insulation, and load-bearing masonry walls optimized for thermal inertia.'
        },
        {
          name: 'Distributed Sensor & Actuator Mesh Node (ECE-Node-01)',
          dept: 'ECE',
          description: 'Dual-core ESP32-S3 + STM32 ARM Cortex sensor node managing MQ-135, DHT22, light lux sensors, piezo footstep vibration harvesters, and 4-channel optoisolated relay drivers.'
        },
        {
          name: 'Solar MPPT & Supercapacitor Energy Hub',
          dept: 'ECE',
          description: 'Monocrystalline solar PV interface with buck-boost MPPT DC-DC converter, LiFePO4 battery BMS, and solid-state automatic grid-island transfer switch.'
        },
        {
          name: 'Edge AI Microclimate Inference Engine',
          dept: 'CSE',
          description: 'Runs lightweight TinyML neural model to forecast internal temperature delta 2 hours in advance and orchestrate kinetic louver angles and ceiling HVAC dampers.'
        },
        {
          name: 'Self-Healing Fault Tolerance & Diagnostic Bus',
          dept: 'CSE',
          description: 'Monitors sensor health, validates CRC checksums on the telemetry stream, recovers from bus hangs via hardware watchdog timers, and isolates faulty sensor lines.'
        },
        {
          name: 'Civil Structural Foundation & Material Matrix',
          dept: 'ARCHITECTURE',
          description: 'Seismically isolated raft foundation, M20 grade reinforced concrete framework, and 9-inch outer masonry envelope with engineered sand-to-cement mortar ratios.'
        }
      ]
    },
    advantages: [
      '48% Reduction in Net Building Energy: Autonomous kinetic solar tracking facade prevents thermal heat gain without active high-power air conditioning.',
      'Holistic Multidisciplinary Integration: Connects electrical circuits directly to structural elements, eliminating redundant wiring and secondary conduit retrofits.',
      'Precision Material Sourcing: Civil estimation algorithms eliminate 8-12% traditional construction over-ordering of sand, cement (simit), and bricks.',
      'Edge Resilient & Off-Grid Capable: Works 100% locally when grid or internet drops; uses LoRa mesh telemetry and local flash ring buffers.',
      'Zero-Latency Sensor Triggering: Hard real-time sensor processing (<15ms latency) prevents moisture build-up and ensures instant ventilation response.',
      'Predictive Maintenance: Continuous impedance and signal analysis flags degrading sensor lines or mechanical louver friction before failure occurs.'
    ],
    disadvantages: [
      'Higher Initial Capital Expenditure: Servo actuators, smart sensors, and double-skin facades increase upfront construction costs by 14-18% compared to standard concrete masonry.',
      'Interdisciplinary Labor Requirement: Requires technicians skilled in both civil electrical conduits and embedded firmware programming during site installation.',
      'Mechanical Louver Servicing: Exterior kinetic panels require semi-annual dust and lubricating maintenance in heavy sandstorm or coastal salt-air environments.',
      'Electronic Component Obsolescence: Sensor modules typically require recalibration or replacement every 7-10 years, requiring accessible conduit junction boxes in structural walls.'
    ],
    futureUpgrades: [
      'Integration of Transparent Perovskite Photovoltaic Window Glazing for additional 2.4 kW power harvesting.',
      'Autonomous Drone Docking port on roof for structural crack detection and automated facade cleaning.',
      'Quantum-safe LoRaWAN encryption handshake for municipal microgrid power trading.'
    ],
    ece: {
      title: 'Multichannel Bioclimatic IoT Sensor & Kinetic Actuator Circuit',
      summary: 'Central controller schematics featuring dual-core ESP32-S3 microcontroller, I2C/SPI environmental sensor array, isolated 12V kinetic servo power bus, and optical relay isolation.',
      workingPrinciple: 'The power distribution unit feeds 12V DC to kinetic servo actuators while stepping down through an ultra-low dropout buck regulator (LM2596 / AP63200) to 3.3V DC for the ESP32-S3 and analog sensors. Analog outputs from the MQ-135 air quality gas sensor pass through an active low-pass RC filter (10kΩ, 100nF) to reject 50/60Hz electromagnetic noise before reaching the 12-bit SAR ADC. The DHT22 digital temperature/humidity sensor transmits on a dedicated GPIO with a 4.7kΩ pull-up resistor. Optocouplers (PC817) provide 2.5kV galvanic isolation between the digital logic pins and the high-voltage 230V AC relay coils driving the backup HVAC and water pump.',
      schematicDescription: 'Schematic incorporates 6 primary functional nodes interconnected via SPI/I2C buses, analog channels, and isolated PWM motor driver lines.',
      voltageAndPowerSpecs: {
        operatingVoltage: '3.3V DC (Logic & Sensors) / 12V DC (Servos) / 230V AC (Relay Mains)',
        currentConsumption: '140mA (Idle Sensing) / 1.85A (Active Louver Adjustment)',
        backupSource: '12.8V 20Ah LiFePO4 Battery with MPPT Solar Charger'
      },
      nodes: [
        {
          id: 'node-pwr',
          label: 'Power Supply & BMS',
          sublabel: 'Solar MPPT + 12V/3.3V Buck',
          type: 'power',
          x: 12,
          y: 20,
          connectedTo: ['node-mcu', 'node-actuator'],
          details: 'Provides regulated 3.3V DC logic rail and 12V 5A motor rail with reverse polarity protection and TVS surge clamping diodes.',
          voltage: '12V / 3.3V'
        },
        {
          id: 'node-mcu',
          label: 'ESP32-S3 Dual-Core MCU',
          sublabel: '240MHz Tensilica + 8MB PSRAM',
          type: 'mcu',
          x: 48,
          y: 40,
          connectedTo: ['node-sensors', 'node-actuator', 'node-lora', 'node-relays'],
          details: 'Core 0 runs FreeRTOS sensor sampling and ADC calibration; Core 1 executes edge inference and kinetic servo trajectory calculations.',
          voltage: '3.3V'
        },
        {
          id: 'node-sensors',
          label: 'Environmental Sensor Array',
          sublabel: 'DHT22 + MQ-135 + Lux + Ultrasonic',
          type: 'sensor',
          x: 18,
          y: 70,
          connectedTo: ['node-mcu'],
          details: 'Samples ambient temperature, relative humidity, air quality index (AQI), solar lux, and greywater cistern depth every 1,000ms.',
          voltage: '3.3V / 5V'
        },
        {
          id: 'node-actuator',
          label: 'Kinetic Louver Servo Array',
          sublabel: 'MG996R Metal Gear (11kg/cm)',
          type: 'actuator',
          x: 82,
          y: 22,
          connectedTo: ['node-mcu', 'node-pwr'],
          details: '4x high-torque digital PWM servos rotating external facade louvers from 0° (fully closed) to 90° (maximum natural airflow).',
          voltage: '12V / 6V'
        },
        {
          id: 'node-relays',
          label: 'Optocoupled Relays (4-Ch)',
          sublabel: 'PC817 Opto + 230V 10A Switching',
          type: 'actuator',
          x: 82,
          y: 65,
          connectedTo: ['node-mcu'],
          details: 'Switches high-voltage thermal damper motors, greywater aeration pumps, and grid cutover contacts with flyback diode protection.',
          voltage: '5V / 230V AC'
        },
        {
          id: 'node-lora',
          label: 'LoRa SX1278 RF Transceiver',
          sublabel: '868/915 MHz Long-Range Bridge',
          type: 'network',
          x: 50,
          y: 88,
          connectedTo: ['node-mcu'],
          details: 'Transmits encrypted telemetry packets up to 8 km to the central district building management base station over SPI bus.',
          voltage: '3.3V'
        }
      ],
      components: [
        {
          name: 'ESP32-S3-WROOM-1-N8R8',
          category: 'Microcontroller',
          specs: 'Xtensa Dual-Core 32-bit LX7 @ 240MHz, 8MB Flash, 8MB PSRAM, Wi-Fi 4 + BLE 5',
          pinConnections: 'GPIO 4 (DHT22), GPIO 5 (MQ135 ADC), GPIO 17/18 (I2C SDA/SCL), GPIO 19-22 (PWM Servos)',
          roleInProject: 'Main cyber-physical edge computing controller managing sensor sampling, motor kinematics, and wireless protocols.'
        },
        {
          name: 'MQ-135 Gas & Air Quality Sensor',
          category: 'Sensor',
          specs: 'High sensitivity to Ammonia, NOx, Alcohol, Benzene, Smoke, CO2 (10 - 1000 ppm)',
          pinConnections: 'VCC -> 5V, GND -> GND, AOUT -> GPIO 34 (through voltage divider to 3.3V)',
          roleInProject: 'Detects indoor air degradation to trigger natural purge ventilation through facade louvers.'
        },
        {
          name: 'DHT22 / AM2302 Precision Sensor',
          category: 'Sensor',
          specs: 'Temperature -40°C to +80°C (±0.5°C), Humidity 0-100% RH (±2% RH)',
          pinConnections: 'VCC -> 3.3V, DATA -> GPIO 4 with 4.7kΩ pullup, GND -> GND',
          roleInProject: 'Monitors micro-climatic comfort index and calculates dew point to prevent condensation.'
        },
        {
          name: 'MG996R Metal Gear Digital Servo',
          category: 'Actuator',
          specs: 'Stall Torque 11 kg/cm @ 6V, 0.17 sec/60°, Dual Ball Bearings, Metal Gears',
          pinConnections: 'Signal -> GPIO 19 (PWM Timer 0), V+ -> 6V 3A step-down, GND -> Common GND',
          roleInProject: 'Physically rotates exterior architectural kinetic louvers to shield direct solar thermal irradiance.'
        },
        {
          name: 'PC817 Optocoupler 4-Channel Relay Board',
          category: 'Actuator',
          specs: '4x Songle SRD-05VDC-SL-C Relays, 10A 250V AC contact rating, 5kV optical isolation',
          pinConnections: 'IN1-IN4 -> GPIO 12-15, VCC -> 5V, JD-VCC -> Relay Power Supply',
          roleInProject: 'Safely switches 230V mains HVAC bypass and greywater sub-pumps without inductive spikes back to MCU.'
        },
        {
          name: 'SX1278 LoRa SPI Transceiver',
          category: 'Communication',
          specs: '433/868 MHz FSK/OOK/LoRa, +20 dBm output, -148 dBm sensitivity, SPI interface',
          pinConnections: 'NSS -> GPIO 10, MOSI -> GPIO 11, MISO -> GPIO 13, SCK -> GPIO 12, RST -> GPIO 9',
          roleInProject: 'Broadcasts low-power long-distance structural health and telemetry packets to city grid.'
        }
      ],
      signalFlowSteps: [
        'Step 1: Environmental sensors (MQ-135, DHT22, Lux) sample air quality, thermal levels, and light levels every 1,000ms.',
        'Step 2: Analog signals undergo RC filtering and are digitized via the ESP32 calibrated 12-bit SAR ADC with attenuation curve 11dB.',
        'Step 3: Core 0 computes heat index, particulate ppm, and solar incidence vector; feeds telemetry queue via FreeRTOS IPC.',
        'Step 4: Core 1 evaluates bioclimatic control algorithm; if solar lux > 45,000 lux and room temp > 24°C, calculates louver angle = 65°.',
        'Step 5: PWM hardware timers emit 50Hz pulses (1.0ms - 2.0ms duty cycle) to reposition MG996R kinetic servos smoothly over 3 seconds.',
        'Step 6: If air quality MQ-135 > 350 ppm, triggers Optocoupler Relay 1 to power on ceiling cross-ventilation intake damper.',
        'Step 7: SX1278 packetizes encrypted payload (JSON/CBOR) with CRC16 and transmits over 868MHz LoRa link.'
      ]
    },
    cse: {
      title: 'AeroZenith Firmware, Edge Intelligence & Fault Handler',
      architectureOverview: 'The CSE firmware operates an asynchronous FreeRTOS kernel on dual-core ESP32-S3. Includes sensor calibration, kinetic trajectory generation, watchdog task supervision, and an automated Error Diagnostics engine.',
      modules: [
        {
          language: 'cpp',
          filename: 'AeroZenith_Firmware_Main.ino',
          purpose: 'Main real-time operating system task loop with sensor polling, servo control, and error detection logic.',
          code: `#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

// Pin Definitions
#define PIN_DHT22         4
#define PIN_MQ135_ADC     34
#define PIN_SERVO_LOUVER  19
#define PIN_RELAY_VENT    12
#define PIN_STATUS_LED    2

// Operational Thresholds
#define TEMP_THRESHOLD_HIGH  28.5  // Celsius
#define AQI_THRESHOLD_ALERT  320   // PPM
#define SERVO_CLOSED_ANGLE   0
#define SERVO_OPTIMAL_ANGLE  65
#define SERVO_MAX_VENT_ANGLE 90

struct SystemTelemetry {
  float temperature;
  float humidity;
  int airQualityPPM;
  int louverAngle;
  bool ventilationRelayActive;
  uint32_t uptimeSeconds;
  uint16_t errorCode;
};

SystemTelemetry g_telemetry = { 24.0, 52.0, 180, 0, false, 0, 0 };

void setup() {
  Serial.begin(115200);
  delay(500);
  
  pinMode(PIN_STATUS_LED, OUTPUT);
  pinMode(PIN_RELAY_VENT, OUTPUT);
  pinMode(PIN_SERVO_LOUVER, OUTPUT);
  digitalWrite(PIN_RELAY_VENT, LOW);
  
  Serial.println("=================================================");
  Serial.println("PRO AI - AeroZenith Cyber-Physical Firmware v2.4");
  Serial.println("Dual-Core ESP32-S3 RTOS System Initialized");
  Serial.println("=================================================");
}

void loop() {
  // Read simulated sensor data from ECE hardware bus
  g_telemetry.uptimeSeconds = millis() / 1000;
  g_telemetry.temperature = 24.0 + 4.5 * sin(g_telemetry.uptimeSeconds * 0.05);
  g_telemetry.humidity = 50.0 + 8.0 * cos(g_telemetry.uptimeSeconds * 0.03);
  int rawADC = analogRead(PIN_MQ135_ADC);
  g_telemetry.airQualityPPM = map(rawADC, 0, 4095, 120, 550);

  // Bioclimatic Decision Algorithm
  if (g_telemetry.temperature > TEMP_THRESHOLD_HIGH) {
    g_telemetry.louverAngle = SERVO_OPTIMAL_ANGLE; // Angle kinetic panels to shade sun
  } else {
    g_telemetry.louverAngle = SERVO_CLOSED_ANGLE;
  }

  // Air Quality Purge Trigger
  if (g_telemetry.airQualityPPM > AQI_THRESHOLD_ALERT) {
    g_telemetry.ventilationRelayActive = true;
    digitalWrite(PIN_RELAY_VENT, HIGH);
  } else {
    g_telemetry.ventilationRelayActive = false;
    digitalWrite(PIN_RELAY_VENT, LOW);
  }

  // Telemetry Packet Stream
  Serial.print("[TELEMETRY] T:");
  Serial.print(g_telemetry.temperature, 1);
  Serial.print("C | H:");
  Serial.print(g_telemetry.humidity, 1);
  Serial.print("% | AQI:");
  Serial.print(g_telemetry.airQualityPPM);
  Serial.print("ppm | Louver:");
  Serial.print(g_telemetry.louverAngle);
  Serial.print("deg | Damper:");
  Serial.println(g_telemetry.ventilationRelayActive ? "ACTIVE" : "STANDBY");

  digitalWrite(PIN_STATUS_LED, HIGH);
  delay(100);
  digitalWrite(PIN_STATUS_LED, LOW);
  delay(900);
}`,
          buggyCodeSample: `#include <Arduino.h>

#define PIN_SERVO_LOUVER 19
#define PIN_MQ135_ADC    34

int sensorHistory[5]; // Fixed buffer of 5 items
int sampleCount = 0;

void loop() {
  // BUG 1: Array Index Out of Bounds Memory Corruption
  // When sampleCount >= 5, writes outside array boundary causing CPU kernel panic
  sensorHistory[sampleCount] = analogRead(PIN_MQ135_ADC);
  sampleCount++;

  // BUG 2: Zero-Division Crash in Moving Average Calculation
  int totalSamples = 0; // Uninitialized counter
  float averageReading = (float)sensorHistory[0] / totalSamples; // CRASH: Division by Zero!

  Serial.println(averageReading);
  delay(1000);
}`,
          simulatedError: {
            errorType: 'Kernel Panic (LoadProhibited / ZeroDivisionError)',
            errorMessage: 'Guru Meditation Error: Core 0 panic\'ed (IntegerDivideByZero & BufferOverflow at 0x400812b4)',
            line: 14,
            explanation: 'Two fatal runtime faults detected: 1) `sampleCount` increments indefinitely without boundary checking, overflowing `sensorHistory[5]` and corrupting stack frames. 2) Variable `totalSamples` is hardcoded to 0 before executing division `sensorHistory[0] / totalSamples`, triggering hardware divide-by-zero interrupt.',
            solutionDiff: `// PRO AI Patch applied:
const int BUFFER_SIZE = 5;
int sensorHistory[BUFFER_SIZE];
int sampleCount = 0;

void loop() {
  // Ring buffer index wrapping prevents overflow
  int index = sampleCount % BUFFER_SIZE;
  sensorHistory[index] = analogRead(PIN_MQ135_ADC);
  sampleCount++;

  // Guard against zero division
  int safeCount = min(sampleCount, BUFFER_SIZE);
  int sum = 0;
  for(int i = 0; i < safeCount; i++) sum += sensorHistory[i];
  float averageReading = (safeCount > 0) ? ((float)sum / safeCount) : 0.0;

  Serial.println(averageReading);
  delay(1000);
}`
          }
        },
        {
          language: 'python',
          filename: 'edge_bioclimatic_agent.py',
          purpose: 'Python Edge Intelligence script running on local gateway to calculate solar azimuth and predict HVAC thermal loads.',
          code: `import math
import time
import json

class BioclimaticEdgeAgent:
    def __init__(self, latitude=13.0827, longitude=80.2707):
        self.latitude = latitude
        self.longitude = longitude
        self.target_temp_c = 23.5
        self.comfort_band = 1.5

    def calculate_solar_incidence(self, hour_of_day):
        """Calculates solar zenith angle for facade shading optimization"""
        solar_declination = 23.45 * math.sin(math.radians((284 + 180) * 360 / 365))
        hour_angle = (hour_of_day - 12) * 15
        cos_zenith = (math.sin(math.radians(self.latitude)) * math.sin(math.radians(solar_declination)) +
                      math.cos(math.radians(self.latitude)) * math.cos(math.radians(solar_declination)) * math.cos(math.radians(hour_angle)))
        zenith_angle = math.degrees(math.acos(max(-1.0, min(1.0, cos_zenith))))
        return max(0.0, 90.0 - zenith_angle)

    def compute_optimal_louver_angle(self, solar_elevation, indoor_temp, outdoor_temp):
        """Dynamic louver tracking formula"""
        if solar_elevation <= 5.0:
            return 0  # Night or horizon - fully open for natural ventilation
        
        thermal_differential = indoor_temp - self.target_temp_c
        if thermal_differential > self.comfort_band:
            # Overheating: block direct incident radiation
            optimal_angle = min(85, max(30, int(solar_elevation * 1.1)))
            return optimal_angle
        else:
            # Passive winter/morning solar heating mode
            return max(15, int(solar_elevation * 0.4))

if __name__ == "__main__":
    agent = BioclimaticEdgeAgent()
    print("PRO AI - Edge Bioclimatic Thermal Optimizer Online")
    for hour in range(8, 18, 2):
        elevation = agent.calculate_solar_incidence(hour)
        angle = agent.compute_optimal_louver_angle(elevation, indoor_temp=26.2, outdoor_temp=33.0)
        print(f"Time: {hour:02d}:00 | Solar Elevation: {elevation:.1f}° -> Louver Angle: {angle}°")`,
          buggyCodeSample: `def compute_optimal_louver_angle(solar_elevation, indoor_temp):
    # BUG: TypeError when comparing string to float
    comfort_threshold = "24.5"
    if indoor_temp > comfort_threshold: # CRASH: TypeError: '>' not supported between instances of 'float' and 'str'
        return solar_elevation * 1.1
    return 0`,
          simulatedError: {
            errorType: 'TypeError (Type Inconsistency)',
            errorMessage: 'TypeError: \'>\' not supported between instances of \'float\' and \'str\' at line 4',
            line: 4,
            explanation: 'Variable `comfort_threshold` is assigned as string `"24.5"` instead of numeric float `24.5`. Comparing float `indoor_temp` against string triggers Python TypeError exception.',
            solutionDiff: `# PRO AI Patch:
comfort_threshold = 24.5 # Convert string literal to float`
          }
        }
      ]
    },
    architecture: {
      title: 'Bioclimatic Thermal Zoning & Precise Civil Material Estimation',
      conceptVision: 'The architectural design revolves around passive climatic envelope strategies: North-South building orientation to eliminate harsh western glare, a central stack-ventilation atrium creating negative thermal buoyancy, integrated concrete thermal mass walls to dampen diurnal temperature swings, and an integrated kinetic louver envelope.',
      structuralLayout: {
        zones: [
          {
            name: 'Central Stack-Ventilation Atrium',
            dimensions: '20 ft × 15 ft (300 sq.ft)',
            purpose: 'Acts as the thermal lung of the habitat, drawing cool air from subterranean tubes and exhausting hot air through motorized skylight dampers.',
            sensorPlacement: 'Ultrasonic air-velocity transmitter and temperature gradient probes mounted at 0m, 3m, and 6m vertical intervals.',
            constructionDetails: 'Reinforced concrete perimeter columns (M20 grade) with double-glazed low-E safety glass curtain wall.'
          },
          {
            name: 'Kinetic Living & Working Pods',
            dimensions: '35 ft × 25 ft (875 sq.ft)',
            purpose: 'Primary occupant zone surrounded by 9-inch load-bearing brick walls with external kinetic louver brackets anchored directly into the structural lintels.',
            sensorPlacement: 'MQ-135 air quality gas sensors at breathing height (1.5m) and PIR human presence detectors at corner bulkheads.',
            constructionDetails: 'Traditional modular clay masonry (190×90×90mm) with 1:6 cement-sand mortar, finished with 12mm lime-pozzolana plaster.'
          },
          {
            name: 'Subterranean Utility & Battery Vault',
            dimensions: '18 ft × 18 ft (324 sq.ft)',
            purpose: 'Houses LiFePO4 battery banks, solar inverters, greywater bio-filtration tanks, and high-voltage optocoupled relay panels.',
            sensorPlacement: 'Water level ultrasonic transceivers, ambient hydrogen/thermal runaway detectors, and flood sensors.',
            constructionDetails: 'Waterproofed RCC retaining wall with 1:1.5:3 concrete mix and continuous water-stop PVC membranes.'
          }
        ],
        sustainabilityFeatures: [
          'Kinetic Honeycomb Louver Facade reducing direct solar heat gain coefficient (SHGC) from 0.72 to 0.28.',
          'Rooftop Rainwater Harvesting reservoir with 18,000 liter cistern and embedded turbidity monitoring.',
          'Cross-ventilated floor plate with window-to-wall ratio (WWR) optimized at 32% on north facade and 18% on south facade.',
          'Fly-ash pozzolanic cement replacing 30% Ordinary Portland Cement (OPC) to reduce embodied carbon footprint by 28%.'
        ],
        passiveBioclimaticStrategies: [
          'Stack Effect: Warm stale air rises through the central 2-story atrium and exits through automated clerestory louvers.',
          'Thermal Mass Inertia: 9-inch thick brick walls absorb daytime solar heat and radiate it inward during cool desert/monsoon nights.',
          'Wind Funneling: Geometric overhangs deflect prevailing seasonal breezes into ground-level acoustic louvers.'
        ]
      },
      defaultMaterialEstimates: calculateCivilMaterials(1500, 1, 9, 10, '1:6 (Standard Masonry)', 'M20 (1:1.5:3 RCC)')
    }
  },
  {
    id: 'geo-shield-tower',
    name: 'GeoShield: Seismic-Resilient Kinetic Tower with IoT Dampers',
    tagline: 'High-Rise Structural Vibration Dissipation System with ECE Accelerometer Feedback, CSE Real-Time Active Tuned Mass Damper (TMD) Control, and High-Strength Civil Reinforcement',
    visionAbstract: 'A high-consequence tri-department project addressing earthquake disaster resilience. ECE delivers high-g tri-axial MEMS accelerometers, linear variable differential transformers (LVDTs), and heavy hydraulic proportional valve drivers. CSE implements an active tuned mass damper (TMD) algorithm running Kalman filter state estimation with sub-5ms control response and automated hardware fault recovery. ARCHITECTURE designs the central structural core, outrigger truss bays, and exact material measurement for high-strength reinforced concrete, sand, cement, and bricks.',
    domainSynergy: {
      eceRole: 'Piezoelectric seismic wave sensors, high-frequency CAN bus telemetry network, 24V hydraulic solenoid proportional drivers.',
      cseRole: 'Real-time Kalman filtering, active damper PID closed-loop control, seismic event telemetry logging, and automated failure mitigation.',
      archRole: 'Central shear wall core engineering, outrigger column sizing, and deep foundation material budgeting for cement, sand, and masonry infill.',
      unifiedValue: 'Reduces lateral earthquake deflection by 68% during Richter 7.5+ seismic events while preventing catastrophic building resonance.'
    },
    systemDesignBlueprint: {
      overallArchitecture: 'Central concrete shear wall core housing a 50-ton hydraulic tuned mass damper at the 18th floor, wired to tri-axial MEMS accelerometers at every 3 floors via redundant CAN-FD bus.',
      subsystems: [
        { name: 'TMD Seismic Counter-Mass', dept: 'ARCHITECTURE', description: 'Reinforced concrete pendulum mass suspended in central core with hydraulic dampening cylinders.' },
        { name: 'Tri-Axial MEMS Accelerometer Network', dept: 'ECE', description: 'ADXL355 ultra-low noise sensors reading structural micro-strains at 1,000 Hz.' },
        { name: 'Real-Time Hydraulic Damper Controller', dept: 'CSE', description: 'Embedded C++ control loop calculating counter-force vectors to neutralize resonant shear waves.' }
      ]
    },
    advantages: [
      'Reduces structural displacement by up to 68% during seismic shocks.',
      'Prevents structural cracking and glass facade shatter.',
      'Real-time automated post-quake structural integrity report.'
    ],
    disadvantages: [
      'High hydraulic pump maintenance requirements.',
      'Requires dedicated high-power emergency generator backup.'
    ],
    futureUpgrades: [
      'Magnetorheological (MR) fluid dampening for instant millisecond viscosity modulation.'
    ],
    ece: {
      title: 'Seismic Accelerometer Sensor & Hydraulic Driver Network',
      summary: 'Low-noise ADXL355 accelerometer modules interfaced with STM32F407 via CAN bus to drive proportional hydraulic valves.',
      workingPrinciple: 'Ground acceleration triggers differential analog voltage shift in capacitive MEMS finger arrays. Signals are converted via 20-bit Sigma-Delta ADC and sent across fault-tolerant CAN-FD bus to the central TMD controller.',
      schematicDescription: 'High-speed differential bus with 120Ω termination resistors, optoisolated valve drivers, and redundant 24V UPS batteries.',
      voltageAndPowerSpecs: {
        operatingVoltage: '24V DC (Hydraulics) / 5V (CAN) / 3.3V (MCU)',
        currentConsumption: '4.2A Peak during active counter-stroke',
        backupSource: 'Dual 24V 100Ah AGM Deep Cycle Banks'
      },
      nodes: [
        { id: 'n1', label: 'Base Seismometer', sublabel: 'Tri-axial ADXL355', type: 'sensor', x: 20, y: 75, connectedTo: ['n2'], details: 'Measures P and S wave ground velocity.', voltage: '3.3V' },
        { id: 'n2', label: 'Central TMD Controller', sublabel: 'STM32F407 168MHz', type: 'mcu', x: 50, y: 40, connectedTo: ['n3', 'n4'], details: 'Executes Kalman state estimation.', voltage: '3.3V' },
        { id: 'n3', label: 'Hydraulic Proportional Valves', sublabel: '4x Moog Servo Valves', type: 'actuator', x: 80, y: 25, connectedTo: ['n2'], details: 'Controls 200 bar hydraulic fluid stroke.', voltage: '24V' },
        { id: 'n4', label: 'CAN-FD Bus Transceiver', sublabel: 'MCP2562FD 8Mbps', type: 'network', x: 50, y: 80, connectedTo: ['n2'], details: 'Multi-node backbone across 24 stories.', voltage: '5V' }
      ],
      components: [
        { name: 'ADXL355 Accelerometer', category: 'Sensor', specs: '±2g/±4g/±8g, 22.5µg/√Hz noise density', pinConnections: 'SPI / I2C to STM32', roleInProject: 'Captures subtle ground acceleration.' },
        { name: 'STM32F407VGT6 ARM Cortex-M4', category: 'Microcontroller', specs: '168MHz, FPU, DSP Instructions, 1MB Flash', pinConnections: 'Full CAN and DAC channels', roleInProject: 'Executes active dampening matrix in real time.' },
        { name: 'Proportional Hydraulic Valve', category: 'Actuator', specs: '200 bar operating pressure, 40ms response', pinConnections: 'Driven by PWM power MOSFET H-bridge', roleInProject: 'Displaces TMD counter-mass against sway.' }
      ],
      signalFlowSteps: [
        'P-wave detected at basement accelerometer.',
        'CAN message dispatched to 18th floor TMD within 2ms.',
        'Kalman filter projects building natural oscillation peak.',
        'Hydraulic cylinder applies inverse counter-pressure to damp resonance.'
      ]
    },
    cse: {
      title: 'Active Tuned Mass Damper Kalman State Control',
      architectureOverview: 'Real-time deterministic C++ control software with state observer and watchdog error supervision.',
      modules: [
        {
          language: 'cpp',
          filename: 'GeoShield_TMD_Controller.cpp',
          purpose: 'Kalman filtering and active proportional hydraulic stroke calculation.',
          code: `#include <iostream>
#include <cmath>

struct SeismicState {
    float displacement;
    float velocity;
    float acceleration;
};

class ActiveTMDController {
private:
    float mass_kg = 50000.0; // 50-ton damper
    float stiffness_k = 120000.0;
    float damping_c = 8500.0;

public:
    float computeCounterForce(SeismicState state) {
        // PID-based counter-force calculation
        float force = -(stiffness_k * state.displacement + damping_c * state.velocity);
        // Clamp force to hydraulic maximum (150 kN)
        if (force > 150000.0) force = 150000.0;
        if (force < -150000.0) force = -150000.0;
        return force;
    }
};

int main() {
    ActiveTMDController controller;
    SeismicState mockQuake = { 0.045, 0.22, 1.8 }; // 45mm displacement, 1.8 m/s2
    float counterForce = controller.computeCounterForce(mockQuake);
    std::cout << "[GEOSHIELD TMD] Counter-Force Applied: " << counterForce / 1000.0 << " kN" << std::endl;
    return 0;
}`,
          buggyCodeSample: `float computeHydraulicPressure(float force, float cylinderArea) {
    // BUG: Unchecked cylinderArea can cause divide by zero
    return force / cylinderArea; // Crash if area == 0
}`,
          simulatedError: {
            errorType: 'SIGFPE (Floating Point Exception)',
            errorMessage: 'Fatal: Division by zero in computeHydraulicPressure(force, 0.0f)',
            line: 3,
            explanation: 'When hydraulic calibration fails, `cylinderArea` is passed as 0.0, causing catastrophic floating point divide-by-zero crash in safety-critical code.',
            solutionDiff: `if (cylinderArea <= 0.0001f) {
    std::cerr << "Warning: Invalid cylinder area! Defaulting to safety baseline." << std::endl;
    cylinderArea = 0.025f; // 250 cm2 default piston area
}
return force / cylinderArea;`
          }
        }
      ]
    },
    architecture: {
      title: 'Seismic Core Shear Wall & Material Quantities',
      conceptVision: 'Reinforced concrete core design with ductile moment-resisting exterior frames and high-damping elastomeric base isolators.',
      structuralLayout: {
        zones: [
          { name: 'Core Shear Wall Tube', dimensions: '30 ft × 30 ft', purpose: 'Resists 85% of lateral wind and seismic moments.', sensorPlacement: 'Embedded fiber-optic strain gauges.', constructionDetails: 'M35 grade high-performance concrete with 25mm TMT rebar.' },
          { name: 'Perimeter Ductile Frame', dimensions: '100 ft × 80 ft', purpose: 'Carries gravity loads and provides redundant ductility.', sensorPlacement: 'Corner displacement transducers.', constructionDetails: 'Composite steel-concrete columns with AAC block partition walls.' }
        ],
        sustainabilityFeatures: ['Post-tensioned slabs reducing concrete volume by 22%'],
        passiveBioclimaticStrategies: ['Aerodynamic curved exterior corners to reduce vortex shedding by 35%']
      },
      defaultMaterialEstimates: calculateCivilMaterials(3500, 3, 9, 11, '1:4 (Rich Masonry)', 'M25 (1:1:2 RCC)')
    }
  }
];
