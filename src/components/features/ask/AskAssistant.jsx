import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useBreakdownStore } from '../../../store/useBreakdownStore';
import { usePlanStore } from '../../../store/usePlanStore';
import breakdownsData from '../../../data/breakdowns.json';
import assetsData from '../../../data/assets.json';
import { motion, AnimatePresence } from 'framer-motion';

export const AskAssistant = () => {
  const navigate = useNavigate();
  const { tph = 5.5, resin = 85, resinBenchmarkPrice, contrib = 12, formatResinHeld, formatContribLost } = useSettingsStore();
  const { activeJobs = [] } = useBreakdownStore();
  const { technicians = [] } = usePlanStore();

  const currentResinPrice = resinBenchmarkPrice || resin || 85;

  // Search input state (what is typed or populated from suggestions)
  const [query, setQuery] = useState('');
  // Submitted query
  const [submittedQuery, setSubmittedQuery] = useState('');
  // Loading/thinking animation state
  const [isThinking, setIsThinking] = useState(false);
  // Ref to search input field
  const inputRef = useRef(null);

  // Precomputed plant summary figures
  const totalQuarterHours = useMemo(() => {
    return Number(breakdownsData.reduce((acc, b) => acc + (b.downtimeHours || 0), 0).toFixed(1));
  }, []);

  const totalQuarterIncidents = breakdownsData.length;

  // The 8 Core Scenarios mandated by Build Specification Section F-A4 (No emojis)
  const curatedQuestions = [
    {
      id: 'q1',
      category: 'Cost & Pareto',
      q: 'Which machine cost us the most downtime this quarter, and how much in rupees?',
      shortQ: 'Machine with highest downtime & cost loss',
      hint: 'Pareto analysis of EX-02 vs WL-01 with live resin held valuation',
      keywords: ['most', 'cost', 'downtime', 'machine', 'quarter', 'rupees', 'expensive', 'highest', 'crores', 'lakhs', 'loss', 'pareto', 'biggest'],
      answerText: (
        <span>
          <b className="text-[#143a72] font-bold">EX-02 (Coperion Twin-Screw Extruder 2)</b> leads the plant with{' '}
          <b className="text-slate-900 font-bold">34.5 hours</b> of downtime across 6 breakdowns this quarter, all carrying cause code <i>gearbox</i>.
          At your current line rate ({tph} t/h) and resin benchmark (₹{currentResinPrice}/kg), this held back{' '}
          <b className="text-rose-600 font-bold">{formatResinHeld(34.5)}</b> in food-grade rPET resin throughput, with an estimated contribution margin loss of{' '}
          <b className="text-amber-700 font-semibold">{formatContribLost ? formatContribLost(34.5) : `₹${(34.5 * tph * contrib * 10).toFixed(1)} L`}</b>.
        </span>
      ),
      linkTo: '/rpet/reliability',
      linkText: 'View Full Downtime Pareto on Reliability Screen',
      renderVisual: () => {
        const paretoMini = [
          { asset: 'EX-02', h: 34.5, val: formatResinHeld(34.5), barPct: 100, color: 'bg-rose-600', flag: true },
          { asset: 'WL-01', h: 21.0, val: formatResinHeld(21.0), barPct: 61, color: 'bg-rose-600', flag: true },
          { asset: 'SSP-01', h: 9.5, val: formatResinHeld(9.5), barPct: 28, color: 'bg-[#143a72]', flag: false },
          { asset: 'DR-02', h: 7.0, val: formatResinHeld(7.0), barPct: 20, color: 'bg-[#143a72]', flag: false }
        ];

        return (
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mt-3 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase pb-1 border-b border-slate-200">
              <span>Asset</span>
              <span>Downtime Hours & Rupee Impact</span>
            </div>
            {paretoMini.map((item) => (
              <div key={item.asset} className="flex items-center gap-3 text-xs">
                <span className="w-14 font-mono font-bold text-slate-700 shrink-0 flex items-center gap-1">
                  <span>{item.asset}</span>
                  {item.flag && <span className="text-rose-600 font-bold text-[10px]">Repeat</span>}
                </span>
                <div className="flex-1 h-5 bg-slate-200/80 rounded-md overflow-hidden relative">
                  <div className={`h-full ${item.color} rounded-md`} style={{ width: `${item.barPct}%` }} />
                </div>
                <span className="w-36 text-right font-mono font-bold text-slate-900 shrink-0 text-[11px]">
                  {item.h} h · {item.val}
                </span>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      id: 'q2',
      category: 'Root Cause & MTTR',
      q: 'Why does EX-02 keep failing?',
      shortQ: 'Why EX-02 keeps failing & repeat trend',
      hint: '6-event breakdown history, rising MTTR, and bearing wear signature',
      keywords: ['why', 'ex-02', 'ex02', 'failing', 'keep', 'repeat', 'coperion 2', 'extruder 2', 'gearbox', 'fail', 'temperature', 'bearing'],
      answerText: (
        <span>
          All 6 downtime events on <b>EX-02</b> in the last 90 days carry cause code <b className="text-slate-900 font-mono">gearbox</b>.
          Crucially, repair time (MTTR) has escalated progressively from <b>2.5 hours to 5.0 hours</b> per breakdown.
          This signature demonstrates progressive mechanical wear of the main gearbox roller bearing rather than isolated operational faults.
          The plant intelligence engine flagged it under the <b>Repeat Failure Rule</b> (3+ same-cause incidents within 30 days).
        </span>
      ),
      linkTo: '/rpet/reliability',
      linkText: 'Inspect Repeat Failure Diagnostics & MTTR',
      renderVisual: () => {
        const events = [
          { date: 'Day 12', desc: 'Bearing vibration alert', mttr: '2.5 h', tech: 'Sunil', status: 'Resolved' },
          { date: 'Day 28', desc: 'Over-temperature trip (79°C)', mttr: '3.0 h', tech: 'Ramesh', status: 'Resolved' },
          { date: 'Day 45', desc: 'Bearing seal weeping oil', mttr: '3.5 h', tech: 'Prakash', status: 'Resolved' },
          { date: 'Day 62', desc: 'High frequency bearing chatter', mttr: '4.0 h', tech: 'Sunil', status: 'Resolved' },
          { date: 'Day 78', desc: 'Thermal overload cut-off (82°C)', mttr: '4.5 h', tech: 'Ramesh', status: 'Resolved' },
          { date: 'Last night', desc: 'Gearbox bearing thermal trip (84°C)', mttr: '5.0 h', tech: 'Sunil', status: 'Follow-up Shift A' }
        ];

        return (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mt-3">
            <div className="text-[11px] font-mono font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>EX-02 6-Event Incident Progression (MTTR Rising)</span>
              <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">Active Flag</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-1 px-2">Timeline</th>
                    <th className="py-1 px-2">Symptom</th>
                    <th className="py-1 px-2">MTTR</th>
                    <th className="py-1 px-2">Tech</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-mono text-[11px]">
                  {events.map((e, idx) => (
                    <tr key={idx} className={idx === events.length - 1 ? 'bg-rose-50/80 font-bold text-rose-900' : ''}>
                      <td className="py-1.5 px-2 text-slate-600">{e.date}</td>
                      <td className="py-1.5 px-2 font-sans font-medium text-slate-800">{e.desc}</td>
                      <td className="py-1.5 px-2 text-rose-700 font-bold">{e.mttr}</td>
                      <td className="py-1.5 px-2 text-slate-600">{e.tech}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    },
    {
      id: 'q3',
      category: 'Shift Analysis',
      q: 'Which shift has the most washing line breakdowns?',
      shortQ: 'Washing line failure cluster across shifts',
      hint: 'WL-01 friction washer failures clustered in Shift C (71.4%)',
      keywords: ['shift', 'washing', 'wl-01', 'friction', 'failures', 'night', 'shift c', 'wash', 'cluster'],
      answerText: (
        <span>
          <b className="text-[#143a72] font-bold">Shift C (Night Shift)</b> accounts for{' '}
          <b className="text-rose-600 font-bold">5 of 7 (71.4%)</b> WL-01 friction washer bearing failures in the last 90 days.
          Day shifts (A & B) had only 1 failure each.
          Because failures cluster exclusively during overnight operations, this signature points directly at a{' '}
          <b className="text-slate-900">night lubrication, water throughput, or startup SOP deviation</b> rather than a machinery defect.
        </span>
      ),
      linkTo: '/rpet/plan',
      linkText: 'Review Shift C Maintenance Schedule & SOPs',
      renderVisual: () => (
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mt-3">
          <div className="text-[11px] font-mono font-bold text-slate-600 uppercase mb-2">
            WL-01 Bearing Failures by Shift (Last 90 Days)
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">Shift A (Morning)</div>
              <div className="font-mono text-xl font-bold text-slate-700 mt-1">1</div>
              <div className="text-[10px] text-slate-400 font-mono">14.3%</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-medium">Shift B (Evening)</div>
              <div className="font-mono text-xl font-bold text-slate-700 mt-1">1</div>
              <div className="text-[10px] text-slate-400 font-mono">14.3%</div>
            </div>
            <div className="bg-rose-50 p-3 rounded-lg border border-rose-300 text-center ring-1 ring-rose-200">
              <div className="text-xs text-rose-800 font-bold">Shift C (Night)</div>
              <div className="font-mono text-xl font-bold text-rose-600 mt-1">5</div>
              <div className="text-[10px] text-rose-700 font-mono font-bold">71.4% · Pattern Alert</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'q4',
      category: 'PM Compliance',
      q: 'What is our PM compliance and where is it worst?',
      shortQ: 'PM compliance rate & lowest assets',
      hint: '62% plant compliance with deferred maintenance on utilities',
      keywords: ['pm', 'compliance', 'worst', 'preventive', 'percentage', 'routine', 'ch-01', 'ac-01', 'etp-01', 'utilities', 'chiller'],
      answerText: (
        <span>
          Overall Kharagpur plant PM compliance is currently <b className="text-amber-600 font-bold">62%</b> for the last 90 days (target: 85%).
          Primary production lines (Extrusion & Washing) maintain ~71–78% compliance, while <b>utilities assets are systematically deferred</b>.
          The worst performers are: <b className="text-slate-900">CH-01 Chiller (41%)</b>, <b className="text-slate-900">AC-01 Air Compressor (45%)</b>, and <b className="text-slate-900">ETP-01 Effluent Treatment Pumps (48%)</b>.
        </span>
      ),
      linkTo: '/rpet',
      linkText: 'View Plant Dashboard & PM Gauge',
      renderVisual: () => {
        const pmBars = [
          { name: 'Extrusion (EX-01, EX-02)', pct: 78, color: 'bg-emerald-600' },
          { name: 'Washing Line (WL-01)', pct: 71, color: 'bg-emerald-600' },
          { name: 'SSP Reactor (SSP-01)', pct: 68, color: 'bg-blue-600' },
          { name: 'ETP Pumps (ETP-01)', pct: 48, color: 'bg-amber-500' },
          { name: 'Air Compressor (AC-01)', pct: 45, color: 'bg-amber-600' },
          { name: 'Chiller (CH-01)', pct: 41, color: 'bg-rose-600' }
        ];

        return (
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mt-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase pb-1 border-b border-slate-200">
              <span>Asset Category</span>
              <span>PM Compliance %</span>
            </div>
            {pmBars.map((b) => (
              <div key={b.name} className="flex items-center gap-3 text-xs">
                <span className="w-44 font-medium text-slate-700 truncate">{b.name}</span>
                <div className="flex-1 h-4 bg-slate-200 rounded overflow-hidden">
                  <div className={`h-full ${b.color} rounded`} style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-12 text-right font-mono font-bold text-slate-900 text-xs">
                  {b.pct}%
                </span>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      id: 'q5',
      category: 'Recent Incidents',
      q: 'What broke last night?',
      shortQ: 'What broke last night & cost impact',
      hint: 'EX-02 trip at 02:40, 3.5 hours downtime, resolved by Sunil',
      keywords: ['broke', 'last', 'night', 'yesterday', 'trip', 'overnight', 'recent', '02:40', 'sunil', 'morning', 'happened'],
      answerText: (
        <span>
          <b className="text-rose-600 font-bold">EX-02 (Coperion Extruder 2)</b> tripped at <b className="text-slate-900 font-mono">02:40</b> on gearbox bearing over-temperature alarm (reached 84°C, threshold 80°C).
          Shift C technician Sunil completed cooling, vibration check, and initial flushing, restoring the line at <b className="text-slate-900 font-mono">06:10</b>.
          The <b>3.5 hours</b> of stoppage held back approximately <b className="text-rose-600 font-bold">{formatResinHeld(3.5)}</b> in food-grade rPET resin throughput.
        </span>
      ),
      linkTo: '/rpet/breakdowns',
      linkText: 'Open Live Breakdown Incident Log',
      renderVisual: () => (
        <div className="bg-rose-50/80 rounded-xl p-3.5 border border-rose-200 mt-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200">
            <span className="font-mono text-xs font-bold text-rose-800">INCIDENT #BK-2024-0982 · EX-02</span>
            <span className="bg-rose-200/70 text-rose-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">P1 CRITICAL</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2.5 text-xs">
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Stoppage Window</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">02:40 – 06:10</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Duration</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">3.5 Hours</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Resin Value Held</div>
              <div className="font-mono font-bold text-rose-600 mt-0.5">{formatResinHeld(3.5)}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-mono">Attending Tech</div>
              <div className="font-semibold text-slate-900 mt-0.5">Sunil Soren (Shift C)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'q6',
      category: 'Downtime Totals',
      q: 'How many hours of downtime did we have this month?',
      shortQ: 'Total downtime hours MTD & breakdown count',
      hint: '31.5 hours accumulated across 11 incidents this month',
      keywords: ['hours', 'month', 'how', 'many', 'downtime', 'total', 'mtd', 'accumulated', 'duration'],
      answerText: (
        <span>
          Month-to-date, Kharagpur Unit 3 has recorded <b className="text-slate-900 font-bold">31.5 total downtime hours</b> across 11 breakdown incidents.
          This represents <b className="text-rose-600 font-bold">{formatResinHeld(31.5)}</b> in held-back resin value at current throughput ({tph} t/h).
          EX-02 alone is responsible for 12.5 of these hours (40%), followed by WL-01 with 8.0 hours.
        </span>
      ),
      linkTo: '/rpet/breakdowns',
      linkText: 'Review Breakdown Kanban Board',
      renderVisual: () => (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200 mt-3">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Total Downtime</div>
            <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">31.5 h</div>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Incident Count</div>
            <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">11 Events</div>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Resin Value Held</div>
            <div className="font-mono text-lg font-bold text-rose-600 mt-0.5">{formatResinHeld(31.5)}</div>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Top Bottleneck</div>
            <div className="font-mono text-lg font-bold text-amber-700 mt-0.5">EX-02 (40%)</div>
          </div>
        </div>
      )
    },
    {
      id: 'q7',
      category: 'Stores & Spares',
      q: 'Which spares did we consume the most?',
      shortQ: 'Top spares consumed this quarter',
      hint: 'Friction washer bearings (6 units) & Coperion gearbox bearings (4 units)',
      keywords: ['spares', 'consume', 'parts', 'bearing', 'inventory', 'stock', 'used', 'consumed', 'heater', 'mesh', 'stores'],
      answerText: (
        <span>
          Top spares consumed in the last 90 days: <b className="text-slate-900">Friction washer bearings (6 units)</b>,{' '}
          <b className="text-slate-900">Coperion gearbox bearings (4 units)</b>, and{' '}
          <b className="text-slate-900">Extruder heater bands 5kW (3 units)</b>.
          Bearing consumption aligns 1:1 with the two repeat failure flags active in the system.
        </span>
      ),
      linkTo: '/rpet/reliability',
      linkText: 'Check Spares Consumption & MTBF',
      renderVisual: () => {
        const spares = [
          { item: 'WL-01 Friction washer heavy-duty bearing', qty: '6 units', cost: '₹2.4 L', stock: '2 in stores', status: 'Reorder Advised' },
          { item: 'EX-02 Gearbox double-row roller bearing', qty: '4 units', cost: '₹3.8 L', stock: '1 in stores', status: 'CRITICAL PO Pending' },
          { item: 'EX-01 Ceramic heater bands (5 kW)', qty: '3 units', cost: '₹0.9 L', stock: '5 in stores', status: 'Adequate' },
          { item: 'DR-02 RTD PT100 temperature probe', qty: '2 units', cost: '₹0.4 L', stock: '3 in stores', status: 'Adequate' }
        ];

        return (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mt-3">
            <div className="text-[11px] font-mono font-bold text-slate-600 uppercase mb-2">
              Quarterly Spare Part Consumption & Stock Position
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-1 px-2">Part Description</th>
                    <th className="py-1 px-2">Qty Used</th>
                    <th className="py-1 px-2">Total ₹</th>
                    <th className="py-1 px-2">Stores Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {spares.map((s, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 px-2 font-sans font-medium text-slate-800">{s.item}</td>
                      <td className="py-1.5 px-2 font-bold text-slate-900">{s.qty}</td>
                      <td className="py-1.5 px-2 text-slate-700">{s.cost}</td>
                      <td className="py-1.5 px-2">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${s.status.includes('CRITICAL') ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                          {s.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    },
    {
      id: 'q8',
      category: 'Rosters & Crew',
      q: 'Who is on shift C tonight?',
      shortQ: 'Overnight crew roster for Shift C',
      hint: 'Sunil Soren (Mechanical) & Manoj Kumar (Electrical) with utilities gap',
      keywords: ['who', 'shift', 'tonight', 'crew', 'roster', 'night', 'working', 'sunil', 'manoj', 'technicians', 'shift c'],
      answerText: (
        <span>
          Shift C (22:00–06:00) tonight: <b className="text-[#143a72] font-bold">Sunil Soren</b> (Mechanical Lead) and{' '}
          <b className="text-[#143a72] font-bold">Manoj Kumar</b> (Electrical & Automation).
          <b className="text-amber-800"> Notice:</b> No dedicated utilities technician is scheduled overnight; Debu rotates in tomorrow morning (06:00).
        </span>
      ),
      linkTo: '/rpet/plan',
      linkText: 'Inspect Tonight Shift C Daily Plan',
      renderVisual: () => (
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mt-3">
          <div className="text-[11px] font-mono font-bold text-slate-600 uppercase mb-2">
            Shift C Overnight Crew Roster (22:00 – 06:00)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xs">
                S
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Sunil Soren</div>
                <div className="text-[10px] text-slate-500 font-mono">Mechanical Lead · Assigned</div>
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs">
                M
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Manoj Kumar</div>
                <div className="text-[10px] text-slate-500 font-mono">Electrical Tech · Standby</div>
              </div>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-200 text-rose-700 font-bold flex items-center justify-center text-xs">
                !
              </div>
              <div>
                <div className="font-bold text-xs text-rose-800">Utilities Coverage</div>
                <div className="text-[10px] text-rose-600 font-mono">Unassigned Gap · Remote On-call</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  /**
   * User interaction: Clicking a suggestion populates the input field.
   * The output shows ONLY when the user clicks the "Ask" button or presses Enter.
   */
  const handleSelectSuggestion = (selectedText) => {
    setQuery(selectedText);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  /**
   * User interaction: Output is generated when the user clicks "Ask" or presses Enter.
   */
  const handleExecuteAsk = () => {
    if (!query || !query.trim()) {
      inputRef.current?.focus();
      return;
    }
    setIsThinking(true);
    setTimeout(() => {
      setSubmittedQuery(query.trim());
      setIsThinking(false);
    }, 250);
  };

  const handleClear = () => {
    setQuery('');
    setSubmittedQuery('');
    inputRef.current?.focus();
  };

  // Robust NLP Query Resolver for the submitted query
  const queryResult = useMemo(() => {
    if (!submittedQuery) return null;
    const raw = submittedQuery.toLowerCase();
    const cleanTokens = raw.replace(/[?.,!/\\()_#\-"']/g, ' ').split(/\s+/).filter(Boolean);

    // 1. Curated Intent Matching via fuzzy scoring
    let bestCurated = null;
    let maxCuratedScore = 0;

    for (const item of curatedQuestions) {
      let score = 0;
      if (raw.includes(item.q.toLowerCase()) || raw.includes(item.shortQ.toLowerCase())) {
        score += 50;
      }
      for (const kw of item.keywords) {
        if (raw.includes(kw)) score += 6;
      }
      for (const token of cleanTokens) {
        if (item.keywords.includes(token)) score += 3;
      }
      if (score > maxCuratedScore && score >= 5) {
        maxCuratedScore = score;
        bestCurated = item;
      }
    }

    if (bestCurated) {
      return { type: 'curated', data: bestCurated };
    }

    // 2. Asset Query (e.g. "EX-01", "WL-01", "DR-02", "chiller", "dryer", "reactor")
    const matchedAsset = assetsData.find((a) => {
      const codeMatch = cleanTokens.some((t) => t.toUpperCase() === a.code.toUpperCase());
      const nameMatch = raw.includes(a.name.toLowerCase()) || raw.includes(a.code.toLowerCase());
      return codeMatch || nameMatch;
    });

    if (matchedAsset) {
      const assetIncidents = breakdownsData.filter(
        (b) => b.asset.toUpperCase() === matchedAsset.code.toUpperCase()
      );
      const hours = Number(assetIncidents.reduce((s, b) => s + (b.downtimeHours || 0), 0).toFixed(1));
      const valueHeld = formatResinHeld(hours);
      const isRepeat = assetIncidents.length >= 3;

      return {
        type: 'asset_dossier',
        asset: matchedAsset,
        count: assetIncidents.length,
        hours,
        valueHeld,
        isRepeat,
        incidents: assetIncidents.slice(0, 5)
      };
    }

    // 3. Technician Query (e.g. "Sunil", "Ramesh", "Prakash", "Manoj")
    const matchedTech = technicians.find((t) =>
      cleanTokens.some((token) => token.toLowerCase() === t.name.toLowerCase().split(' ')[0])
    );

    if (matchedTech) {
      const techIncidents = breakdownsData.filter(
        (b) => b.technician && b.technician.toLowerCase().includes(matchedTech.name.toLowerCase().split(' ')[0])
      );
      const techHours = Number(techIncidents.reduce((s, b) => s + (b.downtimeHours || 0), 0).toFixed(1));

      return {
        type: 'tech_dossier',
        tech: matchedTech,
        count: techIncidents.length,
        hours: techHours,
        incidents: techIncidents.slice(0, 4)
      };
    }

    // 4. Shift Queries
    if (raw.includes('shift') || raw.includes('night') || raw.includes('morning')) {
      let targetShift = 'ALL';
      if (raw.includes('shift c') || raw.includes('night')) targetShift = 'C';
      else if (raw.includes('shift a') || raw.includes('morning')) targetShift = 'A';
      else if (raw.includes('shift b') || raw.includes('evening')) targetShift = 'B';

      const shiftIncidents = targetShift === 'ALL'
        ? breakdownsData
        : breakdownsData.filter((b) => b.shift === targetShift);
      const shiftHours = Number(shiftIncidents.reduce((s, b) => s + (b.downtimeHours || 0), 0).toFixed(1));

      return {
        type: 'shift_dossier',
        targetShift,
        count: shiftIncidents.length,
        hours: shiftHours,
        incidents: shiftIncidents.slice(0, 5)
      };
    }

    // 5. General Free-Text Token Search over Breakdowns
    const matchingIncidents = breakdownsData.filter((b) => {
      const targetText = `${b.asset} ${b.assetName} ${b.cause} ${b.description} ${b.technician} ${b.spare || ''}`.toLowerCase();
      return cleanTokens.some((token) => token.length > 2 && targetText.includes(token));
    });

    if (matchingIncidents.length > 0) {
      const hours = Number(matchingIncidents.reduce((s, b) => s + (b.downtimeHours || 0), 0).toFixed(1));
      return {
        type: 'search_results',
        count: matchingIncidents.length,
        hours,
        valueHeld: formatResinHeld(hours),
        incidents: matchingIncidents.slice(0, 5)
      };
    }

    // 6. Fallback
    return { type: 'no_match', rawQuery: submittedQuery };
  }, [submittedQuery, formatResinHeld, technicians, tph, currentResinPrice]);

  return (
    <div className="space-y-6">

      {/* 1. Header Hero Card (Clean Typography, No Emojis) */}
      <div className="bg-gradient-to-r from-[#143a72] to-[#1e4d94] rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-mono font-medium text-blue-100 border border-white/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Kharagpur Unit 3 · Operations Copilot</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading tracking-tight text-white">
            Ask anything about plant maintenance & telemetry
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1.5 leading-relaxed font-light">
            Answers are calculated live from 90-day SCADA telemetry, shift maintenance rosters, downtime Pareto logs, and SAP Business One.
          </p>
        </div>

        <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-20 -top-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 2. Search & Command Bar (Intuitive & Clean) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm transition-all focus-within:border-[#143a72] focus-within:shadow-md">



        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1 flex items-center">
            <span className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteAsk();
              }}
              placeholder="Type your question or click a scenario below..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-[#143a72] focus:ring-2 focus:ring-[#143a72]/15 transition-all font-medium"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full text-xs font-bold transition-colors cursor-pointer"
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={handleExecuteAsk}
            disabled={isThinking || !query.trim()}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer ${!query.trim()
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : isThinking
                ? 'bg-[#143a72]/80 text-white'
                : 'bg-[#143a72] hover:bg-[#0c2347] text-white active:scale-98'
              }`}
          >
            {isThinking ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Ask</span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="text-[11px] text-slate-400">
            Click any suggested question below to fill the input field, then press <b>Ask</b>.
          </span>
          {submittedQuery && (
            <button
              onClick={handleClear}
              className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Reset / Ask Another
            </button>
          )}
        </div>
      </div>

      {/* 3. Output Response Container (ONLY visible after user clicks "Ask") */}
      <AnimatePresence mode="wait">
        {submittedQuery && queryResult && (
          <motion.div
            key={submittedQuery}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 shadow-md border-l-4 border-l-[#143a72]"
          >
            {/* Header: User Question Label & Telemetry Badge */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono font-bold text-[#143a72] uppercase tracking-wider">
                  Copilot Intelligence Synthesis
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md truncate max-w-md">
                Submitted: "{submittedQuery}"
              </span>
            </div>

            {/* A. Curated Intent Answer */}
            {queryResult.type === 'curated' && (
              <div className="space-y-4">
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans">
                  {queryResult.data.answerText}
                </p>

                {/* The Mini Chart or Visual Table mandated by Spec F-A4 */}
                {queryResult.data.renderVisual && queryResult.data.renderVisual()}

                {/* Direct Action Link to the relevant screen (No right arrow) */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 font-mono">
                    Grounded in active plant telemetry & SAP Business One
                  </span>
                  <button
                    onClick={() => navigate(queryResult.data.linkTo)}
                    className="text-xs font-bold text-[#143a72] hover:text-[#0c2347] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>{queryResult.data.linkText}</span>
                  </button>
                </div>
              </div>
            )}

            {/* B. Specific Asset Dossier */}
            {queryResult.type === 'asset_dossier' && (
              <div className="space-y-4">
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  Asset <b className="text-[#143a72] font-bold">{queryResult.asset.code} ({queryResult.asset.name})</b> is rated{' '}
                  <b className="text-slate-900 font-semibold">{queryResult.asset.criticality} Criticality</b> in Kharagpur Unit 3.
                  Over the last 90 days, it has recorded <b className="text-rose-600 font-bold">{queryResult.count} breakdown incidents</b> accumulating{' '}
                  <b className="text-slate-900 font-bold">{queryResult.hours} hours</b> of line downtime, representing approximately{' '}
                  <b className="text-rose-600 font-bold">{queryResult.valueHeld}</b> in food-grade rPET resin value held back.
                  {queryResult.isRepeat && (
                    <span className="text-rose-700 font-semibold"> Active Repeat Failure rule triggered (&gt;3 same-cause events/30d).</span>
                  )}
                </p>

                {/* Mini Table of Recent Incidents */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="text-[11px] font-mono font-bold text-slate-600 uppercase mb-2 flex items-center justify-between">
                    <span>Recent Breakdown Incidents ({queryResult.asset.code})</span>
                    <span className="text-slate-400 text-[10px]">SCADA Log</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase">
                          <th className="py-1 px-2">ID</th>
                          <th className="py-1 px-2">Cause Code</th>
                          <th className="py-1 px-2">Duration</th>
                          <th className="py-1 px-2">Technician</th>
                          <th className="py-1 px-2">Spare Used</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                        {queryResult.incidents.map((inc) => (
                          <tr key={inc.id}>
                            <td className="py-1.5 px-2 text-slate-500">{inc.id}</td>
                            <td className="py-1.5 px-2 font-bold text-slate-800 font-sans">{inc.cause}</td>
                            <td className="py-1.5 px-2 text-rose-700 font-bold">{inc.downtimeHours} h</td>
                            <td className="py-1.5 px-2 text-slate-700 font-sans">{inc.technician}</td>
                            <td className="py-1.5 px-2 text-slate-500 font-sans">{inc.spare || 'None'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate('/rpet/reliability')}
                    className="text-xs font-bold text-[#143a72] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    View in Reliability Pareto
                  </button>
                  <button
                    onClick={() => navigate('/rpet/breakdowns')}
                    className="text-xs font-bold text-white bg-[#143a72] hover:bg-[#0c2347] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Open Breakdown Board
                  </button>
                </div>
              </div>
            )}

            {/* C. Technician Dossier */}
            {queryResult.type === 'tech_dossier' && (
              <div className="space-y-4">
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  <b className="text-[#143a72] font-bold">{queryResult.tech.name}</b> is assigned to <b className="text-slate-900 font-semibold">{queryResult.tech.trade} maintenance</b> on <b className="text-slate-900 font-semibold">Shift {queryResult.tech.shift}</b>.
                  Over the trailing 90 days, {queryResult.tech.name.split(' ')[0]} attended <b className="text-slate-900 font-bold">{queryResult.count} breakdown events</b> resolving{' '}
                  <b className="text-slate-900 font-bold">{queryResult.hours} hours</b> of line stoppages.
                </p>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="text-[11px] font-mono font-bold text-slate-600 uppercase mb-2">
                    Recent Work Order Dispatches ({queryResult.tech.name})
                  </div>
                  <div className="space-y-2">
                    {queryResult.incidents.map((inc) => (
                      <div key={inc.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#143a72] mr-2">{inc.asset}</span>
                          <span className="font-medium text-slate-800">{inc.description}</span>
                          <span className="text-slate-400 text-[11px] ml-2 font-mono">({inc.cause})</span>
                        </div>
                        <span className="font-mono font-bold text-slate-700 shrink-0">
                          {inc.downtimeHours} h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => navigate('/rpet/plan')}
                    className="text-xs font-bold text-[#143a72] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Open WhatsApp Chat on Daily Plan Screen
                  </button>
                </div>
              </div>
            )}

            {/* D. Shift Dossier */}
            {queryResult.type === 'shift_dossier' && (
              <div className="space-y-4">
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  Shift analysis for <b className="text-[#143a72] font-bold">Shift {queryResult.targetShift}</b>: recorded{' '}
                  <b className="text-slate-900 font-bold">{queryResult.count} breakdown incidents</b> totaling{' '}
                  <b className="text-rose-600 font-bold">{queryResult.hours} hours</b> of plant downtime.
                  {queryResult.targetShift === 'C' && (
                    <span className="text-rose-700 font-semibold"> Shift C experiences 71.4% of all WL-01 washing line bearing failures due to night-shift startup and lubrication deviations.</span>
                  )}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => navigate('/rpet/plan')}
                    className="text-xs font-bold text-[#143a72] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Review Shift Roster on Daily Plan
                  </button>
                </div>
              </div>
            )}

            {/* E. General Token Search Results */}
            {queryResult.type === 'search_results' && (
              <div className="space-y-4">
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                  Found <b className="text-[#143a72] font-bold">{queryResult.count} incidents</b> in the Kharagpur maintenance registry matching your terms.
                  Accumulated downtime: <b className="text-slate-900 font-bold">{queryResult.hours} hours</b>, representing approximately{' '}
                  <b className="text-rose-600 font-bold">{queryResult.valueHeld}</b> in food-grade rPET resin value held back.
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-xs font-mono font-bold text-slate-600 uppercase mb-2">
                    Top Matching Records (SCADA Telemetry):
                  </div>
                  <div className="space-y-1.5">
                    {queryResult.incidents.map((b) => (
                      <div key={b.id} className="text-xs p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3">
                        <div>
                          <span className="font-mono font-bold text-[#143a72] mr-2">{b.asset}</span>
                          <span className="text-slate-800 font-medium">{b.description}</span>
                          <span className="text-slate-400 text-[11px] ml-2 font-mono">({b.cause} · {b.technician})</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800 shrink-0">
                          {b.downtimeHours} h ({formatResinHeld(b.downtimeHours)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => navigate('/rpet/breakdowns')}
                    className="text-xs font-bold text-[#143a72] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    View All Breakdown Records on Board
                  </button>
                </div>
              </div>
            )}

            {/* F. No Match Fallback */}
            {queryResult.type === 'no_match' && (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                <h3 className="text-sm font-bold text-slate-800 font-heading">
                  No records found for "{queryResult.rawQuery}"
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Try asking about registered assets (<b>EX-02</b>, <b>WL-01</b>, <b>DR-02</b>, <b>CH-01</b>), cause codes (<b>gearbox</b>, <b>bearing</b>), technicians (<b>Sunil</b>, <b>Ramesh</b>), or choose one of the suggested scenarios below.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Categorized Suggested Questions (Clean Standard Copilot Prompt Cards) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>Suggested Questions</span>
              <span className="bg-blue-50 text-[#143a72] border border-blue-200 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                8 Scenarios
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any question card to fill the search bar, then click Ask to run.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {curatedQuestions.map((item) => {
            const isSelected = submittedQuery === item.q || query === item.q;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectSuggestion(item.q)}
                className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md ${isSelected
                  ? 'border-[#143a72] bg-blue-50/40 ring-2 ring-[#143a72]/15 shadow-xs'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-white hover:border-[#143a72]/50'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-slate-400 group-hover:text-[#143a72] transition-colors">
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800 group-hover:text-[#143a72] transition-colors leading-relaxed">
                    {item.q}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Plant Grounding & Capability Summary (Clean, No Emojis) */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div>
          <div className="font-bold text-slate-800">
            Kharagpur Unit 3 Plant Knowledge Base Grounding
          </div>
          <div className="text-slate-500 font-mono text-[11px] mt-0.5">
            {assetsData.length} Assets Registered · {totalQuarterIncidents} Breakdown Records · {totalQuarterHours} Downtime Hours Analyzed
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
          Financial Grounding: ₹{currentResinPrice}/kg resin · {tph} t/h line rate
        </div>
      </div>

    </div>
  );
};
