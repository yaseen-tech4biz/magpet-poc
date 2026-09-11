import React, { useState } from 'react';
import { useCavityStore } from '../../../store/useCavityStore';
import { LineChart } from '../../ui/LineChart';

export const CavityDrift = () => {
  const { selectedCavity, selectedMachine, getCurrentDrift, getCurrentMachineInfo } = useCavityStore();
  const driftPoints = getCurrentDrift();
  const values = driftPoints.map((p) => p.weight);
  const machineInfo = getCurrentMachineInfo();

  const [flaggedNotice, setFlaggedNotice] = useState(null);

  const isHotRunner = selectedMachine === 'H-03' && (selectedCavity === 41 || selectedCavity === 42);

  const targetWeight = driftPoints[0]?.target || machineInfo?.productWeight || 26.0;
  const isLargeJar = targetWeight >= 500;
  const tolerance = isLargeJar ? 0.5 : 0.04;
  const band = [
    Number((targetWeight - tolerance).toFixed(2)),
    Number((targetWeight + tolerance).toFixed(2))
  ];

  const dataMin = values.length ? Math.min(...values, band[0]) : targetWeight - 0.1;
  const dataMax = values.length ? Math.max(...values, band[1]) : targetWeight + 0.1;
  const padding = isLargeJar ? 0.3 : 0.05;
  const minVal = Number((dataMin - padding).toFixed(2));
  const maxVal = Number((dataMax + padding).toFixed(2));

  const handleFlagMold = () => {
    setFlaggedNotice(`Mold Maintenance Work Order #MO-4109 logged in SAP Business One for ${selectedMachine} Cavity #${selectedCavity}. Inspection scheduled for upcoming changeover.`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-heading font-semibold text-slate-800 text-sm">
            Cavity {selectedCavity} · 21-Day Weight Drift
          </span>
          <span className="font-mono text-[11px] text-slate-500 ml-2">
            g / daily mean · Target {targetWeight.toFixed(1)}g
          </span>
        </div>

        {isHotRunner && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
            Hot Runner Drift
          </span>
        )}
      </div>

      <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
        <LineChart
          key={`${selectedMachine}-${selectedCavity}`}
          data={values}
          width={360}
          height={210}
          color={isHotRunner ? '#dc2626' : '#16a34a'}
          band={band}
          dots={true}
          dp={isLargeJar ? 1 : 2}
          minVal={minVal}
          maxVal={maxVal}
          xl={['21 d ago', 'today']}
        />
      </div>

      <div className="mt-3.5 text-xs leading-relaxed space-y-2">
        {isHotRunner ? (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-900">
            <span className="font-bold">Hot runner anomaly identified: </span>
            A consistent upward drift of approx. <b>+0.02 g per day</b> (+0.38 g total). This thermal drift on cavities 41 and 42 is the root cause driving weight variation rejects on H-03.
            
            <div className="mt-2.5 pt-2 border-t border-rose-200/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-rose-700">Root Cause: Manifold Zone 3 Tip</span>
              <button
                onClick={handleFlagMold}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] px-3 py-1 rounded shadow-2xs cursor-pointer transition-colors"
              >
                Flag for Mold Servicing
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900">
            <span className="font-semibold">Normal SPC performance: </span>
            Cavity {selectedCavity} on {selectedMachine} remains within target operational limits ({targetWeight.toFixed(2)}g ±{tolerance}g).
          </div>
        )}

        {flaggedNotice && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-blue-900 text-xs font-mono animate-in fade-in">
            {flaggedNotice}
          </div>
        )}
      </div>
    </div>
  );
};
