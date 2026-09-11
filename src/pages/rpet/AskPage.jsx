import React from 'react';
import { Shell } from '../../components/layout/Shell';
import { AskAssistant } from '../../components/features/ask/AskAssistant';

export const AskPage = () => {
  return (
    <Shell
      moduleType="A"
      crumb={<span><b>Kharagpur Unit 3</b> · Plant Copilot · Grounded on SCADA & SAP B1</span>}
    >
      <div className="max-w-5xl mx-auto py-2">
        <AskAssistant />
      </div>
    </Shell>
  );
};
