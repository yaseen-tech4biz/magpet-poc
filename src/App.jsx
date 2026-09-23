import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { LandingPage } from './pages/LandingPage';
import { RpetDashboardPage } from './pages/rpet/RpetDashboardPage';
import { DailyPlanPage } from './pages/rpet/DailyPlanPage';
import { BreakdownsPage } from './pages/rpet/BreakdownsPage';
import { ReliabilityPage } from './pages/rpet/ReliabilityPage';
import { AskPage } from './pages/rpet/AskPage';
import { PreformOverviewPage } from './pages/preform/PreformOverviewPage';
import { MachineH03Page } from './pages/preform/MachineH03Page';
import { CavityMapPage } from './pages/preform/CavityMapPage';
import { SettingsPage } from './pages/SettingsPage';
import { ToastContainer } from './components/ui/ToastContainer';
import { DemoFlightDeck } from './components/demo/DemoFlightDeck';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Module A: Kharagpur rPET */}
        <Route path="/rpet" element={<RpetDashboardPage />} />
        <Route path="/rpet/plan" element={<DailyPlanPage />} />
        <Route path="/rpet/breakdowns" element={<BreakdownsPage />} />
        <Route path="/rpet/reliability" element={<ReliabilityPage />} />
        <Route path="/rpet/ask" element={<AskPage />} />

        {/* Module B: Hooghly Preforms */}
        <Route path="/preform" element={<PreformOverviewPage />} />
        <Route path="/preform/machine" element={<MachineH03Page />} />
        <Route path="/preform/machine/:id" element={<MachineH03Page />} />
        <Route path="/preform/cavity" element={<CavityMapPage />} />
        <Route path="/preform/cavity/:id" element={<CavityMapPage />} />

        {/* Settings & Assumptions */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
      {/* <DemoFlightDeck /> */}
    </BrowserRouter>
  );
}

export default App;
