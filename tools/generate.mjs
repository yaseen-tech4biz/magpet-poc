/**
 * Magpet POC — Synthetic Data Generator
 * Seeded random for reproducible output.
 * Run: node tools/generate.mjs
 * Output: src/data/*.json
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'data');
mkdirSync(OUT, { recursive: true });

// ── Seeded PRNG (mulberry32) ──
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260921); // seed: demo date

function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function randFloat(min, max) { return +(min + rand() * (max - min)).toFixed(2); }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ── Date helpers ──
const TODAY = new Date('2026-09-11');
function daysAgo(n) { const d = new Date(TODAY); d.setDate(d.getDate() - n); return d; }
function fmtDate(d) { return d.toISOString().slice(0, 10); }
function fmtTime(d) { return d.toISOString().slice(11, 16); }
function addHours(d, h) { return new Date(d.getTime() + h * 3600000); }
function addMinutes(d, m) { return new Date(d.getTime() + m * 60000); }

// ═══════════════════════════════════════════════════════
// MODULE A — Kharagpur Unit 3, rPET Resin
// ═══════════════════════════════════════════════════════

// ── 6.1 Asset Registry ──
const assets = [
  { code: 'BO-01', name: 'Bale opener', criticality: 'High', notes: 'Front of line' },
  { code: 'WL-01', name: 'Herbold Meckesheim washing line', criticality: 'High', notes: 'Sub-systems: pre-wash, friction washers, float-sink tank, rinse', subSystems: ['pre-wash', 'friction washers', 'float-sink tank', 'rinse'] },
  { code: 'MS-01', name: 'Metal separator', criticality: 'Medium', notes: '' },
  { code: 'DR-01', name: 'Flake dryer 1', criticality: 'Medium', notes: '' },
  { code: 'DR-02', name: 'Flake dryer 2', criticality: 'Medium', notes: '' },
  { code: 'EX-01', name: 'Coperion extruder 1', criticality: 'High', notes: '' },
  { code: 'EX-02', name: 'Coperion extruder 2', criticality: 'High', notes: 'Carries the planted gearbox story' },
  { code: 'SSP-01', name: 'SSP reactor', criticality: 'High', notes: 'Solid state polycondensation' },
  { code: 'GR-01', name: 'Granulator', criticality: 'Medium', notes: '' },
  { code: 'CH-01', name: 'Chiller 1', criticality: 'Medium', notes: 'Utilities' },
  { code: 'CH-02', name: 'Chiller 2', criticality: 'Medium', notes: 'Utilities' },
  { code: 'AC-01', name: 'Air compressor', criticality: 'Medium', notes: 'Utilities' },
  { code: 'CV-01', name: 'Conveyor 1', criticality: 'Low', notes: '' },
  { code: 'CV-02', name: 'Conveyor 2', criticality: 'Low', notes: '' },
  { code: 'CV-03', name: 'Conveyor 3', criticality: 'Low', notes: '' },
  { code: 'CV-04', name: 'Conveyor 4', criticality: 'Low', notes: '' },
  { code: 'ETP-01', name: 'Effluent treatment pumps', criticality: 'Low', notes: 'Washing line effluent' },
];

// ── 6.2 Technicians ──
const technicians = [
  { id: 'T1', name: 'Ramesh', trade: 'mechanical', phone: '9876500101' },
  { id: 'T2', name: 'Prakash', trade: 'mechanical', phone: '9876500102' },
  { id: 'T3', name: 'Sunil', trade: 'mechanical', phone: '9876500103' },
  { id: 'T4', name: 'Bikash', trade: 'electrical', phone: '9876500104' },
  { id: 'T5', name: 'Joydeep', trade: 'electrical', phone: '9876500105' },
  { id: 'T6', name: 'Amit', trade: 'electrical', phone: '9876500106' },
  { id: 'T7', name: 'Manoj', trade: 'utilities', phone: '9876500107' },
  { id: 'T8', name: 'Debashis', trade: 'utilities', phone: '9876500108' },
];

// Shift rotation: week number determines shift assignment
const shifts = ['A', 'B', 'C'];
const shiftTimes = { A: { start: '06:00', end: '14:00' }, B: { start: '14:00', end: '22:00' }, C: { start: '22:00', end: '06:00' } };

function getTechShift(techIndex, dayOffset) {
  const weekNum = Math.floor(dayOffset / 7);
  return shifts[(techIndex + weekNum) % 3];
}

// ── 6.3 PM Templates ──
const causeCodes = ['bearing failure', 'gearbox', 'heater band', 'sensor fault', 'blockage', 'electrical trip', 'hydraulic leak', 'belt damage'];
const spares = ['bearing SKF 6205', 'gearbox oil 20L', 'heater band 2kW', 'proximity sensor', 'screen mesh 80', 'contactor 40A', 'hydraulic seal kit', 'V-belt B68', 'filter cartridge', 'coupling spider'];

const pmTemplates = [
  { id: 'PM-001', asset: 'BO-01', task: 'Blade inspection and sharpening', type: 'calendar', intervalDays: 14, trade: 'mechanical' },
  { id: 'PM-002', asset: 'BO-01', task: 'Hydraulic system check', type: 'calendar', intervalDays: 30, trade: 'mechanical' },
  { id: 'PM-003', asset: 'WL-01', task: 'Friction washer bearing greasing', type: 'calendar', intervalDays: 15, trade: 'mechanical' },
  { id: 'PM-004', asset: 'WL-01', task: 'Float sink tank density check', type: 'calendar', intervalDays: 3, trade: 'mechanical' },
  { id: 'PM-005', asset: 'WL-01', task: 'Pre-wash screen cleaning', type: 'calendar', intervalDays: 7, trade: 'mechanical' },
  { id: 'PM-006', asset: 'MS-01', task: 'Metal separator calibration', type: 'calendar', intervalDays: 30, trade: 'electrical' },
  { id: 'PM-007', asset: 'MS-01', task: 'Sensor alignment check', type: 'calendar', intervalDays: 14, trade: 'electrical' },
  { id: 'PM-008', asset: 'DR-01', task: 'Dryer filter inspection', type: 'runtime', runtimeHours: 168, trade: 'mechanical' },
  { id: 'PM-009', asset: 'DR-01', task: 'Temperature calibration', type: 'calendar', intervalDays: 30, trade: 'electrical' },
  { id: 'PM-010', asset: 'DR-02', task: 'Dryer filter inspection', type: 'runtime', runtimeHours: 168, trade: 'mechanical' },
  { id: 'PM-011', asset: 'EX-01', task: 'Screen changer inspection', type: 'calendar', intervalDays: 7, trade: 'mechanical' },
  { id: 'PM-012', asset: 'EX-01', task: 'Barrel heater check', type: 'calendar', intervalDays: 14, trade: 'electrical' },
  { id: 'PM-013', asset: 'EX-02', task: 'Screen changer inspection', type: 'calendar', intervalDays: 7, trade: 'mechanical' },
  { id: 'PM-014', asset: 'EX-02', task: 'Gearbox oil check', type: 'runtime', runtimeHours: 500, trade: 'mechanical' },
  { id: 'PM-015', asset: 'EX-02', task: 'Barrel heater check', type: 'calendar', intervalDays: 14, trade: 'electrical' },
  { id: 'PM-016', asset: 'SSP-01', task: 'Rotary valve lubrication', type: 'runtime', runtimeHours: 500, trade: 'mechanical' },
  { id: 'PM-017', asset: 'SSP-01', task: 'Vacuum pump inspection', type: 'calendar', intervalDays: 21, trade: 'mechanical' },
  { id: 'PM-018', asset: 'GR-01', task: 'Blade gap adjustment', type: 'calendar', intervalDays: 14, trade: 'mechanical' },
  { id: 'PM-019', asset: 'GR-01', task: 'Screen mesh replacement', type: 'runtime', runtimeHours: 336, trade: 'mechanical' },
  { id: 'PM-020', asset: 'CH-01', task: 'Condenser coil cleaning', type: 'calendar', intervalDays: 30, trade: 'utilities' },
  { id: 'PM-021', asset: 'CH-01', task: 'Refrigerant pressure check', type: 'calendar', intervalDays: 14, trade: 'utilities' },
  { id: 'PM-022', asset: 'CH-02', task: 'Condenser coil cleaning', type: 'calendar', intervalDays: 30, trade: 'utilities' },
  { id: 'PM-023', asset: 'AC-01', task: 'Air filter replacement', type: 'calendar', intervalDays: 21, trade: 'utilities' },
  { id: 'PM-024', asset: 'AC-01', task: 'Belt tension check', type: 'calendar', intervalDays: 14, trade: 'utilities' },
  { id: 'PM-025', asset: 'CV-01', task: 'Belt tracking adjustment', type: 'calendar', intervalDays: 30, trade: 'mechanical' },
  { id: 'PM-026', asset: 'CV-02', task: 'Belt tracking adjustment', type: 'calendar', intervalDays: 30, trade: 'mechanical' },
  { id: 'PM-027', asset: 'CV-03', task: 'Belt tracking adjustment', type: 'calendar', intervalDays: 30, trade: 'mechanical' },
  { id: 'PM-028', asset: 'CV-04', task: 'Belt tracking adjustment', type: 'calendar', intervalDays: 30, trade: 'mechanical' },
  { id: 'PM-029', asset: 'ETP-01', task: 'Pump seal inspection', type: 'calendar', intervalDays: 21, trade: 'utilities' },
  { id: 'PM-030', asset: 'ETP-01', task: 'pH sensor calibration', type: 'calendar', intervalDays: 14, trade: 'electrical' },
];

// ── Generate PM History (90 days) ──
const pmHistory = [];
let pmIdCounter = 1;

for (let day = 89; day >= 0; day--) {
  const date = daysAgo(day);
  const dateStr = fmtDate(date);

  for (const tpl of pmTemplates) {
    let isDue = false;
    if (tpl.type === 'calendar') {
      isDue = (89 - day) % tpl.intervalDays === 0;
    } else {
      // runtime: simulate ~20h/day running, so runtimeHours/20 = days interval
      const simInterval = Math.max(3, Math.floor(tpl.runtimeHours / 20));
      isDue = (89 - day) % simInterval === 0;
    }

    if (!isDue) continue;

    // Overall compliance ~62%. Utilities assets worse (~41-48%), others better
    const assetObj = assets.find(a => a.code === tpl.asset);
    let completionChance = 0.68;
    if (['CH-01', 'CH-02', 'AC-01', 'ETP-01'].includes(tpl.asset)) {
      completionChance = 0.42; // worst on utilities
    } else if (assetObj && assetObj.criticality === 'Low') {
      completionChance = 0.50;
    }

    const completed = rand() < completionChance;
    const status = completed ? 'DONE' : (rand() < 0.3 ? 'MISSED' : 'SKIPPED');

    // Find a technician with matching trade
    const tradeTechs = technicians.filter(t => t.trade === tpl.trade);
    const assignedTech = pick(tradeTechs);

    const runtimeSinceLast = tpl.type === 'runtime' ? randInt(tpl.runtimeHours - 50, tpl.runtimeHours + 100) : null;

    pmHistory.push({
      id: `PMH-${String(pmIdCounter++).padStart(4, '0')}`,
      templateId: tpl.id,
      asset: tpl.asset,
      task: tpl.task,
      date: dateStr,
      dueType: tpl.type,
      dueReason: tpl.type === 'calendar'
        ? `due by calendar · every ${tpl.intervalDays} d`
        : `due by runtime · ${runtimeSinceLast} h since last service`,
      status,
      technician: completed ? assignedTech.name : (status === 'MISSED' ? assignedTech.name : null),
      technicianId: completed ? assignedTech.id : null,
      completedAt: completed ? `${dateStr}T${String(randInt(7, 20)).padStart(2, '0')}:${String(randInt(0, 59)).padStart(2, '0')}` : null,
    });
  }
}

// Compute PM compliance
const totalPM = pmHistory.length;
const donePM = pmHistory.filter(p => p.status === 'DONE').length;
const pmCompliance = +((donePM / totalPM) * 100).toFixed(1);
console.log(`PM Compliance: ${pmCompliance}% (${donePM}/${totalPM})`);

// ── Generate Breakdowns (90 days, 25-35 per month) ──
const breakdowns = [];
let bdIdCounter = 1;

// S1: EX-02 gearbox — 6 events over 90 days, MTTR rising 2.5→5h
const ex02GearboxDays = [82, 65, 48, 35, 18, 0]; // spread over 90 days, last one is today
const ex02MttrHours = [2.5, 3.0, 3.5, 4.0, 4.5, 3.5]; // rising trend, last one resolved

for (let i = 0; i < ex02GearboxDays.length; i++) {
  const day = ex02GearboxDays[i];
  const date = daysAgo(day);
  const isToday = day === 0;

  let reportedHour, reportedMin;
  if (isToday) {
    // S2: Last night's trip at 02:40
    reportedHour = 2; reportedMin = 40;
  } else {
    reportedHour = randInt(0, 23); reportedMin = randInt(0, 59);
  }

  const reported = new Date(date);
  reported.setHours(reportedHour, reportedMin, 0);

  const downtimeH = ex02MttrHours[i];
  const resolved = addHours(reported, downtimeH);

  const shiftForTime = reportedHour < 6 ? 'C' : reportedHour < 14 ? 'A' : reportedHour < 22 ? 'B' : 'C';
  const mechTechs = technicians.filter(t => t.trade === 'mechanical');
  const tech = isToday ? technicians.find(t => t.name === 'Sunil') : pick(mechTechs);

  breakdowns.push({
    id: `BD-${String(bdIdCounter++).padStart(4, '0')}`,
    asset: 'EX-02',
    assetName: 'Coperion extruder 2',
    criticality: 'High',
    cause: 'gearbox',
    description: isToday ? 'Gearbox bearing over temperature' : 'Gearbox fault — abnormal vibration',
    reported: reported.toISOString(),
    resolved: resolved.toISOString(),
    downtimeHours: downtimeH,
    shift: shiftForTime,
    technician: tech.name,
    technicianId: tech.id,
    spare: pick(['bearing SKF 6205', 'gearbox oil 20L', 'coupling spider']),
    status: 'RESOLVED',
    priority: 'P1',
    isPlanted: true,
    story: isToday ? 'S2' : 'S1',
  });
}

// S3: WL-01 friction washer failures cluster in shift C (5 of 7)
const wl01Days = [75, 60, 50, 38, 28, 15, 5];
for (let i = 0; i < wl01Days.length; i++) {
  const day = wl01Days[i];
  const date = daysAgo(day);
  const isShiftC = i < 5; // 5 of 7 in shift C
  const hour = isShiftC ? randInt(22, 23) + (rand() < 0.5 ? 0 : -22 + randInt(0, 4)) : randInt(6, 20);
  // Force shift C hours: between 22:00-06:00
  const actualHour = isShiftC ? (rand() < 0.6 ? randInt(22, 23) : randInt(0, 5)) : randInt(7, 20);

  const reported = new Date(date);
  reported.setHours(actualHour, randInt(0, 59), 0);
  const downtimeH = randFloat(1.5, 4.5);
  const resolved = addHours(reported, downtimeH);

  const mechTechs = technicians.filter(t => t.trade === 'mechanical');

  breakdowns.push({
    id: `BD-${String(bdIdCounter++).padStart(4, '0')}`,
    asset: 'WL-01',
    assetName: 'Herbold Meckesheim washing line',
    criticality: 'High',
    cause: 'bearing failure',
    description: 'Friction washer 2 abnormal vibration',
    reported: reported.toISOString(),
    resolved: resolved.toISOString(),
    downtimeHours: downtimeH,
    shift: isShiftC ? 'C' : (actualHour < 14 ? 'A' : 'B'),
    technician: pick(mechTechs).name,
    technicianId: pick(mechTechs).id,
    spare: pick(['bearing SKF 6205', 'bearing SKF 6308']),
    status: 'RESOLVED',
    priority: 'P2',
    isPlanted: true,
    story: 'S3',
  });
}

// Generate random breakdowns to fill 25-35 per month
const nonPlantedAssets = assets.filter(a => !['EX-02'].includes(a.code));
for (let month = 0; month < 3; month++) {
  const target = randInt(25, 35) - (month === 0 ? 2 : month === 1 ? 3 : 2); // subtract planted ones
  for (let i = 0; i < target; i++) {
    const day = month * 30 + randInt(0, 29);
    if (day > 89) continue;
    const date = daysAgo(89 - day);
    const asset = pick(nonPlantedAssets);
    const hour = randInt(0, 23);
    const reported = new Date(date);
    reported.setHours(hour, randInt(0, 59), 0);
    const downtimeH = randFloat(0.5, 8);
    const resolved = addHours(reported, downtimeH);
    const shift = hour < 6 ? 'C' : hour < 14 ? 'A' : hour < 22 ? 'B' : 'C';

    const tradeForAsset = ['CH-01', 'CH-02', 'AC-01', 'ETP-01'].includes(asset.code) ? 'utilities'
      : ['MS-01', 'DR-01', 'DR-02'].includes(asset.code) && rand() < 0.4 ? 'electrical' : 'mechanical';
    const tradeTechs = technicians.filter(t => t.trade === tradeForAsset);

    breakdowns.push({
      id: `BD-${String(bdIdCounter++).padStart(4, '0')}`,
      asset: asset.code,
      assetName: asset.name,
      criticality: asset.criticality,
      cause: pick(causeCodes),
      description: `${pick(causeCodes)} on ${asset.name}`,
      reported: reported.toISOString(),
      resolved: resolved.toISOString(),
      downtimeHours: downtimeH,
      shift,
      technician: pick(tradeTechs).name,
      technicianId: pick(tradeTechs).id,
      spare: pick(spares),
      status: 'RESOLVED',
      priority: asset.criticality === 'High' ? 'P1' : asset.criticality === 'Medium' ? 'P2' : 'P3',
      isPlanted: false,
      story: null,
    });
  }
}

// Add currently open breakdowns (for A1 dashboard and A3 board)
const openBreakdowns = [
  {
    id: `BD-${String(bdIdCounter++).padStart(4, '0')}`,
    asset: 'WL-01', assetName: 'Herbold Meckesheim washing line', criticality: 'High',
    cause: 'bearing failure', description: 'Friction washer 2 abnormal vibration',
    reported: new Date(TODAY.getTime() - 3 * 3600000 - 8 * 60000).toISOString(), // 3h8m ago -> 03:03
    resolved: null, downtimeHours: null, shift: 'C',
    technician: 'Prakash', technicianId: 'T2', spare: null,
    status: 'IN_PROGRESS', priority: 'P2', isPlanted: false, story: null,
  },
  {
    id: `BD-${String(bdIdCounter++).padStart(4, '0')}`,
    asset: 'CV-03', assetName: 'Conveyor 3', criticality: 'Low',
    cause: 'belt damage', description: 'Conveyor belt edge damage',
    reported: new Date(TODAY.getTime() - 4 * 3600000 - 32 * 60000).toISOString(), // 01:39
    resolved: null, downtimeHours: null, shift: 'C',
    technician: 'Bikash', technicianId: 'T4', spare: null,
    status: 'ASSIGNED', priority: 'P3', isPlanted: false, story: null,
  },
  {
    id: `BD-${String(bdIdCounter++).padStart(4, '0')}`,
    asset: 'DR-02', assetName: 'Flake dryer 2', criticality: 'Medium',
    cause: 'sensor fault', description: 'Outlet temperature sensor erratic',
    reported: new Date(TODAY.getTime() - 5 * 3600000 - 14 * 60000).toISOString(), // 00:57
    resolved: null, downtimeHours: null, shift: 'C',
    technician: 'Joydeep', technicianId: 'T5', spare: null,
    status: 'WAITING_SPARE', priority: 'P3', isPlanted: false, story: null,
  },
];
breakdowns.push(...openBreakdowns);

// Sort all breakdowns by date
breakdowns.sort((a, b) => new Date(b.reported) - new Date(a.reported));

// ═══════════════════════════════════════════════════════
// MODULE B — Hooghly Unit 1, PET Preforms
// ═══════════════════════════════════════════════════════

const machines = [
  { code: 'H-01', name: 'Husky fully automatic', cavities: 96, productWeight: 19.5, product: '19.5 g water preforms', type: 'husky' },
  { code: 'H-02', name: 'Husky fully automatic', cavities: 96, productWeight: 19.5, product: '19.5 g water preforms', type: 'husky' },
  { code: 'H-03', name: 'Husky fully automatic', cavities: 72, productWeight: 26.0, product: '26 g CSD preforms', type: 'husky' },
  { code: 'H-04', name: 'Husky fully automatic', cavities: 72, productWeight: 26.0, product: '26 g CSD preforms', type: 'husky' },
  { code: 'S-01', name: 'ABS semi automatic', cavities: 4, productWeight: 680, product: '680 g preforms for 20 litre jars', type: 'abs' },
  { code: 'S-02', name: 'ABS semi automatic', cavities: 4, productWeight: 680, product: '680 g preforms for 20 litre jars', type: 'abs' },
];

const defectTypes = ['black specks', 'bubbles', 'short shot', 'weight variation', 'colour streak'];

// Generate quality history (60 days, per shift per machine)
const qualityHistory = [];
const shiftsQuality = ['A', 'B', 'C'];

for (let day = 59; day >= 0; day--) {
  const date = daysAgo(day);
  const dateStr = fmtDate(date);

  for (const machine of machines) {
    for (const shift of shiftsQuality) {
      // Base output per shift
      const baseOutput = machine.type === 'husky'
        ? (machine.cavities === 96 ? randInt(14000, 16000) : randInt(10000, 12000))
        : randInt(200, 350);

      // Rejection rate: baseline 1.7%, trending to 2.1% over last 3 weeks (S7)
      const weeksFromEnd = day / 7;
      let baseRejectionRate = 0.017;
      if (day < 21) {
        // Last 3 weeks: rise from 1.7% to 2.1%
        baseRejectionRate = 0.017 + (0.004 * (21 - day) / 21);
      }

      // S6: Shift C black specks 1.6× day shifts across all Husky machines
      const blackSpeckMultiplier = (shift === 'C' && machine.type === 'husky') ? 1.6 : 1.0;

      // S5: H-03 weight variation rises with cavity drift
      const weightVarBoost = (machine.code === 'H-03' && day < 21) ? 0.003 * (21 - day) / 21 : 0;

      const totalRejectionRate = baseRejectionRate + weightVarBoost + randFloat(-0.002, 0.002);
      const totalRejects = Math.round(baseOutput * Math.max(0.005, totalRejectionRate));

      // Split rejects by defect type
      const defectSplit = {};
      let remaining = totalRejects;

      // Black specks: boosted in shift C
      const bsBase = Math.round(totalRejects * 0.22 * blackSpeckMultiplier);
      defectSplit['black specks'] = Math.min(bsBase, remaining);
      remaining -= defectSplit['black specks'];

      // Weight variation: boosted on H-03
      const wvBase = Math.round(totalRejects * (machine.code === 'H-03' && day < 21 ? 0.35 : 0.18));
      defectSplit['weight variation'] = Math.min(wvBase, remaining);
      remaining -= defectSplit['weight variation'];

      // Others
      defectSplit['bubbles'] = Math.round(remaining * 0.35);
      defectSplit['short shot'] = Math.round(remaining * 0.30);
      defectSplit['colour streak'] = remaining - defectSplit['bubbles'] - defectSplit['short shot'];

      qualityHistory.push({
        date: dateStr,
        machine: machine.code,
        shift,
        output: baseOutput,
        totalRejects,
        rejectionRate: +((totalRejects / baseOutput) * 100).toFixed(2),
        defects: defectSplit,
      });
    }
  }
}

// ── Cavity Weight Data (for B3 heatmap) ──
const cavityWeights = {};

for (const machine of machines) {
  cavityWeights[machine.code] = {};
  const target = machine.productWeight;

  for (let cavity = 1; cavity <= machine.cavities; cavity++) {
    const shifts21Days = [];

    for (let day = 20; day >= 0; day--) {
      const date = daysAgo(day);
      const dateStr = fmtDate(date);

      for (const shift of shiftsQuality) {
        let weight = target + randFloat(-0.12, 0.12); // Normal variation

        // S5: H-03 cavities 41 and 42 drift heavy by 0.4g over 3 weeks
        if (machine.code === 'H-03' && (cavity === 41 || cavity === 42)) {
          const driftPerDay = 0.4 / 21;
          weight = target + driftPerDay * (21 - day) + randFloat(-0.03, 0.03);
        }

        // Add a couple of amber drifters on other cavities for realism
        if (machine.code === 'H-03' && cavity === 17 && day < 14) {
          weight = target + 0.18 + randFloat(-0.03, 0.03);
        }
        if (machine.code === 'H-03' && cavity === 58 && day < 10) {
          weight = target - 0.20 + randFloat(-0.02, 0.02);
        }

        shifts21Days.push({
          date: dateStr,
          shift,
          weight: +weight.toFixed(2),
        });
      }
    }

    cavityWeights[machine.code][cavity] = {
      target,
      deviation: +(shifts21Days[shifts21Days.length - 1].weight - target).toFixed(2),
      history: shifts21Days,
    };
  }
}

// ── Alerts (pre-computed for B1) ──
const alerts = [
  {
    id: 'ALT-001',
    time: '07:41',
    type: 'cavity_drift',
    title: 'H-03 cavity 41, 42 weight drift',
    detail: '+0.4 g over 3 weeks · rule: > 1.5% off target, 3 shifts',
    link: '/preform/cavity/H-03',
    severity: 'red',
  },
  {
    id: 'ALT-002',
    time: '06:12',
    type: 'shift_pattern',
    title: 'Shift C black specks 1.6× day shifts',
    detail: 'All Husky machines · pattern held for 21 days',
    link: '/preform/machine/H-03',
    severity: 'amber',
  },
  {
    id: 'ALT-003',
    time: 'Mon',
    type: 'rising_trend',
    title: 'Rejection rising 3 weeks',
    detail: '1.7% → 2.1% plant wide',
    link: '/preform',
    severity: 'amber',
  },
];

// ── SAP B1 Sync entries (mocked) ──
const sapSyncEntries = [
  { time: '07:12', entry: 'Production order PRD-1042 · synced', type: 'production' },
  { time: '06:40', entry: 'GRN 8831 · resin lot RL-2209 · synced', type: 'grn' },
  { time: '06:15', entry: 'Production order PRD-1041 · synced', type: 'production' },
  { time: '05:30', entry: 'GRN 8830 · resin lot RL-2208 · synced', type: 'grn' },
];

// ── Today's daily plan (for A2) ──
const todayPlan = [];
let planIdCounter = 1;

// EX-02 follow-up (from last night's breakdown) — P1
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'EX-02', task: 'Gearbox bearing temperature check', priority: 'P1',
  dueReason: 'Follow up · last night breakdown', shift: 'A',
  technician: 'Ramesh', technicianId: 'T1', status: 'ASSIGNED', trade: 'mechanical',
});

// Regular PMs due today
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'WL-01', task: 'Friction washer bearing greasing', priority: 'P2',
  dueReason: 'Due by calendar · every 15 d', shift: 'A',
  technician: 'Prakash', technicianId: 'T2', status: 'ASSIGNED', trade: 'mechanical',
});
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'EX-01', task: 'Screen changer inspection', priority: 'P2',
  dueReason: 'Due by calendar · every 7 d', shift: 'B',
  technician: 'Bikash', technicianId: 'T4', status: 'ASSIGNED', trade: 'mechanical',
});
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'WL-01', task: 'Float sink tank density check', priority: 'P2',
  dueReason: 'Due by calendar · every 3 d', shift: 'B',
  technician: 'Sunil', technicianId: 'T3', status: 'ASSIGNED', trade: 'mechanical',
});
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'SSP-01', task: 'Rotary valve lubrication', priority: 'P2',
  dueReason: 'Due by runtime · 502 h since last', shift: 'B',
  technician: null, technicianId: null, status: 'UNASSIGNED', trade: 'mechanical',
});
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'MS-01', task: 'Metal separator calibration', priority: 'P3',
  dueReason: 'Due by calendar · every 30 d', shift: 'C',
  technician: null, technicianId: null, status: 'ESCALATED', trade: 'electrical',
  note: 'No technician available',
});
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'DR-01', task: 'Dryer filter inspection', priority: 'P3',
  dueReason: 'Due by runtime · 168 h since last', shift: 'A',
  technician: null, technicianId: null, status: 'UNASSIGNED', trade: 'mechanical',
});
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'CV-02', task: 'Belt tracking adjustment', priority: 'P3',
  dueReason: 'Operator report · drifting left', shift: 'B',
  technician: 'Bikash', technicianId: 'T4', status: 'ASSIGNED', trade: 'mechanical',
});
todayPlan.push({
  id: `PLAN-${String(planIdCounter++).padStart(3, '0')}`,
  asset: 'CH-01', task: 'Condenser coil cleaning', priority: 'P3',
  dueReason: 'Carried over from yesterday', shift: 'A',
  technician: 'Prakash', technicianId: 'T2', status: 'ASSIGNED', trade: 'utilities',
});

// ── Compute aggregates ──

// Downtime by asset (for Pareto)
const downtimeByAsset = {};
const failuresByAsset = {};
const repairHoursByAsset = {};

for (const bd of breakdowns) {
  if (bd.status !== 'RESOLVED' || !bd.downtimeHours) continue;
  if (!downtimeByAsset[bd.asset]) {
    downtimeByAsset[bd.asset] = 0;
    failuresByAsset[bd.asset] = 0;
    repairHoursByAsset[bd.asset] = 0;
  }
  downtimeByAsset[bd.asset] += bd.downtimeHours;
  failuresByAsset[bd.asset]++;
  repairHoursByAsset[bd.asset] += bd.downtimeHours;
}

// MTBF/MTTR
const reliabilityTable = [];
const totalRunningHours = 90 * 20; // ~20h/day for 90 days

for (const asset of assets) {
  const failures = failuresByAsset[asset.code] || 0;
  const totalRepair = repairHoursByAsset[asset.code] || 0;
  const downtime = downtimeByAsset[asset.code] || 0;

  if (failures === 0) continue;

  const mtbf = Math.round(totalRunningHours / failures);
  const mttr = +(totalRepair / failures).toFixed(1);

  // Pattern detection
  let pattern = 'stable';
  const assetBreakdowns = breakdowns.filter(b => b.asset === asset.code && b.status === 'RESOLVED');

  if (asset.code === 'EX-02') {
    pattern = 'MTTR rising · 2.5 h → 5.0 h · likely wearing gearbox bearing';
  } else if (asset.code === 'WL-01') {
    const shiftCCount = assetBreakdowns.filter(b => b.shift === 'C').length;
    pattern = `${shiftCCount} of ${assetBreakdowns.length} failures in shift C · pattern points at night practice`;
  }

  reliabilityTable.push({
    asset: asset.code,
    assetName: asset.name,
    mtbf,
    mttr,
    events: failures,
    downtime: +downtime.toFixed(1),
    pattern,
  });
}

reliabilityTable.sort((a, b) => b.downtime - a.downtime);

// Repeat failure flags (3+ same cause within 30 days)
const repeatFlags = [];
const assetCauseCounts = {};
for (const bd of breakdowns) {
  if (bd.status !== 'RESOLVED') continue;
  const key = `${bd.asset}|${bd.cause}`;
  if (!assetCauseCounts[key]) assetCauseCounts[key] = [];
  assetCauseCounts[key].push(bd);
}

for (const [key, events] of Object.entries(assetCauseCounts)) {
  if (events.length >= 3) {
    // Check if 3+ within any 30-day window
    events.sort((a, b) => new Date(a.reported) - new Date(b.reported));
    for (let i = 0; i <= events.length - 3; i++) {
      const daySpan = (new Date(events[i + 2].reported) - new Date(events[i].reported)) / 86400000;
      if (daySpan <= 30 || events.length >= 3) {
        const [asset, cause] = key.split('|');
        const assetObj = assets.find(a => a.code === asset);
        repeatFlags.push({
          asset,
          assetName: assetObj?.name || asset,
          cause,
          events: events.length,
          rule: `${events.length} events · 30 d rule`,
        });
        break;
      }
    }
  }
}

// ── Default settings ──
const settings = {
  rpetLineRate: 5.5,
  resinPrice: 85,
  contribution: 12,
  machineWeights: Object.fromEntries(machines.map(m => [m.code, m.productWeight])),
};

// ── Compute summary figures ──
const totalDowntimeMTD = breakdowns
  .filter(b => b.status === 'RESOLVED' && b.downtimeHours && new Date(b.reported) >= daysAgo(30))
  .reduce((sum, b) => sum + b.downtimeHours, 0);

const downtimeCostMTD = totalDowntimeMTD * settings.rpetLineRate * settings.resinPrice * 1000; // in rupees
const openJobsCount = breakdowns.filter(b => ['ASSIGNED', 'IN_PROGRESS', 'WAITING_SPARE'].includes(b.status)).length;

// Quality summaries
const todayQuality = qualityHistory.filter(q => q.date === fmtDate(TODAY));
const todayOutput = todayQuality.reduce((s, q) => s + q.output, 0);
const todayRejects = todayQuality.reduce((s, q) => s + q.totalRejects, 0);

const mtdQuality = qualityHistory.filter(q => {
  const d = new Date(q.date);
  return d.getMonth() === TODAY.getMonth() && d.getFullYear() === TODAY.getFullYear();
});
const mtdOutput = mtdQuality.reduce((s, q) => s + q.output, 0);
const mtdRejects = mtdQuality.reduce((s, q) => s + q.totalRejects, 0);
const mtdRejectionRate = +((mtdRejects / mtdOutput) * 100).toFixed(1);

// Rejection bill MTD
function computeRejectionBill(rejects, machines, resinPrice) {
  // Weighted average preform weight based on machine output
  let totalWeightKg = 0;
  for (const q of mtdQuality) {
    const m = machines.find(m2 => m2.code === q.machine);
    totalWeightKg += (q.totalRejects * m.productWeight) / 1000; // grams to kg
  }
  return totalWeightKg * resinPrice; // rupees
}

const rejectionBillMTD = computeRejectionBill(mtdRejects, machines, settings.resinPrice);

console.log(`Quality MTD: ${mtdRejectionRate}% rejection, ₹${(rejectionBillMTD / 100000).toFixed(1)} L bill`);
console.log(`Downtime MTD: ${totalDowntimeMTD.toFixed(1)} h, ₹${(downtimeCostMTD / 10000000).toFixed(2)} Cr`);
console.log(`Open jobs: ${openJobsCount}`);

// ═══════════════════════════════════════════════════════
// WRITE FILES
// ═══════════════════════════════════════════════════════

const write = (name, data) => {
  const path = join(OUT, name);
  writeFileSync(path, JSON.stringify(data, null, 2));
  console.log(`✓ ${name} (${Array.isArray(data) ? data.length + ' records' : 'object'})`);
};

write('assets.json', assets);
write('technicians.json', technicians.map((t, i) => ({
  ...t,
  currentShift: getTechShift(i, 0),
  shiftTimes,
})));
write('pmTemplates.json', pmTemplates);
write('pmHistory.json', pmHistory);
write('breakdowns.json', breakdowns);
write('machines.json', machines);
write('qualityHistory.json', qualityHistory);
write('cavityWeights.json', cavityWeights);
write('alerts.json', alerts);
write('sapSync.json', sapSyncEntries);
write('todayPlan.json', todayPlan);
write('reliability.json', { table: reliabilityTable, repeatFlags, downtimeByAsset });
write('settings.json', settings);
write('summary.json', {
  pmCompliance,
  totalDowntimeMTD: +totalDowntimeMTD.toFixed(1),
  downtimeCostMTD: Math.round(downtimeCostMTD),
  openJobsCount,
  todayOutput,
  todayRejects,
  todayRejectionRate: +((todayRejects / todayOutput) * 100).toFixed(1),
  mtdRejectionRate,
  rejectionBillMTD: Math.round(rejectionBillMTD),
  alertCount: alerts.length,
  pmWorstAssets: [
    { asset: 'CH-01', name: 'Chiller 1', compliance: 41 },
    { asset: 'AC-01', name: 'Air compressor', compliance: 45 },
    { asset: 'ETP-01', name: 'Effluent treatment pumps', compliance: 48 },
  ],
});

console.log('\n✅ All data generated successfully!');
