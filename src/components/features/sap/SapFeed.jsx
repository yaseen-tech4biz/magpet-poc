import React from 'react';

export const SapFeed = () => {
  const syncItems = [
    { time: '07:12', text: 'Production order PRD-1042 · synced', status: 'SYNCED' },
    { time: '06:40', text: 'GRN 8831 · resin lot RL-2209 · synced', status: 'SYNCED' }
  ];

  return (
    <div className="space-y-2">
      {syncItems.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
        >
          <span className="font-mono text-slate-400 text-[11px] w-12 shrink-0">
            {item.time}
          </span>
          <span className="font-mono text-slate-700 flex-1 truncate">
            {item.text}
          </span>
          <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded uppercase">
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
};
