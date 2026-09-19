import { Routes, Route } from 'react-router-dom';
import KioskLayout from './layouts/KioskLayout';
import WelcomeScreen from './screens/WelcomeScreen';
import IdentifyScreen from './screens/IdentifyScreen';
import ConsentScreen from './screens/ConsentScreen';
import ConverseScreen from './screens/ConverseScreen';
import ScanScreen from './screens/ScanScreen';
import JihvaScreen from './screens/JihvaScreen';
import SummaryScreen from './screens/SummaryScreen';
import DiagnosticsScreen from './screens/DiagnosticsScreen';

function App() {
  return (
    <KioskLayout>
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
    </KioskLayout>
  );
}

export default App;
