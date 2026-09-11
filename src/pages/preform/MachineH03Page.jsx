import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell';
import { Card } from '../../components/ui/Card';
import { StackedBarChart } from '../../components/ui/StackedBarChart';
import { HorizontalBarChart } from '../../components/ui/HorizontalBarChart';
import qualityHistoryData from '../../data/qualityHistory.json';
import machinesData from '../../data/machines.json';
import cavityWeightsData from '../../data/cavityWeights.json';

export const MachineH03Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMachine, setSelectedMachine] = useState(id || 'H-03');

  useEffect(() => {
    if (id && id !== selectedMachine) {
      setSelectedMachine(id);
    }
  }, [id, selectedMachine]);

  const handleMachineChange = (newMachine) => {
    setSelectedMachine(newMachine);
    navigate(`/preform/machine/${newMachine}`);
  };

  const machines = [
    { id: 'H-03', code: 'H-03', name: 'Husky H-03 · 72 Cavities (CSD 26g)', status: 'ALERTS ACTIVE', isHusky: true, cavities: 72, productWeight: 26, product: '26 g CSD preforms' },
    { id: 'H-01', code: 'H-01', name: 'Husky H-01 · 96 Cavities (Water 19.5g)', status: 'NORMAL', isHusky: true, cavities: 96, productWeight: 19.5, product: '19.5 g water preforms' },
    { id: 'H-02', code: 'H-02', name: 'Husky H-02 · 96 Cavities (Water 19.5g)', status: 'NORMAL', isHusky: true, cavities: 96, productWeight: 19.5, product: '19.5 g water preforms' },
    { id: 'H-04', code: 'H-04', name: 'Husky H-04 · 72 Cavities (CSD 26g)', status: 'NORMAL', isHusky: true, cavities: 72, productWeight: 26, product: '26 g CSD preforms' },
    { id: 'S-01', code: 'S-01', name: 'ABS S-01 · 4 Cavities (20L Jar 680g)', status: 'NORMAL', isHusky: false, cavities: 4, productWeight: 680, product: '680 g preforms for 20L jars' },
    { id: 'S-02', code: 'S-02', name: 'ABS S-02 · 4 Cavities (20L Jar 680g)', status: 'NORMAL', isHusky: false, cavities: 4, productWeight: 680, product: '680 g preforms for 20L jars' }
  ];

  const currentMachineObj = machines.find((m) => m.id === selectedMachine) || machines[0];

  // 8 weeks defect counts computed dynamically from qualityHistory.json
  const defectWeeks = useMemo(() => {
    const machineRecords = qualityHistoryData.filter((r) => r.machine === selectedMachine);
    const uniqueDates = [...new Set(machineRecords.map((r) => r.date))].sort().slice(-56); // last 8 weeks (56 days)

    const weeksData = [];
    for (let w = 0; w < 8; w++) {
      const weekDates = uniqueDates.slice(w * 7, (w + 1) * 7);
      const weekRecords = machineRecords.filter((r) => weekDates.includes(r.date));
      const defectSums = {
        'black specks': 0,
        bubbles: 0,
        'short shot': 0,
        'weight variation': 0,
        'colour streak': 0
      };

      weekRecords.forEach((rec) => {
        if (rec.defects) {
          defectSums['black specks'] += rec.defects['black specks'] || 0;
          defectSums['bubbles'] += rec.defects['bubbles'] || 0;
          defectSums['short shot'] += rec.defects['short shot'] || 0;
          defectSums['weight variation'] += rec.defects['weight variation'] || 0;
          defectSums['colour streak'] += rec.defects['colour streak'] || 0;
        }
      });

      weeksData.push([
        defectSums['black specks'],
        defectSums['bubbles'],
        defectSums['short shot'],
        defectSums['weight variation'],
        defectSums['colour streak']
      ]);
    }
    return weeksData;
  }, [selectedMachine]);

  // Cavity Health stats computed dynamically from cavityWeightsData
  const cavityStats = useMemo(() => {
    const machineCavities = cavityWeightsData[selectedMachine] || {};
    let nominal = 0;
    let warning = 0;
    let critical = 0;
    const total = Object.keys(machineCavities).length;

    Object.values(machineCavities).forEach((c) => {
      const absDev = Math.abs(c.deviation);
      if (absDev <= 0.15) nominal++;
      else if (absDev <= 0.25) warning++;
      else critical++;
    });

    return { total, nominal, warning, critical };
  }, [selectedMachine]);

  const defectNames = [
    'Black specks',
    'Bubbles',
    'Short shot',
    'Weight variation',
    'Colour streak'
  ];

  const defectColors = [
    '#dc2626', // Red (Black specks)
    '#0284c7', // Cyan/Blue (Bubbles)
    '#d97706', // Amber (Short shot)
    '#9333ea', // Purple (Weight variation)
    '#2563eb'  // Blue (Colour streak)
  ];

  // Shift disparity data exposing Story S6
  const shiftData = currentMachineObj.isHusky
    ? [
        { l: 'Shift A', v: 1.8, t: '1.8%', c: '#143a72' },
        { l: 'Shift B', v: 1.9, t: '1.9%', c: '#143a72' },
        { l: 'Shift C', v: 2.9, t: '2.9% · 1.6×', c: '#dc2626' }
      ]
    : [
        { l: 'Shift A', v: 0.8, t: '0.8%', c: '#143a72' },
        { l: 'Shift B', v: 0.9, t: '0.9%', c: '#143a72' },
        { l: 'Shift C', v: 1.1, t: '1.1%', c: '#143a72' }
      ];

  return (
    <Shell
      moduleType="B"
      crumb={
        <div className="flex items-center justify-between gap-4 w-full normal-case tracking-normal">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="text-xs font-mono text-slate-700 whitespace-nowrap">
              <strong className="text-slate-900 font-bold">Hooghly Unit 1</strong> · Machine Drilldown · {currentMachineObj.name.split('·')[0]}
            </span>
            <span className="font-mono text-xs text-slate-500 whitespace-nowrap hidden md:inline">
              {currentMachineObj.product}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-sans font-medium whitespace-nowrap">Select Machine:</span>
            <select
              value={selectedMachine}
              onChange={(e) => handleMachineChange(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-mono font-bold text-[#143a72] outline-none shadow-2xs cursor-pointer focus:border-[#143a72] focus:ring-1 focus:ring-[#143a72]"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} · {m.name.split('·')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Defect Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title={`Rejection Breakdown by Defect Type · ${selectedMachine}`}
            subtitle="Trailing 8 weeks trend from shift quality logs"
            rightElement={
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                8 Weeks Trend
              </span>
            }
          >
            <div className="py-2">
              <StackedBarChart
                weeks={defectWeeks}
                defectColors={defectColors}
                width={600}
                height={230}
              />
            </div>

            {/* Defect Legend */}
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
              {defectNames.map((d, i) => (
                <div key={d} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-xs inline-block shrink-0"
                    style={{ backgroundColor: defectColors[i] }}
                  />
                  <span className={selectedMachine === 'H-03' && i === 3 ? 'font-bold text-purple-900' : ''}>
                    {d}
                  </span>
                </div>
              ))}
            </div>

            {selectedMachine === 'H-03' ? (
              <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
                <span className="font-bold">Key Operational Finding (Story S5): </span>
                Weight variation rejects on H-03 have surged dramatically over the last three weeks (surpassing 1,800 defects/week). This correlates directly with hot runner thermal drift in Cavities 41 and 42.
              </div>
            ) : (
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold">Nominal Statistical Process: </span>
                Defect distributions for {selectedMachine} remain within normal statistical quality limits (SPC).
              </div>
            )}
          </Card>
        </div>

        {/* Shift Comparison & Cavity Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Shift Comparison Exposing Story S6 */}
          <Card
            title="Black Specks by Shift"
            subtitle="Shift A / B / C comparison · 21-Day aggregate"
            rightElement={
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                currentMachineObj.isHusky ? 'text-rose-600 bg-rose-50 border border-rose-200' : 'text-emerald-700 bg-emerald-50'
              }`}>
                % Index · Shift C Disparity
              </span>
            }
          >
            <div className="py-2">
              <HorizontalBarChart rows={shiftData} width={380} />
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              {currentMachineObj.isHusky ? (
                <span>
                  <b>Planted Finding (Story S6):</b> Shift C night rejection runs at <b>1.6× day shifts</b> (2.9% vs 1.8%/1.9%). This pattern holds across all Husky machines, pointing directly to overnight resin dehumidification and dryer hopper handling rather than a tool fault.
                </span>
              ) : (
                <span>
                  ABS semi-automatic preform line operates at lower cavity density with manual preform demolding, exhibiting minimal shift disparity.
                </span>
              )}
            </p>
          </Card>

          {/* Machine Cavity Health Summary Card (Spec F-B2) */}
          <Card
            title="Cavity Health Summary"
            subtitle={`${currentMachineObj.cavities} Cavities · ${currentMachineObj.productWeight}g Target`}
            rightElement={
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold uppercase">
                {currentMachineObj.id} Tooling
              </span>
            }
          >
            <div className="grid grid-cols-3 gap-2.5 my-1">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Nominal</div>
                <div className="text-lg font-bold font-mono text-emerald-700">{cavityStats.nominal}</div>
                <div className="text-[10px] text-slate-500">±0.15g</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Drift</div>
                <div className="text-lg font-bold font-mono text-amber-600">{cavityStats.warning}</div>
                <div className="text-[10px] text-slate-500">±0.25g</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Critical</div>
                <div className="text-lg font-bold font-mono text-rose-600">{cavityStats.critical}</div>
                <div className="text-[10px] text-slate-500">&gt;0.25g</div>
              </div>
            </div>

            {selectedMachine === 'H-03' ? (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                <span className="font-bold">Active Tool Warning: </span>
                Cavities 41 and 42 exceed +0.35g threshold. Hot runner tip servicing required.
              </div>
            ) : (
              <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                All {cavityStats.total} cavities operating within expected quality control limits.
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to={`/preform/cavity/${selectedMachine}`}
                className="inline-flex items-center justify-center w-full bg-[#143a72] hover:bg-[#0c2347] text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-2xs transition-colors"
              >
                <span>Open Cavity Heatmap ({selectedMachine})</span>
              </Link>
            </div>
          </Card>

        </div>

      </div>
    </Shell>
  );
};
