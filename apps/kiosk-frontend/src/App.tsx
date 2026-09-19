import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import KioskLayout from './layouts/KioskLayout';

const WelcomeScreen = lazy(() => import('./screens/WelcomeScreen'));
const IdentifyScreen = lazy(() => import('./screens/IdentifyScreen'));
const ConsentScreen = lazy(() => import('./screens/ConsentScreen'));
const ConverseScreen = lazy(() => import('./screens/ConverseScreen'));
const ScanScreen = lazy(() => import('./screens/ScanScreen'));
const JihvaScreen = lazy(() => import('./screens/JihvaScreen'));
const SummaryScreen = lazy(() => import('./screens/SummaryScreen'));
const DiagnosticsScreen = lazy(() => import('./screens/DiagnosticsScreen'));

function App() {
  return (
    <KioskLayout>
      <Suspense fallback={<div className="grid min-h-screen place-items-center text-royal-gold">Loading...</div>}>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/identify" element={<IdentifyScreen />} />
          <Route path="/consent" element={<ConsentScreen />} />
          <Route path="/converse" element={<ConverseScreen />} />
          <Route path="/scan" element={<ScanScreen />} />
          <Route path="/jihva" element={<JihvaScreen />} />
          <Route path="/summary" element={<SummaryScreen />} />
          <Route path="/diagnostics" element={<DiagnosticsScreen />} />
        </Routes>
      </Suspense>
    </KioskLayout>
  );
}

export default App;
