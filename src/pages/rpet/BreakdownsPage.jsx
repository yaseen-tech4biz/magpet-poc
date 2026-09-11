import React from 'react';
import { Shell } from '../../components/layout/Shell';
import { KanbanBoard } from '../../components/features/breakdowns/KanbanBoard';

export const BreakdownsPage = () => {
  return (
    <Shell
      moduleType="A"
      crumb={<span><b>Kharagpur Unit 3</b> · Breakdown board · cost clock runs from report to resolution</span>}
    >
      <KanbanBoard />
    </Shell>
  );
};
